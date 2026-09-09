"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Service, ServiceCategory } from "@/types/database";

const MAX_ITEMS = 4;

function ServiceCard({
  service,
  categoryTitle,
}: {
  service: Service;
  categoryTitle: string;
}) {
  const { t, lang } = useLanguage();
  const title = service[`title_${lang}` as keyof Service] as string;

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border-soft bg-surface p-5 shadow-sm">
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {categoryTitle && (
          <p className="mt-1 text-sm text-foreground/50">{categoryTitle}</p>
        )}
      </div>
      <p
        className={`min-w-0 whitespace-normal break-words font-semibold ${
          service.price != null
            ? "text-sm text-brand-yellow-dark"
            : "text-xs text-foreground/40"
        }`}
      >
        {service.price != null
          ? `${service.price} ${service.currency}`
          : t.servicesPriceOnRequest}
      </p>
    </div>
  );
}

export function ServicesPreview({
  services,
  categories,
}: {
  services: Service[];
  categories: ServiceCategory[];
}) {
  const { t, lang } = useLanguage();

  const categoryTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(
        category.id,
        category[`title_${lang}` as keyof ServiceCategory] as string
      );
    }
    return map;
  }, [categories, lang]);

  const featured = services
    .filter((s) => s.is_featured)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, MAX_ITEMS);

  const visible =
    featured.length > 0
      ? featured
      : [...services].sort((a, b) => a.sort_order - b.sort_order).slice(0, MAX_ITEMS);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-center text-3xl font-bold text-foreground">
        {t.servicesPreviewTitle}
      </h2>
      <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-red" />
      <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
        {t.servicesPreviewSubtitle}
      </p>

      {visible.length === 0 ? (
        <p className="mt-12 text-center text-foreground/50">
          {t.servicesPreviewEmpty}
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categoryTitle={categoryTitleById.get(service.category_id) ?? ""}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/services"
          className="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
        >
          {t.servicesViewAllButton}
        </Link>
      </div>
    </section>
  );
}
