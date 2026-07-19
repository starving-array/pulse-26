import React from "react";
import { 
  Shield, 
  Radio, 
  Scale, 
  Zap, 
  Brain,
  Terminal as TerminalIcon
} from "lucide-react";

export const SystemArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{"// Infrastructure Blueprint"}</span>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Pulse26 System Architecture</span>
        </div>
        <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          SYSTEM CORE
        </div>
      </div>

      {/* Diagram Container */}
      <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <TerminalIcon className="text-cyan-400 w-4 h-4" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Pipeline Flow Diagram</h3>
          </div>
          <span className="text-[10px] font-mono text-white/30">Target: High-Concurrency Ingestion</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="font-mono text-xs text-cyan-400 bg-black/60 p-6 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] whitespace-pre-wrap leading-loose break-all">
            [Turnstiles/Sensors] -&gt; [Cloud Load Balancer + Cloud Armor] -&gt; [Cloud Pub/Sub Queue] -&gt; [Cloud Run Worker Instances] -&gt; [Memorystore Vector Cache] -&gt; [Vertex AI Engine]
          </div>
        </div>
      </section>

      {/* Detailed Production Rules List */}
      <section className="bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-cyan-400 w-4 h-4" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Production Architecture Specifications</h3>
          </div>
          <span className="text-[10px] font-mono text-white/40">GCP Native Stack</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingress Layer */}
            <div className="p-5 rounded-lg bg-white/[0.01] border border-white/5 flex gap-4 items-start">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Ingress Layer</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  A Google Cloud Application Load Balancer distributes all incoming front-line volunteer traffic, while Google Cloud Armor blocks malicious DDoS traffic spikes or turnstile sensor floods at the network edge.
                </p>
              </div>
            </div>

            {/* Asynchronous Ingestion */}
            <div className="p-5 rounded-lg bg-white/[0.01] border border-white/5 flex gap-4 items-start">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Asynchronous Ingestion</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Google Cloud Pub/Sub buffers high-frequency crowd entry tallies, preventing telemetry spikes from overwhelming downstream servers synchronously.
                </p>
              </div>
            </div>

            {/* Elastic Compute Processing */}
            <div className="p-5 rounded-lg bg-white/[0.01] border border-white/5 flex gap-4 items-start">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Elastic Compute Processing</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Google Cloud Run container instances dynamically auto-scale from zero to thousands of nodes instantly to ingest peak rush-hour telemetry and spin down to zero when empty to optimize event costs.
                </p>
              </div>
            </div>

            {/* High-Frequency Caching */}
            <div className="p-5 rounded-lg bg-white/[0.01] border border-white/5 flex gap-4 items-start">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">High-Frequency Caching</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Cloud Memorystore for Redis intercepts redundant telemetry states using an inline cache layer, serving stored directional scripts instantly without querying the LLM repeatedly.
                </p>
              </div>
            </div>
          </div>

          {/* Grounded Inference (Full-width row) */}
          <div className="p-5 rounded-lg bg-cyan-950/10 border border-cyan-500/20 flex gap-4 items-start mt-6">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Grounded Inference</h4>
              <p className="text-xs text-cyan-100/90 leading-relaxed">
                Vertex AI orchestrates Gemini 1.5 Flash using active Context Caching to pre-load stadium blueprints and emergency SOPs, lowering token latency by 90%.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
