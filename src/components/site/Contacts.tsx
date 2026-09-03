"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLINIC } from "@/lib/constants";
import { PhoneLinks } from "./PhoneLink";
import { SocialLinks } from "./SocialLinks";

export function Contacts() {
  const { t, lang } = useLanguage();

  return (
    <section id="contacts" className="bg-surface-muted/60 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-foreground">
          {t.contactsTitle}
        </h2>
        <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-red" />

        <div className="mt-12 grid gap-8 overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm lg:grid-cols-2">
          <div className="flex flex-col gap-6 p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                {t.contactsAddressLabel}
              </p>
              <p className="mt-1 text-lg font-medium text-foreground">
                {CLINIC.address[lang]}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                {t.contactsPhoneLabel}
              </p>
              <PhoneLinks className="mt-1" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                {t.contactsSocialLabel}
              </p>
              <SocialLinks className="mt-2" />
            </div>
          </div>

          <div className="min-h-[280px] w-full">
            <iframe
              title="Rcheuli Medical Center — map"
              src={CLINIC.mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 280 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
