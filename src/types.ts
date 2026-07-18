export interface MultilingualRelay {
  spanish_script: string;
  french_script: string;
  tone_applied: string;
}

export interface TelemetryAnalysisResult {
  status_level: "ACTIVE" | "WARNING" | "CRITICAL";
  reasoning_output: string;
  volunteer_action: string;
  target_reroute_gate: string;
  multilingual_relay: MultilingualRelay;
}

export interface Directive {
  text: string;
  priority: "HIGH" | "MED" | "LOW";
  checked?: boolean;
}
