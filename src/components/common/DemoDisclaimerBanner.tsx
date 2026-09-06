import React, { useState } from 'react';
import { ShieldAlert, Info, X, ExternalLink } from 'lucide-react';

export const DemoDisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-40 bg-[#0D1721] border border-[#243443] hover:border-[#38BDF8] text-[#8EA1B2] hover:text-[#E7EEF5] text-xs px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
        title="View Demo Notice"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>SIMULATION DEMO</span>
      </button>
    );
  }

  return (
    <>
      <aside aria-label="Demo notice" className="bg-[#0D1721]/95 border-b border-[#243443] px-4 py-2 text-xs text-[#8EA1B2] flex items-center justify-between backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] font-mono-code font-bold uppercase tracking-wider text-[10px] shrink-0 border border-[#38BDF8]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            SIMULATED ENVIRONMENT
          </span>
          <p className="truncate text-[#8EA1B2] hidden sm:block">
            All wallet clustering, graph nodes, risk heuristics, and exchange attributions are simulated demo telemetry. No live blockchain or external FIU actions are executed.
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-[#38BDF8] hover:underline shrink-0 text-xs inline-flex items-center gap-1 cursor-pointer"
          >
            Forensic Notice <Info className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <button
            onClick={() => setIsDismissed(true)}
            className="text-[#8EA1B2] hover:text-[#E7EEF5] p-1 rounded hover:bg-[#111F2C] transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="simulation-protocol-title"
        >
          <div className="bg-[#0D1721] border border-[#243443] rounded-xl max-w-lg w-full p-6 text-[#E7EEF5] shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="simulation-protocol-title" className="text-base font-semibold text-white">Forensic Simulation Protocol</h3>
                  <p className="text-xs text-[#8EA1B2]">TraceGuard Prototype System Notice</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#8EA1B2] hover:text-white p-1 rounded-md hover:bg-[#111F2C] cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#8EA1B2] leading-relaxed border-y border-[#243443] py-4">
              <p>
                <strong className="text-white">TraceGuard</strong> is an interactive educational and capability prototype designed for evaluating cryptocurrency fraud intelligence workflows, address clustering heuristics, and compliance referral pipelines.
              </p>
              <div className="space-y-2 bg-[#071018] p-3 rounded-lg border border-[#243443]/60 font-mono-code text-[11px]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Real Blockchain Network Access: Disabled</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>External Exchange API Queries: Disabled</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Real FIU Transmission / Fund Freezing: Disabled</span>
                </div>
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  <span>Local Mock Engine: Synthetic Heuristic Engine v2.4</span>
                </div>
              </div>
              <p>
                Exchange names, cluster memberships, and risk metrics generated in this platform are illustrative and probabilistic. They must not be treated as legally verified facts or applied to real-world asset freezes.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
