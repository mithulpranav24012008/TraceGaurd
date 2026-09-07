import React, { useState } from 'react';
import { Search, Filter, FolderSearch, ArrowUpRight, ShieldAlert, CheckCircle2, ChevronRight, FileCode } from 'lucide-react';
import { MockCase, RiskLevel, EscalationStatus } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { RiskBadge } from '../common/RiskBadge';
import { CyberCellHandoffModal } from '../common/CyberCellHandoffModal';
import { truncateAddress } from '../../utils/formatters';

interface CaseFilesPageProps {
  casesList?: MockCase[];
  onSelectCase: (c: MockCase) => void;
  onNavigateToInvestigation: () => void;
  onUpdateCase?: (updated: MockCase) => void;
}

export const CaseFilesPage: React.FC<CaseFilesPageProps> = ({
  casesList = MOCK_CASES,
  onSelectCase,
  onNavigateToInvestigation,
  onUpdateCase
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [activePillFilter, setActivePillFilter] = useState<'All' | 'High Risk' | 'Under Review' | 'Escalated'>('All');
  const [handoffCase, setHandoffCase] = useState<MockCase | null>(null);

  const handleFilterChange = (pill: 'All' | 'High Risk' | 'Under Review' | 'Escalated') => {
    setActivePillFilter(pill);
  };

  const filteredCases = casesList.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.seedDetails.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.exchange.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesRisk = riskFilter === 'All' || c.severity === riskFilter;

    let matchesPill = true;
    if (activePillFilter === 'High Risk') {
      matchesPill = c.severity === 'High' || c.severity === 'Critical' || c.riskScore >= 70;
    } else if (activePillFilter === 'Under Review') {
      matchesPill = c.status === 'Investigating' || !c.escalationStatus || c.escalationStatus === 'Not Escalated';
    } else if (activePillFilter === 'Escalated') {
      matchesPill = Boolean(c.escalationStatus && c.escalationStatus !== 'Not Escalated') || c.status === 'Attributed' || c.status === 'Alerted';
    }

    return matchesSearch && matchesStatus && matchesRisk && matchesPill;
  });

  const handleOpenCase = (c: MockCase) => {
    onSelectCase(c);
    onNavigateToInvestigation();
  };

  const getEscalationBadge = (status?: EscalationStatus) => {
    switch (status) {
      case 'Escalated':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Accepted by Specialist Team':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Returned for More Info':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-mono text-black">
      {/* Page Header */}
      <div className="neo-card-yellow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-black uppercase tracking-tight flex items-center gap-2">
            <FolderSearch className="w-5 h-5 text-black" />
            <span>Forensic Case Repository & Cyber Cell Triage Handoff</span>
          </h1>
          <p className="text-xs text-black/80 font-mono mt-0.5">
            Active and archived blockchain fraud investigations. First-response triage layer feeding into specialist forensic units.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-black">
          <span className="p-2 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            Total Cases: <strong className="text-black underline">{casesList.length}</strong>
          </span>
          <span className="p-2 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            Matching: <strong className="text-black underline">{filteredCases.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case ID, suspect address, exchange, or title..."
              className="w-full neo-input pl-9"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-3 font-mono text-xs text-black">
            <div className="flex items-center gap-1.5">
              <span className="text-black/70 text-[11px] font-bold">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="neo-input py-1 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Investigating">Investigating</option>
                <option value="Attributed">Attributed</option>
                <option value="Alerted">Alerted</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-black/70 text-[11px] font-bold">RISK:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="neo-input py-1 cursor-pointer"
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

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-black font-mono text-xs font-bold">
          <span className="text-black/80 text-[11px] uppercase mr-1">Quick Filter Pills:</span>
          {(['All', 'High Risk', 'Under Review', 'Escalated'] as const).map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handleFilterChange(pill)}
              className={`px-3 py-1 rounded-md border-2 border-black font-mono font-bold transition-all cursor-pointer ${
                activePillFilter === pill
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-black hover:bg-[#FEF9EF] shadow-[1px_1px_0px_0px_#000]'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Case Files Table */}
      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FBBF24] border-b-2 border-black text-[10px] text-black font-mono font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Case ID & Scenario</th>
                <th className="px-4 py-3">Chain & Target Address</th>
                <th className="px-4 py-3">Threat Tier</th>
                <th className="px-4 py-3">Attributed CEX</th>
                <th className="px-4 py-3">Traced Funds</th>
                <th className="px-4 py-3">Escalation Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-black/70 font-bold">
                    No forensic case records match your query.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenCase(c)}
                    className="hover:bg-[#FEF9EF] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-black flex items-center gap-2">
                        <span>{c.id}</span>
                        <ChevronRight className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-black/70 font-mono mt-0.5 truncate max-w-xs">
                        {c.scenario}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-black font-bold underline">{c.blockchain}</div>
                      <div className="text-[10px] text-black/70 mt-0.5">
                        {truncateAddress(c.seedDetails.address, 6, 6)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <RiskBadge level={c.severity} score={c.riskScore} size="sm" />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-black font-bold">{c.attribution.exchange}</div>
                      <div className="text-[10px] text-green-700 font-bold mt-0.5">
                        {c.attribution.confidence}% Confidence
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-green-800 font-bold">
                        ${c.suspiciousAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-black/70 font-bold">USD Value</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border-2 border-black shadow-[1px_1px_0px_0px_#000] bg-white text-black"
                      >
                        {c.escalationStatus || 'Not Escalated'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHandoffCase(c);
                        }}
                        className="neo-btn bg-indigo-600 text-white px-2.5 py-1.5 text-xs inline-flex items-center gap-1"
                        title="Export handoff package for Cyber Cell"
                      >
                        <FileCode className="w-3 h-3 text-white" />
                        <span>Handoff</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCase(c);
                        }}
                        className="neo-btn-sec px-2.5 py-1.5 text-xs inline-flex items-center gap-1"
                      >
                        <span>Investigate</span>
                        <ArrowUpRight className="w-3 h-3 text-black" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cyber Cell Handoff Modal */}
      {handoffCase && (
        <CyberCellHandoffModal
          caseData={handoffCase}
          onClose={() => setHandoffCase(null)}
          onUpdateEscalationStatus={(updatedCase) => {
            if (onUpdateCase) onUpdateCase(updatedCase);
          }}
        />
      )}
    </div>
  );
};
