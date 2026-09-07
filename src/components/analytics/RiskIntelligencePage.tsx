import React, { useMemo } from 'react';
import {
  ShieldAlert,
  Activity,
  DollarSign,
  Building2,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';

interface RiskIntelligencePageProps {
  casesList?: MockCase[];
}

export const RiskIntelligencePage: React.FC<RiskIntelligencePageProps> = ({
  casesList = MOCK_CASES
}) => {
  const activeCasesCount = casesList.length;
  const highRiskCount = casesList.filter((c) => c.severity === 'Critical' || c.severity === 'High').length;
  const attributedCount = casesList.filter((c) => c.attribution && c.attribution.confidence > 70).length;
  const totalTracedAmount = casesList.reduce((sum, c) => sum + (c.suspiciousAmount || 0), 0);

  // Dynamic Chart Data: Risk Score Distribution (Harmonized Color Scale)
  const riskDistributionData = useMemo(() => {
    const buckets = [
      { range: '0-20 (Low)', count: 0, fill: '#10B981' },
      { range: '21-40 (Nominal)', count: 0, fill: '#10B981' },
      { range: '41-60 (Medium)', count: 0, fill: '#F59E0B' },
      { range: '61-80 (High)', count: 0, fill: '#F97316' },
      { range: '81-100 (Critical)', count: 0, fill: '#EF4444' }
    ];

    casesList.forEach((c) => {
      const score = c.riskScore;
      if (score <= 20) buckets[0].count++;
      else if (score <= 40) buckets[1].count++;
      else if (score <= 60) buckets[2].count++;
      else if (score <= 80) buckets[3].count++;
      else buckets[4].count++;
    });

    return buckets;
  }, [casesList]);

  // Dynamic Chart Data: Cases by Blockchain
  const blockchainData = useMemo(() => {
    const colorMap: Record<string, string> = {
      Ethereum: '#38BDF8',
      Bitcoin: '#F59E0B',
      'BNB Smart Chain': '#FACC15',
      'BNB Chain': '#FACC15',
      Polygon: '#A855F7'
    };

    const counts: Record<string, number> = {};
    casesList.forEach((c) => {
      const chain = c.blockchain || 'Ethereum';
      counts[chain] = (counts[chain] || 0) + 1;
    });

    const entries = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || '#10B981'
    }));

    return entries.length > 0
      ? entries
      : [
          { name: 'Ethereum', value: 14, color: '#38BDF8' },
          { name: 'Bitcoin', value: 8, color: '#F59E0B' },
          { name: 'BNB Smart Chain', value: 5, color: '#FACC15' },
          { name: 'Polygon', value: 4, color: '#A855F7' }
        ];
  }, [casesList]);

  // Dynamic Chart Data: Funds Traced Over Time (Last 7 Days)
  const fundsTracedData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalVolume = totalTracedAmount || 1840000;
    const weights = [0.10, 0.13, 0.17, 0.15, 0.24, 0.10, 0.11];

    return days.map((day, idx) => {
      const dayFunds = Math.round((totalVolume * weights[idx]) / 1000) * 1000;
      const dayCases = Math.max(1, Math.round(activeCasesCount * weights[idx]));
      return { day, funds: dayFunds, cases: dayCases };
    });
  }, [totalTracedAmount, activeCasesCount]);

  // Dynamic Exposure Matrix
  const exposureMatrix = useMemo(() => {
    const getCatStats = (predicate: (c: MockCase) => boolean, defaultCategory: string) => {
      const matching = casesList.filter(predicate);
      const count = matching.length;
      const avgRisk = count > 0
        ? Math.round(matching.reduce((acc, curr) => acc + curr.riskScore, 0) / count)
        : 75;
      return { count, avgRisk };
    };

    const mixerStats = getCatStats(
      (c) => (c.riskComponents?.['Mixer Exposure'] ?? 0) > 0 || c.nodes?.some((n) => n.type === 'mixer'),
      'Mixers'
    );

    const bridgeStats = getCatStats(
      (c) => (c.riskComponents?.['Bridge Exposure'] ?? 0) > 0 || c.nodes?.some((n) => n.type === 'bridge'),
      'Bridges'
    );

    const velocityStats = getCatStats(
      (c) => (c.riskComponents?.['Velocity'] ?? 0) > 40 || c.nodes?.some((n) => n.type === 'peel_chain'),
      'Peel Chains'
    );

    const cexStats = getCatStats(
      (c) => (c.riskComponents?.['Exchange Proximity'] ?? 0) > 40 || !!c.attribution,
      'Exchange Endpoints'
    );

    return [
      {
        category: 'OFAC Sanctioned Mixers (Tornado Cash Sim)',
        cases: mixerStats.count || 9,
        avgRisk: mixerStats.avgRisk || 94,
        trend: mixerStats.avgRisk >= 80 ? 'Elevated' : 'Stable'
      },
      {
        category: 'Cross-Chain Bridges (Hop / Polygon PoS)',
        cases: bridgeStats.count || 14,
        avgRisk: bridgeStats.avgRisk || 82,
        trend: 'Stable'
      },
      {
        category: 'High-Velocity Peel Chains',
        cases: velocityStats.count || 18,
        avgRisk: velocityStats.avgRisk || 78,
        trend: 'Surging'
      },
      {
        category: 'Unregulated OTC Desks / P2P Liquidity',
        cases: cexStats.count || 5,
        avgRisk: cexStats.avgRisk || 86,
        trend: 'Monitoring'
      }
    ];
  }, [casesList]);

  // Summary Metrics
  const summaryCards = [
    {
      label: 'Total Workspace Cases',
      value: activeCasesCount.toString(),
      change: 'Active & archived telemetry',
      icon: Activity,
      color: 'text-[#38BDF8]'
    },
    {
      label: 'High/Critical Risk Cases',
      value: highRiskCount.toString(),
      change: 'Critical / High threat tier',
      icon: ShieldAlert,
      color: 'text-red-400'
    },
    {
      label: 'Exchange Attributions',
      value: attributedCount.toString(),
      change: 'Resolved CEX endpoints',
      icon: Building2,
      color: 'text-emerald-400'
    },
    {
      label: 'Traced Case Value',
      value: `$${(totalTracedAmount / 1000000).toFixed(2)}M`,
      change: 'Cumulative active cases',
      icon: DollarSign,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#38BDF8]" />
          <span>Risk Intelligence & Threat Telemetry</span>
        </h1>
        <p className="text-xs text-[#8EA1B2] mt-0.5">
          Aggregated risk heuristics, cross-case velocity metrics, and counterparty exposure analytics.
        </p>
      </div>

      {/* 4 Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col justify-between space-y-2 hover:border-[#38BDF8]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8EA1B2] font-mono-code">{card.label}</span>
                <div className={`p-1.5 rounded-lg bg-[#071018] border border-[#243443] ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono-code text-white">{card.value}</div>
                <div className="text-[11px] text-[#8EA1B2] mt-0.5 flex items-center gap-1">
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funds Traced Over Time (Area Chart) */}
        <div className="lg:col-span-8 bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#243443] pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                <span>Simulated Funds Traced Over Time</span>
              </h2>
              <p className="text-[11px] text-[#8EA1B2] mt-0.5">Daily traced volume in USD (Simulated week)</p>
            </div>
            <span className="text-[10px] font-mono-code text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30">
              7-DAY TELEMETRY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fundsTracedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fundsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#243443" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#8EA1B2" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#8EA1B2"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1721',
                    borderColor: '#243443',
                    borderRadius: '8px',
                    color: '#E7EEF5',
                    fontSize: '12px',
                    fontFamily: 'ui-monospace, monospace'
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Funds Traced']}
                />
                <Area
                  type="monotone"
                  dataKey="funds"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fundsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cases by Blockchain (Pie / Donut Chart) */}
        <div className="lg:col-span-4 bg-[#0D1721] border border-[#243443] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white">
              Cases by Blockchain
            </h2>
            <p className="text-[11px] text-[#8EA1B2] mt-0.5">Network distribution breakdown</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={blockchainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {blockchainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0D1721" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1721',
                    borderColor: '#243443',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'ui-monospace, monospace'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code pt-2 border-t border-[#243443]">
            {blockchainData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#8EA1B2]">{item.name}:</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Distribution (BarChart) */}
        <div className="lg:col-span-6 bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
          <div className="border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white">
              Risk Score Distribution (Active Cases)
            </h2>
            <p className="text-[11px] text-[#8EA1B2] mt-0.5">Heuristic score density across all tracked investigations</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#243443" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" stroke="#8EA1B2" fontSize={10} tickLine={false} />
                <YAxis stroke="#8EA1B2" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1721',
                    borderColor: '#243443',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'ui-monospace, monospace'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mixer / Bridge Exposure Matrix */}
        <div className="lg:col-span-6 bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
          <div className="border-b border-[#243443] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38BDF8]" />
                <span>Obfuscation Infrastructure Exposure Matrix</span>
              </h2>
              <p className="text-[11px] text-[#8EA1B2] mt-0.5">Frequency of privacy and evasive techniques</p>
            </div>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            {exposureMatrix.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#071018] border border-[#243443] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-white font-semibold">{item.category}</div>
                  <div className="text-[11px] text-[#8EA1B2] mt-0.5">
                    {item.cases} Active Cases • Avg Threat Score: {item.avgRisk}/100
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.trend === 'Surging' || item.trend === 'Elevated'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30'
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
