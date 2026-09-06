import React from 'react';
import { Network, ChevronDown } from 'lucide-react';
import { MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { TransactionGraph } from './TransactionGraph';

interface TransactionGraphPageProps {
  currentCase: MockCase;
  onSelectCase: (c: MockCase) => void;
  onNavigateToInvestigation: () => void;
}

export const TransactionGraphPage: React.FC<TransactionGraphPageProps> = ({
  currentCase,
  onSelectCase,
  onNavigateToInvestigation
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4 select-none">
      {/* Header and Case Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-[#38BDF8]" />
            <span>Forensic Transaction Graph Canvas</span>
          </h1>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            Full-canvas interactive link analysis, particle flow simulation, and multi-hop node inspection.
          </p>
        </div>

        {/* Case selector chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono-code text-[#8EA1B2]">Select Case:</span>
          {MOCK_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-colors cursor-pointer border ${
                currentCase.id === c.id
                  ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#38BDF8] font-bold'
                  : 'bg-[#0D1721] border-[#243443] text-[#8EA1B2] hover:text-white hover:border-[#8EA1B2]'
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Transaction Graph */}
      <TransactionGraph
        caseData={currentCase}
        showContinueButton={false}
      />
    </div>
  );
};
