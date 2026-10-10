"use client";

import React, { createContext, useContext, useEffect } from "react";
import { Lang, getT, TranslationSection } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (section: TranslationSection, key: string) => string;
  dir: "rtl";
}

const tArabic = getT("ar");

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  t: tArabic,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("lang", "ar");
    document.documentElement.setAttribute("dir", "rtl");
    try {
      localStorage.removeItem("axb_lang");
    } catch (e) {}
  }, []);

  return (
    <LanguageContext.Provider value={{ lang: "ar", setLang: () => {}, t: tArabic, dir: "rtl" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
