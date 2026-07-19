import React from "react";

interface HeaderProps {
  currentView: "settings" | "operations" | "system-architecture" | "analytics" | "jury-sandbox";
  setCurrentView: (view: "settings" | "operations" | "system-architecture" | "analytics" | "jury-sandbox") => void;
  sysTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  sysTime
}) => {
  return (
    <header className="flex justify-between items-center w-full px-8 h-16 fixed top-0 z-50 bg-[#0a0a0a] border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
        <span className="font-sans text-sm font-bold tracking-[0.3em] uppercase text-white">
          Pulse26 <span className="text-white/20 font-light ml-1">// System Core</span>
        </span>
        <div role="tablist" aria-label="Main Views Tablist" className="hidden md:flex gap-6 ml-10 items-center h-full">
          <button 
            role="tab"
            aria-selected={currentView === "operations"}
            aria-current={currentView === "operations" ? "page" : undefined}
            onClick={() => setCurrentView("operations")}
            className={`text-xs tracking-widest uppercase transition-colors pb-1 border-b ${
              currentView === "operations" 
                ? "text-cyan-400 font-bold border-cyan-400" 
                : "text-[#c2c6d7] hover:text-white border-transparent"
            }`}
          >
            Operations
          </button>
          <button 
            role="tab"
            aria-selected={currentView === "system-architecture"}
            aria-current={currentView === "system-architecture" ? "page" : undefined}
            onClick={() => setCurrentView("system-architecture")}
            className={`text-xs tracking-widest uppercase transition-colors pb-1 border-b ${
              currentView === "system-architecture" 
                ? "text-cyan-400 font-bold border-cyan-400" 
                : "text-[#c2c6d7] hover:text-white border-transparent"
            }`}
          >
            System Architecture
          </button>
          <button 
            role="tab"
            aria-selected={currentView === "analytics"}
            aria-current={currentView === "analytics" ? "page" : undefined}
            onClick={() => setCurrentView("analytics")}
            className={`text-xs tracking-widest uppercase transition-colors pb-1 border-b ${
              currentView === "analytics" 
                ? "text-cyan-400 font-bold border-cyan-400" 
                : "text-[#c2c6d7] hover:text-white border-transparent"
            }`}
          >
            Analytics
          </button>
          <button 
            role="tab"
            aria-selected={currentView === "jury-sandbox"}
            aria-current={currentView === "jury-sandbox" ? "page" : undefined}
            onClick={() => setCurrentView("jury-sandbox")}
            className={`text-xs tracking-widest uppercase transition-colors pb-1 border-b ${
              currentView === "jury-sandbox" 
                ? "text-cyan-400 font-bold border-cyan-400" 
                : "text-[#c2c6d7] hover:text-white border-transparent"
            }`}
          >
            Jury Sandbox
          </button>
          <button 
            role="tab"
            aria-selected={currentView === "settings"}
            aria-current={currentView === "settings" ? "page" : undefined}
            onClick={() => setCurrentView("settings")}
            className={`text-xs tracking-widest uppercase transition-colors pb-1 border-b ${
              currentView === "settings" 
                ? "text-cyan-400 font-bold border-cyan-400" 
                : "text-[#c2c6d7] hover:text-white border-transparent"
            }`}
          >
            Settings
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest text-white/40 uppercase">
        <div className="hidden lg:block">V-OS 4.2.0</div>
        <div className="hidden sm:block">Buffer: Active</div>
        <div className="text-cyan-400 font-bold">{sysTime}</div>
        
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ93RhcjcTipFqfljUQMXyQObLtFQNBZXi2WXQLRudY0Hz41uv9VKOCMocTcI9L5Fs_Fkt6Xq6sHTJ1q0CHT3Jwmv0Vu9oWR8TRAkcMa02M7UCsIhWfzZcHYdvypnRC6Tvm2fM7b5H6zXGmUZkhH0kO125yLuhqzZu0qa8otZ0riEKVcJofuoD-JDN4d_6IXSUEwzIDXXIo8C3AF_DoEglX5rvvpZouzlt66hrVkayeakGWRzVZDODn4yRio6R72J0g5Gnlo-rgr0"
            alt="Cybersecurity Commander Avatar"
          />
        </div>
      </div>
    </header>
  );
};
