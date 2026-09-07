import React, { useState } from 'react';
import { X, ShieldAlert, Download, Copy, Check, FileCode, FileText, ArrowUpRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MockCase, EscalationStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getPatternMatch } from '../../data/nationalRegistryStore';

interface CyberCellHandoffModalProps {
  caseData: MockCase;
  onClose: () => void;
  onUpdateEscalationStatus?: (updatedCase: MockCase) => void;
}

export const CyberCellHandoffModal: React.FC<CyberCellHandoffModalProps> = ({
  caseData,
  onClose,
  onUpdateEscalationStatus
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<EscalationStatus>(
    caseData.escalationStatus || 'Escalated'
  );

  const patternMatch = getPatternMatch(caseData.seedDetails.address);
  const victimCount = patternMatch ? patternMatch.victimCount : 0;
  const states = patternMatch ? patternMatch.states : [];
  const earliestDate = patternMatch ? patternMatch.earliestDate : 'N/A';
  const totalAmount = patternMatch ? patternMatch.totalAmount : 0;

  // Generate machine-readable JSON Handoff Package
  const generateJsonPackage = () => {
    return {
      handoffMetadata: {
        system: 'TraceGuard Cyber Fraud Triage Engine',
        protocolVersion: 'v2.4-FIRST-RESPONSE-TRIAGE',
        targetDestination: 'State / Central Cyber Crime Cell & Specialist Forensics Desk',
        generatedAt: new Date().toISOString(),
        triageStatement:
          'This package is formatted for handoff to specialist forensic teams and platforms (e.g., Cyber Cell units) for deep transaction tracing and bank/UPI-level attribution. TraceGuard serves as a first-response triage and pattern-matching layer.'
      },
      caseMetadata: {
        id: caseData.id,
        title: caseData.title,
        scenario: caseData.scenario,
        blockchain: caseData.blockchain,
        severity: caseData.severity,
        riskScore: caseData.riskScore,
        suspiciousAmountUsd: caseData.suspiciousAmount,
        source: caseData.source,
        currentStatus: caseData.status,
        escalationStatus: currentStatus
      },
      seedTargetAddress: caseData.seedDetails,
      clusterData: caseData.clusterData,
      riskComponents: caseData.riskComponents,
      highRiskReasons: caseData.highRiskReasons,
      nationalPatternRegistryHits: {
        victimCount,
        reportingStates: states,
        earliestDate,
        totalReportedLossesInr: totalAmount
      },
      attributionEndpoint: caseData.attribution,
      graphEdgesCount: caseData.edges.length,
      graphNodesCount: caseData.nodes.length,
      graphEdges: caseData.edges
    };
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(generateJsonPackage(), null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TG-HANDOFF-${caseData.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    const jsonString = JSON.stringify(generateJsonPackage(), null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTextDossier = () => {
    const textReport = `================================================================================
TRACEGUARD FIRST-RESPONSE TRIAGE & HANDOFF BRIEFING
================================================================================
NOTICE: SPECIALIST FORENSIC HANDOFF PACKAGE
This package is formatted for handoff to specialist forensic teams and platforms 
(e.g., Cyber Cell units) for deep transaction tracing and bank/UPI-level 
attribution. TraceGuard serves as a first-response triage layer.
================================================================================

CASE IDENTIFIER:    ${caseData.id} - ${caseData.title}
GENERATED AT:       ${new Date().toISOString()}
BLOCKCHAIN:         ${caseData.blockchain}
SEVERITY LEVEL:     ${caseData.severity} (Score: ${caseData.riskScore}/100)
ESCALATION STATUS:  ${currentStatus}

PRIMARY TARGET WALLET:
Address:            ${caseData.seedDetails.address}
Transactions:       ${caseData.seedDetails.transactions}
Total Inflow:       ${caseData.seedDetails.totalInflow}
Total Outflow:      ${caseData.seedDetails.totalOutflow}

NATIONAL PATTERN REGISTRY MATCHES:
Victim Reports:     ${victimCount}
States Involved:    ${states.join(', ') || 'N/A'}
Reported Losses:    ₹${totalAmount.toLocaleString('en-IN')}

ATTRIBUTED CEX ENDPOINT:
Exchange:           ${caseData.attribution.exchange}
Wallet Type:        ${caseData.attribution.walletType}
Confidence Rating:  ${caseData.attribution.confidence}%
Jurisdiction:       ${caseData.attribution.jurisdiction || 'International'}

HEURISTIC RISK BREAKDOWN:
${Object.entries(caseData.riskComponents).map(([key, val]) => `- ${key}: ${val}/100`).join('\n')}

KEY RISK TRIGGERS:
${caseData.highRiskReasons.map(r => `* ${r}`).join('\n')}

================================================================================
`;
    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TG-HANDOFF-${caseData.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (newStatus: EscalationStatus) => {
    setCurrentStatus(newStatus);
    if (onUpdateEscalationStatus) {
      onUpdateEscalationStatus({
        ...caseData,
        escalationStatus: newStatus
      });
    }
  };

  const getStatusBadgeStyle = (status: EscalationStatus) => {
    switch (status) {
      case 'Escalated':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Accepted by Specialist Team':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Returned for More Info':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0D1721] border border-[#243443] rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden font-sans">
        {/* Top Header */}
        <div className="p-4 bg-[#111F2C] border-b border-[#243443] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {t('handoff.title')}
              </h2>
              <p className="text-[11px] text-[#8EA1B2]">
                Case Ref: <strong className="text-white font-mono">{caseData.id}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8EA1B2] hover:text-white p-1.5 rounded-lg hover:bg-[#071018] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] text-xs">
          {/* Prominent Specialist Handoff Notice Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{t('handoff.triageNoticeTitle')}</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
              {t('handoff.triageNoticeBody')}
            </p>
          </div>

          {/* Interactive Escalation Status Updater */}
          <div className="p-4 rounded-xl bg-[#071018] border border-[#243443] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t('handoff.escalationStatus')}:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                  currentStatus
                )}`}
              >
                {currentStatus}
              </span>
            </div>

            <div className="pt-2 border-t border-[#243443]/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#8EA1B2] mr-1">{t('handoff.updateStatus')}:</span>
              {(
                [
                  'Not Escalated',
                  'Escalated',
                  'Accepted by Specialist Team',
                  'Returned for More Info'
                ] as EscalationStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    currentStatus === status
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40 shadow-xs'
                      : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Handoff Package Components Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] font-mono">
              Generated Export Package Contents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-[#38BDF8]" />
                  <span>Machine-Readable JSON</span>
                </div>
                <p className="text-[11px] text-[#8EA1B2] font-sans">
                  Structured payload containing graph nodes, cluster entities, CEX attribution, and pattern hits.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Forensic Dossier (PDF/Text)</span>
                </div>
                <p className="text-[11px] text-[#8EA1B2] font-sans">
                  Formatted first-response briefing document complete with triage header notice.
                </p>
              </div>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="pt-4 border-t border-[#243443] flex flex-col sm:flex-row items-center justify-end gap-3 font-mono">
            <button
              onClick={handleCopyJson}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#071018] border border-[#243443] hover:border-[#38BDF8] text-[#8EA1B2] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'JSON Copied!' : t('handoff.copyJson')}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#111F2C] hover:bg-[#162636] border border-[#38BDF8]/40 hover:border-[#38BDF8] text-[#38BDF8] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileCode className="w-4 h-4" />
              <span>{t('handoff.downloadJson')}</span>
            </button>

            <button
              onClick={handleDownloadTextDossier}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{t('handoff.downloadPdf')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
