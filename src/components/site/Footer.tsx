"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLINIC } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-soft bg-surface px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo/logo.png"
            alt={t.clinicName}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t.clinicName}
            </p>
            <p className="text-xs text-foreground/50">
              {CLINIC.address[lang]}
            </p>
          </div>
        </div>

        <SocialLinks />

        <p className="text-xs text-foreground/50">
          © {year} {t.clinicName}. {t.footerRights}.
        </p>
      </div>
    </footer>
  );
}
