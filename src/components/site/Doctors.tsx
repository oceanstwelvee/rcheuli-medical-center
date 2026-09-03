"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Avatar } from "@/components/ui/Avatar";
import type { Doctor } from "@/types/database";

export function Doctors({ doctors }: { doctors: Doctor[] }) {
  const { t, lang } = useLanguage();

  return (
    <section id="doctors" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-center text-3xl font-bold text-foreground">
        {t.doctorsTitle}
      </h2>
      <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-yellow" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => {
          const specialty = doctor[
            `specialty_${lang}` as keyof Doctor
          ] as string | null;
          const bio = doctor[`bio_${lang}` as keyof Doctor] as string | null;
          const isExample = doctor.full_name.trim() === "Доктор — пример";

          return (
            <div
              key={doctor.id}
              className="relative flex flex-col items-center rounded-2xl border border-border-soft bg-surface p-6 text-center shadow-sm"
            >
              {isExample && (
                <span className="absolute right-4 top-4 rounded-full bg-brand-yellow/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-yellow-dark">
                  {t.doctorsExampleBadge}
                </span>
              )}
              <Avatar name={doctor.full_name} photoUrl={doctor.photo_url} size={88} />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {doctor.full_name}
              </h3>
              {specialty && (
                <p className="mt-1 text-sm font-medium text-brand-red-dark">
                  {specialty}
                </p>
              )}
              {bio && (
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {bio}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
