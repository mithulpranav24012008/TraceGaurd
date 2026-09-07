import React from 'react';
import { FileText, ArrowRight, ShieldAlert, CheckCircle2, DollarSign, GitFork, Building2, AlertTriangle } from 'lucide-react';
import { MockCase } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { RiskExplanationBox } from '../common/RiskExplanationBox';
import { truncateAddress } from '../../utils/formatters';

interface SummaryStageProps {
  currentCase: MockCase;
  onAdvanceToNext: () => void;
}

export const SummaryStage: React.FC<SummaryStageProps> = ({
  currentCase,
  onAdvanceToNext
}) => {
  // Compute key dossier metrics dynamically from active case data
  const totalVolumeUSD =
    currentCase.suspiciousAmount > 0
      ? currentCase.suspiciousAmount
      : currentCase.edges.reduce((sum, e) => {
          const num = parseFloat(e.usdValue?.replace(/[^0-9.]/g, '') || '0');
          return sum + (isNaN(num) ? 0 : num);
        }, 0);

  const uniqueWalletCount = new Set(currentCase.nodes?.map((n) => n.address) || []).size || currentCase.nodes?.length || 0;
  const totalTxnsAnalyzed =
    currentCase.nodes?.reduce((sum, n) => sum + (n.transactions || 0), 0) ||
    currentCase.seedDetails?.transactions ||
    0;
  const maxTraceHops =
    currentCase.edges?.length > 0
      ? Math.max(...currentCase.edges.map((e) => e.hop || 1), currentCase.edges.length)
      : 0;
  const highRiskNodesCount = (currentCase.nodes || []).filter(
    (n) => n.risk >= 70 || n.type === 'mixer' || n.type === 'bridge' || n.type === 'high_risk'
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stage Header */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Stage 6: Executive Investigation Summary</h2>
            <RiskBadge level={currentCase.severity} score={currentCase.riskScore} size="sm" />
          </div>
          <p className="text-xs text-[#8EA1B2] mt-1">
            Consolidated forensic dossier synthesizing all graph hops, cluster memberships, and counterparty findings.
          </p>
        </div>

        <button
          onClick={onAdvanceToNext}
          className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Generate Compliance Referral</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Dossier Card */}
      <div className="bg-[#0D1721] border border-[#243443] rounded-xl p-6 space-y-6">
        {/* Case Meta Banner */}
        <div className="p-4 rounded-lg bg-[#071018] border border-[#243443] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold font-mono-code text-white">{currentCase.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-mono-code">
                {currentCase.blockchain}
              </span>
            </div>
            <div className="text-xs text-[#8EA1B2] font-mono-code flex items-center gap-2">
              <span>SEED:</span>
              <span className="text-white">{currentCase.seedDetails?.address || 'N/A'}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase font-mono-code text-[#8EA1B2]">Total Volume Traced</div>
            <div className="text-xl font-bold font-mono-code text-emerald-400">
              ${totalVolumeUSD.toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* 6 Key Dossier Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono-code">
          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">CONNECTED WALLETS</div>
            <div className="text-base font-bold text-white mt-1">{uniqueWalletCount} wallets</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">TXNS ANALYZED</div>
            <div className="text-base font-bold text-white mt-1">{totalTxnsAnalyzed} txns</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">TRACE DEPTH</div>
            <div className="text-base font-bold text-white mt-1">{maxTraceHops} hops</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">HIGH RISK NODES</div>
            <div className="text-base font-bold text-red-400 mt-1">{highRiskNodesCount} flagged</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">ATTRIBUTED CEX</div>
            <div className="text-xs font-bold text-white mt-1 truncate">{currentCase.attribution?.exchange || 'Unattributed'}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">CONFIDENCE</div>
            <div className="text-base font-bold text-emerald-400 mt-1">{currentCase.attribution?.confidence || 0}%</div>
          </div>
        </div>

        {/* High Risk Flags Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono-code flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>High-Risk Intelligence Triggers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentCase.highRiskReasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What This Means — Plain-Language Narrative */}
        <RiskExplanationBox
          riskScore={currentCase.riskScore}
          severity={currentCase.severity}
          riskComponents={currentCase.riskComponents}
          highRiskReasons={currentCase.highRiskReasons}
          attribution={currentCase.attribution}
        />

        {/* Final Disposition & Next Step */}
        <div className="p-4 rounded-lg bg-[#111F2C] border border-[#243443] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono-code">
          <div>
            <div className="text-white font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Investigation Phase Complete</span>
            </div>
            <p className="text-[#8EA1B2] font-sans text-xs mt-0.5">
              Proceed to Stage 7 to generate a simulated regulatory compliance referral for legal or exchange compliance desks.
            </p>
          </div>

          <button
            onClick={onAdvanceToNext}
            className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Referral Generation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
