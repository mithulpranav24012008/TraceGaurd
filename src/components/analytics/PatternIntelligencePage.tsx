import React, { useMemo, useState } from 'react';
import {
  Radar,
  ShieldAlert,
  AlertTriangle,
  ArrowUpDown,
  MapPin,
  Users,
  IndianRupee,
  Calendar,
  Globe,
  Info
} from 'lucide-react';
import { getTopOffenders, getAllEntries } from '../../data/nationalRegistryStore';
import { truncateAddress } from '../../utils/formatters';

type SortKey = 'victimCount' | 'totalAmount';

export const PatternIntelligencePage: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortKey>('victimCount');

  const offenders = useMemo(() => {
    const data = getTopOffenders(50);
    return [...data].sort((a, b) => {
      if (sortBy === 'victimCount') {
        if (b.victimCount !== a.victimCount) return b.victimCount - a.victimCount;
        return b.totalAmount - a.totalAmount;
      }
      if (b.totalAmount !== a.totalAmount) return b.totalAmount - a.totalAmount;
      return b.victimCount - a.victimCount;
    });
  }, [sortBy]);

  const allEntries = useMemo(() => getAllEntries(), []);
  const uniqueAddresses = useMemo(() => new Set(allEntries.map((e) => e.walletAddress.toLowerCase())).size, [allEntries]);
  const totalReports = allEntries.length;
  const totalLosses = useMemo(() => allEntries.reduce((s, e) => s + e.complaintAmount, 0), [allEntries]);
  const multiVictimCount = offenders.length;

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const summaryCards = [
    {
      label: 'Unique Addresses',
      value: uniqueAddresses.toString(),
      detail: 'In national registry',
      icon: Globe,
      color: 'text-[#38BDF8]'
    },
    {
      label: 'Total Reports Filed',
      value: totalReports.toString(),
      detail: 'Across all states',
      icon: Users,
      color: 'text-emerald-400'
    },
    {
      label: 'Total Reported Losses',
      value: formatINR(totalLosses),
      detail: 'Cumulative INR',
      icon: IndianRupee,
      color: 'text-amber-400'
    },
    {
      label: 'Multi-Victim Addresses',
      value: multiVictimCount.toString(),
      detail: '≥2 victims per address',
      icon: AlertTriangle,
      color: 'text-red-400'
    }
  ];

  const toggleSort = (key: SortKey) => {
    setSortBy(key);
  };

  const getHeatColor = (count: number) => {
    if (count >= 5) return 'text-red-400';
    if (count >= 3) return 'text-orange-400';
    return 'text-amber-400';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Radar className="w-5 h-5 text-[#38BDF8]" />
          <span>Pattern Intelligence — National Cross-Case Analysis</span>
        </h1>
        <p className="text-xs text-[#8EA1B2] mt-0.5 max-w-3xl">
          Unlike single-case forensics tools, TraceGuard aggregates wallet intelligence across
          every complaint filed nationwide, enabling pattern detection that isolated investigations miss.
        </p>
      </div>

      {/* Info banner */}
      <div className="p-3 rounded-lg bg-[#38BDF8]/8 border border-[#38BDF8]/25 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#8EA1B2]">
          <span className="text-white font-semibold">Cross-Case National Aggregation: </span>
          This registry persists every suspect wallet address submitted across all investigations —
          past and present. When a new complaint matches a previously reported address, TraceGuard
          connects victims across state boundaries, revealing organized fraud networks that
          single-jurisdiction tools cannot detect.
        </div>
      </div>

      {/* KPI Cards */}
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
                <div className="text-[11px] text-[#8EA1B2] mt-0.5">{card.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Repeat Offender Table */}
      <div className="bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#243443] pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Repeat-Offender Address Registry</span>
            </h2>
            <p className="text-[11px] text-[#8EA1B2] mt-0.5">
              Addresses reported by multiple victims across different states — ranked by threat severity
            </p>
          </div>
          <span className="text-[10px] font-mono-code text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 shrink-0">
            {multiVictimCount} REPEAT OFFENDERS
          </span>
        </div>

        {offenders.length === 0 ? (
          <div className="text-center py-12 text-[#8EA1B2] text-sm">
            No repeat-offender addresses detected yet. Submit cases to build the registry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-code">
              <thead>
                <tr className="border-b border-[#243443] text-[#8EA1B2]">
                  <th className="text-left py-2.5 px-3 font-semibold">#</th>
                  <th className="text-left py-2.5 px-3 font-semibold">Wallet Address</th>
                  <th className="text-left py-2.5 px-3 font-semibold">Chain</th>
                  <th className="text-left py-2.5 px-3 font-semibold">
                    <button
                      onClick={() => toggleSort('victimCount')}
                      className={`flex items-center gap-1 cursor-pointer hover:text-white transition-colors ${
                        sortBy === 'victimCount' ? 'text-[#38BDF8]' : ''
                      }`}
                    >
                      <span>Victims</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left py-2.5 px-3 font-semibold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>States</span>
                    </div>
                  </th>
                  <th className="text-left py-2.5 px-3 font-semibold">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Date Range</span>
                    </div>
                  </th>
                  <th className="text-right py-2.5 px-3 font-semibold">
                    <button
                      onClick={() => toggleSort('totalAmount')}
                      className={`flex items-center gap-1 cursor-pointer hover:text-white transition-colors ml-auto ${
                        sortBy === 'totalAmount' ? 'text-[#38BDF8]' : ''
                      }`}
                    >
                      <span>Total Losses</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {offenders.map((o, idx) => (
                  <tr
                    key={o.walletAddress}
                    className="border-b border-[#243443]/50 hover:bg-[#111F2C] transition-colors"
                  >
                    <td className="py-3 px-3 text-[#8EA1B2]">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="text-white font-semibold" title={o.walletAddress}>
                        {truncateAddress(o.walletAddress, 10, 6)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#8EA1B2]">{o.chain}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${getHeatColor(o.victimCount)} bg-current/10 px-1.5 py-0.5 rounded`}
                        style={{
                          backgroundColor: o.victimCount >= 5 ? 'rgba(239,68,68,0.12)' :
                            o.victimCount >= 3 ? 'rgba(249,115,22,0.12)' : 'rgba(245,158,11,0.12)'
                        }}
                      >
                        {o.victimCount} victims
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {o.states.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-[#071018] border border-[#243443] text-[10px] text-[#8EA1B2]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#8EA1B2] whitespace-nowrap">
                      {o.earliestDate} → {o.latestDate}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-red-400">
                      {formatINR(o.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 font-mono-code">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px]">
            Registry data is locally persisted across sessions. In production, this would connect to
            a centralized I4C / NCRP national database for real-time cross-jurisdiction intelligence.
          </span>
        </div>
      </div>
    </div>
  );
};
