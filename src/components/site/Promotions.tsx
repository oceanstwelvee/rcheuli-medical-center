"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DATE_LOCALES } from "@/lib/i18n/translations";
import { computeDiscountPercent } from "@/lib/promotions";
import type { Lang, Promotion } from "@/types/database";

function formatDeadline(deadline: string, lang: Lang) {
  const date = new Date(`${deadline}T00:00:00`);
  return new Intl.DateTimeFormat(DATE_LOCALES[lang], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const { t, lang } = useLanguage();
  const title = promotion[`title_${lang}` as keyof Promotion] as string;
  const description = promotion[
    `description_${lang}` as keyof Promotion
  ] as string | null;
  const discount = computeDiscountPercent(promotion.price, promotion.old_price);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-surface-muted">
        {promotion.image_url ? (
          <Image
            src={promotion.image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground/25">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        {promotion.price != null && discount != null && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-red px-2.5 py-1 text-xs font-bold text-white shadow">
            -{discount}%
          </span>
        )}
        {promotion.price != null && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-brand-yellow-dark px-3 py-1 text-sm font-semibold text-white shadow">
            {discount != null && (
              <span className="text-white/70 line-through">
                {promotion.old_price} {promotion.currency}
              </span>
            )}
            <span>
              {promotion.price} {promotion.currency}
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {promotion.deadline && (
          <span className="w-fit rounded-full bg-brand-red/10 px-2.5 py-0.5 text-xs font-semibold text-brand-red-dark">
            {t.promotionsUntilLabel} {formatDeadline(promotion.deadline, lang)}
          </span>
        )}
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/65">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function Promotions({ promotions }: { promotions: Promotion[] }) {
  const { t } = useLanguage();

  if (promotions.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-center text-3xl font-bold text-foreground">
        {t.promotionsTitle}
      </h2>
      <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-yellow" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </section>
  );
}
