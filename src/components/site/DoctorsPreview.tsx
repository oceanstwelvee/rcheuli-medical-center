"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import type { Doctor } from "@/types/database";

const MAX_ITEMS = 4;

export function DoctorsPreview({ doctors }: { doctors: Doctor[] }) {
  const { t } = useLanguage();
  const visible = doctors.slice(0, MAX_ITEMS);

  return (
    <section className="bg-surface-muted/60 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-foreground">
          {t.doctorsTitle}
        </h2>
        <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-yellow" />
        <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
          {t.doctorsPreviewSubtitle}
        </p>

        {visible.length === 0 ? (
          <p className="mt-12 text-center text-foreground/50">
            {t.doctorsPreviewEmpty}
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} bioLines={2} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/doctors"
            className="rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-yellow-dark"
          >
            {t.doctorsViewAllButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
