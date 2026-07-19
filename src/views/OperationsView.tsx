import React from "react";
import { 
  Plus, 
  Trash2, 
  Brain, 
  Loader2, 
  Zap, 
  CheckSquare, 
  Square, 
  Activity, 
  Shield 
} from "lucide-react";
import { Directive } from "../types";
import { ScriptPanel } from "../components/ScriptPanel";

interface OperationsViewProps {
  directives: Directive[];
  handleAddDirective: (e: React.FormEvent) => void;
  handleToggleDirective: (idx: number) => void;
  handleRemoveDirective: (idx: number) => void;
  newDirectiveText: string;
  setNewDirectiveText: (val: string) => void;
  newDirectivePriority: "HIGH" | "MED" | "LOW";
  setNewDirectivePriority: (val: "HIGH" | "MED" | "LOW") => void;
  activeTab: "es" | "fr";
  setActiveTab: (val: "es" | "fr") => void;
  spanishScript: string;
  setSpanishScript: (val: string) => void;
  frenchScript: string;
  setFrenchScript: (val: string) => void;
  broadcasting: "es" | "fr" | null;
  handleBroadcast: (lang: "es" | "fr") => void;
  isEditingSpanish: boolean;
  setIsEditingSpanish: (val: boolean) => void;
  tempSpanish: string;
  setTempSpanish: (val: string) => void;
  isEditingFrench: boolean;
  setIsEditingFrench: (val: boolean) => void;
  tempFrench: string;
  setTempFrench: (val: string) => void;
  toneStatus: string;
  gateCSliderValue: number;
  setGateCSliderValue: (val: number) => void;
  gateDSliderValue: number;
  setGateDSliderValue: (val: number) => void;
  surgeRate: string;
  setSurgeRate: (val: string) => void;
  fanContext: string;
  setFanContext: (val: string) => void;
  handleTriggerReasoning: () => Promise<void>;
  loading: boolean;
  loadingStep: number;
  statusLevel: "ACTIVE" | "WARNING" | "CRITICAL" | "DIVERT_PROACTIVE" | "LOCAL OVERRIDE";
  confidence: number;
  reasoningOutput: string;
  targetRerouteGate: string;
  volunteerAction: string;
  rawLog: string;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  directives,
  handleAddDirective,
  handleToggleDirective,
  handleRemoveDirective,
  newDirectiveText,
  setNewDirectiveText,
  newDirectivePriority,
  setNewDirectivePriority,
  activeTab,
  setActiveTab,
  spanishScript,
  setSpanishScript,
  frenchScript,
  setFrenchScript,
  broadcasting,
  handleBroadcast,
  isEditingSpanish,
  setIsEditingSpanish,
  tempSpanish,
  setTempSpanish,
  isEditingFrench,
  setIsEditingFrench,
  tempFrench,
  setTempFrench,
  toneStatus,
  gateCSliderValue,
  setGateCSliderValue,
  gateDSliderValue,
  setGateDSliderValue,
  surgeRate,
  setSurgeRate,
  fanContext,
  setFanContext,
  handleTriggerReasoning,
  loading,
  loadingStep,
  statusLevel,
  confidence,
  reasoningOutput,
  targetRerouteGate,
  volunteerAction,
  rawLog
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
      {/* LEFT COLUMN (60%) */}
      <div className="lg:col-span-6 space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
            Real-Time Flow Analysis & Control Terminal
          </span>
        </div>

        {/* Header Status Block */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-xl flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active Station</span>
            <span className="text-lg font-bold tracking-tight text-white uppercase">Sector North - Turnstile C</span>
          </div>

          {statusLevel === "CRITICAL" ? (
            <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
              CRITICAL
            </div>
          ) : statusLevel === "WARNING" ? (
            <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/30">
              WARNING
            </div>
          ) : statusLevel === "DIVERT_PROACTIVE" ? (
            <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30">
              PROACTIVE DIVERT
            </div>
          ) : statusLevel === "LOCAL OVERRIDE" ? (
            <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 animate-pulse">
              LOCAL OVERRIDE
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              STABLE
            </div>
          )}
        </div>

        {/* Explainable AI feedback */}
        <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-[#050505]/95 z-30 flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
              <p className="text-sm font-bold tracking-widest uppercase text-white">Synthesizing Pipeline Analysis...</p>
              <div className="max-w-md mt-2 text-[11px] font-mono text-white/50 h-12">
                {loadingStep === 0 && <p className="animate-pulse">{"// Reading Gate C & Gate D telemetry vectors..."}</p>}
                {loadingStep === 1 && <p className="animate-pulse">{"// Dispatching high-stakes inference token call..."}</p>}
                {loadingStep === 2 && <p className="animate-pulse">{"// Generating multi-language tone-sensitive scripts..."}</p>}
                {loadingStep === 3 && <p className="animate-pulse">{"// Compiling response directives payload..."}</p>}
              </div>
            </div>
          )}

          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Brain className="text-cyan-400 w-4 h-4" />
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50 italic underline underline-offset-4">Explainable AI Feedback</h3>
            </div>
            <span className="text-[10px] font-mono text-white/30">Confidence Score: {confidence}</span>
          </div>

