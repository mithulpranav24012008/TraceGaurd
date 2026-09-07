import React from 'react';
import { RiskLevel } from '../../types';
import { getRiskColorClass, getRiskLevelFromScore } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';

interface RiskBadgeProps {
  level?: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level: initialLevel,
  score,
  size = 'md',
  showPulse = false
}) => {
  const { settings } = useSettings();

  const effectiveLevel: RiskLevel = score !== undefined
    ? getRiskLevelFromScore(score, settings)
    : (initialLevel || 'Low');

  const colors = getRiskColorClass(effectiveLevel);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3 py-1.5 gap-2.5 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono-code font-semibold tracking-wide uppercase transition-all duration-200 ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses[size]}`}
      role="status"
      aria-label={`Risk Level: ${effectiveLevel}${score !== undefined ? `, Score: ${score}` : ''}`}
    >
      <span
        className={`rounded-full ${colors.dot} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${
          showPulse && !settings.reducedMotion && (effectiveLevel === 'Critical' || effectiveLevel === 'High')
            ? 'animate-pulse'
            : ''
        }`}
      />
      <span>{effectiveLevel}</span>
      {score !== undefined && (
        <span className="opacity-80 pl-1 border-l border-current/30">
          {score}/100
        </span>
      )}
    </span>
  );
};
