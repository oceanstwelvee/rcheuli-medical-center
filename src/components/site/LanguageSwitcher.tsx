"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGS, LANG_LABELS } from "@/lib/i18n/translations";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border-soft bg-surface p-1 text-sm ${className}`}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            lang === l
              ? "bg-brand-red text-white"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
