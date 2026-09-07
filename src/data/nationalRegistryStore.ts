import { NationalRegistryEntry, PatternMatchResult, Blockchain } from '../types';
import { NATIONAL_REGISTRY_SEED } from './nationalRegistrySeed';

const STORAGE_KEY = 'traceguard_national_registry';

let registry: NationalRegistryEntry[] = [];

/**
 * Initialize the national registry from localStorage.
 * If empty (first visit), seeds with synthetic demo data.
 */
export function initRegistry(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      registry = JSON.parse(stored) as NationalRegistryEntry[];
    }
  } catch {
    registry = [];
  }

  // Seed on first visit (or if localStorage was cleared)
  if (registry.length === 0) {
    registry = [...NATIONAL_REGISTRY_SEED];
    persist();
  }
}

/**
 * Add a new report to the national registry and persist.
 */
export function addReport(entry: NationalRegistryEntry): void {
  registry.push(entry);
  persist();
}

/**
 * Look up all reports for a given wallet address (case-insensitive).
 */
export function lookupAddress(walletAddress: string): NationalRegistryEntry[] {
  const normalized = walletAddress.trim().toLowerCase();
  return registry.filter((e) => e.walletAddress.toLowerCase() === normalized);
}

/**
 * Get an aggregated pattern match result for a wallet address.
 * Returns null if no prior reports exist.
 */
export function getPatternMatch(walletAddress: string): PatternMatchResult | null {
  const matches = lookupAddress(walletAddress);
  if (matches.length === 0) return null;

  const states = [...new Set(matches.map((m) => m.reportingState))];
  const cities = [...new Set(matches.map((m) => m.reportingCity))];
  const dates = matches.map((m) => m.dateReported).sort();
  const totalAmount = matches.reduce((sum, m) => sum + m.complaintAmount, 0);

  return {
    walletAddress,
    victimCount: matches.length,
    states,
    cities,
    earliestDate: dates[0],
    latestDate: dates[dates.length - 1],
    totalAmount,
    matchingReports: matches
  };
}

/**
 * Compute a risk score component (0-100) based on pattern match victim count.
 * No matches = 0. One match = 45. Each additional adds 15, capped at 95.
 */
export function getPatternMatchScore(walletAddress: string): number {
  const match = getPatternMatch(walletAddress);
  if (!match) return 0;
  return Math.min(95, 30 + match.victimCount * 15);
}

/**
 * Get a ranked list of repeat-offender addresses (those with ≥2 reports),
 * sorted by victim count descending, then total amount descending.
 */
export function getTopOffenders(limit: number = 50): {
  walletAddress: string;
  chain: Blockchain;
  victimCount: number;
  states: string[];
  earliestDate: string;
  latestDate: string;
  totalAmount: number;
}[] {
  // Group by normalized address
  const groups = new Map<string, NationalRegistryEntry[]>();
  for (const entry of registry) {
    const key = entry.walletAddress.toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(entry);
  }

  const offenders: {
    walletAddress: string;
    chain: Blockchain;
    victimCount: number;
    states: string[];
    earliestDate: string;
    latestDate: string;
    totalAmount: number;
  }[] = [];

  for (const [, entries] of groups) {
    if (entries.length < 2) continue;
    const dates = entries.map((e) => e.dateReported).sort();
    offenders.push({
      walletAddress: entries[0].walletAddress,
      chain: entries[0].chain,
      victimCount: entries.length,
      states: [...new Set(entries.map((e) => e.reportingState))],
      earliestDate: dates[0],
      latestDate: dates[dates.length - 1],
      totalAmount: entries.reduce((s, e) => s + e.complaintAmount, 0)
    });
  }

  offenders.sort((a, b) => {
    if (b.victimCount !== a.victimCount) return b.victimCount - a.victimCount;
    return b.totalAmount - a.totalAmount;
  });

  return offenders.slice(0, limit);
}

/**
 * Return the full registry (for analytics).
 */
export function getAllEntries(): NationalRegistryEntry[] {
  return [...registry];
}

/** Persist the current registry to localStorage. */
function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}
