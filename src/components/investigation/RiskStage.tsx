import React from 'react';
import { ShieldAlert, ArrowRight, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { MockCase } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface RiskStageProps {
  currentCase: MockCase;
  onAdvanceToNext: () => void;
}

export const RiskStage: React.FC<RiskStageProps> = ({ currentCase, onAdvanceToNext }) => {
  const score = currentCase.riskScore;
  const components = currentCase.riskComponents;
  const timeline = currentCase.timeline;

  // Gauge calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getGaugeColor = (val: number) => {
    if (val >= 80) return '#EF4444';
    if (val >= 65) return '#F97316';
    if (val >= 40) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Stage 4: Risk Intelligence Assessment</h2>
            <RiskBadge level={currentCase.severity} score={score} size="sm" showPulse />
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
                stroke={getGaugeColor(score)}
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
              <span className="text-4xl font-black text-white">{score}</span>
              <span className="text-[10px] text-[#8EA1B2] font-semibold tracking-wider uppercase mt-0.5">
                {currentCase.severity} RISK
              </span>
            </div>
          </div>

          <div className="w-full p-2.5 rounded-lg bg-[#071018] border border-[#243443] text-left text-xs font-mono-code space-y-1">
            <div className="text-[10px] text-[#8EA1B2]">EVALUATION TIER:</div>
            <div className="text-white font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${score >= 80 ? 'bg-red-500' : 'bg-orange-500'}`} />
              <span>{currentCase.severity.toUpperCase()} RISK PROFILE</span>
            </div>
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
              const color = getGaugeColor(val);
              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className="text-[#E7EEF5]">{name}</span>
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
