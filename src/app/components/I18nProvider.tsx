'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Language, TranslationKey, getLanguage, setLanguage, t as translateFunc } from '../lib/i18n';

const I18nContext = createContext<{ lang: Language; setLang: (l: Language) => void; t: (key: TranslationKey) => string } | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('de');
  
  useEffect(() => {
    setLangState(getLanguage());
  }, []);
  
  const setLang = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setLangState(newLang);
  }, []);
  
  const t = useCallback((key: TranslationKey) => {
    return translateFunc(key, lang);
  }, [lang]);
  
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
