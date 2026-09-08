import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, MessageSquare } from 'lucide-react';
import { RiskLevel, RiskComponents, ExchangeAttribution, PatternMatchResult } from '../../types';
import { generateRiskExplanation } from '../../utils/explanationGenerator';
import { useLanguage } from '../../context/useLanguage';

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
  attribution
}) => {
  const { language: globalLang, t } = useLanguage();
  const [lang, setLang] = useState<'en' | 'hi'>(globalLang);
  const [copiedVictim, setCopiedVictim] = useState(false);
  const [copiedOfficer, setCopiedOfficer] = useState(false);

  useEffect(() => {
    setLang(globalLang);
  }, [globalLang]);

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
    <div className="neo-card p-4 space-y-3 font-mono">
      {/* Box Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FBBF24] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <span>{t('explanationBox.whatThisMeans')}</span>
            </h4>
            <div className="text-[10px] text-black/70 font-mono">{t('explanationBox.threatNarrativeSubtitle')}</div>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center bg-white p-0.5 rounded-lg border-2 border-black font-mono text-[11px] shadow-[1px_1px_0px_0px_#000]">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              lang === 'en'
                ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              lang === 'hi'
                ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Plain-English Narrative */}
      <div className="text-xs text-black leading-relaxed bg-[#FDFBF7] p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono font-bold">
        {currentOfficerText}
      </div>

      {/* Footer Copy Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="text-[10px] text-black/75 font-mono font-bold">
          {copiedVictim ? (
            <span className="text-green-700 font-bold flex items-center gap-1">
              <Check className="w-3 h-3 text-green-700" /> {t('explanationBox.victimScriptCopied')}
            </span>
          ) : copiedOfficer ? (
            <span className="text-black font-bold flex items-center gap-1">
              <Check className="w-3 h-3 text-black" /> {t('explanationBox.officerBriefCopied')}
            </span>
          ) : (
            <span>{t('explanationBox.ruleBasedNarrative')}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyOfficerBrief}
            className="neo-btn-sec px-2.5 py-1 text-[11px] flex items-center gap-1.5"
            title="Copy plain-language officer narrative"
          >
            <Copy className="w-3 h-3" />
            <span>{t('explanationBox.copyBrief')}</span>
          </button>

          <button
            onClick={handleCopyVictimScript}
            className="neo-btn px-3 py-1 text-[11px] flex items-center gap-1.5"
            title="Copy non-technical SMS/Call script for updating the victim"
          >
            <MessageSquare className="w-3 h-3" />
            <span>{t('explanationBox.copyVictimUpdate')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
