import React from "react";
import { Play, VolumeX, Edit2, Save } from "lucide-react";

interface ScriptPanelProps {
  lang: "es" | "fr";
  script: string;
  setScript: (s: string) => void;
  broadcasting: "es" | "fr" | null;
  handleBroadcast: (lang: "es" | "fr") => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  tempScript: string;
  setTempScript: (s: string) => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({
  lang,
  script,
  setScript,
  broadcasting,
  handleBroadcast,
  isEditing,
  setIsEditing,
  tempScript,
  setTempScript
}) => {
  const languageLabel = lang === "es" ? "Spanish" : "French";

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={tempScript}
            onChange={(e) => setTempScript(e.target.value)}
            rows={3}
            className="w-full bg-[#050505] border border-cyan-500/30 text-xs font-mono p-3 rounded-lg focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-400 outline-none"
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[9px] font-bold rounded cursor-pointer uppercase tracking-wider text-white"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setScript(tempScript);
                setIsEditing(false);
              }}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-[9px] font-bold text-black rounded cursor-pointer flex items-center gap-1 uppercase tracking-wider"
            >
              <Save className="w-3 h-3" /> Save Script
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs italic text-cyan-400 leading-relaxed bg-black/40 p-4 border border-white/5 rounded-lg shadow-inner">
            "{script}"
          </p>
          
          {broadcasting === lang && (
            <div className="text-[10px] font-mono text-cyan-400 animate-pulse bg-cyan-500/10 px-3 py-2 border border-cyan-500/20 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
              Broadcasting {languageLabel} script to volunteer megaphone arrays...
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => handleBroadcast(lang)}
              className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer ${
                broadcasting === lang ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-cyan-500 text-black"
              }`}
            >
              {broadcasting === lang ? (
                <>
                  <VolumeX className="w-4 h-4" /> Stop Broadcast
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Broadcast {languageLabel}
                </>
              )}
            </button>
            <button 
              onClick={() => {
                setTempScript(script);
                setIsEditing(true);
              }}
              className="px-3 py-2.5 border border-white/10 text-[#d1d1d1] rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              title="Override translation"
              aria-label={`Override ${languageLabel} translation`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
