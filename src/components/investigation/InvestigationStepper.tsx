import React from 'react';
import { Check, Play, Pause } from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  label: string;
}

interface InvestigationStepperProps {
  stages: Stage[];
  currentStage: number;
  maxReachedStage: number;
  onSelectStage: (stageId: number) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  loadingMessage?: string;
}

export const InvestigationStepper: React.FC<InvestigationStepperProps> = ({
  stages,
  currentStage,
  maxReachedStage,
  onSelectStage,
  isAutoPlaying,
  onToggleAutoPlay,
  loadingMessage
}) => {
  return (
    <div className="bg-[#0D1721] border-b border-[#243443] px-6 py-3.5 select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Stepper Steps */}
        <nav aria-label="Investigation stages" className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {stages.map((stage, idx) => {
            const isCurrent = currentStage === stage.id;
            const isCompleted = maxReachedStage > stage.id;
            const isAccessible = stage.id <= maxReachedStage;

            return (
              <React.Fragment key={stage.id}>
                {idx > 0 && (
                  <div
                    className={`h-[1px] w-3 sm:w-6 transition-colors duration-200 shrink-0 ${
                      stage.id <= maxReachedStage ? 'bg-[#38BDF8]/60' : 'bg-[#243443]'
                    }`}
                  />
                )}

                <button
                  onClick={() => isAccessible && onSelectStage(stage.id)}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#38BDF8]/15 text-white border border-[#38BDF8]/50 shadow-sm shadow-[#38BDF8]/10'
                      : isCompleted
                      ? 'bg-[#111F2C] text-[#E7EEF5] border border-[#243443] hover:border-[#38BDF8]/40'
                      : 'text-[#8EA1B2]/60 border border-transparent cursor-not-allowed'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono-code font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#38BDF8] text-slate-950 shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-[#111F2C] text-[#8EA1B2] border border-[#243443]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : stage.id}
                  </div>
                  <span className="whitespace-nowrap font-mono-code text-[11px]">{stage.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Simulation Auto-Play / Status Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {loadingMessage && (
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-md border border-[#38BDF8]/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>{loadingMessage}</span>
            </div>
          )}

          <button
            onClick={onToggleAutoPlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-medium border transition-colors cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-[#111F2C] border-[#243443] text-[#8EA1B2] hover:text-white hover:border-[#38BDF8]'
            }`}
            title={isAutoPlaying ? 'Pause Automated Investigation' : 'Run Full Automated Pipeline'}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Auto-Trace</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#38BDF8]" />
                <span>Auto-Simulate All</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
