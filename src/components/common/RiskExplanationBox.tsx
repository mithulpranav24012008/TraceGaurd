import React, { useState } from 'react';
import { BookOpen, Copy, Check, MessageSquare, Globe2 } from 'lucide-react';
import { RiskLevel, RiskComponents, ExchangeAttribution, PatternMatchResult } from '../../types';
import { generateRiskExplanation } from '../../utils/explanationGenerator';

interface RiskExplanationBoxProps {
  riskScore: number;
  severity: RiskLevel;
  riskComponents: RiskComponents;
  highRiskReasons?: string[];
  patternMatch?: PatternMatchResult | null;
  attribution?: ExchangeAttribution;
  compact?: boolean;
}

export const RiskExplanationBox: React.FC<RiskExplanationBoxProps> = ({
  riskScore,
  severity,
  riskComponents,
  highRiskReasons,
  patternMatch,
  attribution,
  compact = false
}) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [copiedVictim, setCopiedVictim] = useState(false);
  const [copiedOfficer, setCopiedOfficer] = useState(false);

  const explanation = generateRiskExplanation({
    riskScore,
    severity,
    riskComponents,
    highRiskReasons,
    patternMatch,
    attribution
  });

  const currentOfficerText = lang === 'hi' ? explanation.officerHindi : explanation.officerEnglish;
  const currentVictimScript = lang === 'hi' ? explanation.victimHindi : explanation.victimEnglish;

  const handleCopyVictimScript = () => {
    navigator.clipboard.writeText(currentVictimScript);
    setCopiedVictim(true);
    setTimeout(() => setCopiedVictim(false), 2500);
  };

  const handleCopyOfficerBrief = () => {
    navigator.clipboard.writeText(currentOfficerText);
    setCopiedOfficer(true);
    setTimeout(() => setCopiedOfficer(false), 2500);
  };

  return (
    <div className="p-4 rounded-xl bg-[#071018] border border-[#243443] space-y-3 font-sans">
      {/* Box Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#243443] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code flex items-center gap-1.5">
              <span>What this means</span>
            </h4>
            <div className="text-[10px] text-[#8EA1B2]">Automated plain-language threat narrative</div>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center bg-[#0D1721] p-0.5 rounded-lg border border-[#243443] font-mono-code text-[11px]">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              lang === 'en'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                : 'text-[#8EA1B2] hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              lang === 'hi'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                : 'text-[#8EA1B2] hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Plain-English Narrative */}
      <div className="text-xs text-white leading-relaxed bg-[#0D1721] p-3 rounded-lg border border-[#243443]/80 font-sans">
        {currentOfficerText}
      </div>

      {/* Footer Copy Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="text-[10px] text-[#8EA1B2] font-mono-code">
          {copiedVictim ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Victim SMS/Call Script Copied!
            </span>
          ) : copiedOfficer ? (
            <span className="text-[#38BDF8] font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Officer Brief Copied!
            </span>
          ) : (
            <span>Rule-based narrative • Jargon-free script available</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyOfficerBrief}
            className="bg-[#0D1721] hover:bg-[#111F2C] border border-[#243443] hover:border-[#8EA1B2] text-[#8EA1B2] hover:text-white px-2.5 py-1 rounded-md text-[11px] font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy plain-language officer narrative"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Brief</span>
          </button>

          <button
            onClick={handleCopyVictimScript}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold px-3 py-1 rounded-md text-[11px] font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
            title="Copy non-technical SMS/Call script for updating the victim"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Copy for victim update</span>
          </button>
        </div>
      </div>
    </div>
  );
};
