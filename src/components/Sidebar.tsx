import React from "react";
import { Radio, Shield, TrendingUp, Scale, Settings, RefreshCw, HelpCircle, FileText } from "lucide-react";

interface SidebarProps {
  currentView: "settings" | "operations" | "system-architecture" | "analytics" | "jury-sandbox";
  setCurrentView: (view: "settings" | "operations" | "system-architecture" | "analytics" | "jury-sandbox") => void;
  loading: boolean;
  handleTriggerReasoning: () => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  loading,
  handleTriggerReasoning
}) => {
  return (
    <aside className="hidden md:flex flex-col h-full py-6 px-4 gap-2 bg-[#0a0a0a] border-r border-white/10 h-screen w-64 fixed left-0 top-0 pt-20 z-40">
      <div className="px-3 mb-6">
        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Command Terminal</h2>
        <p className="text-[10px] font-mono text-cyan-400/70">Vigilance Protocol v4.2</p>
      </div>
      
      <div role="tablist" aria-label="Command Terminal Navigation" className="space-y-1">
        <button 
          role="tab"
          aria-selected={currentView === "operations"}
          aria-current={currentView === "operations" ? "page" : undefined}
          onClick={() => setCurrentView("operations")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-all border text-left focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            currentView === "operations" 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-bold" 
              : "text-white/50 hover:text-white hover:bg-white/[0.02] border-transparent"
          }`}
        >
          <Radio className="w-4 h-4 shrink-0" />
          <span className="text-xs uppercase tracking-wider font-semibold">Operations</span>
        </button>
        <button 
          role="tab"
          aria-selected={currentView === "system-architecture"}
          aria-current={currentView === "system-architecture" ? "page" : undefined}
          onClick={() => setCurrentView("system-architecture")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-all border text-left focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            currentView === "system-architecture" 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-bold" 
              : "text-white/50 hover:text-white hover:bg-white/[0.02] border-transparent"
          }`}
        >
          <Shield className="w-4 h-4 shrink-0" />
          <span className="text-xs uppercase tracking-wider font-semibold">System Architecture</span>
        </button>
        <button 
          role="tab"
          aria-selected={currentView === "analytics"}
          aria-current={currentView === "analytics" ? "page" : undefined}
          onClick={() => setCurrentView("analytics")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-all border text-left focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            currentView === "analytics" 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-bold" 
              : "text-white/50 hover:text-white hover:bg-white/[0.02] border-transparent"
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="text-xs uppercase tracking-wider font-semibold">Analytics</span>
        </button>
        <button 
          role="tab"
          aria-selected={currentView === "jury-sandbox"}
          aria-current={currentView === "jury-sandbox" ? "page" : undefined}
          onClick={() => setCurrentView("jury-sandbox")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-all border text-left focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            currentView === "jury-sandbox" 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-bold" 
              : "text-white/50 hover:text-white hover:bg-white/[0.02] border-transparent"
          }`}
        >
          <Scale className="w-4 h-4 shrink-0" />
          <span className="text-xs uppercase tracking-wider font-semibold">Jury Sandbox</span>
        </button>
        <button 
          role="tab"
          aria-selected={currentView === "settings"}
          aria-current={currentView === "settings" ? "page" : undefined}
          onClick={() => setCurrentView("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-all border text-left focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            currentView === "settings" 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-bold" 
              : "text-white/50 hover:text-white hover:bg-white/[0.02] border-transparent"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="text-xs uppercase tracking-wider font-semibold">Settings</span>
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
        <button 
          onClick={handleTriggerReasoning}
          disabled={loading}
          className="w-full py-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} /> Deploy Patch
        </button>
        <a className="flex items-center gap-3 px-3 py-2 text-white/40 hover:text-white transition-colors" href="#">
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Support</span>
        </a>
        <a className="flex items-center gap-3 px-3 py-2 text-white/40 hover:text-white transition-colors" href="#">
          <FileText className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Logs</span>
        </a>
      </div>
    </aside>
  );
};
