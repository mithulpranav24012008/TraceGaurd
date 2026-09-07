import React, { useState } from 'react';
import { Building2, Search, CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink, Filter } from 'lucide-react';
import { MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';

interface ExchangeAttributionPageProps {
  casesList?: MockCase[];
}

export const ExchangeAttributionPage: React.FC<ExchangeAttributionPageProps> = ({
  casesList = MOCK_CASES
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const exchangesList = [
    {
      name: 'ExampleX Exchange',
      jurisdiction: 'Seychelles / EU Compliant',
      totalCases: casesList.filter((c) => c.exchange.toLowerCase().includes('examplex')).length || 14,
      totalFunds: '$840,000',
      activeAttributionConfidence: 94,
      riskRating: 'Regulated / Cooperating',
      clusterIds: ['CL-EX-9921-EU', 'CL-EX-9922-USDT'],
      typicalSweepLatency: '< 18 minutes',
      evidencePatterns: [
        'Multi-input deposit sweep scripts',
        'Omnibus hot wallet consolidation',
        'Strict KYC / FIU compliance interface'
      ]
    },
    {
      name: 'ExampleY Exchange',
      jurisdiction: 'United States / FinCEN MSB',
      totalCases: casesList.filter((c) => c.exchange.toLowerCase().includes('exampley')).length || 9,
      totalFunds: '$420,000',
      activeAttributionConfidence: 89,
      riskRating: 'Regulated / Tier-1',
      clusterIds: ['US-EX-Y-8802', 'US-EX-Y-BATCH'],
      typicalSweepLatency: '~ 2 hours (Batch sweeper)',
      evidencePatterns: [
        'SegWit/Taproot scripted user addresses',
        'Aggregated institutional UTXO outputs',
        'Rapid freeze response for SAR notifications'
      ]
    },
    {
      name: 'ExampleZ Exchange',
      jurisdiction: 'Dubai (VARA Registered)',
      totalCases: casesList.filter((c) => c.exchange.toLowerCase().includes('examplez')).length || 6,
      totalFunds: '$290,000',
      activeAttributionConfidence: 78,
      riskRating: 'Regulated / Emerging',
      clusterIds: ['AE-EX-Z-4401'],
      typicalSweepLatency: '< 5 minutes',
      evidencePatterns: [
        'Direct BSC BEP-20 token sweepers',
        'Automated fiat gateway integrations',
        'Deposit correlation via tag/memo'
      ]
    },
    {
      name: 'Unregulated P2P / Instant Swapper Pool',
      jurisdiction: 'Offshore / Unregistered',
      totalCases: casesList.filter((c) => c.exchange.toLowerCase().includes('p2p') || c.exchange.toLowerCase().includes('swapper')).length || 11,
      totalFunds: '$610,000',
      activeAttributionConfidence: 45,
      riskRating: 'High Risk / Non-Compliant',
      clusterIds: ['OFFSHORE-SWAP-01'],
      typicalSweepLatency: 'Instant cross-asset burn',
      evidencePatterns: [
        'No-KYC exchange routing',
        'Cross-chain automated atomic swap contracts',
        'Absence of dedicated law enforcement portal'
      ]
    }
  ];

  const filteredExchanges = exchangesList.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.clusterIds.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#38BDF8]" />
            <span>Exchange Counterparty Attribution Registry</span>
          </h1>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            Documented deposit sweeps, custodial wallet clusters, and exchange attribution heuristics.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-code text-xs">
          <span className="p-2 rounded-lg bg-[#0D1721] border border-[#243443] text-[#8EA1B2]">
            Cluster Signatures: <strong className="text-white">48</strong>
          </span>
          <span className="p-2 rounded-lg bg-[#0D1721] border border-[#243443] text-[#8EA1B2]">
            Attribution Accuracy: <strong className="text-emerald-400">92.4%</strong>
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-xl bg-[#0D1721] border border-[#243443] flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8EA1B2] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exchange name, cluster ID, or jurisdiction..."
            className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg pl-9 pr-3 py-2 text-xs font-mono-code text-white placeholder-[#586C7E] outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Exchange Cards Grid / Empty State */}
      {filteredExchanges.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1721] border border-[#243443] rounded-xl text-[#8EA1B2] font-mono-code text-xs">
          No exchange attribution profiles match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExchanges.map((ex, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] hover:border-[#38BDF8]/40 transition-colors flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#243443] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#111F2C] border border-[#243443] text-[#38BDF8]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{ex.name}</h3>
                      <div className="text-[11px] text-[#8EA1B2] font-mono-code">{ex.jurisdiction}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono-code">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        ex.activeAttributionConfidence > 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {ex.activeAttributionConfidence}% Confidence
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 my-4 font-mono-code text-xs">
                  <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                    <div className="text-[10px] text-[#8EA1B2]">LINKED CASES</div>
                    <div className="text-white font-bold mt-0.5">{ex.totalCases}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                    <div className="text-[10px] text-[#8EA1B2]">TOTAL FUNDS</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{ex.totalFunds}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#071018] border border-[#243443]">
                    <div className="text-[10px] text-[#8EA1B2]">SWEEP SPEED</div>
                    <div className="text-white font-bold mt-0.5 truncate">{ex.typicalSweepLatency}</div>
                  </div>
                </div>

                {/* Cluster IDs */}
                <div className="space-y-1.5 font-mono-code text-xs mb-3">
                  <div className="text-[10px] text-[#8EA1B2] uppercase">Identified Wallet Clusters:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ex.clusterIds.map((cid, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded bg-[#111F2C] border border-[#243443] text-[#38BDF8] text-[11px]"
                      >
                        {cid}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div className="space-y-1.5 text-xs text-[#8EA1B2]">
                  <div className="text-[10px] uppercase font-mono-code text-[#8EA1B2]">Attribution Signatures:</div>
                  {ex.evidencePatterns.map((ev, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#243443] flex items-center justify-between text-xs font-mono-code">
                <span className="text-[#8EA1B2]">COMPLIANCE STATUS:</span>
                <span className="text-white font-semibold">{ex.riskRating}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
