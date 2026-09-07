import React, { useState, useMemo, useEffect } from 'react';
import {
  Inbox,
  Search,
  Upload,
  Plus,
  ShieldAlert,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileSpreadsheet,
  X,
  Radar,
  MapPin,
  Clock,
  Filter,
  Trash2,
  Check,
  Copy,
  ChevronRight
} from 'lucide-react';
import { TriageComplaint, Blockchain, RiskLevel, TriageAction, MockCase } from '../../types';
import { getTriageQueue, addTriageComplaints, escalateComplaints, parseCsvText } from '../../data/triageQueueStore';
import { RiskBadge } from '../common/RiskBadge';
import { truncateAddress } from '../../utils/formatters';

interface TriageQueuePageProps {
  onSelectCase: (c: MockCase) => void;
  onNavigateToInvestigation: () => void;
  onCasesUpdated?: (newCases: MockCase[]) => void;
}

type SortField = 'riskScore' | 'amount' | 'daysAgo' | 'patternMatchCount';

export const TriageQueuePage: React.FC<TriageQueuePageProps> = ({
  onSelectCase,
  onNavigateToInvestigation,
  onCasesUpdated
}) => {
  const [complaints, setComplaints] = useState<TriageComplaint[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [chainFilter, setChainFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('Pending Triage');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Modals
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Manual Form Rows
  const [manualRows, setManualRows] = useState<
    Array<{
      complainantName: string;
      walletAddress: string;
      chain: Blockchain;
      amount: string;
      dateReported: string;
      stationDistrict: string;
    }>
  >([
    {
      complainantName: '',
      walletAddress: '',
      chain: 'Ethereum',
      amount: '',
      dateReported: new Date().toISOString().split('T')[0],
      stationDistrict: 'District Cyber Cell'
    }
  ]);

  // Load queue on mount
  useEffect(() => {
    const list = getTriageQueue();
    setComplaints(list);
  }, []);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Days ago calculator helper
  const getDaysAgo = (dateStr: string): number => {
    try {
      const reported = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - reported.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  // Filter & Sort Logic
  const processedComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          c.id.toLowerCase().includes(query) ||
          c.complainantName.toLowerCase().includes(query) ||
          c.walletAddress.toLowerCase().includes(query) ||
          c.stationDistrict.toLowerCase().includes(query);

        const matchesChain = chainFilter === 'All' || c.chain === chainFilter;
        const matchesRisk = riskFilter === 'All' || c.riskLevel === riskFilter;
        const matchesAction = actionFilter === 'All' || c.recommendedAction === actionFilter;
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

        return matchesSearch && matchesChain && matchesRisk && matchesAction && matchesStatus;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortField === 'riskScore') {
          valA = a.riskScore;
          valB = b.riskScore;
        } else if (sortField === 'amount') {
          valA = a.amount;
          valB = b.amount;
        } else if (sortField === 'daysAgo') {
          valA = getDaysAgo(a.dateReported);
          valB = getDaysAgo(b.dateReported);
        } else if (sortField === 'patternMatchCount') {
          valA = a.patternMatchCount;
          valB = b.patternMatchCount;
        }

        return sortAsc ? valA - valB : valB - valA;
      });
  }, [complaints, searchQuery, chainFilter, riskFilter, actionFilter, statusFilter, sortField, sortAsc]);

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allVisibleIds = new Set(processedComplaints.map((c) => c.id));
      setSelectedIds(allVisibleIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Bulk Escalate Action
  const handleBulkEscalate = () => {
    if (selectedIds.size === 0) return;
    const idsToEscalate = Array.from(selectedIds);
    const createdCases = escalateComplaints(idsToEscalate);

    // Refresh local queue state
    setComplaints(getTriageQueue());
    setSelectedIds(new Set());

    if (onCasesUpdated) {
      onCasesUpdated(createdCases);
    }

    showNotice(`Successfully escalated ${createdCases.length} complaints into Case Files.`);
  };

  // Single Escalate Action
  const handleEscalateSingle = (complaint: TriageComplaint) => {
    const created = escalateComplaints([complaint.id]);
    setComplaints(getTriageQueue());
    if (onCasesUpdated && created.length > 0) {
      onCasesUpdated(created);
    }
    showNotice(`Complaint ${complaint.id} escalated to Cyber Cell Case Repository.`);
  };

  // Inspect / Load into Investigation Workflow
  const handleInspect = (complaint: TriageComplaint) => {
    const created = escalateComplaints([complaint.id]);
    const targetCase = created[0] || {
      id: complaint.id,
      title: `Triage Case: ${complaint.complainantName}`,
      scenario: 'Station Triage Investigation',
      blockchain: complaint.chain,
      severity: complaint.riskLevel,
      riskScore: complaint.riskScore,
      confidence: 90,
      exchange: 'Centralized Exchange',
      suspiciousAmount: Math.round(complaint.amount / 83),
      source: 'Victim Report',
      status: 'Investigating',
      seedDetails: {
        address: complaint.walletAddress,
        blockchain: complaint.chain,
        firstSeen: `${complaint.dateReported} 00:00:00 UTC`,
        lastSeen: new Date().toISOString().substring(0, 10) + ' 12:00:00 UTC',
        transactions: 12,
        totalInflow: `₹${complaint.amount.toLocaleString('en-IN')}`,
        totalOutflow: `₹${Math.round(complaint.amount * 0.95).toLocaleString('en-IN')}`,
        currentBalance: '₹0.00',
        reportedBy: 'Victim Report'
      },
      clusterData: {
        title: 'Triage Address Cluster',
        description: 'Cluster extracted from station complaint.',
        heuristics: ['Station Complaint Correlation'],
        relatedAddressesCount: 2,
        risk: complaint.riskScore,
        root: complaint.walletAddress,
        clusterEntities: []
      },
      nodes: [
        {
          id: 'node-seed',
          name: `Target (${truncateAddress(complaint.walletAddress, 4, 4)})`,
          type: 'suspect',
          address: complaint.walletAddress,
          transactions: 12,
          received: `₹${complaint.amount.toLocaleString('en-IN')}`,
          sent: `₹${Math.round(complaint.amount * 0.95).toLocaleString('en-IN')}`,
          risk: complaint.riskScore,
          flags: ['Station Complaint Target'],
          x: 320,
          y: 200,
          entityName: complaint.complainantName
        }
      ],
      edges: [],
      riskComponents: {
        'Transaction Behavior': complaint.riskScore,
        'Mixer Exposure': 0,
        'Bridge Exposure': 0,
        'Address Clustering': 75,
        'Velocity': 80,
        'Exchange Proximity': 85,
        'National Pattern Match': complaint.patternMatchCount * 20
      },
      timeline: [],
      attribution: {
        title: 'Station Referral Attribution',
        exchange: 'Exchange Deposit Node',
        walletType: 'User Deposit Forwarder',
        confidence: 88,
        potentialExchangeAmount: `₹${complaint.amount.toLocaleString('en-IN')}`,
        potentiallyTraceableAmount: `₹${complaint.amount.toLocaleString('en-IN')}`,
        evidence: ['Station complaint match'],
        warning: 'Requires formal law enforcement notice.',
        jurisdiction: 'India'
      },
      highRiskReasons: [
        `Reported at ${complaint.stationDistrict} by ${complaint.complainantName}`,
        `National Pattern Match: ${complaint.patternMatchCount} prior report(s)`
      ]
    };

    onSelectCase(targetCase);
    onNavigateToInvestigation();
  };

  // CSV Import Submission
  const handleImportCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;
    const parsed = parseCsvText(csvInput);
    if (parsed.length === 0) {
      alert('Could not parse any valid complaint rows. Please check CSV format.');
      return;
    }
    const updated = addTriageComplaints(parsed);
    setComplaints(updated);
    setIsCsvModalOpen(false);
    setCsvInput('');
    showNotice(`Successfully imported ${parsed.length} complaints into the Triage Queue.`);
  };

  // Manual Rows Submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = manualRows.filter((r) => r.walletAddress.trim() !== '' && r.complainantName.trim() !== '');
    if (valid.length === 0) return;

    const formatted = valid.map((r) => ({
      complainantName: r.complainantName.trim(),
      walletAddress: r.walletAddress.trim(),
      chain: r.chain,
      amount: parseFloat(r.amount) || 500000,
      dateReported: r.dateReported,
      stationDistrict: r.stationDistrict.trim() || 'District Cyber Cell'
    }));

    const updated = addTriageComplaints(formatted);
    setComplaints(updated);
    setIsManualModalOpen(false);
    showNotice(`Added ${formatted.length} manual complaint entry(ies) to Triage Queue.`);
  };

  const formatINR = (amt: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getActionBadgeClass = (action: TriageAction) => {
    switch (action) {
      case 'Escalate to Cyber Cell':
        return 'bg-red-500/15 text-red-400 border-red-500/40';
      case 'Monitor':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'Low Priority':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-mono text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 bg-[#FBBF24] border-2 border-black text-black text-xs px-4 py-2.5 rounded-lg shadow-[4px_4px_0px_0px_#000] flex items-center gap-2 font-mono font-bold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="neo-card-yellow p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-black uppercase tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-black" />
            <span>Station Triage Queue — Multi-Complaint Backlog Processing</span>
          </h1>
          <p className="text-xs text-black/80 font-mono mt-1 max-w-3xl">
            Station-level desk for processing incoming cybercrime complaints in bulk. Automated multi-factor risk scoring ranks backlog priority for immediate escalation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="neo-btn-sec px-3.5 py-2 text-xs flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5 text-black" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="neo-btn px-3.5 py-2 text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Complaint</span>
          </button>
        </div>
      </div>

      {/* Quick Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="neo-card p-3">
          <div className="text-[10px] text-black/70 font-bold uppercase">Pending Backlog</div>
          <div className="text-lg font-bold text-black mt-0.5">
            {complaints.filter((c) => c.status === 'Pending Triage').length}
          </div>
        </div>

        <div className="neo-card-pink p-3">
          <div className="text-[10px] text-black font-bold uppercase">Urgent Escalation Needed</div>
          <div className="text-lg font-bold text-black mt-0.5">
            {complaints.filter((c) => c.recommendedAction === 'Escalate to Cyber Cell' && c.status === 'Pending Triage').length}
          </div>
        </div>

        <div className="neo-card-yellow p-3">
          <div className="text-[10px] text-black font-bold uppercase">Pattern Hits (≥1 Victims)</div>
          <div className="text-lg font-bold text-black mt-0.5">
            {complaints.filter((c) => c.patternMatchCount > 0).length}
          </div>
        </div>

        <div className="neo-card-mint p-3">
          <div className="text-[10px] text-black font-bold uppercase">Total Case Value</div>
          <div className="text-lg font-bold text-black mt-0.5">
            {formatINR(complaints.reduce((s, c) => s + c.amount, 0))}
          </div>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="neo-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-black absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by complainant, wallet address, station, or complaint ID..."
            className="w-full neo-input pl-9"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-black">
          <div className="flex items-center gap-1">
            <span className="text-black/70 text-[10px] font-bold">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="neo-input py-1 cursor-pointer"
            >
              <option value="Pending Triage">Pending Triage</option>
              <option value="Escalated">Escalated</option>
              <option value="All">All Complaints</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-black/70 text-[10px] font-bold">CHAIN:</span>
            <select
              value={chainFilter}
              onChange={(e) => setChainFilter(e.target.value)}
              className="neo-input py-1 cursor-pointer"
            >
              <option value="All">All Chains</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="BNB Smart Chain">BNB Smart Chain</option>
              <option value="Polygon">Polygon</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-black/70 text-[10px] font-bold">RISK:</span>
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

          <div className="flex items-center gap-1">
            <span className="text-black/70 text-[10px] font-bold">ACTION:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="neo-input py-1 cursor-pointer"
            >
              <option value="All">All Actions</option>
              <option value="Escalate to Cyber Cell">Escalate to Cyber Cell</option>
              <option value="Monitor">Monitor</option>
              <option value="Low Priority">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Button */}
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkEscalate}
            className="neo-btn bg-red-600 text-white font-bold px-4 py-2 text-xs flex items-center gap-2 shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>Select and Escalate ({selectedIds.size}) to Case Files</span>
          </button>
        )}
      </div>

      {/* Dense Triage Table */}
      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[#FBBF24] border-b-2 border-black text-[10px] text-black font-mono font-bold uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      processedComplaints.length > 0 &&
                      processedComplaints.every((c) => selectedIds.has(c.id))
                    }
                    onChange={handleSelectAll}
                    className="accent-black rounded cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3">
                  <button
                    onClick={() => toggleSort('riskScore')}
                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer"
                  >
                    <span>Threat Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-3">Complainant & Station</th>
                <th className="px-3 py-3">Target Address & Chain</th>
                <th className="px-3 py-3">
                  <button
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer"
                  >
                    <span>Reported Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-3">
                  <button
                    onClick={() => toggleSort('daysAgo')}
                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer"
                  >
                    <span>Reported</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-3">
                  <button
                    onClick={() => toggleSort('patternMatchCount')}
                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer"
                  >
                    <Radar className="w-3 h-3 text-black" />
                    <span>Pattern Hits</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-3">Recommended Action</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black">
              {processedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-black/70 font-bold">
                    No complaints match your triage filters.
                  </td>
                </tr>
              ) : (
                processedComplaints.map((c) => {
                  const isSelected = selectedIds.has(c.id);
                  const daysAgo = getDaysAgo(c.dateReported);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-[#FEF9EF] transition-colors ${
                        isSelected ? 'bg-[#94D3AC]/30' : ''
                      } ${c.status === 'Escalated' ? 'opacity-60' : ''}`}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(c.id)}
                          className="accent-black rounded cursor-pointer"
                        />
                      </td>

                      {/* Risk Score */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                      </td>

                      {/* Complainant Name & Station */}
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-black flex items-center gap-1.5">
                          <span>{c.complainantName}</span>
                          <span className="text-[10px] text-black/60 font-normal">({c.id})</span>
                        </div>
                        <div className="text-[10px] text-black/70 truncate max-w-xs mt-0.5">
                          {c.stationDistrict}
                        </div>
                      </td>

                      {/* Target Address & Chain */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="text-black font-mono font-bold" title={c.walletAddress}>
                            {truncateAddress(c.walletAddress, 6, 4)}
                          </span>
                          <button
                            onClick={() => handleCopy(c.walletAddress)}
                            className="text-black hover:opacity-75 p-0.5 cursor-pointer"
                            title="Copy address"
                          >
                            {copiedAddress === c.walletAddress ? (
                              <Check className="w-3 h-3 text-green-700 font-bold" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-black font-bold mt-0.5 underline">{c.chain}</div>
                      </td>

                      {/* Reported Value */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="text-green-800 font-bold">{formatINR(c.amount)}</div>
                        <div className="text-[10px] text-black/70 font-bold">${c.amountUsd.toLocaleString()} USD</div>
                      </td>

                      {/* Reported Date / Days Ago */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="text-black font-bold">{c.dateReported}</div>
                        <div className="text-[10px] text-black/70">
                          {daysAgo === 0 ? 'Today' : `${daysAgo} day(s) ago`}
                        </div>
                      </td>

                      {/* Pattern Hits */}
                      <td className="px-3 py-2.5">
                        {c.patternMatchCount > 0 ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FBCFE8] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                              <Radar className="w-3 h-3 text-black" />
                              {c.patternMatchCount} prior victims
                            </span>
                            {c.patternStates.length > 0 && (
                              <div className="text-[9px] text-black/70 truncate max-w-[140px]">
                                {c.patternStates.slice(0, 2).join(', ')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-black/50">No prior hits</span>
                        )}
                      </td>

                      {/* Recommended Action */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-[10px] uppercase font-bold border-2 border-black shadow-[1px_1px_0px_0px_#000] inline-block ${
                            c.recommendedAction === 'Escalate to Cyber Cell'
                              ? 'bg-red-300 text-black'
                              : c.recommendedAction === 'Monitor'
                              ? 'bg-[#FBBF24] text-black'
                              : 'bg-[#94D3AC] text-black'
                          }`}
                        >
                          {c.recommendedAction}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="px-3 py-2.5 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => handleInspect(c)}
                          className="neo-btn-sec px-2 py-1 text-[11px] inline-flex items-center gap-1"
                          title="Run full forensic trace"
                        >
                          <span>Trace</span>
                          <ChevronRight className="w-3 h-3 text-black" />
                        </button>

                        {c.status === 'Pending Triage' && (
                          <button
                            onClick={() => handleEscalateSingle(c)}
                            className="neo-btn px-2 py-1 text-[11px]"
                            title="Escalate directly to Case Files"
                          >
                            Escalate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] border-2 border-black rounded-xl max-w-2xl w-full p-6 text-black space-y-4 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="text-sm font-mono font-bold flex items-center gap-2 uppercase">
                <FileSpreadsheet className="w-4 h-4 text-black" />
                <span>Bulk CSV Complaint Import</span>
              </h3>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="text-black hover:bg-black/10 p-1 rounded cursor-pointer border border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-black/80 font-mono">
              Paste CSV data or upload a file containing complaint records. Required columns:
              <br />
              <code className="text-black font-bold bg-[#FBBF24] px-1 rounded border border-black text-[11px]">
                Complainant Name, Wallet Address, Chain, Amount (INR), Date (YYYY-MM-DD), Station/District
              </code>
            </p>

            <form onSubmit={handleImportCsvSubmit} className="space-y-4 font-mono text-xs">
              <textarea
                rows={6}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder={`Complainant Name, Wallet Address, Chain, Amount, Date, Station\nRajesh Kumar, 0x71c89f2a2810a993e827b508f7d8e0a2e399A42, Ethereum, 1500000, 2026-09-06, Cyber PS Bengaluru\nPriya S, bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh, Bitcoin, 3200000, 2026-09-05, Cyber Cell Mumbai`}
                className="w-full neo-input font-mono"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setCsvInput(
                      `Complainant Name, Wallet Address, Chain, Amount, Date, Station\nArun Varma, 0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99, Ethereum, 2400000, 2026-09-07, Cyber Crime Cell Delhi\nSunil Patil, bc1qsuperoffender88291ab37cd9182ef0a78b450c, Bitcoin, 5400000, 2026-09-07, Cyber Cell Pune\nNisha Rao, 0x2a91029384710293847102938471029384710293, Polygon, 950000, 2026-09-06, Jaipur Cyber PS`
                    )
                  }
                  className="text-xs text-black font-bold underline cursor-pointer"
                >
                  Load Sample CSV Payload
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCsvModalOpen(false)}
                    className="neo-btn-sec px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="neo-btn px-4 py-2 text-xs"
                  >
                    Parse & Import Queue
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Multi-Row Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] border-2 border-black rounded-xl max-w-4xl w-full p-6 text-black space-y-4 shadow-[6px_6px_0px_0px_#000] max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="text-sm font-mono font-bold flex items-center gap-2 uppercase">
                <Plus className="w-4 h-4 text-black" />
                <span>Manual Multi-Row Complaint Entry Form</span>
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-black hover:bg-black/10 p-1 rounded cursor-pointer border border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 font-mono text-xs">
              {manualRows.map((row, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] text-black/70 font-bold">
                    <span>COMPLAINT ENTRY #{idx + 1}</span>
                    {manualRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setManualRows(manualRows.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:opacity-75 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Complainant Name *"
                      value={row.complainantName}
                      onChange={(e) => {
                        const copy = [...manualRows];
                        copy[idx].complainantName = e.target.value;
                        setManualRows(copy);
                      }}
                      required
                      className="neo-input"
                    />

                    <input
                      type="text"
                      placeholder="Suspect Wallet Address *"
                      value={row.walletAddress}
                      onChange={(e) => {
                        const copy = [...manualRows];
                        copy[idx].walletAddress = e.target.value;
                        setManualRows(copy);
                      }}
                      required
                      className="neo-input"
                    />

                    <select
                      value={row.chain}
                      onChange={(e) => {
                        const copy = [...manualRows];
                        copy[idx].chain = e.target.value as Blockchain;
                        setManualRows(copy);
                      }}
                      className="neo-input cursor-pointer"
                    >
                      <option value="Ethereum">Ethereum</option>
                      <option value="Bitcoin">Bitcoin</option>
                      <option value="BNB Smart Chain">BNB Smart Chain</option>
                      <option value="Polygon">Polygon</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Amount in INR (e.g. 1500000)"
                      value={row.amount}
                      onChange={(e) => {
                        const copy = [...manualRows];
                        copy[idx].amount = e.target.value;
                        setManualRows(copy);
                      }}
                      className="neo-input"
                    />

                    <input
                      type="date"
                      value={row.dateReported}
                      onChange={(e) => {
                        const copy = [...manualRows];
                        copy[idx].dateReported = e.target.value;
                        setManualRows(copy);
                      }}
                      className="neo-input cursor-pointer"
                    />

                    <input
                      type="text"
                      placeholder="Station / District"
                      value={row.stationDistrict}
                      onChange={(e) => {
                        const copy = [...manualRows];
                        copy[idx].stationDistrict = e.target.value;
                        setManualRows(copy);
                      }}
                      className="neo-input"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 font-mono">
                <button
                  type="button"
                  onClick={() =>
                    setManualRows([
                      ...manualRows,
                      {
                        complainantName: '',
                        walletAddress: '',
                        chain: 'Ethereum',
                        amount: '',
                        dateReported: new Date().toISOString().split('T')[0],
                        stationDistrict: 'District Cyber Cell'
                      }
                    ])
                  }
                  className="text-xs text-black font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Entry Row</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="neo-btn-sec px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="neo-btn px-4 py-2 text-xs"
                  >
                    Process Entries & Calculate Risk
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
