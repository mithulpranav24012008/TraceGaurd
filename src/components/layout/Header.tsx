import React, { useState, useEffect } from 'react';
import { Shield, Clock, AlertTriangle, ChevronDown, Check, RefreshCw, Globe2 } from 'lucide-react';
import { MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  currentCase: MockCase;
  casesList?: MockCase[];
  onSelectCase: (caseItem: MockCase) => void;
  onResetInvestigation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  casesList = MOCK_CASES,
  onSelectCase,
  onResetInvestigation
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0D1721] border-b border-[#243443] px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span>{t('header.title')}</span>
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono-code font-medium bg-[#111F2C] border border-[#243443] text-[#38BDF8]">
              {t('header.version')}
            </span>
          </div>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Language Selector Toggle Pill */}
        <div className="flex items-center bg-[#071018] p-1 rounded-lg border border-[#243443] font-mono-code text-xs">
          <Globe2 className="w-3.5 h-3.5 text-[#38BDF8] ml-1.5 mr-1" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                : 'text-[#8EA1B2] hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              language === 'hi'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                : 'text-[#8EA1B2] hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Case Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
            className="flex items-center gap-2 bg-[#111F2C] hover:bg-[#162636] border border-[#243443] hover:border-[#38BDF8]/60 text-xs px-3 py-1.5 rounded-lg text-white font-mono-code transition-colors cursor-pointer"
            aria-expanded={isCaseDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-[#8EA1B2]">{t('header.case')}</span>
            <span className="font-semibold text-[#38BDF8]">{currentCase.id}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8EA1B2]" />
          </button>

          {isCaseDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsCaseDropdownOpen(false)} 
              />
              <div 
                className="absolute right-0 mt-1.5 w-72 bg-[#0D1721] border border-[#243443] rounded-lg shadow-2xl p-1.5 z-50 space-y-1 font-sans text-xs"
                role="listbox"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-mono-code text-[#8EA1B2] uppercase tracking-wider border-b border-[#243443]/60">
                  Select Forensic Case
                </div>
                {casesList.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c);
                      setIsCaseDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                      currentCase.id === c.id
                        ? 'bg-[#38BDF8]/10 text-white border border-[#38BDF8]/30'
                        : 'text-[#8EA1B2] hover:bg-[#111F2C] hover:text-white'
                    }`}
                    role="option"
                    aria-selected={currentCase.id === c.id}
                  >
                    <div>
                      <div className="font-mono-code font-semibold text-white flex items-center gap-2">
                        <span>{c.id}</span>
                        <span className="text-[10px] text-[#38BDF8]">({c.blockchain})</span>
                      </div>
                      <div className="text-[11px] text-[#8EA1B2] truncate max-w-[200px] mt-0.5">
                        {c.scenario}
                      </div>
                    </div>
                    {currentCase.id === c.id && (
                      <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Live UTC Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#071018] border border-[#243443] text-xs font-mono-code text-[#8EA1B2]">
          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>{timeString || '2026-09-06 17:00:00 UTC'}</span>
        </div>

        {/* Reset Investigation */}
        <button
          onClick={onResetInvestigation}
          title="Reset Investigation & Return to Seed Stage"
          className="flex items-center gap-1.5 bg-[#111F2C] hover:bg-[#162636] border border-[#243443] hover:border-[#8EA1B2] text-xs px-2.5 py-1.5 rounded-lg text-[#8EA1B2] hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('header.reset')}</span>
        </button>

        {/* Environment Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t('header.liveGateways')}</span>
        </div>
      </div>
    </header>
  );
};
