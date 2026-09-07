import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DemoDisclaimerBanner } from './components/common/DemoDisclaimerBanner';
import { InvestigationPage } from './components/investigation/InvestigationPage';
import { CaseFilesPage } from './components/cases/CaseFilesPage';
import { TransactionGraphPage } from './components/investigation/TransactionGraphPage';
import { RiskIntelligencePage } from './components/analytics/RiskIntelligencePage';
import { PatternIntelligencePage } from './components/analytics/PatternIntelligencePage';
import { ExchangeAttributionPage } from './components/attribution/ExchangeAttributionPage';
import { ComplianceAlertsPage } from './components/alerts/ComplianceAlertsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { NavigationTab, MockCase, ComplianceReferral } from './types';
import { MOCK_CASES, INITIAL_COMPLIANCE_REFERRALS } from './data/mockCases';
import { initRegistry } from './data/nationalRegistryStore';
import { Menu } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('investigation');
  const [currentCase, setCurrentCase] = useState<MockCase>(MOCK_CASES[0]);
  const [referrals, setReferrals] = useState<ComplianceReferral[]>(INITIAL_COMPLIANCE_REFERRALS);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize the national pattern match registry on first render
  useEffect(() => {
    initRegistry();
  }, []);

  const handleSelectCase = (caseItem: MockCase) => {
    setCurrentCase(caseItem);
  };

  const handleAlertGenerated = (newReferral: ComplianceReferral) => {
    setReferrals((prev) => [newReferral, ...prev]);
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
          {activeTab === 'investigation' && (
            <InvestigationPage
              currentCase={currentCase}
              onUpdateCase={(updated) => setCurrentCase(updated)}
              onSelectCase={handleSelectCase}
              onAlertGenerated={handleAlertGenerated}
            />
          )}

          {activeTab === 'cases' && (
            <CaseFilesPage
              onSelectCase={handleSelectCase}
              onNavigateToInvestigation={() => setActiveTab('investigation')}
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

          {activeTab === 'reports' && <ReportsPage />}

          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}

export default App;
