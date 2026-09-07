import { TriageComplaint, Blockchain, RiskLevel, TriageAction, MockCase } from '../types';
import { TRIAGE_QUEUE_SEED } from './triageQueueSeed';
import { getPatternMatch } from './nationalRegistryStore';
import { generateSimulatedCaseForAddress } from './mockCases';

const STORAGE_KEY = 'traceguard_triage_queue';

let queue: TriageComplaint[] = [];

/**
 * Compute risk score, level, pattern match count, and action recommendation
 * for a raw complaint entry based on national registry telemetry.
 */
export function enrichComplaint(entry: {
  id?: string;
  complainantName: string;
  walletAddress: string;
  chain: Blockchain;
  amount: number;
  amountUsd?: number;
  dateReported: string;
  stationDistrict: string;
  status?: 'Pending Triage' | 'Escalated' | 'Dismissed';
}): TriageComplaint {
  const cleanAddress = entry.walletAddress.trim();
  const pattern = getPatternMatch(cleanAddress);
  const patternMatchCount = pattern ? pattern.victimCount : 0;
  const patternStates = pattern ? pattern.states : [];

  // Compute risk score based on pattern match, amount, and chain factors
  let baseRisk = 30;
  if (patternMatchCount >= 5) baseRisk += 45;
  else if (patternMatchCount >= 3) baseRisk += 35;
  else if (patternMatchCount >= 1) baseRisk += 20;

  // Amount factor (in INR)
  if (entry.amount >= 5000000) baseRisk += 20;
  else if (entry.amount >= 2000000) baseRisk += 15;
  else if (entry.amount >= 500000) baseRisk += 10;

  // Specific address checks
  if (cleanAddress.toLowerCase().includes('superoffender') || cleanAddress.toLowerCase().startsWith('0x71c89f')) {
    baseRisk += 15;
  }

  const riskScore = Math.min(98, Math.max(25, baseRisk));
  
  const riskLevel: RiskLevel =
    riskScore >= 80 ? 'Critical' : riskScore >= 65 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low';

  let recommendedAction: TriageAction = 'Low Priority';
  if (riskScore >= 75 || patternMatchCount >= 3) {
    recommendedAction = 'Escalate to Cyber Cell';
  } else if (riskScore >= 45 || patternMatchCount >= 1) {
    recommendedAction = 'Monitor';
  }

  const amountUsd = entry.amountUsd || Math.round(entry.amount / 83);
  const id = entry.id || `CMP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  return {
    id,
    complainantName: entry.complainantName,
    walletAddress: cleanAddress,
    chain: entry.chain,
    amount: entry.amount,
    amountUsd,
    dateReported: entry.dateReported,
    stationDistrict: entry.stationDistrict,
    riskScore,
    riskLevel,
    patternMatchCount,
    patternStates,
    recommendedAction,
    status: entry.status || 'Pending Triage'
  };
}

/** Initialize the triage store from localStorage or seed */
export function initTriageStore(): TriageComplaint[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TriageComplaint[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Re-enrich to make sure live pattern matches stay synced
        queue = parsed.map((item) => enrichComplaint(item));
        persist();
        return [...queue];
      }
    }
  } catch {
    queue = [];
  }

  // Seed on first visit
  queue = TRIAGE_QUEUE_SEED.map((seed) => enrichComplaint(seed));
  persist();
  return [...queue];
}

/** Return active triage queue */
export function getTriageQueue(): TriageComplaint[] {
  if (queue.length === 0) {
    return initTriageStore();
  }
  // Keep pattern match numbers refreshed
  return queue.map((c) => enrichComplaint(c));
}

/** Add new complaints (from CSV or manual entry form) */
export function addTriageComplaints(
  newEntries: Array<{
    complainantName: string;
    walletAddress: string;
    chain: Blockchain;
    amount: number;
    dateReported: string;
    stationDistrict: string;
  }>
): TriageComplaint[] {
  const enriched = newEntries.map((e) => enrichComplaint(e));
  queue = [...enriched, ...queue];
  persist();
  return [...queue];
}

/** Bulk escalate complaints into full cases for Case Files */
export function escalateComplaints(ids: string[]): MockCase[] {
  const idSet = new Set(ids);
  const escalatedCases: MockCase[] = [];

  queue = queue.map((item) => {
    if (idSet.has(item.id)) {
      // Generate a case
      const createdCase = generateSimulatedCaseForAddress(
        item.walletAddress,
        item.chain,
        'Victim Report',
        item.riskLevel
      );
      createdCase.title = `Escalated Case: ${item.complainantName} (${item.stationDistrict.split(' ')[0]})`;
      createdCase.status = 'Investigating';
      escalatedCases.push(createdCase);

      return {
        ...item,
        status: 'Escalated' as const
      };
    }
    return item;
  });

  persist();
  return escalatedCases;
}

/** Helper to parse CSV content string into structured complaint items */
export function parseCsvText(csvText: string): Array<{
  complainantName: string;
  walletAddress: string;
  chain: Blockchain;
  amount: number;
  dateReported: string;
  stationDistrict: string;
}> {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Detect header row
  const hasHeader = lines[0].toLowerCase().includes('complainant') || lines[0].toLowerCase().includes('wallet') || lines[0].toLowerCase().includes('address');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const complainantName = cols[0] || 'Anonymous Complainant';
    const walletAddress = cols[1] || '0x71c89f2a2810a993e827b508f7d8e0a2e399A42';
    
    // Chain matching
    let chain: Blockchain = 'Ethereum';
    const chainStr = (cols[2] || '').toLowerCase();
    if (chainStr.includes('btc') || chainStr.includes('bitcoin')) chain = 'Bitcoin';
    else if (chainStr.includes('bnb') || chainStr.includes('bsc') || chainStr.includes('binance')) chain = 'BNB Smart Chain';
    else if (chainStr.includes('polygon') || chainStr.includes('matic')) chain = 'Polygon';

    // Amount parsing
    const rawAmt = (cols[3] || '500000').replace(/[^0-9.]/g, '');
    const amount = parseFloat(rawAmt) || 500000;

    // Date parsing
    const dateReported = cols[4] || new Date().toISOString().split('T')[0];

    // Station parsing
    const stationDistrict = cols[5] || 'District Cyber Cell';

    return {
      complainantName,
      walletAddress,
      chain,
      amount,
      dateReported,
      stationDistrict
    };
  });
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {}
}
