import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import os from "os";
import helmet from "helmet";

dotenv.config();

// Handle inline JSON service account credentials on Vercel/cloud environments
if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS.trim().startsWith("{")) {
  try {
    const tempKeyPath = path.join(os.tmpdir(), "gcp-key.json");
    fs.writeFileSync(tempKeyPath, process.env.GOOGLE_APPLICATION_CREDENTIALS.trim());
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempKeyPath;
    console.log("🔑 Google Application Credentials written to temporary path:", tempKeyPath);
  } catch (e: unknown) {
    const err = e as Error;
    console.error("❌ Failed to write temporary credentials file:", err.message || err);
  }
}

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));

// Hardened CORS Origin Middleware supporting Vite dev server ports
app.use((req, res, next) => {
  const origins = process.env.CLIENT_URL 
    ? [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"] 
    : ["http://localhost:5173", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (origin && origins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10kb" }));

// Handle favicon requests instantly with 204 No Content
app.get("/favicon.ico", (req, res) => res.status(204).end());

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION
});

export interface GeminiRequestPayload {
  model: string;
  contents: string;
  config?: Record<string, unknown>;
}

/**
 * Inbound telemetry payload representing real-time crowd density metrics
 * across Gate C and Gate D, combined with Metro hub surge conditions.
 */
export interface TelemetryRequest {
  gateCDensity?: number;
  gateDDensity?: number;
  gateCSliderValue?: number;
  gateDSliderValue?: number;
  surgeRate: string;
  fanContext: string;
  reasoningOutputPrompt?: string;
}

/**
 * Structure for multilingual emergency megaphone broadcasts,
 * ensuring rapid passenger dispersal instructions in Spanish and French.
 */
export interface MultilingualRelay {
  spanish_script: string;
  french_script: string;
  tone_applied: string;
}

/**
 * Complete Explainable AI (XAI) routing evaluation payload returned to the client,
 * detailing crowd status levels, actionable ground directives, and caching metadata.
 */
export interface TelemetryResponse {
  status_level: "ACTIVE" | "WARNING" | "CRITICAL" | "DIVERT_PROACTIVE";
  reasoning_output: string;
  volunteer_action: string;
  target_reroute_gate: string;
  multilingual_relay: MultilingualRelay;
  cache_status?: "HIT" | "MISS";
}

// In-memory edge cache store
interface CacheEntry {
  timestamp: number;
  data: TelemetryResponse;
}
const edgeCache: Record<string, CacheEntry> = {};

/**
 * Explainable AI (XAI) engine for Predictive Stadium Crowd Routing.
 * Evaluates real-time passenger density and controls Gate C/Gate D Load Balancing
 * via a Multilingual Megaphone Relay of emergency directives.
 *
 * @param requestPayload Structured Gemini payload config with text prompts
 */
export async function processGateTelemetry(requestPayload: GeminiRequestPayload) {
  // Standard model configuration for Vertex AI pipeline
  const response = await ai.models.generateContent({
    model: requestPayload.model || 'gemini-2.5-flash',
    contents: requestPayload.contents,
    config: requestPayload.config || {}
  });
  
  return response;
}

// Core helper for status classification logic (exported for testing)
/**
 * Evaluates real-time Gate C/Gate D load balancing thresholds and Metro surge rates
 * to classify stadium crowd congestion into deterministic operational states.
 * 
 * @param gateCDensity - Current passenger saturation percentage at Gate C (0-100)
 * @param gateDDensity - Current passenger saturation percentage at Gate D (0-100)
 * @param surgeRate - Categorical transit influx rate from adjacent Metro hubs
 * @returns Operational status level governing proactive diversion protocols
 */
export function getStatusLevel(gateCDensity: number, gateDDensity: number, surgeRate: string): "ACTIVE" | "WARNING" | "CRITICAL" | "DIVERT_PROACTIVE" {
  if (surgeRate === "Zero-Flow Lockdown") {
    return "CRITICAL";
  } else if (gateCDensity > 80 && gateDDensity > 80) {
    return "CRITICAL";
  } else if (gateCDensity >= 90) {
    return "CRITICAL";
  } else if (gateCDensity >= 80) {
    return "WARNING";
  } else if (Math.abs(gateCDensity - gateDDensity) >= 30) {
    return "DIVERT_PROACTIVE";
  }
  return "ACTIVE";
}

// In-memory rate limiting store
interface RateLimitData {
  count: number;
  resetTime: number;
}
const ipRequestCounts: Record<string, RateLimitData> = {};
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // Max 100 requests per minute

/**
 * Explainable AI (XAI) endpoint for real-time telemetry processing.
 * Performs Predictive Stadium Crowd Routing and Gate C/Gate D Load Balancing
 * using a Multilingual Megaphone Relay backup script.
 */
app.post("/api/analyze-telemetry", async (req, res) => {
  try {
    const ip = String(req.ip || req.headers["x-forwarded-for"] || "unknown");
    const now = Date.now();

    // Periodic garbage collection to prevent memory leaks from expired IP records
    if (Math.random() < 0.05) {
      for (const ipKey in ipRequestCounts) {
        if (now > ipRequestCounts[ipKey].resetTime) {
          delete ipRequestCounts[ipKey];
        }
      }
    }

    if (!ipRequestCounts[ip] || now > ipRequestCounts[ip].resetTime) {
      ipRequestCounts[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    } else {
      ipRequestCounts[ip].count++;
    }

    if (ipRequestCounts[ip].count > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    // --- Step 1: Perimeter Security & Parameter Bounds Validation (0-100) ---
    // 1. CAPTURE & BIN FIRST: At the absolute top of the request function, capture the raw gateCDensity and gateDDensity from the sandbox inputs and apply the 5% binning formula immediately
    const { gateCDensity: reqGateCDensity, gateDDensity: reqGateDDensity, gateCSliderValue, gateDSliderValue, surgeRate, fanContext, reasoningOutputPrompt } = req.body;

    const gateCDensity = gateCSliderValue !== undefined ? gateCSliderValue : reqGateCDensity;
    const gateDDensity = gateDSliderValue !== undefined ? gateDSliderValue : reqGateDDensity;

    if (gateCDensity === undefined || gateDDensity === undefined || gateCDensity === null || gateDDensity === null || !surgeRate || !fanContext) {
      return res.status(400).json({ error: "Missing required telemetry parameters." });
    }

    // Input parameter bounds (0-100) validation guard rail
    const numC = Number(gateCDensity);
    const numD = Number(gateDDensity);
    if (isNaN(numC) || numC < 0 || numC > 100 || isNaN(numD) || numD < 0 || numD > 100) {
      return res.status(400).json({ error: "Telemetry values must be valid numbers between 0 and 100." });
    }

    // --- Step 2: Deterministic Operational Status Classification ---
    // Determine status level strictly by user directive rule:
    // If Gate C crosses 80%, status_level must become 'WARNING'. If it crosses 90%, it must become 'CRITICAL'. Otherwise ACTIVE.
    const statusLevel = getStatusLevel(gateCDensity, gateDDensity, surgeRate);

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

    // --- Step 3: Edge Cache Lookup (90-Second TTL Evaluation) ---
    // 3. CHECK CACHE STORE: Look up the cacheKey. If it exists, return the cached payload instantly
    const cachedEntry = edgeCache[cacheKey];
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

    const sourceGate = gateCDensity > gateDDensity ? "Gate C" : "Gate D";
    const targetGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
    const sourceDensity = gateCDensity > gateDDensity ? gateCDensity : gateDDensity;
    const targetDensity = gateCDensity > gateDDensity ? gateDDensity : gateCDensity;

    // Pre-calculate fallback variables to inject dynamically into prompt and use as fallbacks
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
      calculatedVolunteerAction = `Redirect traffic away from ${sourceGate} and guide them to ${targetGate}.`;
    }

    let spanishScript = `Atención: el flujo está activo. Por favor, siga las indicaciones.`;
    let frenchScript = `Attention : le flux est actif. Veuillez seguir les indications de seguridad.`;

    if (surgeRate === "Zero-Flow Lockdown") {
      spanishScript = "CIERRE DE ESTADIO EN VIGOR. Detengan todos los movimientos de personas de inmediato. Permanezcan en sus lugares y esperen instrucciones de seguridad.";
      frenchScript = "CONFINEMENT DU STADE EN VIGUEUR. Arrêtez immédiatement tout mouvement de foule. Veuillez rester sur place et attendre les consignes de sécurité.";
    } else if (gateCDensity > 80 && gateDDensity > 80) {
      spanishScript = `Todos los puntos de acceso regional (Puerta C al ${gateCDensity}% y Puerta D al ${gateDDensity}%) están experimentando actualmente limitaciones extremas de capacidad debido a la multitud masiva del torneo. Necesitamos retener los flujos de peatones entrantes en los puntos de control del perímetro exterior de inmediato hasta que los pasillos internos se despejen de manera segura.`;
      frenchScript = `Tous les points d'accès regionales (Porte C à ${gateCDensity}% et Porte D à ${gateDDensity}%) connaissent actuellement des contraintes de capacité extrêmes en raison de la foule massive du tournoi. Nous devons retenir immédiatement les flux de piétons entrants aux points de contrôle du périmètre extérieur jusqu'à ce que les halls intérieurs se libèrent en toute sécurité.`;
    } else if (gateCDensity >= 80) {
      spanishScript = `Atención: la Puerta C está experimentando una congestión extrema del ${gateCDensity}%. Rediríjase a la Puerta D de inmediato.`;
      frenchScript = `Attention : la Porte C connaît un encombrement extrême de ${gateCDensity}%. Veuillez vous rediriger vers la Porte D immédiatement.`;
    } else if (statusLevel === "DIVERT_PROACTIVE") {
      const higherGateEs = gateCDensity > gateDDensity ? "Puerta C" : "Puerta D";
      const lowerGateEs = gateCDensity > gateDDensity ? "Puerta D" : "Puerta C";
      const higherGateFr = gateCDensity > gateDDensity ? "Porte C" : "Porte D";
      const lowerGateFr = gateCDensity > gateDDensity ? "Porte D" : "Porte C";
      spanishScript = `Atención: La ${higherGateEs} está experimentando alta afluencia. Por favor, diríjase a la ${lowerGateEs} para un acceso más rápido.`;
      frenchScript = `Attention : La ${higherGateFr} est encombrée. Veuillez vous diriger vers la ${lowerGateFr} pour un acceso más rápido.`;
    }

    // 1. VARIABLE CONDITIONALS:
    // If the client didn't supply the prompt, fall back to calculating it server-side:
    let targetReasoningOutput = reasoningOutputPrompt;
    if (surgeRate === "Zero-Flow Lockdown") {
      targetReasoningOutput = "STADIUM LOCKDOWN IN EFFECT. Stop all crowd movements immediately. Instruct all fans to remain in place and wait for further security directives.";
    } else if (gateCDensity > 80 && gateDDensity > 80) {
      targetReasoningOutput = `All regional access points (Gate C at ${gateCDensity}% and Gate D at ${gateDDensity}%) are currently experiencing extreme capacity constraints due to the massive tournament crowd. We need to hold incoming pedestrian flows at the outer perimeter checkpoints immediately until internal concourses clear out safely.`;
    } else if (!targetReasoningOutput) {
      if (statusLevel === "DIVERT_PROACTIVE") {
        targetReasoningOutput = `${sourceGate} is experiencing heavy volume at ${sourceDensity}%, while ${targetGate} remains clear at ${targetDensity}%. Operations must immediately divert arriving spectators toward ${targetGate} to balance the terminal footprint.`;
      } else if (gateCDensity >= 0 && gateCDensity <= 40) {
        targetReasoningOutput = `Gate C is moving smoothly at ${gateCDensity}% with normal traffic from the Metro. Gate D is at ${gateDDensity}%. Keep maintaining current flows.`;
      } else if (gateCDensity >= 41 && gateCDensity <= 79) {
        targetReasoningOutput = `Gate C is getting busy at ${gateCDensity}% due to the Metro flow. Gate D is open at ${gateDDensity}%. We should monitor this closely.`;
      } else {
        targetReasoningOutput = `Gate C is completely jammed right now at ${gateCDensity}% because a massive crowd just came in from the Metro for the ${fanContext}. Meanwhile, Gate D is totally empty at only ${gateDDensity}%. We need to quickly guide people over to Gate D so everyone gets inside safely.`;
      }
    }

    // --- Step 4: Explainable AI (XAI) Inference & Multilingual Relay Generation ---
    let result;
    try {
      let response;
      const requestPayload = {
        model: "gemini-3.5-flash",
        contents: `You are the Pulse26 Stadium Telemetry Engine. Your primary directive is to analyze crowd-flow distribution across Sector North without ever interchanging or misrepresenting the raw gate telemetry values.

[RAW TELEMETRY GROUND TRUTH]
- Gate C Density: ${gateCDensity}%
- Gate D Density: ${gateDDensity}%
- Operational State: ${statusLevel}

[CRITICAL INGRESS RULES]
1. ABSOLUTE TRUTH: You must maintain strict data integrity. Never alter, swap, or interchange the percentage values of Gate C and Gate D under any circumstances.
2. DISPARITY EVALUATION: If the operational state is "DIVERT_PROACTIVE", identify which gate has the mathematically higher density (the Source Gate) and which has the lower density (the Target Gate). 
3. DIRECTIVE GENERATION: You must generate a 'reasoning_output' that clearly states the exact factual percentage of the crowded gate, notes that the emptier gate is underutilized with its exact factual percentage, and explicitly commands ground teams to route patrons from the higher-density gate to the lower-density gate.

Requirements:
1. "status_level": Must match: "${statusLevel}"
2. "reasoning_output": You MUST output exactly this natural, conversational, simple-English statement:
   "${targetReasoningOutput}"
3. "volunteer_action": You MUST output exactly this instruction for volunteers on the ground:
   "${calculatedVolunteerAction}"
4. "target_reroute_gate": Recommend the low-density target gate ("${calculatedRerouteGate}") to redirect the active queue.
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
    } catch (apiError: unknown) {
      const err = apiError as Error;
      console.warn("Gemini API call failed or quota/billing limits exceeded. Falling back to local rules engine:", err.message || err);
      
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
  } catch (error: unknown) {
    const err = error as { status?: number; code?: number; message?: string };
    console.error("Telemetry analysis failed:", err);
    
    const isQuota = 
      err?.status === 429 || 
      err?.code === 429 || 
      String(err?.message || "").toLowerCase().includes("quota") || 
      String(err?.message || "").toLowerCase().includes("resource_exhausted") || 
      String(err?.message || "").toLowerCase().includes("rate limit") ||
      String(err?.message || "").includes("429");

    if (isQuota) {
      return res.status(429).json({
        error: "RESOURCE_EXHAUSTED",
        message: "Gemini API quota limit hit. Local safety backup layer actively handling state parameters."
      });
    }

    return res.status(500).json({ error: "Internal server error" });
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
      const ext = path.extname(req.path);
      if (ext && ext !== ".html") {
        return res.status(404).send("Not Found");
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  startServer();
}

export default app;
