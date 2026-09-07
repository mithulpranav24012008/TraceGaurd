import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Copy, Check, Database, Zap, Globe, RefreshCw } from 'lucide-react';
import { Blockchain, InvestigationSource, RiskLevel, MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { RiskBadge } from '../common/RiskBadge';

interface SeedStageProps {
  currentCase: MockCase;
  onStartInvestigation: (
    address: string,
    blockchain: Blockchain,
    source: InvestigationSource,
    severity: RiskLevel
  ) => Promise<void> | void;
  onSelectPreloadedCase: (caseItem: MockCase) => void;
  onAdvanceToNext: () => void;
}

export const SeedStage: React.FC<SeedStageProps> = ({
  currentCase,
  onStartInvestigation,
  onSelectPreloadedCase,
  onAdvanceToNext
}) => {
  const [addressInput, setAddressInput] = useState(currentCase.seedDetails.address);
  const [blockchain, setBlockchain] = useState<Blockchain>(currentCase.blockchain);
  const [source, setSource] = useState<InvestigationSource>(currentCase.source);
  const [severity, setSeverity] = useState<RiskLevel>(currentCase.severity);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'live' | 'demo'>('live');

  const blockchains: Blockchain[] = ['Ethereum', 'Bitcoin', 'BNB Smart Chain', 'Polygon'];
  const sources: InvestigationSource[] = ['Victim Report', 'Bank Referral', 'Exchange Referral', 'Law Enforcement'];
  const severities: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsLoading(true);
    try {
      await onStartInvestigation(addressInput.trim(), blockchain, source, severity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Stage 1: Seed Address Ingestion & Live On-Chain Analysis</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-code text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE GATEWAYS ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#8EA1B2] mt-1">
            Analyze any real-world wallet address across Ethereum, Bitcoin, Polygon, or BNB Smart Chain using direct blockchain RPC and telemetry nodes.
          </p>
        </div>

        {/* Mode & Preset incident buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#071018] p-1 rounded-lg border border-[#243443] font-mono-code text-xs mr-2">
            <button
              onClick={() => setMode('live')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                mode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-[#8EA1B2] hover:text-white'
              }`}
            >
              🟢 Live Address Mode
            </button>
            <button
              onClick={() => setMode('demo')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                mode === 'demo'
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                  : 'text-[#8EA1B2] hover:text-white'
              }`}
            >
              🎭 Demo Presets
            </button>
          </div>

          {mode === 'demo' && (
            <div className="flex items-center gap-1.5 flex-wrap animate-in fade-in">
              <span className="text-[11px] font-mono-code text-[#8EA1B2] mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#38BDF8]" /> Presets:
              </span>
              {MOCK_CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setAddressInput(c.seedDetails.address);
                    setBlockchain(c.blockchain);
                    setSource(c.source);
                    setSeverity(c.severity);
                    onSelectPreloadedCase(c);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono-code transition-colors cursor-pointer border ${
                    currentCase.id === c.id
                      ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white'
                      : 'bg-[#111F2C] border-[#243443] text-[#8EA1B2] hover:text-white hover:border-[#8EA1B2]'
                  }`}
                >
                  {c.blockchain.split(' ')[0]} ({c.scenario.split(' ')[0]})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Form & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#243443] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#38BDF8]" />
              <span>Target Wallet Address Parameters</span>
            </h3>
            <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              LIVE MAINNET QUERY
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="suspect-wallet-input" className="block text-xs font-medium text-[#E7EEF5] mb-1.5 font-mono-code">
                Suspect Wallet Address (EVM / BTC / Solana)
              </label>
              <div className="relative">
                <input
                  id="suspect-wallet-input"
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Enter real wallet address (e.g., 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 or bc1q...)"
                  className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg px-3 py-2 text-xs font-mono-code text-white placeholder-[#586C7E] transition-all outline-hidden"
                  required
                />
                {addressInput && (
                  <button
                    type="button"
                    onClick={() => handleCopy(addressInput)}
                    className="absolute right-2.5 top-2.5 text-[#8EA1B2] hover:text-white cursor-pointer"
                    title="Copy address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#8EA1B2] mt-1.5 font-mono-code flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#38BDF8]" />
                Try any real EVM (0x...) or Bitcoin (1... / 3... / bc1...) mainnet address.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="blockchain-select" className="block text-xs font-medium text-[#8EA1B2] mb-1 font-mono-code">
                  Blockchain Network
                </label>
                <select
                  id="blockchain-select"
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value as Blockchain)}
                  className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] rounded-lg px-3 py-2 text-xs text-white font-mono-code cursor-pointer outline-hidden"
                >
                  {blockchains.map(b => (
                    <option key={b} value={b} className="bg-[#0D1721] text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="source-select" className="block text-xs font-medium text-[#8EA1B2] mb-1 font-mono-code">
                  Investigation Source
                </label>
                <select
                  id="source-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as InvestigationSource)}
                  className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] rounded-lg px-3 py-2 text-xs text-white font-mono-code cursor-pointer outline-hidden"
                >
                  {sources.map(s => (
                    <option key={s} value={s} className="bg-[#0D1721] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="severity-select" className="block text-xs font-medium text-[#8EA1B2] mb-1 font-mono-code">
                Case Severity Override
              </label>
              <select
                id="severity-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] rounded-lg px-3 py-2 text-xs text-white font-mono-code cursor-pointer outline-hidden"
              >
                {severities.map(sev => (
                  <option key={sev} value={sev} className="bg-[#0D1721] text-white">
                    {sev} Severity
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#38BDF8] hover:bg-[#0284C7] disabled:opacity-60 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs font-mono-code tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#38BDF8]/10 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>FETCHING LIVE ON-CHAIN TELEMETRY...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>RUN LIVE ON-CHAIN FORENSIC TRACE</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Current Seed Address Profile Card */}
        <div className="lg:col-span-6 bg-[#0D1721] border border-[#243443] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#243443] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#38BDF8]" />
                <span>Seed Address Telemetry Profile</span>
              </h3>
              <RiskBadge level={currentCase.severity} score={currentCase.riskScore} size="sm" />
            </div>

            <div className="mt-4 space-y-3 font-mono-code text-xs">
              <div className="p-3 rounded-lg bg-[#071018] border border-[#243443] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#8EA1B2] uppercase">
                  <span>Target Address</span>
                  <span className="text-emerald-400 font-bold">VERIFIED MAINNET</span>
                </div>
                <div className="text-white text-xs font-semibold break-all selection:bg-[#38BDF8] selection:text-black">
                  {currentCase.seedDetails.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2]">BLOCKCHAIN</div>
                  <div className="text-white font-semibold mt-0.5">{currentCase.seedDetails.blockchain}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2]">TRANSACTIONS</div>
                  <div className="text-white font-semibold mt-0.5">{currentCase.seedDetails.transactions} txns</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2]">FIRST SEEN</div>
                  <div className="text-white font-semibold mt-0.5 truncate">{currentCase.seedDetails.firstSeen.split(' ')[0]}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2]">CURRENT BALANCE</div>
                  <div className="text-white font-semibold mt-0.5 truncate">{currentCase.seedDetails.currentBalance}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2]">TOTAL INFLOW</div>
                  <div className="text-emerald-400 font-semibold mt-0.5">{currentCase.seedDetails.totalInflow}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                  <div className="text-[10px] text-[#8EA1B2]">TOTAL OUTFLOW</div>
                  <div className="text-orange-400 font-semibold mt-0.5">{currentCase.seedDetails.totalOutflow}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#243443] flex items-center justify-between">
            <span className="text-[11px] text-[#8EA1B2]">Status: Ingested & Live Synchronized</span>
            <button
              onClick={onAdvanceToNext}
              className="bg-[#111F2C] hover:bg-[#162636] border border-[#38BDF8]/60 hover:border-[#38BDF8] text-white px-4 py-2 rounded-lg text-xs font-mono-code font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Analyze Address Hops</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
