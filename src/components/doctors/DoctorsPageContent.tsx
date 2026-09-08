"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DoctorCard } from "./DoctorCard";
import type { Doctor } from "@/types/database";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function DoctorsPageContent({ doctors }: { doctors: Doctor[] }) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = useMemo(() => {
    const seen = new Map<string, string>();
    for (const doctor of doctors) {
      const specialty =
        (doctor[`specialty_${lang}` as keyof Doctor] as string | null) ?? "";
      const tags =
        (doctor[`tags_${lang}` as keyof Doctor] as string[] | null) ?? [];
      for (const value of [specialty, ...tags]) {
        if (!value || !value.trim()) continue;
        const key = normalize(value);
        if (!seen.has(key)) seen.set(key, value.trim());
      }
    }
    return Array.from(seen.values());
  }, [doctors, lang]);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const specialty =
        (doctor[`specialty_${lang}` as keyof Doctor] as string | null) ?? "";
      const tags =
        (doctor[`tags_${lang}` as keyof Doctor] as string[] | null) ?? [];

      if (activeFilter) {
        const key = normalize(activeFilter);
        const matchesFilter =
          normalize(specialty) === key ||
          tags.some((tag) => normalize(tag) === key);
        if (!matchesFilter) return false;
      }

      if (normalizedQuery) {
        const haystack = `${doctor.full_name} ${specialty}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [doctors, lang, activeFilter, normalizedQuery]);

  return (
    <>
      <section className="bg-surface-muted/60 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {t.doctorsTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            {t.doctorsPageSubtitle}
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
                placeholder={t.doctorsSearchPlaceholder}
                className="w-full rounded-full border border-border-soft bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              aria-pressed={activeFilter === null}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === null
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-border-soft bg-surface text-foreground/70 hover:border-brand-red hover:text-brand-red"
              }`}
            >
              {t.doctorsAllSpecialties}
            </button>
            {filters.map((filter) => {
              const isActive =
                activeFilter !== null && normalize(activeFilter) === normalize(filter);
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-border-soft bg-surface text-foreground/70 hover:border-brand-red hover:text-brand-red"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {visibleDoctors.length === 0 ? (
          <p className="py-12 text-center text-foreground/50">
            {t.doctorsNoResults}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
