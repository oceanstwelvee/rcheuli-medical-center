"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADMIN_LANGS,
  adminPhrases,
  adminTranslations,
  type AdminDict,
  type AdminLang,
} from "./admin-translations";

/**
 * Deliberately a different storage key from the public site's "rcheuli-lang":
 * an editor who previews the site in Russian must not flip the panel, and the
 * panel must not flip the site.
 */
const STORAGE_KEY = "rcheuli-admin-lang";
const DEFAULT_ADMIN_LANG: AdminLang = "ka";

interface AdminLanguageContextValue {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
  t: AdminDict;
  phrases: (typeof adminPhrases)[AdminLang];
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(
  null
);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(DEFAULT_ADMIN_LANG);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AdminLang | null;
    if (stored && ADMIN_LANGS.includes(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncs client-only localStorage after the SSR-matching first render
      setLangState(stored);
    }
  }, []);

  // Under /admin this provider owns <html lang>; the public provider stands
  // down here (see LanguageContext) so the two never fight over the attribute.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: AdminLang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: adminTranslations[lang],
      phrases: adminPhrases[lang],
    }),
    [lang]
  );

  return (
    <AdminLanguageContext.Provider value={value}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) {
    throw new Error(
      "useAdminLanguage must be used within an AdminLanguageProvider"
    );
  }
  return ctx;
}
