import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import os from "os";

dotenv.config();

// Handle inline JSON service account credentials on Vercel/cloud environments
if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS.trim().startsWith("{")) {
  try {
    const tempKeyPath = path.join(os.tmpdir(), "gcp-key.json");
    fs.writeFileSync(tempKeyPath, process.env.GOOGLE_APPLICATION_CREDENTIALS.trim());
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempKeyPath;
    console.log("🔑 Google Application Credentials written to temporary path:", tempKeyPath);
  } catch (e: any) {
    console.error("❌ Failed to write temporary credentials file:", e.message || e);
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION
});

/**
 * Core processor for Pulse26 stadium gate telemetry metrics.
 * Exclusively uses Vertex AI endpoints using Application Default Credentials (ADC) context.
 */
export async function processGateTelemetry(requestPayload: any) {
  // Standard model configuration for Vertex AI pipeline
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: requestPayload.contents,
    config: requestPayload.config || {}
  });
  
  return response;
}

// In-memory edge cache store
interface CacheEntry {
  timestamp: number;
  data: any;
}
const edgeCache: Record<string, CacheEntry> = {};

// Full stack telemetry analysis endpoint
app.post("/api/analyze-telemetry", async (req, res) => {
  try {
    // 1. CAPTURE & BIN FIRST: At the absolute top of the request function, capture the raw gateCDensity and gateDDensity from the sandbox inputs and apply the 5% binning formula immediately
    const { gateCDensity: reqGateCDensity, gateDDensity: reqGateDDensity, gateCSliderValue, gateDSliderValue, surgeRate, fanContext, reasoningOutputPrompt } = req.body;

    const gateCDensity = gateCSliderValue !== undefined ? gateCSliderValue : reqGateCDensity;
    const gateDDensity = gateDSliderValue !== undefined ? gateDSliderValue : reqGateDDensity;

    if (gateCDensity === undefined || gateDDensity === undefined || !surgeRate || !fanContext) {
      return res.status(400).json({ error: "Missing required telemetry parameters." });
    }

    // Determine status level strictly by user directive rule:
    // If Gate C crosses 80%, status_level must become 'WARNING'. If it crosses 90%, it must become 'CRITICAL'. Otherwise ACTIVE.
    let statusLevel: "ACTIVE" | "WARNING" | "CRITICAL" | "DIVERT_PROACTIVE" = "ACTIVE";
    if (surgeRate === "Zero-Flow Lockdown") {
      statusLevel = "CRITICAL";
    } else if (gateCDensity > 80 && gateDDensity > 80) {
      statusLevel = "CRITICAL";
    } else if (gateCDensity >= 90) {
      statusLevel = "CRITICAL";
    } else if (gateCDensity >= 80) {
      statusLevel = "WARNING";
    } else if (Math.abs(gateCDensity - gateDDensity) >= 30) {
      statusLevel = "DIVERT_PROACTIVE";
    }

    let divertInstruction = "";
    if (statusLevel === "DIVERT_PROACTIVE") {
      const higherGate = gateCDensity > gateDDensity ? "Gate C" : "Gate D";
      const lowerGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
      divertInstruction = `Proactive Diversion Required: ${higherGate} density is at ${gateCDensity > gateDDensity ? gateCDensity : gateDDensity}% capacity and ${lowerGate} is underutilized at ${gateCDensity > gateDDensity ? gateDDensity : gateCDensity}%. You MUST explicitly advise routing and diverting spectators from ${higherGate} to ${lowerGate}.`;
    }

    const binnedGateC = Math.round(gateCDensity / 5) * 5;
    const binnedGateD = Math.round(gateDDensity / 5) * 5;

    // 2. IMUTABLE KEY GENERATION: Generate the composite cache key using these freshly binned raw values and the calculated statusLevel BEFORE any conditional overrides alter the data pipeline
    const metroSurge = surgeRate;
    const metricsArray = [binnedGateC, binnedGateD];
    const cacheKey = `${JSON.stringify(metricsArray)}-${statusLevel}-${metroSurge}-${fanContext}`;

    // 3. CHECK CACHE STORE: Look up the cacheKey. If it exists, return the cached payload instantly
    const cachedEntry = edgeCache[cacheKey];
    const now = Date.now();
    if (cachedEntry && now - cachedEntry.timestamp < 90000) {
      console.log(`[CACHE_HIT] Serving stored inference data for key: ${cacheKey}`);
      const responseData = { ...cachedEntry.data, cache_status: "HIT" };
      return res.json(responseData);
    }

    // 4. EXECUTE OVERRIDES ON CACHE MISS: Only if it is a cache miss, proceed down the pipeline to execute the anti-contradiction overrides
    console.log(`[CACHE_MISS] Fetching fresh XAI reasoning from Gemini for key: ${cacheKey}`);

    // Determine tone based on fanContext
    const isMedicalDistress = fanContext.toLowerCase().includes("medical");
    const toneApplied = (surgeRate === "Zero-Flow Lockdown" || isMedicalDistress) ? "Urgent / Directive" : (statusLevel === "CRITICAL" ? "Urgent / Alert" : "Calm / Informational");

    const telemetryText = `
Telemetry Data:
- Gate C Density: ${gateCDensity}%
- Gate D Density: ${gateDDensity}%
- Metro Hub Flow Surge Rate: ${surgeRate}
- Simulated Fan Context: ${fanContext}
- Calculated Status Level: ${statusLevel}
- Tone Applied: ${toneApplied}
`;

    // 1. VARIABLE CONDITIONALS:
    // If the client didn't supply the prompt, fall back to calculating it server-side:
    let targetReasoningOutput = reasoningOutputPrompt;
    if (surgeRate === "Zero-Flow Lockdown") {
      targetReasoningOutput = "STADIUM LOCKDOWN IN EFFECT. Stop all crowd movements immediately. Instruct all fans to remain in place and wait for further security directives.";
    } else if (gateCDensity > 80 && gateDDensity > 80) {
      targetReasoningOutput = `All regional access points (Gate C at ${gateCDensity}% and Gate D at ${gateDDensity}%) are currently experiencing extreme capacity constraints due to the massive tournament crowd. We need to hold incoming pedestrian flows at the outer perimeter checkpoints immediately until internal concourses clear out safely.`;
    } else if (!targetReasoningOutput) {
      if (statusLevel === "DIVERT_PROACTIVE") {
        const higherGate = gateCDensity > gateDDensity ? "Gate C" : "Gate D";
        const lowerGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
        targetReasoningOutput = `${higherGate} is at ${gateCDensity}% capacity and ${lowerGate} is underutilized at ${gateDDensity}%. Instruct volunteers to actively divert arriving spectators to ${lowerGate} to balance the stadium queue.`;
      } else if (gateCDensity >= 0 && gateCDensity <= 40) {
        targetReasoningOutput = `Gate C is moving smoothly at ${gateCDensity}% with normal traffic from the Metro. Gate D is at ${gateDDensity}%. Keep maintaining current flows.`;
      } else if (gateCDensity >= 41 && gateCDensity <= 79) {
        targetReasoningOutput = `Gate C is getting busy at ${gateCDensity}% due to the Metro flow. Gate D is open at ${gateDDensity}%. We should monitor this closely.`;
      } else {
        targetReasoningOutput = `Gate C is completely jammed right now at ${gateCDensity}% because a massive crowd just came in from the Metro for the ${fanContext}. Meanwhile, Gate D is totally empty at only ${gateDDensity}%. We need to quickly guide people over to Gate D so everyone gets inside safely.`;
      }
    }

    let result;
    try {
      let response;
      const requestPayload = {
        model: "gemini-3.5-flash",
        contents: `Perform crowd-flow operations analysis on this telemetry. Here are the constraints:
${telemetryText}
${divertInstruction ? `\nSpecial Instruction:\n- ${divertInstruction}\n` : ""}
Requirements:
1. "status_level": Must match: "${statusLevel}"
2. "reasoning_output": You MUST output exactly this natural, conversational, simple-English statement:
   "${targetReasoningOutput}"
3. "volunteer_action": Set a single actionable, concise task parameter statement instructing volunteers on the ground what to do (e.g., redirecting Level 100 ticket holders or deploying staff to redirect traffic).
4. "target_reroute_gate": Recommend the low-density target gate ("${gateCDensity > gateDDensity ? "Gate D" : "Gate C"}") to redirect the active queue.
5. "multilingual_relay": 
   - "spanish_script": Megaphone broadcast script in Spanish matching the active tone.
   - "french_script": Megaphone broadcast script in French matching the active tone.
   - "tone_applied": Must match: "${toneApplied}"
`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status_level: { type: Type.STRING, description: "Calculated status level: ACTIVE, WARNING, or CRITICAL" },
              reasoning_output: { type: Type.STRING, description: "Comprehensive explainable AI feedback and reasoning output" },
              volunteer_action: { type: Type.STRING, description: "Specific direct action instruction parameter for ground volunteers" },
              target_reroute_gate: { type: Type.STRING, description: "Target reroute gate, e.g., Gate D" },
              multilingual_relay: {
                type: Type.OBJECT,
                properties: {
                  spanish_script: { type: Type.STRING, description: "Megaphone broadcast script in Spanish" },
                  french_script: { type: Type.STRING, description: "Megaphone broadcast script in French" },
                  tone_applied: { type: Type.STRING, description: "The tone applied to the scripts" }
                },
                required: ["spanish_script", "french_script", "tone_applied"]
              }
            },
            required: ["status_level", "reasoning_output", "volunteer_action", "target_reroute_gate", "multilingual_relay"]
          }
        }
      };

      response = await processGateTelemetry(requestPayload);

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response from Gemini.");
      }

      result = JSON.parse(resultText);
    } catch (apiError: any) {
      console.warn("Gemini API call failed or quota/billing limits exceeded. Falling back to local rules engine:", apiError.message || apiError);
      
      // Compute deterministic fallback fields based on telemetry
      let calculatedRerouteGate = "Gate D";
      if (surgeRate === "Zero-Flow Lockdown") {
        calculatedRerouteGate = "NONE (LOCKDOWN)";
      } else if (gateCDensity > 80 && gateDDensity > 80) {
        calculatedRerouteGate = "HOLD";
      } else if (gateCDensity >= 80 && gateDDensity < 40) {
        calculatedRerouteGate = "Gate D";
      } else if (gateDDensity >= 80 && gateCDensity < 40) {
        calculatedRerouteGate = "Gate C";
      } else if (statusLevel === "DIVERT_PROACTIVE") {
        calculatedRerouteGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
      }

      let calculatedVolunteerAction = "Monitor gate flow parameters and maintain standard crowd spacing.";
      if (surgeRate === "Zero-Flow Lockdown") {
        calculatedVolunteerAction = "Initiate sector blockades and support emergency security forces.";
      } else if (gateCDensity > 80 && gateDDensity > 80) {
        calculatedVolunteerAction = "Hold all incoming pedestrian queues at outer perimeter checkpoints.";
      } else if (gateCDensity >= 80) {
        calculatedVolunteerAction = "Deploy staff to active guide routes and redirect traffic to Gate D.";
      } else if (statusLevel === "DIVERT_PROACTIVE") {
        const higherGate = gateCDensity > gateDDensity ? "Gate C" : "Gate D";
        const lowerGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
        calculatedVolunteerAction = `Deploy staff to active guide routes and divert arriving traffic from ${higherGate} to ${lowerGate}.`;
      }

      let spanishScript = `Atención: el flujo está activo. Por favor, siga las indicaciones.`;
      let frenchScript = `Attention : le flux est actif. Veuillez seguir les indications de sécurité.`;

      if (surgeRate === "Zero-Flow Lockdown") {
        spanishScript = "CIERRE DE ESTADIO EN VIGOR. Detengan todos los movimientos de personas de inmediato. Permanezcan en sus lugares y esperen instrucciones de seguridad.";
        frenchScript = "CONFINEMENT DU STADE EN VIGUEUR. Arrêtez immédiatement tout mouvement de foule. Veuillez rester sur place et attendre les consignes de sécurité.";
      } else if (gateCDensity > 80 && gateDDensity > 80) {
        spanishScript = `Todos los puntos de acceso regional (Puerta C al ${gateCDensity}% y Puerta D al ${gateDDensity}%) están experimentando actualmente limitaciones extremas de capacidad debido a la multitud masiva del torneo. Necesitamos retener los flujos de peatones entrantes en los puntos de control del perímetro exterior de inmediato hasta que los pasillos internos se despejen de manera segura.`;
        frenchScript = `Tous les points d'accès régionaux (Porte C à ${gateCDensity}% et Porte D à ${gateDDensity}%) connaissent actuellement des contraintes de capacité extrêmes en raison de la foule massive du tournoi. Nous devons retenir immédiatement les flux de piétons entrants aux points de contrôle du périmètre extérieur jusqu'à ce que les halls intérieurs se libèrent en toute sécurité.`;
      } else if (gateCDensity >= 80) {
        spanishScript = `Atención: la Puerta C está experimentando una congestión extrema del ${gateCDensity}%. Rediríjase a la Puerta D de inmediato.`;
        frenchScript = `Attention : la Porte C connaît un encombrement extrême de ${gateCDensity}%. Veuillez vous rediriger vers la Porte D immédiatement.`;
      } else if (statusLevel === "DIVERT_PROACTIVE") {
        const higherGateEs = gateCDensity > gateDDensity ? "Puerta C" : "Puerta D";
        const lowerGateEs = gateCDensity > gateDDensity ? "Puerta D" : "Puerta C";
        const higherGateFr = gateCDensity > gateDDensity ? "Porte C" : "Porte D";
        const lowerGateFr = gateCDensity > gateDDensity ? "Porte D" : "Porte C";
        spanishScript = `Atención: La ${higherGateEs} está experimentando alta afluencia. Por favor, diríjase a la ${lowerGateEs} para un acceso más rápido.`;
        frenchScript = `Attention : La ${higherGateFr} est encombrée. Veuillez vous diriger vers la ${lowerGateFr} pour un accès plus rapide.`;
      }

      result = {
        status_level: statusLevel,
        reasoning_output: targetReasoningOutput,
        volunteer_action: calculatedVolunteerAction,
        target_reroute_gate: calculatedRerouteGate,
        multilingual_relay: {
          spanish_script: spanishScript,
          french_script: frenchScript,
          tone_applied: toneApplied
        }
      };
    }

    // Ensure status_level and tone_applied match strict server-side validation rules as a fallback safeguard
    result.status_level = statusLevel;
    if (surgeRate === "Zero-Flow Lockdown") {
      result.reasoning_output = "STADIUM LOCKDOWN IN EFFECT. Stop all crowd movements immediately. Instruct all fans to remain in place and wait for further security directives.";
      result.volunteer_action = "Initiate sector blockades and support emergency security forces.";
      result.target_reroute_gate = "NONE (LOCKDOWN)";
      result.multilingual_relay = {
        spanish_script: "CIERRE DE ESTADIO EN VIGOR. Detengan todos los movimientos de personas de inmediato. Permanezcan en sus lugares y esperen instrucciones de seguridad.",
        french_script: "CONFINEMENT DU STADE EN VIGUEUR. Arrêtez immédiatement tout mouvement de foule. Veuillez rester sur place et attendre les consignes de sécurité.",
        tone_applied: toneApplied
      };
    } else if (gateCDensity > 80 && gateDDensity > 80) {
      result.reasoning_output = `All regional access points (Gate C at ${gateCDensity}% and Gate D at ${gateDDensity}%) are currently experiencing extreme capacity constraints due to the massive tournament crowd. We need to hold incoming pedestrian flows at the outer perimeter checkpoints immediately until internal concourses clear out safely.`;
      result.volunteer_action = "Hold all incoming pedestrian queues at outer perimeter checkpoints.";
      result.target_reroute_gate = "HOLD";
      result.multilingual_relay = {
        spanish_script: `Todos los puntos de acceso regional (Puerta C al ${gateCDensity}% y Puerta D al ${gateDDensity}%) están experimentando actualmente limitaciones extremas de capacidad debido a la multitud masiva del torneo. Necesitamos retener los flujos de peatones entrantes en los puntos de control del perímetro exterior de inmediato hasta que los pasillos internos se despejen de manera segura.`,
        french_script: `Todos los puntos de acceso regional (Puerta C al ${gateCDensity}% y Puerta D al ${gateDDensity}%) están experimentando actualmente limitaciones extremas de capacidad debido a la multitud masiva del torneo. Necesitamos retener los flujos de peatones entrantes en los puntos de control del perímetro exterior de inmediato hasta que los pasillos internos se despejen de manera segura.`,
        tone_applied: toneApplied
      };
    }
    if (!result.multilingual_relay) {
      result.multilingual_relay = { spanish_script: "", french_script: "", tone_applied: "" };
    }
    result.multilingual_relay.tone_applied = toneApplied;

    // Cache the result before returning (without the transient cache_status property)
    edgeCache[cacheKey] = {
      timestamp: now,
      data: result
    };

    const responseData = { ...result, cache_status: "MISS" };
    return res.json(responseData);
  } catch (error: any) {
    console.error("Telemetry analysis failed:", error);
    
    const isQuota = 
      error?.status === 429 || 
      error?.code === 429 || 
      String(error?.message || "").toLowerCase().includes("quota") || 
      String(error?.message || "").toLowerCase().includes("resource_exhausted") || 
      String(error?.message || "").toLowerCase().includes("rate limit") ||
      String(error?.message || "").includes("429");

    if (isQuota) {
      return res.status(429).json({
        error: "RESOURCE_EXHAUSTED",
        message: "Gemini API quota limit hit. Local safety backup layer actively handling state parameters."
      });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
