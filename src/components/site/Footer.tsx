"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLINIC } from "@/lib/constants";
import { PrimaryCallButton } from "./PhoneLink";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-muted px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {t.footerAboutTitle}
            </h3>
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <Image
                src="/logo/logo.png"
                alt={t.clinicName}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-sm font-semibold text-foreground">
                {t.clinicName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-foreground/65">
              {t.heroSubtitle}
            </p>
            <SocialLinks />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {t.footerNavTitle}
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/#about"
                className="text-foreground/70 transition-colors hover:text-brand-red"
              >
                {t.navAbout}
              </Link>
              <Link
                href="/services"
                className="text-foreground/70 transition-colors hover:text-brand-red"
              >
                {t.navServices}
              </Link>
              <Link
                href="/doctors"
                className="text-foreground/70 transition-colors hover:text-brand-red"
              >
                {t.navDoctors}
              </Link>
              <Link
                href="/#contacts"
                className="text-foreground/70 transition-colors hover:text-brand-red"
              >
                {t.navContacts}
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {t.footerBookTitle}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/65">
              {t.footerBookText}
            </p>
            <PrimaryCallButton className="w-fit" />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {t.contactsTitle}
            </h3>
            <a
              href={CLINIC.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 transition-colors hover:text-brand-red"
            >
              {CLINIC.address[lang]}
            </a>
            <div className="flex flex-col gap-1">
              {CLINIC.phones.map((phone) => (
                <a
                  key={phone.tel}
                  href={`tel:${phone.tel}`}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-brand-red"
                >
                  {phone.display}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border-soft pt-6 text-center text-xs text-foreground/50">
          © {year} {t.clinicName}. {t.footerRights}.
        </div>
      </div>
    </footer>
  );
}
