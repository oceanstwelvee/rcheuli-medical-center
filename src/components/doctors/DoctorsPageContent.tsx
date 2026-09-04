"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGUAGE_NAMES } from "@/lib/i18n/translations";
import { Avatar } from "@/components/ui/Avatar";
import type { Doctor } from "@/types/database";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { t, lang } = useLanguage();
  const specialty =
    (doctor[`specialty_${lang}` as keyof Doctor] as string | null) ?? "";
  const bio = (doctor[`bio_${lang}` as keyof Doctor] as string | null) ?? "";
  const tags = (doctor[`tags_${lang}` as keyof Doctor] as string[] | null) ?? [];
  const pills = [specialty, ...tags].filter(
    (value): value is string => Boolean(value && value.trim())
  );
  const languages = doctor.languages ?? [];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
      <div className="relative aspect-[4/5] w-full bg-surface-muted">
        {doctor.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doctor.photo_url}
            alt={doctor.full_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Avatar name={doctor.full_name} size={96} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pills.map((pill, i) => (
              <span
                key={`${pill}-${i}`}
                className="rounded-full bg-brand-yellow/15 px-2.5 py-1 text-xs font-medium text-brand-yellow-dark"
              >
                {pill}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-lg font-bold text-foreground">
          {doctor.full_name}
        </h3>

        {bio && (
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/65">
            {bio}
          </p>
        )}

        {languages.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border-soft pt-3 text-xs text-foreground/60">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
            </svg>
            <span className="font-medium">{t.doctorsLanguagesLabel}</span>
            {languages.map((code) => (
              <span
                key={code}
                className="rounded-full border border-border-soft px-2 py-0.5 text-foreground/70"
              >
                {LANGUAGE_NAMES[code]?.[lang] ?? code}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
