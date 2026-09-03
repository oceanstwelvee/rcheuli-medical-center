"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Service, ServiceCategory } from "@/types/database";

function formatPrice(service: Service, priceOnRequestText: string) {
  if (service.price == null) return priceOnRequestText;
  return `${service.price} ${service.currency}`;
}

export function ServicesPageContent({
  categories,
  services,
}: {
  categories: ServiceCategory[];
  services: Service[];
}) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const visibleCategories = useMemo(() => {
    const base =
      activeCategory === "all"
        ? categories
        : categories.filter((c) => c.id === activeCategory);

    return base
      .map((category) => {
        const categoryTitle = category[
          `title_${lang}` as keyof ServiceCategory
        ] as string;
        const categoryMatches =
          normalizedQuery === "" ||
          categoryTitle.toLowerCase().includes(normalizedQuery);

        const categoryServices = services.filter(
          (s) => s.category_id === category.id
        );

        const items = categoryMatches
          ? categoryServices
          : categoryServices.filter((s) => {
              const title = s[`title_${lang}` as keyof Service] as string;
              return title.toLowerCase().includes(normalizedQuery);
            });

        return { category, items };
      })
      .filter(({ items }) => items.length > 0);
  }, [categories, services, activeCategory, normalizedQuery, lang]);

  return (
    <>
      <section className="bg-surface-muted/60 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {t.servicesPageTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            {t.servicesPageSubtitle}
          </p>

          <div className="mx-auto mt-8 max-w-lg">
            <div className="relative">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.servicesSearchPlaceholder}
                className="w-full rounded-full border border-border-soft bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border-soft bg-surface text-foreground/70 hover:border-brand-red hover:text-brand-red"
              }`}
            >
              {t.servicesAllCategories}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-border-soft bg-surface text-foreground/70 hover:border-brand-red hover:text-brand-red"
                }`}
              >
                {category[`title_${lang}` as keyof ServiceCategory] as string}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {visibleCategories.length === 0 ? (
          <p className="py-12 text-center text-foreground/50">
            {t.servicesNoResults}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleCategories.map(({ category, items }) => (
              <div
                key={category.id}
                className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-brand-red-dark">
                  {
                    category[
                      `title_${lang}` as keyof ServiceCategory
                    ] as string
                  }
                </h2>
                <ul className="mt-4 flex flex-col divide-y divide-border-soft">
                  {items.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-end gap-2 py-2.5"
                    >
                      <span className="text-sm text-foreground/80">
                        {
                          service[
                            `title_${lang}` as keyof Service
                          ] as string
                        }
                      </span>
                      <span className="mb-1 flex-1 border-b border-dotted border-border-soft" />
                      <span
                        className={`shrink-0 text-sm font-semibold ${
                          service.price != null
                            ? "text-brand-yellow-dark"
                            : "text-foreground/40"
                        }`}
                      >
                        {formatPrice(service, t.servicesPriceOnRequest)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
