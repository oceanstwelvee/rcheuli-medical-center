"use client";

import { useAdminLanguage } from "@/lib/i18n/AdminLanguageContext";
import { ADMIN_LANG_LABELS, ADMIN_LANGS } from "@/lib/i18n/admin-translations";

export function AdminLanguageSwitcher() {
  const { lang, setLang, t } = useAdminLanguage();

  return (
    <div
      role="group"
      aria-label={t.switchLanguage}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-soft bg-surface-muted p-1"
    >
      {ADMIN_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === code
              ? "bg-brand-red text-white"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {ADMIN_LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