          <div className="p-6 space-y-6">
            <output className="serif-font text-xl md:text-2xl leading-relaxed text-gray-300 p-6 bg-white/[0.01] border border-white/5 rounded-xl shadow-inner block" aria-live="polite">
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 italic">{"// Unified Context Resolution"}</p>
              <p className="mb-4">{reasoningOutput}</p>
              <div className="text-xs font-mono text-white/40 border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between gap-2">
                <span>Target Gate Recommendation: <b className="text-cyan-400">{targetRerouteGate}</b></span>
                <span>Primary Ground Action: <b className="text-cyan-400">{volunteerAction.length > 55 ? volunteerAction.substring(0, 55) + "..." : volunteerAction}</b></span>
              </div>
            </output>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-white/30 mb-2 uppercase tracking-widest">/stream/raw_telemetry/v1_log</span>
              <pre className="h-[140px] bg-black p-4 border border-white/5 rounded-lg font-mono text-[11px] text-cyan-400/80 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                {rawLog}
              </pre>
            </div>
          </div>
        </section>

        {/* Direct Action Checklist */}
        <section className="bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-cyan-400 w-4 h-4" />
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Direct Action Checklist</h3>
            </div>
            <span className="text-[10px] font-mono text-white/40">Task Queue: {directives.filter(d => d.checked).length}/{directives.length}</span>
          </div>
          
