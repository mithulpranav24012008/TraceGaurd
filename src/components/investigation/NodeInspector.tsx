import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';
import { GraphNode, NodeType } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { RiskExplanationBox } from '../common/RiskExplanationBox';
import { getRiskLevelFromScore, truncateAddress } from '../../utils/formatters';
import { useLanguage } from '../../context/useLanguage';

interface NodeInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
  onNavigateToInvestigation?: (nodeId?: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, onClose, onNavigateToInvestigation }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Reset copied state whenever target node changes
  useEffect(() => {
    setCopied(false);
  }, [node?.id]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const safeRisk = typeof node.risk === 'number' && !isNaN(node.risk) ? Math.min(Math.max(node.risk, 0), 100) : 0;
  const riskLevel = getRiskLevelFromScore(safeRisk);

  const safeTxCount = typeof node.transactions === 'number' && !isNaN(node.transactions) ? node.transactions.toLocaleString() : '0';
  const safeReceived = node.received && node.received !== 'undefined' ? node.received : '$0.00';
  const safeSent = node.sent && node.sent !== 'undefined' ? node.sent : '$0.00';
  const flags = Array.isArray(node.flags) ? node.flags : [];

  const handleCopy = (text: string) => {
    if (!text) return;
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

  // Derive dynamic risk components from actual node properties
  const isMixer = node.type === 'mixer' || flags.some((f) => f.toLowerCase().includes('mixer'));
  const isBridge = node.type === 'bridge' || flags.some((f) => f.toLowerCase().includes('bridge'));
  const isClustered = node.type === 'clustered_wallet' || flags.some((f) => f.toLowerCase().includes('cluster'));
  const isExchange = node.type === 'exchange' || flags.some((f) => f.toLowerCase().includes('exchange') || f.toLowerCase().includes('cex'));

  const riskComponents = {
    'Transaction Behavior': safeRisk,
    'Mixer Exposure': isMixer ? Math.max(85, safeRisk) : 0,
    'Bridge Exposure': isBridge ? Math.max(80, safeRisk) : 0,
    'Address Clustering': isClustered ? Math.max(75, safeRisk) : Math.round(safeRisk * 0.4),
    'Velocity': (node.transactions || 0) > 15 ? Math.max(70, safeRisk) : Math.round(safeRisk * 0.3),
    'Exchange Proximity': isExchange ? Math.max(90, safeRisk) : Math.round(safeRisk * 0.2),
    'National Pattern Match': flags.some((f) => f.toLowerCase().includes('complaint') || f.toLowerCase().includes('pattern') || f.toLowerCase().includes('report')) ? 80 : 0
  };

  return (
    <>
      {/* Backdrop overlay for closing drawer on click outside */}
      <div
        className="absolute inset-0 bg-black/40 z-20 transition-opacity animate-in fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute right-0 top-0 bottom-0 bg-[#0D1721] border-l border-[#243443] w-80 sm:w-96 h-full flex flex-col shadow-2xl z-30 transition-all select-none animate-in slide-in-from-right duration-200">
        {/* Inspector Header */}
        <div className="p-4 border-b border-[#243443] bg-[#111F2C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
              {t('nodeInspector.title')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8EA1B2] hover:text-white p-1 rounded-md hover:bg-[#071018] transition-colors cursor-pointer border border-transparent hover:border-[#243443]"
            aria-label="Close inspector"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inspector Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono-code text-xs text-[#E7EEF5]">
          {/* Node Identity */}
          <div className="space-y-1.5 p-3 rounded-lg bg-[#071018] border border-[#243443]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8EA1B2] uppercase">{t('nodeInspector.nodeCategory')}</span>
              <RiskBadge level={riskLevel} score={safeRisk} size="sm" />
            </div>
            <div className="text-sm font-bold text-white font-sans">{node.name || t('nodeInspector.unlabeledNode')}</div>
            <div className="text-[11px] text-[#38BDF8]">{getNodeTypeLabel(node.type)}</div>
          </div>

          {/* Address and Copy */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8EA1B2] uppercase">{t('nodeInspector.rawAddress')}</label>
            <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#E7EEF5] break-all selection:bg-[#38BDF8] selection:text-black">
                {node.address || '0x0000000000000000000000000000000000000000'}
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
                <span>{t('nodeInspector.totalReceived')}</span>
              </div>
              <div className="text-emerald-400 font-bold text-xs mt-1">{safeReceived}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div className="flex items-center gap-1 text-[10px] text-[#8EA1B2]">
                <ArrowUpRight className="w-3 h-3 text-orange-400" />
                <span>{t('nodeInspector.totalSent')}</span>
              </div>
              <div className="text-orange-400 font-bold text-xs mt-1">{safeSent}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div className="text-[10px] text-[#8EA1B2]">{t('nodeInspector.txCount')}</div>
              <div className="text-white font-bold text-xs mt-1">{safeTxCount} txns</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div className="text-[10px] text-[#8EA1B2]">{t('nodeInspector.heuristicRisk')}</div>
              <div className={`font-bold text-xs mt-1 ${safeRisk > 70 ? 'text-red-400' : 'text-amber-400'}`}>
                {safeRisk} / 100
              </div>
            </div>
          </div>

          {/* Risk Indicators / Behavioral Flags */}
          <div className="space-y-2">
            <div className="text-[10px] text-[#8EA1B2] uppercase flex items-center justify-between">
              <span>{t('nodeInspector.behavioralFlags')}</span>
              <span className="text-[#38BDF8]">{node.flags?.length || 0} {t('nodeInspector.detected')}</span>
            </div>

            {node.flags && node.flags.length > 0 ? (
              <div className="space-y-1.5">
                {node.flags?.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-sans flex items-start gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </div>
                )) || (
                  <div className="p-2 rounded-lg bg-[#071018] border border-[#243443] text-[11px] text-[#8EA1B2]">
                    {t('nodeInspector.noFlags')}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-[#071018] border border-[#243443] text-[11px] text-[#8EA1B2]">
                {t('nodeInspector.noFlags')}
              </div>
            )}
          </div>

          {/* Recent Transactions List */}
          <div className="space-y-2">
            <div className="text-[10px] text-[#8EA1B2] uppercase flex items-center justify-between">
              <span>{t('nodeInspector.recentTx')}</span>
              <span className="text-[#38BDF8]">{node.recentTransactions?.length || 0} {t('nodeInspector.recorded')}</span>
            </div>

            {node.recentTransactions && node.recentTransactions.length > 0 ? (
              <div className="space-y-1.5">
                {node.recentTransactions?.map((tx, idx) => (
                  <div
                    key={tx.id || tx.hash || idx}
                    className="p-2 rounded-lg bg-[#071018] border border-[#243443] text-[11px] font-mono flex items-center justify-between"
                  >
                    <span className="text-[#38BDF8]">{tx.hash ? truncateAddress(tx.hash) : `Tx #${idx + 1}`}</span>
                    <span className="text-emerald-400 font-bold">{tx.amount || '$0.00'}</span>
                  </div>
                )) || (
                  <div className="p-2 rounded-lg bg-[#071018] border border-[#243443] text-[11px] text-[#8EA1B2]">
                    {t('nodeInspector.noRecentTx')}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-[#071018] border border-[#243443] text-[11px] text-[#8EA1B2]">
                {t('nodeInspector.noRecentTx')}
              </div>
            )}
          </div>

          {/* Plain Language Threat Explanation */}
          <RiskExplanationBox
            riskScore={safeRisk}
            severity={riskLevel}
            riskComponents={riskComponents}
            highRiskReasons={flags}
            compact
          />

          {/* Entity Association */}
          {node.entityName && (
            <div className="p-3 rounded-lg bg-[#111F2C] border border-[#243443] space-y-1">
              <div className="text-[10px] text-[#8EA1B2] uppercase">{t('nodeInspector.entityProtocol')}</div>
              <div className="text-white font-bold text-xs font-sans">{node.entityName}</div>
              <div className="text-[10px] text-[#8EA1B2] font-sans">
                {t('nodeInspector.entityMatchNotice')}
              </div>
            </div>
          )}
        </div>

        {/* Inspector Footer & Action */}
        <div className="p-3 border-t border-[#243443] bg-[#071018] space-y-2">
          {onNavigateToInvestigation && (
            <button
              onClick={() => onNavigateToInvestigation(node.address || node.id)}
              className="w-full bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold py-2 px-3 rounded-lg text-xs font-mono-code flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <span>{t('nodeInspector.launchWorkflow')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center justify-between text-[10px] text-[#8EA1B2]">
            <span>{t('nodeInspector.simulatedNode')}</span>
            <span className="text-[#38BDF8]">TRACEGUARD SOC</span>
          </div>
        </div>
      </div>
    </>
  );
};
