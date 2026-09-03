"use client";

import { useState } from "react";
import type { Lang } from "@/types/database";
import { LANG_LABELS, LANGS } from "@/lib/i18n/translations";

export function LangTabs({
  children,
}: {
  children: (lang: Lang) => React.ReactNode;
}) {
  const [active, setActive] = useState<Lang>("ru");

  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-border-soft bg-surface-muted p-1">
        {LANGS.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActive(lang)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              active === lang
                ? "bg-brand-red text-white"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {LANG_LABELS[lang]}
          </button>
        ))}
      </div>
      {LANGS.map((lang) => (
        <div key={lang} hidden={lang !== active}>
          {children(lang)}
        </div>
      ))}
    </div>
  );
}
