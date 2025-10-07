'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import trJson from '@/locales/tr.json';
import enJson from '@/locales/en.json';

type Language = 'tr' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  lang: Record<string, string>;
}

const tr: Record<string, string> = trJson as Record<string, string>;
const en: Record<string, string> = enJson as Record<string, string>;

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('tr');
  const lang = language === 'tr' ? tr : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage,lang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
