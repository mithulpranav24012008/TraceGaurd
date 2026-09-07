import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';

export type SupportedLanguage = 'en' | 'hi';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string, fallback?: string) => string;
}

const translationsMap: Record<SupportedLanguage, Record<string, any>> = {
  en: enTranslations,
  hi: hiTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem('traceguard_language');
      if (stored === 'hi' || stored === 'en') return stored;
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('traceguard_language', lang);
    } catch {}
  };

  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split('.');
    let current: any = translationsMap[language] || translationsMap.en;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallbackVal: any = translationsMap.en;
        for (const fKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fKey in fallbackVal) {
            fallbackVal = fallbackVal[fKey];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : fallback || keyPath;
      }
    }

    return typeof current === 'string' ? current : fallback || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
