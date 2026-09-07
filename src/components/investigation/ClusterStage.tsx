import React, { useState } from 'react';
import { Network, CheckCircle2, ArrowRight, ShieldAlert, Layers } from 'lucide-react';
import { MockCase } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { truncateAddress } from '../../utils/formatters';

interface ClusterStageProps {
  currentCase: MockCase;
  onAdvanceToNext: () => void;
}

export const ClusterStage: React.FC<ClusterStageProps> = ({
  currentCase,
  onAdvanceToNext
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number>(0);
  const cluster = currentCase.clusterData;
  const entities = cluster.clusterEntities;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stage Header */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Stage 2: Heuristic Address Clustering</h2>
            <RiskBadge level={currentCase.severity} score={cluster.risk} size="sm" />
          </div>
          <p className="text-xs text-[#8EA1B2] mt-1">
            {cluster.description} Aggregating multi-sig, common-input, and behavioral telemetry.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code">
          <div className="px-3 py-1.5 rounded-lg bg-[#071018] border border-[#243443]">
            <span className="text-[#8EA1B2]">ENTITIES DETECTED: </span>
            <strong className="text-[#38BDF8]">{cluster.relatedAddressesCount} Wallets</strong>
          </div>
          <button
            onClick={onAdvanceToNext}
            className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Continue Trace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cluster Heuristics & Interactive Radial Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radial SVG Cluster Diagram */}
        <div className="lg:col-span-7 bg-[#0D1721] border border-[#243443] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#243443] pb-3">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Network className="w-4 h-4 text-[#38BDF8]" />
              <span>Entity Cluster Topology</span>
            </div>
            <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Correlated Graph
            </span>
          </div>

          {/* SVG Cluster Canvas */}
          <div className="relative py-6 flex items-center justify-center">
            <svg viewBox="0 0 500 340" className="w-full h-auto max-h-[340px] select-none">
              <defs>
                <radialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="linkLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Background radial ring */}
              <circle cx="250" cy="170" r="110" fill="none" stroke="#243443" strokeDasharray="4 4" />
              <circle cx="250" cy="170" r="140" fill="url(#clusterGlow)" />

              {/* Cluster satellite nodes & connection lines */}
              {entities.map((ent, idx) => {
                const total = entities.length;
                const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                const radius = 110;
                const x = 250 + radius * Math.cos(angle);
                const y = 170 + radius * Math.sin(angle);
                const isSelected = selectedEntity === idx;

                return (
                  <g key={idx} className="cursor-pointer" onClick={() => setSelectedEntity(idx)}>
                    {/* Animated connecting line */}
                    <line
                      x1="250"
                      y1="170"
                      x2={x}
                      y2={y}
                      stroke={isSelected ? '#38BDF8' : '#243443'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray="4 4"
                      className="animate-flow-dash"
                    />

                    {/* Correlation score label on edge */}
                    <rect
                      x={(250 + x) / 2 - 16}
                      y={(170 + y) / 2 - 8}
                      width="32"
                      height="16"
                      rx="4"
                      fill="#071018"
                      stroke={isSelected ? '#38BDF8' : '#243443'}
                      strokeWidth="1"
                    />
                    <text
                      x={(250 + x) / 2}
                      y={(170 + y) / 2 + 4}
                      fill={isSelected ? '#38BDF8' : '#8EA1B2'}
                      fontSize="9"
                      fontFamily="ui-monospace, monospace"
                      textAnchor="middle"
                    >
                      {ent.correlationScore}%
                    </text>

                    {/* Satellite node circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 22 : 18}
                      fill="#111F2C"
                      stroke={isSelected ? '#38BDF8' : '#38BDF8/50'}
                      strokeWidth={isSelected ? 2 : 1.5}
                      className="transition-all duration-200"
                    />
                    <text
                      x={x}
                      y={y + 3}
                      fill="#E7EEF5"
                      fontSize="9"
                      fontFamily="ui-monospace, monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      W{idx + 1}
                    </text>

                    {/* Satellite node text label */}
                    <text
                      x={x}
                      y={y + (y > 170 ? 32 : -26)}
                      fill="#8EA1B2"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                    >
                      {ent.alias}
                    </text>
                  </g>
                );
              })}

              {/* Central Root Node */}
              <g className="cursor-pointer">
                <circle cx="250" cy="170" r="30" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="2" />
                <circle cx="250" cy="170" r="22" fill="#0D1721" stroke="#EF4444" strokeWidth="2" />
                <text
                  x="250"
                  y="173"
                  fill="#EF4444"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="middle"
                >
                  SEED
                </text>
                <text
                  x="250"
                  y="218"
                  fill="#E7EEF5"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="middle"
                >
                  {truncateAddress(currentCase.seedDetails.address, 4, 4)}
                </text>
              </g>
            </svg>
          </div>

          <div className="pt-3 border-t border-[#243443] flex items-center justify-between text-[11px] font-mono-code text-[#8EA1B2]">
            <span>Click any node (W1–W{entities.length}) to inspect correlation evidence</span>
            <span className="text-[#38BDF8]">HEURISTIC ENGINE v3.4</span>
          </div>
        </div>

        {/* Heuristics & Selected Node Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Entity Inspector */}
          {entities[selectedEntity] && (
            <div className="bg-[#0D1721] border border-[#38BDF8]/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#243443] pb-2.5">
                <div>
                  <div className="text-white text-xs font-bold font-mono-code flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                    <span>{entities[selectedEntity].alias}</span>
                  </div>
                  <div className="text-[10px] text-[#8EA1B2] font-mono-code mt-0.5">
                    {entities[selectedEntity].address}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-mono-code text-xs font-bold">
                    {entities[selectedEntity].correlationScore}% Score
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono-code">
                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2] uppercase">Clustering Trigger / Reason</div>
                  <div className="text-white text-xs mt-1 font-sans">
                    {entities[selectedEntity].reason}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-[#071018] border border-[#243443]">
                    <div className="text-[10px] text-[#8EA1B2]">EST. BALANCE</div>
                    <div className="text-emerald-400 font-semibold">{entities[selectedEntity].balance}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#071018] border border-[#243443]">
                    <div className="text-[10px] text-[#8EA1B2]">FIRST SEEN</div>
                    <div className="text-white">{entities[selectedEntity].firstSeen}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Heuristic Criteria Checklist */}
          <div className="bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono-code flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <span>Applied Clustering Heuristics</span>
            </h3>

            <div className="space-y-2 text-xs">
              {cluster.heuristics.map((heuristic, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#071018] border border-[#243443] flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[#E7EEF5] leading-snug">{heuristic}</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono-code">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>Entity Risk Escalation: +{cluster.risk} pts heuristic penalty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
