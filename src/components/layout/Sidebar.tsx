import React from 'react';
import {
  Inbox,
  Search,
  SearchCheck,
  FolderSearch,
  Network,
  ShieldAlert,
  Radar,
  Building2,
  Bell,
  FileText,
  Settings,
  ShieldCheck,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  pendingAlertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  pendingAlertsCount = 2
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'track', label: t('nav.track'), icon: SearchCheck },
    { id: 'triage', label: t('nav.triage'), icon: Inbox },
    { id: 'investigation', label: t('nav.investigation'), icon: Search },
    { id: 'cases', label: t('nav.cases'), icon: FolderSearch },
    { id: 'graph', label: t('nav.graph'), icon: Network },
    { id: 'risk', label: t('nav.risk'), icon: ShieldAlert },
    { id: 'pattern', label: t('nav.pattern'), icon: Radar },
    { id: 'attribution', label: t('nav.attribution'), icon: Building2 },
    { id: 'alerts', label: t('nav.alerts'), icon: Bell, badge: pendingAlertsCount },
    { id: 'reports', label: t('nav.reports'), icon: FileText },
    { id: 'settings', label: t('nav.settings'), icon: Settings }
  ] as const;

  const systemStatus = [
    { name: 'Blockchain RPC Node', status: 'Online (Sync)' },
    { name: 'Exchange Compliance API', status: 'Connected' },
    { name: 'FIU / Freeze Gateway', status: 'Armed & Active' }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#94D3AC] border-r-2 border-black select-none font-mono">
      {/* Brand Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between bg-[#94D3AC]">
        <div className="flex items-center gap-2.5">
          <div className="bg-black text-white font-mono font-bold text-sm px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
            <span className="text-[#38BDF8]">&lt;/&gt;</span>
            <span>TraceGuard</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-black hover:bg-black/10 p-1 rounded-md border border-black"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black/70">
          Investigation Core
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id as NavigationTab);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_#000]'
                  : 'text-black hover:bg-black/10 border-2 border-transparent hover:border-black'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#38BDF8]' : 'text-black'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {'badge' in item && Boolean(item.badge) && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBBF24] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Telemetry & Status */}
      <div className="p-3 border-t-2 border-black bg-[#94D3AC] space-y-2">
        <div className="bg-[#FDFBF7] border-2 border-black rounded-lg p-2.5 shadow-[2px_2px_0px_0px_#000] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-black font-mono font-bold border-b border-black/20 pb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-black" />
              MONITORS
            </span>
            <span className="text-[10px] bg-[#94D3AC] px-1.5 py-0.5 rounded border border-black text-black">ONLINE</span>
          </div>

          <div className="space-y-1">
            {systemStatus.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[10px] text-black/80 font-mono"
              >
                <span className="truncate pr-1">{s.name}</span>
                <span className="flex items-center gap-1 text-black font-bold shrink-0 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-black/20 flex items-center justify-between text-[9px] font-mono text-black font-bold">
            <span>LIVE GATEWAYS</span>
            <span>~12ms</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
