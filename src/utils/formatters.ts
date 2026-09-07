import { RiskLevel } from '../types';

export function truncateAddress(address: string, frontChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= frontChars + endChars) return address;
  return `${address.substring(0, frontChars)}...${address.substring(address.length - endChars)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getRiskColorClass(level: RiskLevel): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (level) {
    case 'Critical':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        dot: 'bg-red-500'
      };
    case 'High':
      return {
        text: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/40',
        dot: 'bg-orange-500'
      };
    case 'Medium':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        dot: 'bg-amber-500'
      };
    case 'Low':
    default:
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        dot: 'bg-emerald-500'
      };
  }
}

export function getRiskLevelFromScore(
  score: number,
  thresholds?: { criticalThreshold?: number; highThreshold?: number; mediumThreshold?: number }
): RiskLevel {
  const critical = thresholds?.criticalThreshold ?? 80;
  const high = thresholds?.highThreshold ?? 65;
  const medium = thresholds?.mediumThreshold ?? 40;

  if (score >= critical) return 'Critical';
  if (score >= high) return 'High';
  if (score >= medium) return 'Medium';
  return 'Low';
}

export function generateUniqueFiuReference(existingReferrals?: { referenceNumber: string }[]): string {
  const usedCodes = new Set<string>();

  if (existingReferrals) {
    existingReferrals.forEach((r) => {
      if (r.referenceNumber) usedCodes.add(r.referenceNumber);
    });
  }

  try {
    const stored = localStorage.getItem('traceguard_referrals');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach((r: any) => {
          if (r && r.referenceNumber) usedCodes.add(r.referenceNumber);
        });
      }
    }
  } catch {}

  let code = '';
  let attempts = 0;
  do {
    const num = Math.floor(1000 + Math.random() * 9000);
    code = `FIU-DEMO-2026-${String(num).padStart(4, '0')}`;
    attempts++;
  } while (usedCodes.has(code) && attempts < 1000);

  return code;
}

