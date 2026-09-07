import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DemoDisclaimerBanner } from './components/common/DemoDisclaimerBanner';
import { InvestigationPage } from './components/investigation/InvestigationPage';
import { TriageQueuePage } from './components/triage/TriageQueuePage';
import { CaseFilesPage } from './components/cases/CaseFilesPage';
import { TransactionGraphPage } from './components/investigation/TransactionGraphPage';
import { RiskIntelligencePage } from './components/analytics/RiskIntelligencePage';
import { PatternIntelligencePage } from './components/analytics/PatternIntelligencePage';
import { ExchangeAttributionPage } from './components/attribution/ExchangeAttributionPage';
import { ComplianceAlertsPage } from './components/alerts/ComplianceAlertsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { PublicTrackPage } from './components/public/PublicTrackPage';
import { NavigationTab, MockCase, ComplianceReferral } from './types';
import { MOCK_CASES, INITIAL_COMPLIANCE_REFERRALS } from './data/mockCases';
import { initRegistry } from './data/nationalRegistryStore';
import { Menu } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('investigation');
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Cases state with localStorage persistence
  const [casesList, setCasesList] = useState<MockCase[]>(() => {
    try {
      const stored = localStorage.getItem('traceguard_cases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return MOCK_CASES;
  });

  const [currentCase, setCurrentCase] = useState<MockCase>(casesList[0] || MOCK_CASES[0]);

  // Referrals state with localStorage persistence
  const [referrals, setReferrals] = useState<ComplianceReferral[]>(() => {
    try {
      const stored = localStorage.getItem('traceguard_referrals');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COMPLIANCE_REFERRALS;
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize the national pattern match registry on first render
  useEffect(() => {
    initRegistry();
  }, []);

  const handleSelectCase = (caseItem: MockCase) => {
    setCurrentCase(caseItem);
  };

  const handleUpdateCase = (updated: MockCase) => {
    setCurrentCase(updated);
    setCasesList((prev) => {
      const existsIndex = prev.findIndex(
        (c) => c.id === updated.id || c.seedDetails.address.toLowerCase() === updated.seedDetails.address.toLowerCase()
      );
      let nextList: MockCase[];
      if (existsIndex >= 0) {
        nextList = [...prev];
        nextList[existsIndex] = updated;
      } else {
        nextList = [updated, ...prev];
      }
      try {
        localStorage.setItem('traceguard_cases', JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
  };

  const handleAlertGenerated = (newReferral: ComplianceReferral) => {
    setReferrals((prev) => {
      const next = [newReferral, ...prev];
      try {
        localStorage.setItem('traceguard_referrals', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleBatchCasesCreated = (newCases: MockCase[]) => {
    setCasesList((prev) => {
      const next = [...newCases, ...prev];
      try {
        localStorage.setItem('traceguard_cases', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#94D3AC] text-black p-0 md:p-3 md:gap-3 font-mono">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingAlertsCount={referrals.length}
      />

      {/* Main Investigation Workspace Area Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#FDFBF7] md:border-2 md:border-black md:rounded-2xl md:shadow-[4px_4px_0px_0px_#000]">
        {/* Top Disclaimer Banner */}
        <DemoDisclaimerBanner />

        {/* Top Header */}
        <div className="relative">
          <Header
            currentCase={currentCase}
            casesList={casesList}
            onSelectCase={handleSelectCase}
            onResetInvestigation={() => {
              setCurrentStage(1);
              setActiveTab('investigation');
            }}
          />

          {/* Mobile menu trigger bar */}
          <div className="md:hidden bg-[#FBBF24] border-b-2 border-black px-4 py-2 flex items-center justify-between text-black font-mono font-bold">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-mono font-bold text-black p-1 rounded-md border border-black bg-white shadow-[1px_1px_0px_0px_#000]"
            >
              <Menu className="w-4 h-4 text-black" />
              <span>NAVIGATION MENU</span>
            </button>
            <span className="text-xs font-mono font-bold text-black bg-white border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
              {activeTab.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Viewport Content Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#FDFBF7]">
          {activeTab === 'track' && (
            <PublicTrackPage
              casesList={casesList}
              onNavigateToOfficerSpace={() => setActiveTab('investigation')}
            />
          )}

          {activeTab === 'triage' && (
            <TriageQueuePage
              onSelectCase={handleSelectCase}
              onNavigateToInvestigation={() => setActiveTab('investigation')}
              onCasesUpdated={handleBatchCasesCreated}
            />
          )}

          {activeTab === 'investigation' && (
            <InvestigationPage
              currentCase={currentCase}
              currentStage={currentStage}
              onStageChange={setCurrentStage}
              onUpdateCase={handleUpdateCase}
              onSelectCase={handleSelectCase}
              onAlertGenerated={handleAlertGenerated}
            />
          )}

          {activeTab === 'cases' && (
            <CaseFilesPage
              casesList={casesList}
              onSelectCase={handleSelectCase}
              onNavigateToInvestigation={() => setActiveTab('investigation')}
              onUpdateCase={handleUpdateCase}
            />
          )}

          {activeTab === 'graph' && (
            <TransactionGraphPage
              currentCase={currentCase}
              casesList={casesList}
              onSelectCase={handleSelectCase}
              onNavigateToInvestigation={() => setActiveTab('investigation')}
            />
          )}

          {activeTab === 'risk' && <RiskIntelligencePage casesList={casesList} />}

          {activeTab === 'pattern' && <PatternIntelligencePage />}

          {activeTab === 'attribution' && <ExchangeAttributionPage casesList={casesList} />}

          {activeTab === 'alerts' && (
            <ComplianceAlertsPage referrals={referrals} />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              casesList={casesList}
              onUpdateCase={handleUpdateCase}
            />
          )}

          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}

export default App;
