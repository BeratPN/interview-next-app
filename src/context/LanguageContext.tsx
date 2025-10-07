"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import trJson from '@/locales/tr.json';
import enJson from '@/locales/en.json';
import { Language, LanguageContextType } from '@/types';
import { storage } from '@/utils';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  tr: trJson,
  en: enJson,
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('tr');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = storage.get<Language>('language', 'tr');
    setLanguageState(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.set('language', lang);
    document.documentElement.lang = lang;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    lang: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}