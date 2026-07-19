import React from "react";
import { Scale, Activity, Loader2, RefreshCw } from "lucide-react";

interface AuditResults {
  stateIngestion: string;
  toneFiltering: string;
  contradictionGuard: string;
  cacheMatching: string;
  offlineOverride: string;
}

interface JurySandboxViewProps {
  setCurrentView: (view: "settings" | "operations" | "system-architecture" | "analytics" | "jury-sandbox") => void;
  handleRunSystemAudit: () => Promise<void>;
  auditRunning: boolean;
  auditLogs: string[];
  auditResults: AuditResults;
}

export const JurySandboxView: React.FC<JurySandboxViewProps> = ({
  setCurrentView,
  handleRunSystemAudit,
  auditRunning,
  auditLogs,
  auditResults
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{"// Stress Evaluation"}</span>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Jury Telemetry Simulation Mode</span>
        </div>
        <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          SANDBOX
        </div>
      </div>

      {/* Instructional Canvas */}
      <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Scale className="text-cyan-400 w-4 h-4" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Evaluation Protocol & Instructions</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">READY</span>
        </div>

        <div className="p-8 space-y-6">
          <div className="max-w-3xl space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide uppercase">Jury Telemetry Simulation Mode</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {"To test the platform's multi-variable AI reasoning capabilities, please navigate to the right-hand panel, adjust the Gate C and Gate D density sliders, select a transport context scenario, and hit 'INJECT TELEMETRY & TRIGGER'. The backend Gemini model will dynamically evaluate the parameters to rewrite the live front-line directives."}
            </p>
          </div>

          {/* Staggered Step Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-lg bg-black/40 border border-white/5 space-y-2 relative">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cyan-400/30">01</div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Adjust Densities</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Slide Gate C density above 80% or 90% to trigger corresponding warning/critical system level shifts automatically.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-black/40 border border-white/5 space-y-2 relative">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cyan-400/30">02</div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Select Scenario</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Pick a transport surge multiplier or fan event context to test the grounded localized reasoning layer.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 space-y-2 relative">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-cyan-400/50">03</div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-400">Inject Telemetry</h4>
              <p className="text-[11px] text-cyan-100/70 leading-relaxed">
                Hit the trigger action to watch Gemini re-evaluate, bypass or hit the 90s edge cache, and update field guidelines.
              </p>
            </div>
          </div>

          {/* Live Simulation Playground Quick Navigation Hint */}
          <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">{"// Quick Link"}</span>
              <p className="text-xs text-white">Ready to test? Go straight back to the operations cockpit.</p>
            </div>
            <button 
              onClick={() => setCurrentView("operations")}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Open Cockpit Panel
            </button>
          </div>
        </div>
      </section>

      {/* Programmatic System Audit Dashboard */}
      <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-400 w-4 h-4 animate-pulse" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Core System Audit Dashboard</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Stress Testing Sequence</span>
        </div>

        <div className="p-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <h3 className="text-lg font-bold text-white tracking-wide uppercase">Pipeline Core Audit & Stress Test Suite</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Run an automated full programmatic system audit sequence across all core Pulse26 application framework functions. The sequence executes 5 high-stress telemetry simulation scenarios over our live backend API and outputs the final <b>PULSE26 CORE ARCHITECTURE AUDIT REPORT</b> directly into the stream log window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleRunSystemAudit}
              disabled={auditRunning}
              className="px-6 py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.15em] text-xs hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,245,255,0.15)] disabled:opacity-50 flex items-center gap-2 cursor-pointer rounded-lg"
            >
              {auditRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>STRESS_TEST_SEQUENCE_ACTIVE</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>RUN FULL SYSTEM AUDIT & STRESS TEST</span>
                </>
              )}
            </button>
            {auditRunning && (
              <span className="text-xs font-mono text-cyan-400 animate-pulse uppercase tracking-wider">{"// Running live API checks in sequence..."}</span>
            )}
          </div>

          {/* Audit Logs and Real-time Status Card */}
          {(auditLogs.length > 0 || auditRunning) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* Scenario Logs */}
              <div className="lg:col-span-2 space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-mono">Live Ingestion Logs</h4>
                <div className="h-[220px] bg-black/80 border border-white/5 rounded-lg p-4 font-mono text-[10px] text-cyan-400/80 leading-relaxed overflow-y-auto space-y-1">
                  {auditLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>

              {/* Verification Results Ledger */}
              <div className="space-y-3 bg-black/40 border border-white/5 p-5 rounded-lg">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-mono">Report Verification Ledger</h4>
                <div className="space-y-4">
                  {/* Ingestion */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">State Variable Ingestion</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      auditResults.stateIngestion === "PASS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      auditResults.stateIngestion === "FAIL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/30"
                    }`}>
                      {auditResults.stateIngestion}
                    </span>
                  </div>

                  {/* Tone Filtering */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">XAI Tone Filtering</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      auditResults.toneFiltering === "PASS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      auditResults.toneFiltering === "FAIL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/30"
                    }`}>
                      {auditResults.toneFiltering}
                    </span>
                  </div>

                  {/* Contradiction Guard */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">Contradiction Guard</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      auditResults.contradictionGuard === "PASS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      auditResults.contradictionGuard === "FAIL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/30"
                    }`}>
                      {auditResults.contradictionGuard}
                    </span>
                  </div>

                  {/* Cache Key Matching */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">90s Cache Key Match</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      auditResults.cacheMatching === "PASS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      auditResults.cacheMatching === "FAIL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/30"
                    }`}>
                      {auditResults.cacheMatching}
                    </span>
                  </div>

                  {/* Offline Local Override */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">Offline Local Override</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      auditResults.offlineOverride === "PASS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      auditResults.offlineOverride === "FAIL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/30"
                    }`}>
                      {auditResults.offlineOverride}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
