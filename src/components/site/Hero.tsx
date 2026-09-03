"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PrimaryCallButton } from "./PhoneLink";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-surface-muted to-background"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-yellow/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-yellow-dark">
          Tbilisi
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          {t.heroSubtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <PrimaryCallButton />
          <a
            href="#contacts"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border-soft bg-surface px-6 py-3 font-semibold text-foreground transition-colors hover:border-brand-yellow hover:text-brand-yellow-dark"
          >
            {t.addressButton}
          </a>
        </div>
      </div>
    </section>
  );
}
