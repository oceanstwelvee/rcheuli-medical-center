"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/types/database";
import { LANGS, translations, type Dict } from "./translations";

const STORAGE_KEY = "rcheuli-lang";
const DEFAULT_LANG: Lang = "ka";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const pathname = usePathname();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGS.includes(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncs client-only localStorage after the SSR-matching first render
      setLangState(stored);
    }
  }, []);

  // The root layout ships a static <html lang="ka">, so the real language —
  // which only exists as client state — has to be mirrored onto the document
  // after mount. Depending on `lang` covers both the first load (this runs
  // again once the effect above restores a stored language) and every switch.
  // Under /admin the panel runs on its own language, so AdminLanguageProvider
  // owns the attribute there and this one stands down; changing `pathname`
  // re-runs the effect, so leaving the panel restores the site's language.
  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    document.documentElement.lang = lang;
  }, [lang, pathname]);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

export function pickLocalized<
  T extends Record<string, unknown>,
  K extends string
>(item: T, field: K, lang: Lang): string {
  const key = `${field}_${lang}` as keyof T;
  const value = item[key];
  if (typeof value === "string" && value.trim().length > 0) return value;
  const fallback = item[`${field}_en` as keyof T];
  if (typeof fallback === "string" && fallback.trim().length > 0)
    return fallback;
  return "";
}
