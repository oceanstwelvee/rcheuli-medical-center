"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CLINIC } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/#about", key: "navAbout" as const },
  { href: "/services", key: "navServices" as const },
  { href: "/#doctors", key: "navDoctors" as const },
  { href: "/#contacts", key: "navContacts" as const },
];

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-5">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logo.png"
            alt={t.clinicName}
            width={72}
            height={72}
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-brand-red"
            >
              {t[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <a
            href={`tel:${CLINIC.phones[0].tel}`}
            className="rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-yellow-dark"
          >
            {t.callButton}
          </a>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border-soft bg-surface px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-foreground/80"
              >
                {t[item.key]}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <a
              href={`tel:${CLINIC.phones[0].tel}`}
              className="rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-white"
            >
              {t.callButton}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
