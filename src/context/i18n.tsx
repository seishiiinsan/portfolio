"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, Translations } from "@/lib/translations";

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  isRtl: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const isRtl = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang], isRtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
