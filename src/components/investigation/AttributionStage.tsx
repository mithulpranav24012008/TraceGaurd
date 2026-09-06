import React from 'react';
import { Building2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Database, DollarSign } from 'lucide-react';
import { MockCase } from '../../types';

interface AttributionStageProps {
  currentCase: MockCase;
  onAdvanceToNext: () => void;
}

export const AttributionStage: React.FC<AttributionStageProps> = ({
  currentCase,
  onAdvanceToNext
}) => {
  const attr = currentCase.attribution;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stage Header */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">{attr.title}</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-code text-xs font-bold">
              {attr.confidence}% Confidence
            </span>
          </div>
          <p className="text-xs text-[#8EA1B2] mt-1">
            Correlated heuristic cluster match identifying destination custodial service.
          </p>
        </div>

        <button
          onClick={onAdvanceToNext}
          className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>View Investigation Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exchange Match Profile Card */}
        <div className="lg:col-span-6 bg-[#0D1721] border border-[#243443] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#243443] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{attr.exchange}</h3>
                  <div className="text-[11px] text-[#8EA1B2] font-mono-code">{attr.walletType}</div>
                </div>
              </div>

              <div className="text-right font-mono-code">
                <div className="text-xs font-bold text-emerald-400">{attr.confidence}% MATCH</div>
                <div className="text-[10px] text-[#8EA1B2]">HEURISTIC v3.4</div>
              </div>
            </div>

            {/* Financial Tracing Cards */}
            <div className="grid grid-cols-2 gap-3 my-4 font-mono-code">
              <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
                <div className="text-[10px] text-[#8EA1B2] uppercase">Potential Inflow</div>
                <div className="text-sm font-bold text-white mt-1">{attr.potentialExchangeAmount}</div>
                <div className="text-[10px] text-[#8EA1B2] mt-0.5">Deposited at CEX</div>
              </div>

              <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
                <div className="text-[10px] text-[#8EA1B2] uppercase">Traceable Amount</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">{attr.potentiallyTraceableAmount}</div>
                <div className="text-[10px] text-[#8EA1B2] mt-0.5">High recovery viability</div>
              </div>
            </div>

            {/* Jurisdictional Telemetry */}
            <div className="space-y-2 text-xs font-mono-code">
              <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443] flex items-center justify-between">
                <span className="text-[#8EA1B2]">JURISDICTION:</span>
                <span className="text-white font-semibold">{attr.jurisdiction || 'International Service'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443] flex items-center justify-between">
                <span className="text-[#8EA1B2]">CLUSTER ID:</span>
                <span className="text-[#38BDF8] font-semibold">{attr.depositCluster || 'CL-GEN-2026-01'}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 font-mono-code">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold text-amber-300">Probabilistic Intelligence Warning</div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed font-sans">
                {attr.warning}
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Checklist */}
        <div className="lg:col-span-6 bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#243443] pb-3">
            <h3 className="text-xs font-semibold text-white uppercase font-mono-code flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Corroborating Attribution Evidence</span>
            </h3>
            <span className="text-[10px] font-mono-code text-[#38BDF8]">{attr.evidence.length} Points Verified</span>
          </div>

          <div className="space-y-3 text-xs">
            {attr.evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#071018] border border-[#243443] flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">{item}</div>
                  <div className="text-[11px] text-[#8EA1B2] mt-0.5 font-mono-code">
                    Signal Verified: Confidence +{Math.round(attr.confidence / attr.evidence.length)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#111F2C] border border-[#243443] text-xs font-mono-code space-y-1">
            <div className="text-white font-semibold">Recommended Investigator Action:</div>
            <p className="text-[#8EA1B2] font-sans text-xs">
              Generate a formal compliance referral payload with case hash and submit to legal liaison team for law enforcement subpoena coordination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
