import React, { useState } from 'react';
import { Building2, AlertTriangle, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { MockCase } from '../../types';
import { truncateAddress } from '../../utils/formatters';

interface AttributionStageProps {
  currentCase: MockCase;
  onAdvanceToNext: () => void;
  onUpdateCase?: (updated: MockCase) => void;
}

export const AttributionStage: React.FC<AttributionStageProps> = ({
  currentCase,
  onAdvanceToNext,
  onUpdateCase
}) => {
  const attr = currentCase.attribution;
  const evidenceList = attr.evidence || [];
  const clusterEntities = currentCase.clusterData?.clusterEntities || [];

  const [selectedEntityIndex, setSelectedEntityIndex] = useState<number>(0);
  const selectedEntity = clusterEntities[selectedEntityIndex] || null;

  // Track checked state of each evidence point
  const [checkedEvidence, setCheckedEvidence] = useState<boolean[]>(() =>
    evidenceList.map(() => true)
  );

  // Compute confidence dynamically based on selected cluster entity's correlationScore
  const baseEntityConfidence = selectedEntity
    ? selectedEntity.correlationScore
    : attr.confidence || 90;

  const totalEvidenceCount = evidenceList.length || 1;
  const minConfidence = Math.max(20, baseEntityConfidence - 30);
  const pointWeight = (baseEntityConfidence - minConfidence) / totalEvidenceCount;

  const checkedCount = checkedEvidence.filter(Boolean).length;
  const rawConfidence = minConfidence + Math.round(checkedCount * pointWeight);
  const confidenceScore = Math.min(100, Math.max(0, rawConfidence));

  const handleToggleEvidence = (index: number) => {
    const nextChecked = [...checkedEvidence];
    nextChecked[index] = !nextChecked[index];
    setCheckedEvidence(nextChecked);

    const newCheckedCount = nextChecked.filter(Boolean).length;
    const newRaw = minConfidence + Math.round(newCheckedCount * pointWeight);
    const newClamped = Math.min(100, Math.max(0, newRaw));

    if (onUpdateCase) {
      onUpdateCase({
        ...currentCase,
        attribution: {
          ...currentCase.attribution,
          confidence: newClamped
        }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stage Header */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">{attr.title}</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-code text-xs font-bold">
              {confidenceScore}% Confidence — {selectedEntity?.alias || attr.exchange}
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

      {/* Cluster Entity Selection Bar */}
      {clusterEntities.length > 0 && (
        <div className="p-4 rounded-xl bg-[#0D1721] border border-[#243443] space-y-2 font-mono-code">
          <div className="flex items-center justify-between text-xs text-[#8EA1B2]">
            <span className="uppercase font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#38BDF8]" />
              <span>Select Cluster Target Node to Inspect Attribution:</span>
            </span>
            <span className="text-[#38BDF8]">{clusterEntities.length} Cluster Entities</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {clusterEntities.map((entity, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedEntityIndex(idx)}
                className={`px-3 py-2 rounded-lg text-xs font-mono-code transition-all cursor-pointer border shrink-0 text-left space-y-0.5 ${
                  selectedEntityIndex === idx
                    ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white shadow-md'
                    : 'bg-[#071018] border-[#243443] text-[#8EA1B2] hover:text-white hover:border-[#8EA1B2]'
                }`}
              >
                <div className="font-bold flex items-center gap-2">
                  <span>{entity.alias}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border ${
                      entity.correlationScore >= 85
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {entity.correlationScore}% Conf
                  </span>
                </div>
                <div className="text-[10px] text-[#8EA1B2]">{truncateAddress(entity.address, 6, 4)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

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
                  <h3 className="text-sm font-bold text-white">
                    {selectedEntity ? `${attr.exchange} (${selectedEntity.alias})` : attr.exchange}
                  </h3>
                  <div className="text-[11px] text-[#8EA1B2] font-mono-code">
                    {selectedEntity ? `${selectedEntity.reason} — ${attr.walletType}` : attr.walletType}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono-code">
                <div className="text-xs font-bold text-emerald-400">{confidenceScore}% MATCH</div>
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
            <span className="text-[10px] font-mono-code text-[#38BDF8]">{checkedCount} of {evidenceList.length} Signals Verified</span>
          </div>

          <div className="space-y-3 text-xs">
            {evidenceList.map((item, idx) => (
              <label
                key={idx}
                className={`p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                  checkedEvidence[idx]
                    ? 'bg-[#071018] border-[#243443] hover:border-[#38BDF8]/50'
                    : 'bg-[#071018]/50 border-[#243443]/40 opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedEvidence[idx]}
                  onChange={() => handleToggleEvidence(idx)}
                  className="mt-0.5 rounded border-[#243443] text-[#38BDF8] focus:ring-[#38BDF8] cursor-pointer"
                />
                <div className="flex-1">
                  <div className={`font-medium ${checkedEvidence[idx] ? 'text-white' : 'text-[#8EA1B2] line-through'}`}>
                    {item}
                  </div>
                  <div className="text-[11px] text-[#8EA1B2] mt-0.5 font-mono-code">
                    {checkedEvidence[idx]
                      ? `Signal Active: +${Math.round(pointWeight)}% confidence contribution`
                      : 'Signal Excluded: Confidence reduced'}
                  </div>
                </div>
              </label>
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
