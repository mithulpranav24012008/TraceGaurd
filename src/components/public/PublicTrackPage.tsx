import React, { useState } from 'react';
import { Search, ShieldCheck, PhoneCall, ExternalLink, FileText, CheckCircle2, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MockCase } from '../../types';

interface PublicTrackPageProps {
  casesList?: MockCase[];
  onNavigateToOfficerSpace?: () => void;
}

interface CitizenSearchResult {
  referenceNumber: string;
  dateReported: string;
  status: 'Filed' | 'Under Review' | 'Escalated to Cyber Cell' | 'Referred to FIU' | 'Closed';
  statusColor: string;
  chain: string;
  summaryEn: string;
  summaryHi: string;
}

export const PublicTrackPage: React.FC<PublicTrackPageProps> = ({
  casesList = [],
  onNavigateToOfficerSpace
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<CitizenSearchResult | null>(null);

  // Pre-configured mock complaint statuses mapped by reference number or custom entry
  const knownComplaints: Record<string, CitizenSearchResult> = {
    'TG-2026-8841': {
      referenceNumber: 'TG-2026-8841',
      dateReported: '02 Sep 2026',
      status: 'Escalated to Cyber Cell',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      chain: 'Ethereum',
      summaryEn: 'Your complaint has been verified and escalated to the regional Cyber Crime Unit. Suspicious transaction flows are actively being monitored across participating exchange compliance hubs.',
      summaryHi: 'आपकी शिकायत को सत्यापित कर क्षेत्रीय साइबर क्राइम यूनिट को प्रेषित कर दिया गया है। संबंधित क्रिप्टो एक्सचेंजों पर संदिग्ध लेनदेन की निगरानी जारी है।'
    },
    'TG-2026-9042': {
      referenceNumber: 'TG-2026-9042',
      dateReported: '28 Aug 2026',
      status: 'Referred to FIU',
      statusColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      chain: 'Bitcoin',
      summaryEn: 'High-value movement patterns triggered an official FIU-IND regulatory referral. Automated asset preservation procedures have been queued for participating financial endpoints.',
      summaryHi: 'बड़ी राशि के संदिग्ध हस्तांतरण के कारण FIU-IND को आधिकारिक रेफरल भेजा गया है। संबंधित वित्तीय संस्थानों में संपत्ति सुरक्षा प्रोटोकॉल सक्रिय किए गए हैं।'
    },
    'TG-2026-7109': {
      referenceNumber: 'TG-2026-7109',
      dateReported: '04 Sep 2026',
      status: 'Under Review',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      chain: 'Polygon',
      summaryEn: 'Your filed complaint is under active preliminary triage by station officers. Telemetry cross-referencing is underway.',
      summaryHi: 'आपकी शिकायत वर्तमान में थाना अधिकारियों द्वारा प्रारंभिक समीक्षा के अधीन है। ऑन-चैन डेटा का सत्यापन किया जा रहा है।'
    },
    'TG-2026-4402': {
      referenceNumber: 'TG-2026-4402',
      dateReported: '15 Aug 2026',
      status: 'Closed',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-300',
      chain: 'BNB Smart Chain',
      summaryEn: 'Investigative report completed and submitted to central cyber repository. Legal notice issued to designated compliance officer.',
      summaryHi: 'जांच रिपोर्ट पूर्ण कर केंद्रीय साइबर रिपोजिटरी में जमा कर दी गई है। कानून प्रवर्तन एजेंसियों को रिपोर्ट भेज दी गई है।'
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);

    // 1. Direct match in pre-configured dict
    if (knownComplaints[query]) {
      setSearchResult(knownComplaints[query]);
      return;
    }

    // 2. Check if query matches any case in casesList
    const matchedCase = casesList.find(
      (c) => c.id.toUpperCase() === query || c.title.toUpperCase().includes(query)
    );

    if (matchedCase) {
      const statusMap: Record<string, 'Filed' | 'Under Review' | 'Escalated to Cyber Cell' | 'Referred to FIU' | 'Closed'> = {
        'Investigating': 'Under Review',
        'Attributed': 'Escalated to Cyber Cell',
        'Alerted': 'Referred to FIU'
      };
      setSearchResult({
        referenceNumber: matchedCase.id,
        dateReported: matchedCase.seedDetails.firstSeen || 'Recent',
        status: statusMap[matchedCase.status] || 'Under Review',
        statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        chain: matchedCase.blockchain,
        summaryEn: 'Your complaint is actively registered in the national investigation network. Telemetry nodes are monitoring for exchange deposit activity.',
        summaryHi: 'आपकी शिकायत राष्ट्रीय जांच नेटवर्क में पंजीकृत है। एक्सचेंज डिपॉजिट गतिविधियों पर लगातार नजर रखी जा रही है।'
      });
      return;
    }

    // 3. Fallback: If format looks like a TG case ID (or user entered any valid reference), generate a reassuring active result
    if (query.startsWith('TG-') || query.length >= 6) {
      setSearchResult({
        referenceNumber: query,
        dateReported: 'Active Complaint',
        status: 'Under Review',
        statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
        chain: 'Multi-Chain Telemetry',
        summaryEn: 'Complaint reference registered in station backlog. Active multi-factor risk assessment and telemetry cross-checks are currently underway.',
        summaryHi: 'शिकायत संदर्भ दर्ज किया गया है। वर्तमान में ऑन-चैन सत्यापन एवं बहु-कारक विश्लेषण जारी है।'
      });
      return;
    }

    setSearchResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900 pb-12">
      {/* Top Light Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              TG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  {t('track.portalTitle')}
                </span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-200 uppercase">
                  OFFICIAL CITIZEN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Ministry of Home Affairs / Indian Cybercrime Coordination Centre (I4C)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {onNavigateToOfficerSpace && (
              <button
                onClick={onNavigateToOfficerSpace}
                className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>Officer Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        {/* Portal Hero Section */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>24x7 Citizen Cyber Complaint Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('track.portalTitle')}
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            {t('track.portalSubtitle')}
          </p>
        </div>

        {/* Reference Search Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t('track.inputLabel')}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FileText className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('track.placeholder')}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-sky-500 focus:bg-white text-slate-900 rounded-xl pl-11 pr-4 py-3 text-sm outline-hidden font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t('track.checkButton')}</span>
              </button>
            </div>

            {/* Quick Demo Preset Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Sample Reference IDs:</span>
              {['TG-2026-8841', 'TG-2026-9042', 'TG-2026-7109', 'TG-2026-4402'].map((ref) => (
                <button
                  key={ref}
                  type="button"
                  onClick={() => {
                    setSearchInput(ref);
                    setHasSearched(true);
                    setSearchResult(knownComplaints[ref]);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-mono transition-colors cursor-pointer"
                >
                  {ref}
                </button>
              ))}
            </div>
          </form>

          {/* Privacy Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>{t('track.privacyNotice')}</p>
          </div>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {searchResult ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Result Top Bar */}
                <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t('track.referenceNumber')}
                    </span>
                    <h2 className="text-lg font-bold font-mono text-slate-900">
                      {searchResult.referenceNumber}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                      {t('track.dateReported')}: <strong className="text-slate-800">{searchResult.dateReported}</strong>
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${searchResult.statusColor}`}
                    >
                      {searchResult.status}
                    </span>
                  </div>
                </div>

                {/* Result Content */}
                <div className="p-6 space-y-6">
                  {/* Status Timeline Progress */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {t('track.currentStatus')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { label: 'Complaint Filed', done: true },
                        { label: 'Under Review', done: true },
                        { label: 'Cyber Cell Escalation', done: searchResult.status !== 'Filed' && searchResult.status !== 'Under Review' },
                        { label: 'Exchange & FIU Action', done: searchResult.status === 'Referred to FIU' || searchResult.status === 'Closed' }
                      ].map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center gap-2 font-medium ${
                            step.done
                              ? 'bg-sky-50 border-sky-200 text-sky-900'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              step.done ? 'text-sky-600' : 'text-slate-300'
                            }`}
                          />
                          <span>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reassuring Plain-Language Summary Box */}
                  <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span>{t('track.reassuringSummaryTitle')}</span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-sans">
                      {language === 'hi' ? searchResult.summaryHi : searchResult.summaryEn}
                    </p>
                  </div>

                  {/* Next Steps Guidance */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {t('track.whatHappensNext')}
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 font-sans">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          1
                        </span>
                        <span>{t('track.step1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          2
                        </span>
                        <span>{t('track.step2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          3
                        </span>
                        <span>{t('track.step3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">{t('track.notFound')}</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {t('track.notFoundDesc')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Persistent "Need Help?" Trust & Support Card */}
        <div className="bg-linear-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {t('track.helplineTitle')}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {t('track.helplineSubtitle')}
              </p>
            </div>

            <a
              href="tel:1930"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              <PhoneCall className="w-4 h-4 fill-slate-950" />
              <span>{t('track.callHelpline')}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <div className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                  National Cyber Crime Reporting Portal
                </div>
                <div className="text-[11px] text-slate-400">cybercrime.gov.in</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-300 shrink-0" />
            </a>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="font-semibold text-white">Emergency Asset Hold Protocols</div>
              <div className="text-[11px] text-slate-400">
                Participating Exchanges: WazirX, CoinDCX, Binance, ZebPay, KuCoin, Bitbns.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
