import React from "react";
import { TrendingUp, Activity } from "lucide-react";

interface AnalyticsViewProps {
  analyticsThroughput: number;
  analyticsSaturationColorClass: string;
  analyticsSaturationLabel: string;
  analyticsScanLatency: string;
  analyticsGateDLatency: string;
  gateCSliderValue: number;
  gateDSliderValue: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analyticsThroughput,
  analyticsSaturationColorClass,
  analyticsSaturationLabel,
  analyticsScanLatency,
  analyticsGateDLatency,
  gateCSliderValue,
  gateDSliderValue
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{"// Operations Analytics"}</span>
          <span className="text-xl font-bold tracking-tight text-white uppercase">Pulse26 Analytics Hub</span>
        </div>
        <div className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          REAL-TIME STATS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Crowd Flow Card */}
        <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-cyan-400 w-4 h-4" />
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Total Crowd Flow</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${analyticsSaturationColorClass}`}>
                {analyticsSaturationLabel}
              </span>
              <span className="text-[10px] font-mono text-green-400 shrink-0">● LIVE FEED</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Current Throughput</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">{analyticsThroughput.toLocaleString()} <span className="text-xs font-normal text-white/50">fans/min</span></div>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Peak Capacity</span>
                <div className="text-2xl font-black text-white font-mono">4,500 <span className="text-xs font-normal text-white/50">fans/min</span></div>
              </div>
            </div>

            {/* Peak historical bar mockup */}
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase">
                <span>Hourly Throughput Trend</span>
                <span>08:00 - 09:00 (UTC)</span>
              </div>
              
              <div className="h-28 w-full flex items-end gap-1 pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0,30 L 10,25 L 20,28 L 30,12 L 40,8 L 50,15 L 60,5 L 70,18 L 80,10 L 90,2 L 100,6 L 100,30 Z" 
                    fill="url(#chartGrad)" 
                  />
                  <path 
                    d="M 0,30 L 10,25 L 20,28 L 30,12 L 40,8 L 50,15 L 60,5 L 70,18 L 80,10 L 90,2 L 100,6" 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="90" cy="2" r="2.5" fill="#22d3ee" className="animate-pulse" />
                </svg>
              </div>

              <div className="flex justify-between font-mono text-[9px] text-white/50 pt-1">
                <span>-60 min</span>
                <span>-30 min</span>
                <span>Active Peak (1.2x)</span>
                <span>Now</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gate Efficiency Ratios Card */}
        <section className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden relative">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Activity className="text-cyan-400 w-4 h-4" />
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Gate Efficiency Ratios</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">VIGILANCE LAYER</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Average Latency</span>
                <h4 className="text-xs text-white uppercase font-bold tracking-wider">Turnstile processing</h4>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-cyan-400 font-mono">{analyticsScanLatency}<span className="text-xs font-normal text-white/50">s</span></div>
                <span className="text-[9px] font-mono text-cyan-400/60 uppercase">per ticket scan</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-1">Turnstile Matrix Status</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/60 font-semibold uppercase">Gate C Line</span>
                    <span className={`${gateCSliderValue > 70 ? 'text-red-400' : gateCSliderValue >= 40 ? 'text-yellow-400' : 'text-green-400'} font-bold`}>
                      {gateCSliderValue > 70 ? 'Busy' : gateCSliderValue >= 40 ? 'Moderate' : 'Optimal'} ({analyticsScanLatency}s)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden">
                    <div className={`${gateCSliderValue > 70 ? 'bg-red-400' : gateCSliderValue >= 40 ? 'bg-yellow-400' : 'bg-green-400'} h-full rounded`} style={{ width: `${gateCSliderValue}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/60 font-semibold uppercase">Gate D Line</span>
                    <span className={`${gateDSliderValue > 70 ? 'text-red-400' : gateDSliderValue >= 40 ? 'text-yellow-400' : 'text-green-400'} font-bold`}>
                      {gateDSliderValue > 70 ? 'Busy' : gateDSliderValue >= 40 ? 'Moderate' : 'Optimal'} ({analyticsGateDLatency}s)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden">
                    <div className={`${gateDSliderValue > 70 ? 'bg-red-400' : gateDSliderValue >= 40 ? 'bg-yellow-400' : 'bg-green-400'} h-full rounded`} style={{ width: `${gateDSliderValue}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-lg border border-white/5 font-mono text-[10px] text-white/50 leading-relaxed">
                <span className="text-cyan-400/80">[SYSTEM_ALERT]</span> Gate C processing delay detected. Volunteers have been prompted to initiate redirect protocols immediately. Average turnstile scans remain safe at &lt; 2.0s threshold.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
