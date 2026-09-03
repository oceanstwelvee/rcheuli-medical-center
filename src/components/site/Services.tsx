"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Service, ServiceCategory } from "@/types/database";

export function Services({
  categories,
  services,
}: {
  categories: ServiceCategory[];
  services: Service[];
}) {
  const { t, lang } = useLanguage();

  return (
    <section
      id="services"
      className="bg-surface-muted/60 px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-foreground">
          {t.servicesTitle}
        </h2>
        <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-red" />

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {categories.map((category) => {
            const items = services.filter(
              (s) => s.category_id === category.id
            );
            if (items.length === 0) return null;

            return (
              <div
                key={category.id}
                className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-brand-red-dark">
                  {category[`title_${lang}` as keyof ServiceCategory] as string}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-2.5 text-sm text-foreground/75"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow" />
                      <span>
                        {item[`title_${lang}` as keyof Service] as string}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
