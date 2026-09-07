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
    <div className="flex h-screen w-screen overflow-hidden bg-[#071018] text-[#E7EEF5]">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingAlertsCount={referrals.length}
      />

      {/* Main Investigation Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Disclaimer Banner */}
        <DemoDisclaimerBanner />

        {/* Top Header */}
        <div className="relative">
          <Header
            currentCase={currentCase}
            casesList={casesList}
            onSelectCase={handleSelectCase}
            onResetInvestigation={() => {
              setActiveTab('investigation');
            }}
          />

          {/* Mobile menu trigger bar */}
          <div className="md:hidden bg-[#0D1721] border-b border-[#243443] px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-mono-code text-[#8EA1B2] hover:text-white p-1 rounded hover:bg-[#111F2C]"
            >
              <Menu className="w-4 h-4 text-[#38BDF8]" />
              <span>NAVIGATION MENU</span>
            </button>
            <span className="text-xs font-mono-code text-[#38BDF8] font-bold">
              {activeTab.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto bg-[#071018]">
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
              onSelectCase={handleSelectCase}
              onNavigateToInvestigation={() => setActiveTab('investigation')}
            />
          )}

          {activeTab === 'risk' && <RiskIntelligencePage />}

          {activeTab === 'pattern' && <PatternIntelligencePage />}

          {activeTab === 'attribution' && <ExchangeAttributionPage />}

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
