import React, { useMemo } from 'react';
import { ShieldAlert, ArrowRight, Activity, TrendingUp, AlertTriangle, Radar, MapPin, Users } from 'lucide-react';
import { MockCase } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { getPatternMatch, getPatternMatchScore } from '../../data/nationalRegistryStore';

interface RiskStageProps {
  currentCase: MockCase;
  onAdvanceToNext: () => void;
}

export const RiskStage: React.FC<RiskStageProps> = ({ currentCase, onAdvanceToNext }) => {
  // Run national pattern match lookup BEFORE rendering risk data
  const patternMatch = useMemo(
    () => getPatternMatch(currentCase.seedDetails.address),
    [currentCase.seedDetails.address]
  );
  const patternScore = useMemo(
    () => getPatternMatchScore(currentCase.seedDetails.address),
    [currentCase.seedDetails.address]
  );

  // Compute adjusted risk score (boosted by pattern match)
  const baseScore = currentCase.riskScore;
  const adjustedScore = patternMatch
    ? Math.min(100, baseScore + Math.floor(patternMatch.victimCount * 5))
    : baseScore;

  // Build components with live pattern match score injected
  const components = {
    ...currentCase.riskComponents,
    'National Pattern Match': patternScore
  };

  const timeline = currentCase.timeline;

  // Gauge calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (adjustedScore / 100) * circumference;

  const getGaugeColor = (val: number) => {
    if (val >= 80) return '#EF4444';
    if (val >= 65) return '#F97316';
    if (val >= 40) return '#F59E0B';
    return '#10B981';
  };

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const getSeverityFromScore = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 65) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low' as const;
  };

  const displaySeverity = patternMatch ? getSeverityFromScore(adjustedScore) : currentCase.severity;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Stage 4: Risk Intelligence Assessment</h2>
            <RiskBadge level={displaySeverity} score={adjustedScore} size="sm" showPulse />
          </div>
          <p className="text-xs text-[#8EA1B2] mt-1">
            Simulated multi-factor heuristic threat score assessing privacy tool interaction, velocity, and CEX proximity.
          </p>
        </div>

        <button
          onClick={onAdvanceToNext}
          className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Examine Exchange Attribution</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ═══ NATIONAL PATTERN MATCH BANNER ═══ */}
      {patternMatch && patternMatch.victimCount > 0 && (
        <div className="p-4 rounded-xl bg-red-500/8 border-2 border-red-500/40 space-y-3 animate-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/15 border border-red-500/30 shrink-0">
              <Radar className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-red-400 font-mono-code uppercase tracking-wider">
                  🔴 National Pattern Match Detected
                </h3>
                <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[10px] font-mono-code text-red-400 font-bold">
                  CROSS-CASE INTELLIGENCE
                </span>
              </div>
              <p className="text-sm text-white mt-2 leading-relaxed">
                This wallet has been reported by{' '}
                <span className="font-bold text-red-400">{patternMatch.victimCount} victims</span>{' '}
                across{' '}
                <span className="font-bold text-amber-400">{patternMatch.states.join(', ')}</span>{' '}
                since{' '}
                <span className="font-bold text-[#38BDF8]">{patternMatch.earliestDate}</span>,
                totaling{' '}
                <span className="font-bold text-red-400">{formatINR(patternMatch.totalAmount)}</span>{' '}
                in reported losses.
              </p>
              <p className="text-[11px] text-[#8EA1B2] mt-1.5">
                Cross-case aggregation powered by TraceGuard's national registry — connecting victims across
                state boundaries to expose organized fraud networks that single-case tools miss.
              </p>
            </div>
          </div>

          {/* State breakdown chips */}
          <div className="flex flex-wrap gap-2 pl-12">
            {patternMatch.matchingReports.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0D1721] border border-[#243443] text-[11px] font-mono-code"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span className="text-[#8EA1B2]">{r.reportingCity}, {r.reportingState}</span>
                <span className="text-[#586C7E]">•</span>
                <span className="text-white">{r.dateReported}</span>
                <span className="text-[#586C7E]">•</span>
                <span className="text-red-400 font-semibold">{formatINR(r.complaintAmount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Circular Risk Meter + Component Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circular Risk Meter Card */}
        <div className="lg:col-span-4 bg-[#0D1721] border border-[#243443] rounded-xl p-5 flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between border-b border-[#243443] pb-2.5">
            <span className="text-xs font-semibold text-white uppercase font-mono-code flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              Threat Gauge
            </span>
            <span className="text-[10px] font-mono-code text-[#8EA1B2]">SCORE METRIC</span>
          </div>

          {/* SVG Circular Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
              {/* Background track circle */}
              <circle
                cx="55"
                cy="55"
                r="45"
                stroke="#111F2C"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated score arc */}
              <circle
                cx="55"
                cy="55"
                r="45"
                stroke={getGaugeColor(adjustedScore)}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner text score */}
            <div className="absolute flex flex-col items-center justify-center font-mono-code">
              <span className="text-4xl font-black text-white">{adjustedScore}</span>
              <span className="text-[10px] text-[#8EA1B2] font-semibold tracking-wider uppercase mt-0.5">
                {displaySeverity} RISK
              </span>
            </div>
          </div>

          <div className="w-full p-2.5 rounded-lg bg-[#071018] border border-[#243443] text-left text-xs font-mono-code space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">EVALUATION TIER:</div>
            <div className="text-white font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${adjustedScore >= 80 ? 'bg-red-500' : 'bg-orange-500'}`} />
              <span>{displaySeverity.toUpperCase()} RISK PROFILE</span>
            </div>
            {patternMatch && patternMatch.victimCount > 0 && (
              <div className="text-[10px] text-red-400 font-sans pt-1 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Score boosted by +{Math.floor(patternMatch.victimCount * 5)} from national pattern match
              </div>
            )}
            <div className="text-[10px] text-[#8EA1B2] font-sans pt-1">
              Triggered automated compliance referral flag.
            </div>
          </div>
        </div>

        {/* Risk Component Breakdown Bars */}
        <div className="lg:col-span-8 bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#243443] pb-2.5">
            <h3 className="text-xs font-semibold text-white uppercase font-mono-code flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#38BDF8]" />
              <span>Heuristic Component Attribution</span>
            </h3>
            <span className="text-[10px] font-mono-code text-[#8EA1B2]">WEIGHTED MODEL v2</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(components).map(([name, val]) => {
              const color = name === 'National Pattern Match'
                ? (val > 0 ? '#EF4444' : '#243443')
                : getGaugeColor(val);
              const isPatternRow = name === 'National Pattern Match';
              return (
                <div key={name} className={`space-y-1.5 ${isPatternRow && val > 0 ? 'p-2.5 -mx-2.5 rounded-lg bg-red-500/5 border border-red-500/20' : ''}`}>
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className={`flex items-center gap-1.5 ${isPatternRow && val > 0 ? 'text-red-400 font-bold' : 'text-[#E7EEF5]'}`}>
                      {isPatternRow && <Radar className="w-3.5 h-3.5" />}
                      {name}
                      {isPatternRow && val > 0 && (
                        <span className="text-[9px] bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 rounded text-red-400 ml-1">
                          CROSS-CASE
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-white">{val} / 100</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-[#071018] rounded-full overflow-hidden border border-[#243443]/80 p-0.2">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${val}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 font-mono-code">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px]">
              Disclaimer: Risk scores are simulated heuristic values for demonstration and educational testing only.
            </span>
          </div>
        </div>
      </div>

      {/* Risk Escalation Timeline */}
      <div className="bg-[#0D1721] border border-[#243443] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#243443] pb-2.5">
          <h3 className="text-xs font-semibold text-white uppercase font-mono-code flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
            <span>Hop-by-Hop Risk Escalation Chronology</span>
          </h3>
          <span className="text-[10px] font-mono-code text-[#8EA1B2]">CHRONOLOGICAL DRIFT</span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#243443]">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative flex items-start justify-between gap-4 font-mono-code text-xs">
              {/* Bullet circle */}
              <div
                className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border border-[#0D1721]"
                style={{ backgroundColor: getGaugeColor(item.risk) }}
              />

              <div>
                <div className="text-white font-semibold flex items-center gap-2">
                  <span className="text-[#38BDF8]">{item.time}</span>
                  <span>— {item.event}</span>
                </div>
                {item.detail && (
                  <div className="text-[#8EA1B2] text-[11px] font-sans mt-0.5">
                    {item.detail}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-bold border"
                  style={{
                    color: getGaugeColor(item.risk),
                    borderColor: `${getGaugeColor(item.risk)}40`,
                    backgroundColor: `${getGaugeColor(item.risk)}15`
                  }}
                >
                  Score: {item.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
