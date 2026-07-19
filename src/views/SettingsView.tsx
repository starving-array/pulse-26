import React from "react";
import { Settings } from "lucide-react";

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{"// System Control Panel"}</span>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Pulse26 Settings</span>
        </div>
        <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          SYSTEM CORE
        </div>
      </div>

      {/* Settings Dashboard Matrix */}
      <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Settings className="text-cyan-400 w-4 h-4" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">System Configuration Ledger</h3>
          </div>
          <span className="text-[10px] font-mono text-white/30">Read-Only Secure Parameters</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-black/40 rounded-lg border border-white/5 divide-y divide-white/5 font-mono text-xs">
            
            {/* Target Backend Model */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-white uppercase font-bold text-xs tracking-wider">Target Backend Model</span>
                <p className="text-[10px] text-white/40 font-mono">The LLM model targeted for crowd reasoning inference.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-cyan-400 font-bold uppercase">Gemini 1.5 Flash (Active)</span>
              </div>
            </div>

            {/* Local Cache Status */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-white uppercase font-bold text-xs tracking-wider">Local Cache Status</span>
                <p className="text-[10px] text-white/40 font-mono">Controls backend API result intercept to reduce latency.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-cyan-400 font-bold uppercase">90-Second In-Memory Edge Cache Enabled</span>
              </div>
            </div>

            {/* Language Relays Active */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-white uppercase font-bold text-xs tracking-wider">Language Relays Active</span>
                <p className="text-[10px] text-white/40 font-mono">Localized megaphone scripts supported for field relays.</p>
              </div>
              <div className="text-right">
                <span className="text-white uppercase font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10 text-[10px] tracking-wider">
                  English, Spanish, French
                </span>
              </div>
            </div>

          </div>

          {/* Environment Integrity block */}
          <div className="p-4 rounded-lg bg-black/60 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white/50 font-mono text-[10px] tracking-wide leading-relaxed">
            <div className="space-y-1">
              <div><span className="text-cyan-400 font-bold">{"// CLOUD CONFIG:"}</span> Region: asia-southeast1</div>
              <div><span className="text-cyan-400 font-bold">{"// SECURE VAULT:"}</span> process.env.GEMINI_API_KEY (VALID)</div>
            </div>
            <div className="sm:text-right text-white/30 text-[9px] uppercase">
              Pulse26 Secure Node Stack v4.2.0-C
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
