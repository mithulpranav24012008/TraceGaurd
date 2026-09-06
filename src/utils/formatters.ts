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

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'Critical';
  if (score >= 65) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}
