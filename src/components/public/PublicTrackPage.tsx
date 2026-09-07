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
    <div className="min-h-screen bg-[#FDFBF7] text-black font-mono select-none pb-12 p-2 sm:p-4">
      {/* Top Light Header Banner */}
      <header className="neo-card-yellow p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] text-lg">
            TG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-black text-base tracking-tight uppercase">
                {t('track.portalTitle')}
              </span>
              <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-black uppercase shadow-[1px_1px_0px_0px_#000]">
                OFFICIAL CITIZEN PORTAL
              </span>
            </div>
            <p className="text-xs text-black/80 font-mono hidden sm:block">
              Ministry of Home Affairs / Indian Cybercrime Coordination Centre (I4C)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {onNavigateToOfficerSpace && (
            <button
              onClick={onNavigateToOfficerSpace}
              className="hidden md:flex items-center gap-1.5 neo-btn-sec px-3 py-1.5 text-xs"
            >
              <span>Officer Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 pt-2 space-y-8">
        {/* Portal Hero Section */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 bg-[#94D3AC] text-black border-2 border-black px-3 py-1 rounded-full text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000]">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>24x7 Citizen Cyber Complaint Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-black uppercase tracking-tight">
            {t('track.portalTitle')}
          </h1>
          <p className="text-black/80 font-mono text-sm max-w-xl mx-auto leading-relaxed">
            {t('track.portalSubtitle')}
          </p>
        </div>

        {/* Reference Search Card */}
        <div className="neo-card p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black">
              {t('track.inputLabel')}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FileText className="w-5 h-5 absolute left-3.5 top-3 text-black" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('track.placeholder')}
                  className="w-full neo-input pl-11 py-2.5 font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="neo-btn px-6 py-2.5 text-sm flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-white" />
                <span>{t('track.checkButton')}</span>
              </button>
            </div>

            {/* Quick Demo Preset Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-black font-mono font-bold">
              <span className="text-black/80">Sample Reference IDs:</span>
              {['TG-2026-8841', 'TG-2026-9042', 'TG-2026-7109', 'TG-2026-4402'].map((ref) => (
                <button
                  key={ref}
                  type="button"
                  onClick={() => {
                    setSearchInput(ref);
                    setHasSearched(true);
                    setSearchResult(knownComplaints[ref]);
                  }}
                  className="bg-white hover:bg-[#FEF9EF] text-black px-2.5 py-1 rounded-md border-2 border-black font-mono font-bold shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
                >
                  {ref}
                </button>
              ))}
            </div>
          </form>

          {/* Privacy Notice */}
          <div className="p-3.5 rounded-xl bg-[#FEF9EF] border-2 border-black text-xs text-black font-mono font-bold flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#000]">
            <Lock className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <p>{t('track.privacyNotice')}</p>
          </div>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {searchResult ? (
              <div className="neo-card overflow-hidden">
                {/* Result Top Bar */}
                <div className="bg-[#FBBF24] border-b-2 border-black px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono font-bold">
                  <div>
                    <span className="text-xs font-bold text-black uppercase tracking-wider">
                      {t('track.referenceNumber')}
                    </span>
                    <h2 className="text-lg font-bold font-mono text-black">
                      {searchResult.referenceNumber}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-black font-bold">
                      {t('track.dateReported')}: <strong className="underline">{searchResult.dateReported}</strong>
                    </span>
                    <span
                      className="text-xs font-mono font-bold px-3 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_#000] bg-white text-black"
                    >
                      {searchResult.status}
                    </span>
                  </div>
                </div>

                {/* Result Content */}
                <div className="p-6 space-y-6 font-mono">
                  {/* Status Timeline Progress */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
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
                          className={`p-3 rounded-xl border-2 border-black flex items-center gap-2 font-mono font-bold shadow-[2px_2px_0px_0px_#000] ${
                            step.done
                              ? 'bg-[#94D3AC] text-black'
                              : 'bg-white text-black/50'
                          }`}
                        >
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 text-black"
                          />
                          <span>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reassuring Plain-Language Summary Box */}
                  <div className="p-5 rounded-xl bg-[#FDFBF7] border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-black uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>{t('track.reassuringSummaryTitle')}</span>
                    </div>
                    <p className="text-sm text-black leading-relaxed font-mono font-bold">
                      {language === 'hi' ? searchResult.summaryHi : searchResult.summaryEn}
                    </p>
                  </div>

                  {/* Next Steps Guidance */}
                  <div className="space-y-3 pt-2 border-t-2 border-black">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                      {t('track.whatHappensNext')}
                    </h3>
                    <ul className="space-y-2 text-xs text-black font-mono font-bold">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center shrink-0 text-[10px] border border-black shadow-[1px_1px_0px_0px_#000]">
                          1
                        </span>
                        <span>{t('track.step1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center shrink-0 text-[10px] border border-black shadow-[1px_1px_0px_0px_#000]">
                          2
                        </span>
                        <span>{t('track.step2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-black text-white font-bold flex items-center justify-center shrink-0 text-[10px] border border-black shadow-[1px_1px_0px_0px_#000]">
                          3
                        </span>
                        <span>{t('track.step3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="neo-card-pink p-8 text-center space-y-3 font-mono">
                <AlertTriangle className="w-10 h-10 text-black mx-auto" />
                <h3 className="text-base font-bold text-black uppercase">{t('track.notFound')}</h3>
                <p className="text-xs text-black/80 max-w-md mx-auto font-bold">
                  {t('track.notFoundDesc')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Persistent "Need Help?" Trust & Support Card */}
        <div className="neo-card-yellow p-6 sm:p-8 space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-5">
            <div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-black" />
                <h3 className="text-lg font-bold text-black uppercase tracking-tight">
                  {t('track.helplineTitle')}
                </h3>
              </div>
              <p className="text-xs text-black/80 font-mono mt-1">
                {t('track.helplineSubtitle')}
              </p>
            </div>

            <a
              href="tel:1930"
              className="neo-btn px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>{t('track.callHelpline')}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FEF9EF] transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <div className="font-bold text-black group-hover:underline">
                  National Cyber Crime Reporting Portal
                </div>
                <div className="text-[11px] text-black/70">cybercrime.gov.in</div>
              </div>
              <ExternalLink className="w-4 h-4 text-black shrink-0" />
            </a>

            <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-1 font-mono">
              <div className="font-bold text-black">Emergency Asset Hold Protocols</div>
              <div className="text-[11px] text-black/80">
                Participating Exchanges: WazirX, CoinDCX, Binance, ZebPay, KuCoin, Bitbns.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
