import React, { useState } from 'react';
import { Search, Filter, FolderSearch, ArrowUpRight, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { MockCase, RiskLevel } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { RiskBadge } from '../common/RiskBadge';
import { truncateAddress } from '../../utils/formatters';

interface CaseFilesPageProps {
  casesList?: MockCase[];
  onSelectCase: (c: MockCase) => void;
  onNavigateToInvestigation: () => void;
}

export const CaseFilesPage: React.FC<CaseFilesPageProps> = ({
  casesList = MOCK_CASES,
  onSelectCase,
  onNavigateToInvestigation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  const filteredCases = casesList.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.seedDetails.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.exchange.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesRisk = riskFilter === 'All' || c.severity === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleOpenCase = (c: MockCase) => {
    onSelectCase(c);
    onNavigateToInvestigation();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderSearch className="w-5 h-5 text-[#38BDF8]" />
            <span>Forensic Case Repository</span>
          </h1>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            Active and archived blockchain fraud investigations with real-time heuristic status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-[#8EA1B2]">
          <span className="p-2 rounded-lg bg-[#0D1721] border border-[#243443]">
            Total Cases: <strong className="text-white">{casesList.length}</strong>
          </span>
          <span className="p-2 rounded-lg bg-[#0D1721] border border-[#243443]">
            Matching: <strong className="text-[#38BDF8]">{filteredCases.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8EA1B2] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case ID, suspect address, exchange, or title..."
            className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg pl-9 pr-3 py-2 text-xs font-mono-code text-white placeholder-[#586C7E] outline-hidden transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 font-mono-code text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8EA1B2] text-[11px]">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#071018] border border-[#243443] focus:border-[#38BDF8] text-white rounded-lg px-2.5 py-1.5 text-xs outline-hidden cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Investigating">Investigating</option>
              <option value="Attributed">Attributed</option>
              <option value="Alerted">Alerted</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#8EA1B2] text-[11px]">RISK:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-[#071018] border border-[#243443] focus:border-[#38BDF8] text-white rounded-lg px-2.5 py-1.5 text-xs outline-hidden cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Files Table */}
      <div className="bg-[#0D1721] border border-[#243443] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-[#111F2C] border-b border-[#243443] text-[10px] text-[#8EA1B2] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Case ID & Scenario</th>
                <th className="px-4 py-3">Chain & Target Address</th>
                <th className="px-4 py-3">Threat Tier</th>
                <th className="px-4 py-3">Attributed CEX</th>
                <th className="px-4 py-3">Traced Funds</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243443]/60 text-[#E7EEF5]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8EA1B2]">
                    No forensic case records match your query.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenCase(c)}
                    className="hover:bg-[#111F2C]/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{c.id}</span>
                        <ChevronRight className="w-3 h-3 text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-[#8EA1B2] font-sans mt-0.5 truncate max-w-xs">
                        {c.scenario}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-[#38BDF8] font-semibold">{c.blockchain}</div>
                      <div className="text-[10px] text-[#8EA1B2] mt-0.5">
                        {truncateAddress(c.seedDetails.address, 6, 6)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <RiskBadge level={c.severity} score={c.riskScore} size="sm" />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-white font-semibold">{c.attribution.exchange}</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        {c.attribution.confidence}% Confidence
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-emerald-400 font-bold">
                        ${c.suspiciousAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#8EA1B2]">USD Value</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          c.status === 'Alerted'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : c.status === 'Attributed'
                            ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCase(c);
                        }}
                        className="bg-[#071018] hover:bg-[#38BDF8] text-[#8EA1B2] hover:text-slate-950 px-2.5 py-1.5 rounded-lg border border-[#243443] hover:border-[#38BDF8] transition-all text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Investigate</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
