import React, { useState } from 'react';
import { Settings, Shield, Sliders, Monitor, RefreshCw, Check, Globe, Building2, Lock, Zap, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetToDefaults = () => {
    resetSettings();
    handleSave();
  };

  const handleSwitchKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#38BDF8]" />
            <span>Platform Settings & Accessibility Configuration</span>
          </h1>
          <p className="text-xs text-[#8EA1B2] mt-0.5">
            Configure live blockchain nodes, exchange compliance webhooks, heuristic risk sensitivity, and accessibility preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Configuration Saved
            </span>
          )}
          <button
            onClick={handleResetToDefaults}
            className="bg-[#0D1721] hover:bg-[#111F2C] border border-[#243443] hover:border-[#8EA1B2] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none text-[#8EA1B2] hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Accessibility & SOC Theme Options */}
        <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] space-y-4">
          <div className="border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#38BDF8]" />
              <span>Accessibility & Theme Controls</span>
            </h2>
            <p className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
              Preferences persist across navigation and page refreshes.
            </p>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div>
                <div className="text-white font-semibold">Reduced Motion Mode</div>
                <div className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
                  Disables background pulse animations and smooth transitions for cognitive accessibility.
                </div>
              </div>
              <button
                onClick={() => {
                  updateSettings({ reducedMotion: !settings.reducedMotion });
                  handleSave();
                }}
                onKeyDown={(e) => handleSwitchKeyDown(e, () => {
                  updateSettings({ reducedMotion: !settings.reducedMotion });
                  handleSave();
                })}
                className={`px-3 py-1.5 rounded text-xs font-bold border focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors cursor-pointer ${
                  settings.reducedMotion
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443]'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label="Toggle Reduced Motion Mode"
              >
                {settings.reducedMotion ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div>
                <div className="text-white font-semibold">High Contrast SOC Theme</div>
                <div className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
                  Increases border weights and text contrast ratios for enhanced readability in low-light SOC rooms.
                </div>
              </div>
              <button
                onClick={() => {
                  updateSettings({ highContrast: !settings.highContrast });
                  handleSave();
                }}
                onKeyDown={(e) => handleSwitchKeyDown(e, () => {
                  updateSettings({ highContrast: !settings.highContrast });
                  handleSave();
                })}
                className={`px-3 py-1.5 rounded text-xs font-bold border focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors cursor-pointer ${
                  settings.highContrast
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443]'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label="Toggle High Contrast SOC Theme"
              >
                {settings.highContrast ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Heuristic Risk Thresholds */}
        <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] space-y-4">
          <div className="border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#38BDF8]" />
              <span>Risk Score Sensitivity Calibration</span>
            </h2>
            <p className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
              Adjust score boundaries. Updating these sliders immediately updates threat tier evaluations and badges across all views.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-code text-xs">
            {/* Critical */}
            <div className="p-3.5 rounded-lg bg-[#071018] border border-[#243443] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold uppercase">CRITICAL TIER</span>
                <span className="text-white font-bold">{settings.criticalThreshold}+</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                value={settings.criticalThreshold}
                onChange={(e) => {
                  updateSettings({ criticalThreshold: Number(e.target.value) });
                  handleSave();
                }}
                className="w-full accent-red-500 focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none cursor-pointer"
                aria-label="Critical Risk Threshold Slider"
              />
              <div className="text-[10px] text-[#8EA1B2]">Triggers immediate SAR referral</div>
            </div>

            {/* High */}
            <div className="p-3.5 rounded-lg bg-[#071018] border border-[#243443] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-orange-400 font-bold uppercase">HIGH TIER</span>
                <span className="text-white font-bold">{settings.highThreshold}+</span>
              </div>
              <input
                type="range"
                min="50"
                max="75"
                value={settings.highThreshold}
                onChange={(e) => {
                  updateSettings({ highThreshold: Number(e.target.value) });
                  handleSave();
                }}
                className="w-full accent-orange-500 focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none cursor-pointer"
                aria-label="High Risk Threshold Slider"
              />
              <div className="text-[10px] text-[#8EA1B2]">Triggers CEX attribution monitor</div>
            </div>

            {/* Medium */}
            <div className="p-3.5 rounded-lg bg-[#071018] border border-[#243443] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold uppercase">MEDIUM TIER</span>
                <span className="text-white font-bold">{settings.mediumThreshold}+</span>
              </div>
              <input
                type="range"
                min="30"
                max="50"
                value={settings.mediumThreshold}
                onChange={(e) => {
                  updateSettings({ mediumThreshold: Number(e.target.value) });
                  handleSave();
                }}
                className="w-full accent-amber-500 focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none cursor-pointer"
                aria-label="Medium Risk Threshold Slider"
              />
              <div className="text-[10px] text-[#8EA1B2]">Triggers cluster expansion</div>
            </div>
          </div>
        </div>

        {/* Section 3: Graph Preferences */}
        <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] space-y-4">
          <div className="border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#38BDF8]" />
              <span>Forensic Graph Rendering & Simulation Speed</span>
            </h2>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div>
                <div className="text-white font-semibold">Active Fund Flow Particle Animation</div>
                <div className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
                  Draws moving directional dashed particles along confirmed fund flow paths.
                </div>
              </div>
              <button
                onClick={() => {
                  updateSettings({ animateParticles: !settings.animateParticles });
                  handleSave();
                }}
                onKeyDown={(e) => handleSwitchKeyDown(e, () => {
                  updateSettings({ animateParticles: !settings.animateParticles });
                  handleSave();
                })}
                className={`w-11 h-6 flex items-center rounded-full p-1 focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors cursor-pointer ${
                  settings.animateParticles ? 'bg-[#38BDF8]' : 'bg-[#243443]'
                }`}
                role="switch"
                aria-checked={settings.animateParticles}
                aria-label="Toggle Fund Flow Particle Animation"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.animateParticles ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#071018] border border-[#243443]">
              <div>
                <div className="text-white font-semibold">Automated Pipeline Stage Progression Delay</div>
                <div className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
                  Delay in milliseconds between simulated pipeline stages during Auto-Trace.
                </div>
              </div>
              <select
                value={settings.stageDelay}
                onChange={(e) => {
                  updateSettings({ stageDelay: Number(e.target.value) });
                  handleSave();
                }}
                className="bg-[#111F2C] border border-[#243443] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none text-white rounded-lg px-3 py-1.5 text-xs outline-hidden cursor-pointer"
                aria-label="Select Pipeline Stage Progression Delay"
              >
                <option value={700}>700ms (Fast Demo)</option>
                <option value={1000}>1,000ms (Standard SOC)</option>
                <option value={1500}>1,500ms (Deliberate)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Live Network & Gateway Access */}
        <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] space-y-4">
          <div className="flex items-center justify-between border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Live External Gateways & Forensic Protocols</span>
            </h2>
            <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              GATEWAYS: PERSISTENT
            </span>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            {/* Gateway 1: Real Blockchain Access */}
            <div className="p-3.5 rounded-lg bg-[#071018] border border-[#243443] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#38BDF8]/10 text-[#38BDF8]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Real Blockchain Network Access</div>
                    <div className="text-[11px] text-[#8EA1B2] font-sans">
                      Connects directly to L1/L2 mainnet JSON-RPC nodes for block headers and balance verification.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateSettings({ realBlockchainAccess: !settings.realBlockchainAccess });
                    handleSave();
                  }}
                  onKeyDown={(e) => handleSwitchKeyDown(e, () => {
                    updateSettings({ realBlockchainAccess: !settings.realBlockchainAccess });
                    handleSave();
                  })}
                  className={`px-3 py-1 rounded text-xs font-bold border focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors cursor-pointer ${
                    settings.realBlockchainAccess
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443]'
                  }`}
                  role="switch"
                  aria-checked={settings.realBlockchainAccess}
                  aria-label="Toggle Real Blockchain Network Access"
                >
                  {settings.realBlockchainAccess ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {settings.realBlockchainAccess && (
                <div className="pt-2 border-t border-[#243443]/60 flex items-center gap-2">
                  <span className="text-[10px] text-[#8EA1B2]">RPC ENDPOINT:</span>
                  <input
                    type="text"
                    value={settings.rpcEndpoint}
                    onChange={(e) => {
                      updateSettings({ rpcEndpoint: e.target.value });
                      handleSave();
                    }}
                    className="flex-1 bg-[#0D1721] border border-[#243443] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none rounded px-2 py-1 text-[11px] text-white outline-hidden"
                    aria-label="RPC Endpoint URL"
                  />
                </div>
              )}
            </div>

            {/* Gateway 2: External Exchange API */}
            <div className="p-3.5 rounded-lg bg-[#071018] border border-[#243443] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#38BDF8]/10 text-[#38BDF8]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">External Exchange API Queries</div>
                    <div className="text-[11px] text-[#8EA1B2] font-sans">
                      Dispatches telemetry verification calls to participating centralized exchange compliance desks.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateSettings({ externalExchangeApi: !settings.externalExchangeApi });
                    handleSave();
                  }}
                  onKeyDown={(e) => handleSwitchKeyDown(e, () => {
                    updateSettings({ externalExchangeApi: !settings.externalExchangeApi });
                    handleSave();
                  })}
                  className={`px-3 py-1 rounded text-xs font-bold border focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors cursor-pointer ${
                    settings.externalExchangeApi
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443]'
                  }`}
                  role="switch"
                  aria-checked={settings.externalExchangeApi}
                  aria-label="Toggle External Exchange API Queries"
                >
                  {settings.externalExchangeApi ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {settings.externalExchangeApi && (
                <div className="pt-2 border-t border-[#243443]/60 flex items-center gap-2">
                  <span className="text-[10px] text-[#8EA1B2]">CEX API STREAM:</span>
                  <input
                    type="text"
                    value={settings.exchangeApiEndpoint}
                    onChange={(e) => {
                      updateSettings({ exchangeApiEndpoint: e.target.value });
                      handleSave();
                    }}
                    className="flex-1 bg-[#0D1721] border border-[#243443] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none rounded px-2 py-1 text-[11px] text-white outline-hidden"
                    aria-label="CEX API Stream Endpoint"
                  />
                </div>
              )}
            </div>

            {/* Gateway 3: Real FIU Transmission */}
            <div className="p-3.5 rounded-lg bg-[#071018] border border-[#243443] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Real FIU Transmission / Fund Freezing Protocol</div>
                    <div className="text-[11px] text-[#8EA1B2] font-sans">
                      Enables automated regulatory SAR/STR referral generation and emergency 72-hour asset hold protocol.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateSettings({ realFiuTransmission: !settings.realFiuTransmission });
                    handleSave();
                  }}
                  onKeyDown={(e) => handleSwitchKeyDown(e, () => {
                    updateSettings({ realFiuTransmission: !settings.realFiuTransmission });
                    handleSave();
                  })}
                  className={`px-3 py-1 rounded text-xs font-bold border focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors cursor-pointer ${
                    settings.realFiuTransmission
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443]'
                  }`}
                  role="switch"
                  aria-checked={settings.realFiuTransmission}
                  aria-label="Toggle Real FIU Transmission Protocol"
                >
                  {settings.realFiuTransmission ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {settings.realFiuTransmission && (
                <div className="pt-2 border-t border-[#243443]/60 flex items-center gap-2">
                  <span className="text-[10px] text-[#8EA1B2]">FIU PROTOCOL:</span>
                  <input
                    type="text"
                    value={settings.fiuProtocol}
                    onChange={(e) => {
                      updateSettings({ fiuProtocol: e.target.value });
                      handleSave();
                    }}
                    className="flex-1 bg-[#0D1721] border border-[#243443] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none rounded px-2 py-1 text-[11px] text-white outline-hidden"
                    aria-label="FIU Transmission Protocol Descriptor"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Language & Localization Preferences */}
        <div className="p-5 rounded-xl bg-[#0D1721] border border-[#243443] space-y-4">
          <div className="border-b border-[#243443] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono-code text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#38BDF8]" />
              <span>{t('settings.languageSection')}</span>
            </h2>
            <p className="text-[11px] text-[#8EA1B2] mt-0.5 font-sans">
              {t('settings.languageHelp')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg bg-[#071018] border border-[#243443]">
            <div>
              <div className="text-white font-semibold text-xs font-mono-code">{t('settings.selectLanguage')}</div>
              <div className="text-[11px] text-[#8EA1B2] font-sans mt-0.5">
                Active Locale: <span className="text-[#38BDF8] font-mono-code font-bold">{language === 'hi' ? 'हिन्दी (Hindi)' : 'English (en)'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono-code text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40 shadow-sm'
                    : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443] hover:text-white'
                }`}
              >
                English (en)
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40 shadow-sm'
                    : 'bg-[#111F2C] text-[#8EA1B2] border-[#243443] hover:text-white'
                }`}
              >
                हिन्दी (hi)
              </button>
            </div>
          </div>
        </div>

        {/* Section 6: System Information */}
        <div className="p-4 rounded-xl bg-[#071018] border border-[#243443] font-mono-code text-xs text-[#8EA1B2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">TraceGuard Engine:</span>
            <span>v2.4-FORENSIC-SOC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Gateway Status:</span>
            <span className="text-emerald-400 font-bold">ALL EXTERNAL GATEWAYS ENABLED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Heuristics Engine:</span>
            <span>Cluster Heuristic v3.4 + CEX Sweeper Attributor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
