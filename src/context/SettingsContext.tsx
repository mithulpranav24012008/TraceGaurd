import React, { createContext, useState, useEffect } from 'react';

export interface SettingsState {
  demoMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  animateParticles: boolean;
  stageDelay: number;
  criticalThreshold: number;
  highThreshold: number;
  mediumThreshold: number;
  realBlockchainAccess: boolean;
  externalExchangeApi: boolean;
  realFiuTransmission: boolean;
  rpcEndpoint: string;
  exchangeApiEndpoint: string;
  fiuProtocol: string;
}

export const DEFAULT_SETTINGS: SettingsState = {
  demoMode: false,
  reducedMotion: false,
  highContrast: false,
  animateParticles: true,
  stageDelay: 1000,
  criticalThreshold: 80,
  highThreshold: 65,
  mediumThreshold: 40,
  realBlockchainAccess: true,
  externalExchangeApi: true,
  realFiuTransmission: true,
  rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
  exchangeApiEndpoint: 'https://api.cex-compliance.io/v2/stream',
  fiuProtocol: 'goAML Central Transmission Gateway v4.2'
};

export interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (partial: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const stored = localStorage.getItem('traceguard_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Apply reduced motion or high contrast root class attributes when settings change
  useEffect(() => {
    try {
      localStorage.setItem('traceguard_settings', JSON.stringify(settings));
    } catch {}

    const root = document.documentElement;
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings]);

  const updateSettings = (partial: Partial<SettingsState>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem('traceguard_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('traceguard_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch {}
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
