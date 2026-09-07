import React from 'react';
import { MockCase } from '../../types';
import { ShieldCheck, Info, AlertTriangle } from 'lucide-react';

interface PublicStatusPageProps {
  caseData?: MockCase | null;
  onBack?: () => void;
}

export const PublicStatusPage: React.FC<PublicStatusPageProps> = ({ caseData, onBack }) => {
  let renderedContent: React.ReactNode;

  try {
    const rawExplanation = caseData?.plainLanguageExplanation;
    const explanationText =
      typeof rawExplanation === 'string' && rawExplanation.trim().length > 0
        ? rawExplanation.toLowerCase()
        : 'generic complaint status: actively monitored across multi-chain telemetry nodes.';

    const caseId = caseData?.id || 'TG-2026-GENERIC';
    const caseTitle = caseData?.title || 'Active Cyber Complaint Tracking Record';

    renderedContent = (
      <div className="max-w-3xl mx-auto p-6 space-y-6 font-mono text-black">
        {/* Header */}
        <div className="p-4 rounded-xl bg-[#FBBF24] border-2 border-black flex items-center justify-between shadow-[4px_4px_0px_0px_#000]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider">Public Status Report</span>
            <h1 className="text-lg font-bold">{caseId}</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white hover:bg-slate-100 text-black font-bold px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs cursor-pointer"
            >
              Back
            </button>
          )}
        </div>

        {/* Case Title & Explanation */}
        <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
          <h2 className="text-base font-bold text-black">{caseTitle}</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded-lg border border-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
            <span className="capitalize">{explanationText}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-[#FEF9EF] border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-black" />
            <span>Telemetry Protection Status:</span>
          </div>
          <p className="text-black/80">
            Automated monitoring node active. Compliant exchanges notified under standard protocol.
          </p>
        </div>
      </div>
    );
  } catch {
    renderedContent = (
      <div className="max-w-md mx-auto p-6 rounded-xl bg-red-100 border-2 border-black text-center space-y-3 font-mono">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="text-sm font-bold text-red-900 uppercase">Status Render Error</h3>
        <p className="text-xs text-red-800">
          Generic status message: Active telemetry monitoring in progress.
        </p>
      </div>
    );
  }

  return <div className="min-h-screen bg-[#FDFBF7] py-8">{renderedContent}</div>;
};
