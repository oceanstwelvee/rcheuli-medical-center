"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGUAGE_NAMES } from "@/lib/i18n/translations";
import { Avatar } from "@/components/ui/Avatar";
import type { Doctor } from "@/types/database";

export function DoctorCard({
  doctor,
  bioLines = 3,
}: {
  doctor: Doctor;
  bioLines?: 2 | 3;
}) {
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
          <p
            className={`${
              bioLines === 2 ? "line-clamp-2" : "line-clamp-3"
            } text-sm leading-relaxed text-foreground/65`}
          >
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
