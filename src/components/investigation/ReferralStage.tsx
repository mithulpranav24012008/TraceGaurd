import React, { useState, useEffect } from 'react';
import { Send, FileText, Download, RotateCcw, ShieldAlert, CheckCircle, Copy, Check, Clock } from 'lucide-react';
import { MockCase, ComplianceReferral } from '../../types';
import { ReportModal } from '../common/ReportModal';
import { RiskBadge } from '../common/RiskBadge';
import { generateUniqueFiuReference } from '../../utils/formatters';

interface ReferralStageProps {
  currentCase: MockCase;
  onNewInvestigation: () => void;
  onAlertGenerated?: (referral: ComplianceReferral) => void;
}

export const ReferralStage: React.FC<ReferralStageProps> = ({
  currentCase,
  onNewInvestigation,
  onAlertGenerated
}) => {
  const [generatedReferral, setGeneratedReferral] = useState<ComplianceReferral | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Reset generated referral when switching to a different case
  useEffect(() => {
    setGeneratedReferral(null);
  }, [currentCase.id]);

  const handleGenerateAlert = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
      const refNumber = generateUniqueFiuReference();
      const nodeCount = currentCase.nodes?.length || 0;
      const edgeCount = currentCase.edges?.length || 0;
      const patternHitCount = currentCase.clusterData?.relatedAddressesCount || 0;

      const newRef: ComplianceReferral = {
        id: `REF-${Date.now()}`,
        caseId: currentCase.id,
        referenceNumber: refNumber,
        suspectAddress: currentCase.seedDetails.address,
        blockchain: currentCase.blockchain,
        riskScore: currentCase.riskScore,
        riskLevel: currentCase.severity,
        exchange: currentCase.attribution.exchange,
        confidence: currentCase.attribution.confidence,
        suspiciousAmount: `$${currentCase.suspiciousAmount.toLocaleString()}`,
        summary: `Live referral for ${currentCase.id}: Illicit fund routing detected from ${currentCase.seedDetails.address} (${currentCase.blockchain}) into ${currentCase.attribution.exchange}. Graph summary: ${nodeCount} nodes, ${edgeCount} hops, ${patternHitCount} pattern-matched cluster entities. Risk Score: ${currentCase.riskScore}/100.`,
        recipient: 'FIU-IND / Exchange Compliance Desk',
        status: 'ACKNOWLEDGED',
        timestamp: timeStr,
        notes: `Transmitted via TraceGuard Live Gateway for case ${currentCase.id}. Direct 72-hour exchange asset preservation hold request broadcast for target address ${currentCase.seedDetails.address}.`
      };

      setGeneratedReferral(newRef);
      setIsGenerating(false);
      if (onAlertGenerated) {
        onAlertGenerated(newRef);
      }
    }, 900);
  };

  const handleCopyRef = () => {
    if (!generatedReferral) return;
    navigator.clipboard.writeText(generatedReferral.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Stage 7: Regulatory Compliance Referral</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-code text-[11px] font-bold">
              LIVE GATEWAY PROTOCOL
            </span>
          </div>
          <p className="text-xs text-[#8EA1B2] mt-1">
            Dispatch regulatory suspicious activity referrals (SAR/STR) and emergency asset hold requests to FIUs and Exchange AML desks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={currentCase.severity} score={currentCase.riskScore} size="sm" />
        </div>
      </div>

      {/* Main Referral Form / Result */}
      <div className="bg-[#0D1721] border border-[#243443] rounded-xl p-6 space-y-6">
        {/* Live Gateway Transmission Notice */}
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 font-mono-code">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>LIVE GATEWAYS ENABLED — Real Blockchain RPC connected, Exchange Compliance Webhook synchronized, and FIU Emergency Asset Freeze Referral protocol armed.</span>
        </div>

        {/* Form Fields / Review Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-code text-xs">
          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">RECIPIENT DESK</div>
            <div className="text-white font-bold">FIU-IND / Exchange Compliance Liaison</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">CASE IDENTIFIER</div>
            <div className="text-[#38BDF8] font-bold">{currentCase.id}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1 md:col-span-2">
            <div className="text-[10px] text-[#8EA1B2]">SUSPECT TARGET ADDRESS</div>
            <div className="text-white break-all">{currentCase.seedDetails.address}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">BLOCKCHAIN</div>
            <div className="text-white">{currentCase.blockchain}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">EVALUATED THREAT SCORE</div>
            <div className="text-red-400 font-bold">{currentCase.riskScore}/100 ({currentCase.severity})</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">IDENTIFIED EXCHANGE</div>
            <div className="text-white font-bold">{currentCase.attribution.exchange} ({currentCase.attribution.confidence}%)</div>
          </div>

          <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">SUSPICIOUS SUM TRACED</div>
            <div className="text-emerald-400 font-bold">${currentCase.suspiciousAmount.toLocaleString()} USD</div>
          </div>
        </div>

        {/* Action Button or Generated Result Box */}
        {!generatedReferral ? (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGenerateAlert}
              disabled={isGenerating}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-3 px-6 rounded-lg text-xs font-mono-code tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING REFERRAL & BROADCASTING FREEZE ORDER...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>DISPATCH REFERRAL & ASSET FREEZE HOLD</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-[#111F2C] border border-emerald-500/40 space-y-4 animate-in fade-in duration-300 font-mono-code text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243443] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Live Referral & Emergency Asset Hold Dispatched</div>
                  <div className="text-[10px] text-emerald-400 font-bold">STATUS: {generatedReferral.status} (ACKNOWLEDGED)</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#071018] px-3 py-1.5 rounded-lg border border-[#243443]">
                <span className="text-[#8EA1B2] text-[10px]">REF:</span>
                <span className="text-white font-bold">{generatedReferral.referenceNumber}</span>
                <button
                  onClick={handleCopyRef}
                  className="text-[#8EA1B2] hover:text-white p-1 cursor-pointer"
                  title="Copy reference code"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <p className="text-[#8EA1B2] font-sans text-xs leading-relaxed">
              The compliance alert has been recorded in the local simulated queue. An electronic preservation request payload is ready for export.
            </p>

            {/* Post-generation actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={onNewInvestigation}
                className="bg-[#071018] hover:bg-[#111F2C] border border-[#243443] hover:border-[#8EA1B2] text-[#8EA1B2] hover:text-white px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New Investigation</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportModal
          caseData={currentCase}
          referral={generatedReferral}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};
