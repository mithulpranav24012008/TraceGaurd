import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, Check, RefreshCw, Globe2 } from 'lucide-react';
import { MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { useLanguage } from '../../context/useLanguage';

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
    <header className="bg-[#FDFBF7] border-b-2 border-black px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs font-mono">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-mono font-bold text-black tracking-tight flex items-center gap-2 uppercase">
              <span>{t('header.title')}</span>
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FBBF24] border border-black text-black shadow-[1px_1px_0px_0px_#000]">
              {t('header.version')}
            </span>
          </div>
          <p className="text-xs text-black/70 font-mono mt-0.5">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Language Selector Toggle Pill */}
        <div className="flex items-center bg-white p-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs text-black">
          <Globe2 className="w-3.5 h-3.5 text-black ml-1 mr-1" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
              language === 'hi'
                ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                : 'text-black hover:bg-black/10'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Case Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
            className="flex items-center gap-2 bg-white hover:bg-[#FEF9EF] border-2 border-black text-xs px-3 py-1.5 rounded-lg text-black font-mono font-bold shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
            aria-expanded={isCaseDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-black/70">{t('header.case')}</span>
            <span className="font-bold text-black underline">{currentCase.id}</span>
            <ChevronDown className="w-3.5 h-3.5 text-black" />
          </button>

          {isCaseDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsCaseDropdownOpen(false)} 
              />
              <div 
                className="absolute right-0 mt-1.5 w-72 bg-[#FDFBF7] border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000] p-1.5 z-50 space-y-1 font-mono text-xs text-black"
                role="listbox"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-black uppercase tracking-wider border-b-2 border-black">
                  Select Forensic Case
                </div>
                {casesList.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c);
                      setIsCaseDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition-colors cursor-pointer border border-transparent ${
                      currentCase.id === c.id
                        ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'text-black hover:bg-black/10 hover:border-black'
                    }`}
                    role="option"
                    aria-selected={currentCase.id === c.id}
                  >
                    <div>
                      <div className="font-mono font-bold flex items-center gap-2">
                        <span>{c.id}</span>
                        <span className={currentCase.id === c.id ? 'text-[#38BDF8]' : 'text-black/70'}>({c.blockchain})</span>
                      </div>
                      <div className={`text-[11px] truncate max-w-[200px] mt-0.5 ${currentCase.id === c.id ? 'text-white/80' : 'text-black/70'}`}>
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
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border-2 border-black text-xs font-mono font-bold text-black shadow-[2px_2px_0px_0px_#000]">
          <Clock className="w-3.5 h-3.5 text-black" />
          <span>{timeString || '2026-09-06 17:00:00 UTC'}</span>
        </div>

        {/* Reset Investigation */}
        <button
          onClick={onResetInvestigation}
          title="Reset Investigation & Return to Seed Stage"
          className="flex items-center gap-1.5 bg-white hover:bg-[#FEF9EF] border-2 border-black text-xs px-2.5 py-1.5 rounded-lg text-black font-mono font-bold shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-black" />
          <span className="hidden sm:inline">{t('header.reset')}</span>
        </button>

        {/* Environment Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#94D3AC] border-2 border-black text-black text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000]">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span>{t('header.liveGateways')}</span>
        </div>
      </div>
    </header>
  );
};
