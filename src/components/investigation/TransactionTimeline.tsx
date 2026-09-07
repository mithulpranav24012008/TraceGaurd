import React from 'react';
import { Clock } from 'lucide-react';
import { GraphEdge, RiskTimelineEvent } from '../../types';

interface TransactionTimelineProps {
  timeline: RiskTimelineEvent[];
  edges: GraphEdge[];
  selectedEdgeId: string | null;
  onSelectEdge: (edgeId: string) => void;
}

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  timeline,
  edges,
  selectedEdgeId,
  onSelectEdge
}) => {
  return (
    <div className="bg-[#0D1721] border-t border-[#243443] p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#38BDF8]" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono-code">
            Transaction Chronology & Hop Velocity
          </h4>
        </div>
        <span className="text-[10px] font-mono-code text-[#8EA1B2]">
          {edges.length} Sequential Transfers
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {edges.map((edge, idx) => {
          const isSelected = selectedEdgeId === edge.id;
          const correspondingEvent = timeline[idx] || {
            time: `Hop ${edge.hop}`,
            event: `${edge.source} -> ${edge.target}`,
            risk: 70
          };

          return (
            <button
              key={edge.id}
              onClick={() => onSelectEdge(edge.id)}
              className={`flex-shrink-0 p-2.5 rounded-lg border font-mono-code text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white shadow-md shadow-[#38BDF8]/10'
                  : 'bg-[#071018] border-[#243443] hover:border-[#8EA1B2]/60 text-[#8EA1B2]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] mb-1">
                <span className="text-[#38BDF8] font-bold">HOP #{edge.hop}</span>
                <span className="text-[#8EA1B2]">{correspondingEvent.time}</span>
              </div>

              <div className="text-xs font-bold text-white mb-0.5">
                {edge.amount}
              </div>

              <div className="text-[10px] text-emerald-400 font-semibold mb-1">
                {edge.usdValue}
              </div>

              <div className="text-[10px] text-[#8EA1B2] truncate max-w-[140px] flex items-center gap-1">
                <span>TX:</span>
                <span className="text-white underline decoration-[#243443]">{edge.txHash}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
