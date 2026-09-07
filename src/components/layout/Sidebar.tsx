import React from 'react';
import {
  Search,
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
  const navItems = [
    { id: 'investigation', label: 'Investigation', icon: Search },
    { id: 'cases', label: 'Case Files', icon: FolderSearch },
    { id: 'graph', label: 'Transaction Graph', icon: Network },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'pattern', label: 'Pattern Intelligence', icon: Radar },
    { id: 'attribution', label: 'Exchange Attribution', icon: Building2 },
    { id: 'alerts', label: 'Compliance Alerts', icon: Bell, badge: pendingAlertsCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  const systemStatus = [
    { name: 'Blockchain RPC Node', status: 'Online (Sync)' },
    { name: 'Exchange Compliance API', status: 'Connected' },
    { name: 'FIU / Freeze Gateway', status: 'Armed & Active' }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0D1721] border-r border-[#243443] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#243443] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#0284C7] p-0.5 shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#071018] rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
              <span>TraceGuard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            </div>
            <div className="text-[11px] text-[#8EA1B2] font-medium tracking-wide mt-1">
              Crypto Fraud Intelligence
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-[#8EA1B2] hover:text-white p-1 rounded hover:bg-[#111F2C]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono-code uppercase tracking-wider text-[#8EA1B2]/70">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#38BDF8]/10 text-white border border-[#38BDF8]/40 shadow-sm shadow-[#38BDF8]/5'
                  : 'text-[#8EA1B2] hover:bg-[#111F2C] hover:text-[#E7EEF5]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#38BDF8]' : 'text-[#8EA1B2]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {'badge' in item && Boolean(item.badge) && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Telemetry & Status */}
      <div className="p-4 border-t border-[#243443] bg-[#071018]/50 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-[#8EA1B2] font-mono-code">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
            SYSTEM MONITORS
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">ALL GREEN</span>
        </div>

        <div className="space-y-1.5">
          {systemStatus.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px] text-[#8EA1B2] font-mono-code"
            >
              <span className="truncate pr-2">{s.name}</span>
              <span className="flex items-center gap-1.5 text-emerald-400 shrink-0 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {s.status}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#243443]/60 flex items-center justify-between text-[10px] font-mono-code text-[#8EA1B2]/60">
          <span className="text-emerald-400 font-bold">MODE: LIVE GATEWAYS ENABLED</span>
          <span>LATENCY: ~12ms</span>
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
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
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
