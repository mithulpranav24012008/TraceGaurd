import React, { useState } from 'react';
import { Bell, Search, FileText, Copy, Check } from 'lucide-react';
import { ComplianceReferral, MockCase } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ReportModal } from '../common/ReportModal';
import { getCaseById } from '../../data/mockCases';
import { useLanguage } from '../../context/useLanguage';

interface ComplianceAlertsPageProps {
  referrals: ComplianceReferral[];
  casesList?: MockCase[];
}

export const ComplianceAlertsPage: React.FC<ComplianceAlertsPageProps> = ({
  referrals,
  casesList = []
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseForReport, setSelectedCaseForReport] = useState<MockCase | null>(null);
  const [selectedReferralForReport, setSelectedReferralForReport] = useState<ComplianceReferral | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const filteredReferrals = referrals.filter(
    (ref) =>
      ref.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.exchange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.suspectAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (refNumber: string) => {
    navigator.clipboard.writeText(refNumber);
    setCopiedRef(refNumber);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleOpenReport = (ref: ComplianceReferral) => {
    const matchedCase = casesList.find((c) => c.id === ref.caseId) || getCaseById(ref.caseId);
    setSelectedCaseForReport(matchedCase);
    setSelectedReferralForReport(ref);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#38BDF8]" />
            <span>{t('alerts.title')}</span>
          </h1>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            {t('alerts.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-code text-xs">
          <span className="p-2 rounded-lg bg-[#0D1721] border border-[#243443] text-[#8EA1B2]">
            {t('alerts.totalReferrals')}: <strong className="text-white">{referrals.length}</strong>
          </span>
          <span className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            SIMULATION ONLY
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0D1721] border border-[#243443] flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8EA1B2] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by referral reference (e.g. FIU-DEMO-), case ID, or exchange..."
            className="w-full bg-[#071018] border border-[#243443] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg pl-9 pr-3 py-2 text-xs font-mono-code text-white placeholder-[#586C7E] outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-[#0D1721] border border-[#243443] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-[#111F2C] border-b border-[#243443] text-[10px] text-[#8EA1B2] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">{t('alerts.referralId')}</th>
                <th className="px-4 py-3">{t('alerts.caseRef')}</th>
                <th className="px-4 py-3">Threat Tier</th>
                <th className="px-4 py-3">{t('alerts.exchange')} & {t('alerts.suspiciousAmount')}</th>
                <th className="px-4 py-3">{t('alerts.date')}</th>
                <th className="px-4 py-3">{t('alerts.status')}</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243443]/60 text-[#E7EEF5]">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8EA1B2]">
                    No compliance referrals recorded yet. Run Stage 7 in an investigation to dispatch an alert.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-[#111F2C]/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{ref.referenceNumber}</span>
                        <button
                          onClick={() => handleCopy(ref.referenceNumber)}
                          className="text-[#8EA1B2] hover:text-[#38BDF8] p-1 cursor-pointer"
                          title="Copy reference number"
                        >
                          {copiedRef === ref.referenceNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-[#8EA1B2] mt-0.5">{ref.recipient}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-[#38BDF8] font-bold">{ref.caseId}</div>
                      <div className="text-[10px] text-[#8EA1B2] mt-0.5">{ref.blockchain}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <RiskBadge level={ref.riskLevel} score={ref.riskScore} size="sm" />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-white font-semibold">{ref.exchange}</div>
                      <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                        {ref.suspiciousAmount}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-white text-xs">{ref.timestamp}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {ref.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenReport(ref)}
                        className="bg-[#071018] hover:bg-[#38BDF8] text-[#8EA1B2] hover:text-slate-950 px-2.5 py-1.5 rounded-lg border border-[#243443] hover:border-[#38BDF8] transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {selectedCaseForReport && (
        <ReportModal
          caseData={selectedCaseForReport}
          referral={selectedReferralForReport}
          onClose={() => {
            setSelectedCaseForReport(null);
            setSelectedReferralForReport(null);
          }}
        />
      )}
    </div>
  );
};
