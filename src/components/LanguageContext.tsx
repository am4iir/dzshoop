"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Lang, getT, TranslationSection } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (section: TranslationSection, key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  t: (_s, k) => k,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("axb_lang") as Lang | null;
      if (saved === "ar" || saved === "en" || saved === "fr") {
        applyLang(saved);
        setLangState(saved);
      }
    } catch (e) {}
  }, []);

  function applyLang(l: Lang) {
    const dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", l);
    document.documentElement.setAttribute("dir", dir);
  }

  const setLang = (l: Lang) => {
    setLangState(l);
    applyLang(l);
    try {
      localStorage.setItem("axb_lang", l);
    } catch (e) {}
  };

  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = getT(lang);

  if (!mounted) {
    // SSR: render with default Arabic to match server HTML
    return (
      <LanguageContext.Provider value={{ lang: "ar", setLang, t: getT("ar"), dir: "rtl" }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
