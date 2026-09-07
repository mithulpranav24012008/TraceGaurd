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
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-mono text-black">
      {/* Header */}
      <div className="neo-card-yellow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-black uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-black" />
            <span>Forensic Intelligence Dossiers & Triage Handoffs</span>
          </h1>
          <p className="text-xs text-black/80 font-mono mt-0.5">
            Structured first-response forensic briefings formatted for Cyber Cell escalation and machine-readable JSON exports.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono font-bold text-black">
          <span className="p-2 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            Ready Reports: <strong className="text-black underline">{casesList.length}</strong>
          </span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {casesList.map((c) => (
          <div
            key={c.id}
            className="neo-card p-5 flex flex-col justify-between space-y-4 font-mono"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between border-b-2 border-black pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-bold text-black">{c.id}</span>
                    <RiskBadge level={c.severity} score={c.riskScore} size="sm" />
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border-2 border-black shadow-[1px_1px_0px_0px_#000] bg-white text-black"
                    >
                      {c.escalationStatus || 'Not Escalated'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-black mt-1">{c.title}</div>
                  <div className="text-[11px] text-black/70 font-mono mt-0.5">
                    Chain: {c.blockchain} • Source: {c.source}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-black/70 font-bold">TRACED SUM</div>
                  <div className="text-sm font-bold text-green-800 mt-0.5">
                    ${c.suspiciousAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Target & Attribution Details */}
              <div className="p-3 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1 font-mono text-xs">
                <div className="text-[10px] text-black/70 font-bold uppercase">Seed Target Address:</div>
                <div className="text-black text-[11px] font-bold break-all">{c.seedDetails.address}</div>
                <div className="pt-2 border-t-2 border-black flex items-center justify-between text-[11px]">
                  <span className="text-black/70 font-bold">Attributed Endpoint:</span>
                  <span className="text-black font-bold underline">{c.attribution.exchange} ({c.attribution.confidence}%)</span>
                </div>
              </div>

              {/* High Risk Highlights */}
              <div className="space-y-1 text-xs text-black font-mono">
                <div className="text-[10px] uppercase font-mono font-bold text-black/70">Key Findings:</div>
                {c.highRiskReasons.slice(0, 2).map((r, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-2 font-bold">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="truncate">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t-2 border-black flex items-center justify-between font-mono">
              <span className="text-[11px] text-black/70 font-bold">
                Depth: {c.edges.length} Hops • {c.nodes.length} Nodes
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHandoffCase(c)}
                  className="neo-btn bg-indigo-600 text-white px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-white" />
                  <span>Cyber Cell Handoff</span>
                </button>

                <button
                  onClick={() => setSelectedCase(c)}
                  className="neo-btn-sec px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-black" />
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
