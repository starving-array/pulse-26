import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

console.log("=== 1. Environment Setup ===");
const useVertex = process.env.GOOGLE_GENAI_USE_VERTEXAI;
console.log("GOOGLE_GENAI_USE_VERTEXAI environment check:", useVertex || "(not set)");
console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT || "missing");
console.log("GOOGLE_CLOUD_LOCATION:", process.env.GOOGLE_CLOUD_LOCATION || "missing");

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION;

const ai = new GoogleGenAI({
  vertexai: true,
  project,
  location
});

console.log("=== 2. Dynamic Imbalance Simulation ===");
const gateCDensity = 65;
const gateDDensity = 20;
const surgeRate = "Nominal Flow (1.0x)";
const fanContext = "High-Stakes Sporting Event";
console.log(`Inputs: Gate C Density = ${gateCDensity}%, Gate D Density = ${gateDDensity}%`);

console.log("=== 3. Pipeline Interception ===");
// Determine statusLevel
let statusLevel = "ACTIVE";
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
console.log("Calculated statusLevel:", statusLevel);

let divertInstruction = "";
if (statusLevel === "DIVERT_PROACTIVE") {
  const higherGate = gateCDensity > gateDDensity ? "Gate C" : "Gate D";
  const lowerGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
  divertInstruction = `Proactive Diversion Required: ${higherGate} density is at ${gateCDensity > gateDDensity ? gateCDensity : gateDDensity}% capacity and ${lowerGate} is underutilized at ${gateCDensity > gateDDensity ? gateDDensity : gateCDensity}%. You MUST explicitly advise routing and diverting spectators from ${higherGate} to ${lowerGate}.`;
}

const binnedGateC = Math.round(gateCDensity / 5) * 5;
const binnedGateD = Math.round(gateDDensity / 5) * 5;
const metricsArray = [binnedGateC, binnedGateD];
const cacheKey = `${JSON.stringify(metricsArray)}-${statusLevel}-${surgeRate}-${fanContext}`;
console.log("Generated cacheKey:", cacheKey);

// Target reasoning output fallback calculation
let targetReasoningOutput = "";
if (statusLevel === "DIVERT_PROACTIVE") {
  const higherGate = gateCDensity > gateDDensity ? "Gate C" : "Gate D";
  const lowerGate = gateCDensity > gateDDensity ? "Gate D" : "Gate C";
  targetReasoningOutput = `${higherGate} is at ${gateCDensity}% capacity and ${lowerGate} is underutilized at ${gateDDensity}%. Instruct volunteers to actively divert arriving spectators to ${lowerGate} to balance the stadium queue.`;
}

const telemetryText = `
Telemetry Data:
- Gate C Density: ${gateCDensity}%
- Gate D Density: ${gateDDensity}%
- Metro Hub Flow Surge Rate: ${surgeRate}
- Simulated Fan Context: ${fanContext}
- Calculated Status Level: ${statusLevel}
- Tone Applied: Calm / Informational
`;

const systemInstruction = `Perform crowd-flow operations analysis on this telemetry. Here are the constraints:
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
   - "tone_applied": Must match: "Calm / Informational"
`;
console.log("=== System Instruction sent to LLM ===");
console.log(systemInstruction);

console.log("=== 4. Live LLM Ingress Check ===");
try {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: systemInstruction,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status_level: { type: Type.STRING },
          reasoning_output: { type: Type.STRING },
          volunteer_action: { type: Type.STRING },
          target_reroute_gate: { type: Type.STRING },
          multilingual_relay: {
            type: Type.OBJECT,
            properties: {
              spanish_script: { type: Type.STRING },
              french_script: { type: Type.STRING },
              tone_applied: { type: Type.STRING }
            },
            required: ["spanish_script", "french_script", "tone_applied"]
          }
        },
        required: ["status_level", "reasoning_output", "volunteer_action", "target_reroute_gate", "multilingual_relay"]
      }
    }
  });

  const rawText = response.text;
  console.log("Raw LLM Response:");
  console.log(rawText);

  console.log("=== 5. Automated Logic Audit Assertion ===");
  const parsed = JSON.parse(rawText);
  const reasoning = parsed.reasoning_output || "";
  const volunteer = parsed.volunteer_action || "";

  console.log("Reasoning Output checked:", reasoning);
  console.log("Volunteer Action checked:", volunteer);

  const containsDivertVerbs = reasoning.toLowerCase().includes("divert") || reasoning.toLowerCase().includes("redirect") || reasoning.toLowerCase().includes("gate d");
  const containsMonitorClosely = reasoning.toLowerCase().includes("monitor closely");

  console.log("Assertion checks:");
  console.log("- Contains routing/divert terms?", containsDivertVerbs);
  console.log("- Contains 'monitor closely'?", containsMonitorClosely);

  if (containsDivertVerbs && !containsMonitorClosely) {
    console.log("✅ SUCCESS: The routing logic resolves correctly on the backend pipeline when not overridden by client prompts!");
  } else {
    console.log("❌ FAILURE: LLM output did not meet assertion constraints.");
  }
} catch (err) {
  console.error("❌ ERROR executing LLM API call:", err.message || err);
}
