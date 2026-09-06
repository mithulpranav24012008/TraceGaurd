import React, { useState } from 'react';
import { X, ExternalLink, ShieldAlert, ArrowUpRight, ArrowDownLeft, Copy, Check, Hash, Info } from 'lucide-react';
import { GraphNode, NodeType } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { getRiskLevelFromScore, truncateAddress } from '../../utils/formatters';

interface NodeInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const riskLevel = getRiskLevelFromScore(node.risk);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNodeTypeLabel = (type: NodeType) => {
    switch (type) {
      case 'victim':
        return 'Reported Victim Source';
      case 'suspect':
        return 'Suspect Seed Entity';
      case 'clustered_wallet':
        return 'Clustered Counterparty';
      case 'peel_chain':
        return 'Peel Chain Dispersal';
      case 'mixer':
        return 'Privacy Obfuscator / Mixer';
      case 'bridge':
        return 'Cross-Chain Bridge Gateway';
      case 'exchange':
        return 'Exchange Hot/Deposit Wallet';
      case 'high_risk':
        return 'High Risk Unidentified Sink';
      default:
        return 'Blockchain Address';
    }
  };

  return (
    <div className="bg-[#0D1721] border-l border-[#243443] w-80 sm:w-96 h-full flex flex-col shadow-2xl z-30 transition-transform select-none">
      {/* Inspector Header */}
      <div className="p-4 border-b border-[#243443] bg-[#111F2C] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
            Forensic Node Inspector
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[#8EA1B2] hover:text-white p-1 rounded-md hover:bg-[#071018] transition-colors cursor-pointer"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono-code text-xs text-[#E7EEF5]">
        {/* Node Identity */}
        <div className="space-y-1.5 p-3 rounded-lg bg-[#071018] border border-[#243443]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8EA1B2] uppercase">Node Category</span>
            <RiskBadge level={riskLevel} score={node.risk} size="sm" />
          </div>
          <div className="text-sm font-bold text-white font-sans">{node.name}</div>
          <div className="text-[11px] text-[#38BDF8]">{getNodeTypeLabel(node.type)}</div>
        </div>

        {/* Address and Copy */}
        <div className="space-y-1">
          <label className="text-[10px] text-[#8EA1B2] uppercase">Raw Blockchain Address</label>
          <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#E7EEF5] break-all selection:bg-[#38BDF8] selection:text-black">
              {node.address}
            </span>
            <button
              onClick={() => handleCopy(node.address)}
              className="text-[#8EA1B2] hover:text-[#38BDF8] p-1 shrink-0 cursor-pointer"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Financial Flow Statistics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="flex items-center gap-1 text-[10px] text-[#8EA1B2]">
              <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
              <span>TOTAL RECEIVED</span>
            </div>
            <div className="text-emerald-400 font-bold text-xs mt-1">{node.received}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="flex items-center gap-1 text-[10px] text-[#8EA1B2]">
              <ArrowUpRight className="w-3 h-3 text-orange-400" />
              <span>TOTAL SENT</span>
            </div>
            <div className="text-orange-400 font-bold text-xs mt-1">{node.sent}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">TRANSACTION COUNT</div>
            <div className="text-white font-bold text-xs mt-1">{node.transactions} txns</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="text-[10px] text-[#8EA1B2]">HEURISTIC RISK</div>
            <div className={`font-bold text-xs mt-1 ${node.risk > 70 ? 'text-red-400' : 'text-amber-400'}`}>
              {node.risk} / 100
            </div>
          </div>
        </div>

        {/* Risk Indicators / Behavioral Flags */}
        <div className="space-y-2">
          <div className="text-[10px] text-[#8EA1B2] uppercase flex items-center justify-between">
            <span>Behavioral Flags & Indicators</span>
            <span className="text-[#38BDF8]">{node.flags.length} Detected</span>
          </div>

          <div className="space-y-1.5">
            {node.flags.map((flag, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-sans flex items-start gap-2"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Entity Association */}
        {node.entityName && (
          <div className="p-3 rounded-lg bg-[#111F2C] border border-[#243443] space-y-1">
            <div className="text-[10px] text-[#8EA1B2] uppercase">Identified Entity / Protocol</div>
            <div className="text-white font-bold text-xs font-sans">{node.entityName}</div>
            <div className="text-[10px] text-[#8EA1B2] font-sans">
              Matches simulated threat signature registry.
            </div>
          </div>
        )}
      </div>

      {/* Inspector Footer */}
      <div className="p-3 border-t border-[#243443] bg-[#071018] text-[10px] text-[#8EA1B2] flex items-center justify-between">
        <span>STATUS: SIMULATED NODE</span>
        <span className="text-[#38BDF8]">TRACEGUARD SOC</span>
      </div>
    </div>
  );
};
