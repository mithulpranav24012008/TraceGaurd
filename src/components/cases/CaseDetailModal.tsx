import React from 'react';
import { X, ImageOff, FileText, ShieldAlert } from 'lucide-react';
import { MockCase } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface CaseDetailModalProps {
  caseItem: MockCase | null;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseItem, onClose }) => {
  if (!caseItem) return null;

  const hasScreenshots =
    caseItem.evidenceScreenshots != null &&
    Array.isArray(caseItem.evidenceScreenshots) &&
    caseItem.evidenceScreenshots.length > 0;

  const primaryScreenshot = hasScreenshots
    ? caseItem.evidenceScreenshots![0]
    : caseItem.evidenceScreenshot || caseItem.seedDetails?.evidenceScreenshot;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto font-mono text-black"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FDFBF7] border-2 border-black rounded-2xl max-w-2xl w-full flex flex-col shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#FBBF24] border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black text-sm">{caseItem.id}</span>
            <RiskBadge level={caseItem.severity} score={caseItem.riskScore} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="text-black hover:bg-black/10 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs font-mono">
          <div>
            <h2 className="text-base font-bold text-black">{caseItem.title}</h2>
            <p className="text-black/80 text-xs mt-1">{caseItem.scenario}</p>
          </div>

          {/* Screenshot Evidence Guard */}
          <div className="space-y-2 pt-2 border-t-2 border-black">
            <div className="font-bold text-black uppercase tracking-wider text-[11px]">
              Scam Evidence Screenshot Attachment:
            </div>
            {primaryScreenshot ? (
              <div className="rounded-xl overflow-hidden border-2 border-black bg-slate-900 p-2 flex items-center justify-center">
                <img
                  src={primaryScreenshot}
                  alt="Scam Evidence Screenshot"
                  className="max-h-52 object-contain"
                />
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-center space-y-2">
                <ImageOff className="w-8 h-8 text-black/50 mx-auto" />
                <div className="text-xs font-bold text-black/70 uppercase">
                  No screenshots attached
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
