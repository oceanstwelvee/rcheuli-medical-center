"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PrimaryCallButton } from "./PhoneLink";
import type { Dict } from "@/lib/i18n/translations";

function IconShieldPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
      <path d="M12 8v6M9 11h6" />
    </svg>
  );
}

function IconStethoscope() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 3v6a4 4 0 0 0 8 0V3" />
      <path d="M9 15a6 6 0 0 0 12 0v-2" />
      <circle cx="21" cy="11" r="1.5" />
      <circle cx="9" cy="18" r="3" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

const FEATURES: { icon: () => React.ReactNode; key: keyof Dict }[] = [
  { icon: IconShieldPlus, key: "heroFeature1" },
  { icon: IconStethoscope, key: "heroFeature2" },
  { icon: IconUsers, key: "heroFeature3" },
  { icon: IconHeart, key: "heroFeature4" },
];

export function Hero() {
  const { t } = useLanguage();
  const [firstWord, ...rest] = t.heroTitle.split(" ");

  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden min-h-[600px] sm:min-h-[560px] lg:min-h-[620px]"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/background.png"
          alt=""
          fill
          priority
          className="object-cover object-[30%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_0%,rgba(255,253,250,0.55)_30%,transparent_55%)] sm:bg-[linear-gradient(to_right,var(--background)_0%,rgba(255,253,250,0.5)_28%,transparent_45%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[600px] max-w-6xl flex-col justify-center gap-6 px-4 py-20 sm:min-h-[560px] sm:px-6 sm:py-28 lg:min-h-[620px]">
        <span className="w-fit rounded-full border border-brand-yellow/40 bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-yellow-dark backdrop-blur">
          {t.heroCityBadge}
        </span>

        <h1 className="max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
          {firstWord}
          <br />
          {rest.join(" ")}
        </h1>

        <p className="max-w-md text-lg text-foreground/70">{t.heroSubtitle}</p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <PrimaryCallButton />
          <a
            href="#contacts"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-yellow-dark px-6 py-[10px] font-semibold text-brand-yellow-dark transition-colors hover:bg-brand-yellow-dark hover:text-white"
          >
            {t.addressButton}
          </a>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-5 pt-4">
          {FEATURES.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-yellow/15 text-brand-yellow-dark">
                <Icon />
              </span>
              <span className="max-w-[8.5rem] text-sm font-medium leading-tight text-foreground/80">
                {t[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
