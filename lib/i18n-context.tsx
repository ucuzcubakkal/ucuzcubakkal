"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Language } from "@/lib/i18n";

type I18nContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof translations.tr) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: "tr",
  setLang: () => {},
  t: (key) => String(translations.tr[key]),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("tr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ucuzcubakkal_lang") as Language;
      if (saved === "tr" || saved === "en") setLangState(saved);
    } catch { /* */ }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try { localStorage.setItem("ucuzcubakkal_lang", l); } catch { /* */ }
  };

  const t = (key: keyof typeof translations.tr): string =>
    (translations[lang][key] ?? translations.tr[key]) as string;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