          <div className="p-5 space-y-3">
            {directives.map((dir, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  dir.checked 
                    ? "bg-black/30 border-white/5 opacity-40" 
                    : "bg-white/[0.02] border-white/5 hover:border-cyan-400/20"
                }`}
              >
                <button 
                  onClick={() => handleToggleDirective(idx)}
                  className="text-cyan-400 hover:text-white transition-colors focus:outline-none"
                >
                  {dir.checked ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-white/30" />
                  )}
                </button>

                <span 
                  onClick={() => handleToggleDirective(idx)}
                  className={`text-xs font-mono select-none cursor-pointer flex-1 transition-colors ${
                    dir.checked ? "line-through text-white/30" : "text-gray-300"
                  }`}
                >
                  {idx + 1}. {dir.text}
                </span>

                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    dir.priority === "HIGH" 
                      ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                      : dir.priority === "MED" 
                      ? "bg-orange-500/10 border border-orange-500/20 text-orange-400" 
                      : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  }`}>
                    {dir.priority}
                  </span>

                  <button 
                    onClick={() => handleRemoveDirective(idx)}
                    className="text-white/30 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                    title="Purge Command"
                    aria-label="Remove directive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add manual actions */}
            <form onSubmit={handleAddDirective} className="flex gap-2 pt-4 mt-2 border-t border-white/5">
              <input 
                type="text"
                maxLength={140}
                placeholder="Add tactical instruction parameter on the ground..."
                value={newDirectiveText}
                onChange={(e) => setNewDirectiveText(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 text-xs text-white rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 placeholder-white/20 font-mono"
              />
              <select
                aria-label="Select Directive Priority Level"
                value={newDirectivePriority}
                onChange={(e) => setNewDirectivePriority(e.target.value as "HIGH" | "MED" | "LOW")}
                className="bg-black/40 border border-white/10 text-[10px] text-white rounded-lg px-2 py-2 focus:ring-1 focus:ring-cyan-400 font-mono"
              >
                <option value="HIGH">HIGH</option>
                <option value="MED">MED</option>
                <option value="LOW">LOW</option>
              </select>
              <button 
                type="submit"
                className="bg-cyan-500 text-black hover:bg-cyan-400 px-3 py-2 rounded-lg font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0 shadow-[0_0_10px_rgba(0,245,255,0.15)]"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </form>
          </div>
        </section>

        {/* Multilingual Megaphone tab and container */}
        <section className="bg-black/40 rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-inner">
          <div className="flex border-b border-white/10 bg-white/[0.01] items-center justify-between pr-4">
            <div className="flex">
              <button 
                onClick={() => setActiveTab("es")}
                className={`px-6 py-3 text-[10px] uppercase tracking-widest border-r border-white/10 font-bold transition-all ${
                  activeTab === "es" 
                    ? "bg-white/5 text-cyan-400" 
                    : "text-white/30 hover:text-white"
                }`}
              >
                Spanish script
              </button>
              <button 
                onClick={() => setActiveTab("fr")}
                className={`px-6 py-3 text-[10px] uppercase tracking-widest border-r border-white/10 font-bold transition-all ${
                  activeTab === "fr" 
                    ? "bg-white/5 text-cyan-400" 
                    : "text-white/30 hover:text-white"
                }`}
              >
                French script
              </button>
            </div>

            <div className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/20 px-2 py-1 border border-cyan-500/20 rounded uppercase tracking-wider">
              Tone: {toneStatus}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "es" ? (
              <ScriptPanel
                lang="es"
                script={spanishScript}
                setScript={setSpanishScript}
                broadcasting={broadcasting}
                handleBroadcast={handleBroadcast}
                isEditing={isEditingSpanish}
                setIsEditing={setIsEditingSpanish}
                tempScript={tempSpanish}
                setTempScript={setTempSpanish}
              />
            ) : (
              <ScriptPanel
                lang="fr"
                script={frenchScript}
                setScript={setFrenchScript}
                broadcasting={broadcasting}
                handleBroadcast={handleBroadcast}
                isEditing={isEditingFrench}
                setIsEditing={setIsEditingFrench}
                tempScript={tempFrench}
                setTempScript={setTempFrench}
              />
            )}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN (40%) */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-8 bg-[#0a0a0a] p-8 rounded-xl border border-white/10 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg tracking-wide">Environment Sandbox</h3>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Manual override parameters</p>
          </div>

          <div className="space-y-8">
            {/* Range Sliders */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="uppercase tracking-widest text-gray-400">Gate C Density</span>
                  <span id="val-c" className="text-cyan-400 font-bold">{gateCSliderValue}%</span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={gateCSliderValue}
                  onChange={(e) => setGateCSliderValue(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  aria-label="Gate C Density Slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={gateCSliderValue}
                />
                <div className="flex justify-between text-[9px] font-mono text-white/55">
                  <span>Min Flow</span>
                  <span>Compounded Queue Threshold (80% / 90%)</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="uppercase tracking-widest text-gray-400">Gate D Density</span>
                  <span id="val-d" className="text-cyan-400 font-bold">{gateDSliderValue}%</span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={gateDSliderValue}
                  onChange={(e) => setGateDSliderValue(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  aria-label="Gate D Density Slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={gateDSliderValue}
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block font-mono">
                  Metro Hub Flow Surge
                </label>
                <select 
                  value={surgeRate}
                  onChange={(e) => setSurgeRate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3 text-sm rounded-lg text-white outline-none focus:border-cyan-500/50 cursor-pointer font-sans"
                >
                  <option value="Nominal Flow (1.0x)" className="bg-[#0a0a0a]">Nominal Flow (1.0x)</option>
                  <option value="Rush Hour Peak (2.5x)" className="bg-[#0a0a0a]">Rush Hour Peak (2.5x)</option>
                  <option value="Emergency Surge (5.0x)" className="bg-[#0a0a0a]">Emergency Surge (5.0x)</option>
                  <option value="Zero-Flow Lockdown" className="bg-[#0a0a0a]">Zero-Flow Lockdown</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block font-mono">
                  Simulated Fan Context
                </label>
                <select 
                  value={fanContext}
                  onChange={(e) => setFanContext(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3 text-sm rounded-lg text-white outline-none focus:border-cyan-500/50 cursor-pointer font-sans"
                >
                  <option value="General Commuter" className="bg-[#0a0a0a]">General Commuter</option>
                  <option value="High-Stakes Sporting Event" className="bg-[#0a0a0a]">High-Stakes Sporting Event</option>
                  <option value="Political Rally" className="bg-[#0a0a0a]">Political Rally</option>
                  <option value="Music Festival Outflow" className="bg-[#0a0a0a]">Music Festival Outflow</option>
                  <option value="Medical Distress" className="bg-[#0a0a0a]">⚠️ Medical Distress (Urgent)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Heatmap Flow Component */}
          <div className="relative h-32 rounded-lg overflow-hidden border border-white/10 bg-black group shadow-inner">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/30 via-transparent to-transparent"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqR21Bi28cbk7KhDL2vH1aee0tXOqBiQgE4EULXpxYAsmjpX7PcKD5BEClzNlWWX61N6ooCd52CL_D0Bt8KAs7_4J9wpdVTZ2QDDovihI9zoppaCIzthK6iWifJ3PxIjgTzuo0C8gn5yce55r1eOGEJRCIRf276K_G23SMdIfwelxX7RRstXWsPPP5cX2qnzwPEtIU5s1jv6QRjclVFSBE3PUh-YSwWSnOQFfrOCNp5YWOqgwplAdlKrPz5960XRlYY9vfsLNi0IY')" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-3">
                <Activity className="w-6 h-6 text-cyan-400 animate-pulse mx-auto mb-1" />
                <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Live Flow Heatmap Feed</p>
                <p className="text-[9px] text-white/40 mt-0.5">Inbound: {surgeRate}</p>
              </div>
            </div>
          </div>

          {/* Main injection trigger action button */}
          <button 
            onClick={handleTriggerReasoning}
            disabled={loading}
            className="w-full py-5 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-cyan-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,245,255,0.2)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Zap className="w-4 h-4 fill-current" />
            )}
            <span>Inject Telemetry & Trigger XAI</span>
          </button>

          {/* Consensus Shield status footer */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <Shield className="text-cyan-400 w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wide">Jury Consensus Active</span>
              <span className="text-[10px] text-white/40 font-mono">3/3 Secure Judges Validated Operations Command</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
