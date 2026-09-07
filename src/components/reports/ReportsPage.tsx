import React, { useState } from 'react';
import { FileText, Download, Printer, ExternalLink, ShieldCheck, ChevronRight, FileCode, ArrowUpRight } from 'lucide-react';
import { MOCK_CASES } from '../../data/mockCases';
import { MockCase, EscalationStatus } from '../../types';
import { ReportModal } from '../common/ReportModal';
import { CyberCellHandoffModal } from '../common/CyberCellHandoffModal';
import { RiskBadge } from '../common/RiskBadge';
import { truncateAddress } from '../../utils/formatters';

interface ReportsPageProps {
  casesList?: MockCase[];
  onUpdateCase?: (updated: MockCase) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  casesList = MOCK_CASES,
  onUpdateCase
}) => {
  const [selectedCase, setSelectedCase] = useState<MockCase | null>(null);
  const [handoffCase, setHandoffCase] = useState<MockCase | null>(null);

  const getEscalationBadge = (status?: EscalationStatus) => {
    switch (status) {
      case 'Escalated':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Accepted by Specialist Team':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Returned for More Info':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#38BDF8]" />
            <span>Forensic Intelligence Dossiers & Triage Handoffs</span>
          </h1>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            Structured first-response forensic briefings formatted for Cyber Cell escalation and machine-readable JSON exports.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-code text-xs">
          <span className="p-2 rounded-lg bg-[#0D1721] border border-[#243443] text-[#8EA1B2]">
            Ready Reports: <strong className="text-white">{casesList.length}</strong>
          </span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {casesList.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] hover:border-[#38BDF8]/40 transition-colors flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between border-b border-[#243443] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono-code text-white">{c.id}</span>
                    <RiskBadge level={c.severity} score={c.riskScore} size="sm" />
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold border ${getEscalationBadge(
                        c.escalationStatus
                      )}`}
                    >
                      {c.escalationStatus || 'Not Escalated'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#E7EEF5] mt-1">{c.title}</div>
                  <div className="text-[11px] text-[#8EA1B2] font-mono-code mt-0.5">
                    Chain: {c.blockchain} • Source: {c.source}
                  </div>
                </div>

                <div className="text-right font-mono-code">
                  <div className="text-xs text-[#8EA1B2]">TRACED SUM</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    ${c.suspiciousAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Target & Attribution Details */}
              <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1 font-mono-code text-xs">
                <div className="text-[10px] text-[#8EA1B2] uppercase">Seed Target Address:</div>
                <div className="text-white text-[11px] break-all">{c.seedDetails.address}</div>
                <div className="pt-2 border-t border-[#243443]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#8EA1B2]">Attributed Endpoint:</span>
                  <span className="text-[#38BDF8] font-semibold">{c.attribution.exchange} ({c.attribution.confidence}%)</span>
                </div>
              </div>

              {/* High Risk Highlights */}
              <div className="space-y-1 text-xs text-[#8EA1B2]">
                <div className="text-[10px] uppercase font-mono-code text-[#8EA1B2]">Key Findings:</div>
                {c.highRiskReasons.slice(0, 2).map((r, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="truncate">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#243443] flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-[#8EA1B2]">
                Depth: {c.edges.length} Hops • {c.nodes.length} Nodes
              </span>
              <div className="flex items-center gap-2 font-mono-code">
                <button
                  onClick={() => setHandoffCase(c)}
                  className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Cyber Cell Handoff</span>
                </button>

                <button
                  onClick={() => setSelectedCase(c)}
                  className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Dossier</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedCase && (
        <ReportModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateCase={onUpdateCase}
        />
      )}

      {/* Cyber Cell Handoff Modal */}
      {handoffCase && (
        <CyberCellHandoffModal
          caseData={handoffCase}
          onClose={() => setHandoffCase(null)}
          onUpdateEscalationStatus={(updatedCase) => {
            if (onUpdateCase) onUpdateCase(updatedCase);
          }}
        />
      )}
    </div>
  );
};
