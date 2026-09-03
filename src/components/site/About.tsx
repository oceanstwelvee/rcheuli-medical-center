"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { SiteContent } from "@/types/database";

export function About({ content }: { content: SiteContent | null }) {
  const { t, lang } = useLanguage();

  const text =
    content?.[`value_${lang}` as keyof SiteContent] ??
    content?.value_en ??
    "";

  return (
    <section id="about" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-center text-3xl font-bold text-foreground">
        {t.aboutTitle}
      </h2>
      <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-yellow" />
      <p className="mt-8 text-center text-lg leading-relaxed text-foreground/75">
        {text as string}
      </p>
    </section>
  );
}
