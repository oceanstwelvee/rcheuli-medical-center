"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAdminLanguage } from "@/lib/i18n/AdminLanguageContext";
import { AdminLanguageSwitcher } from "./AdminLanguageSwitcher";
import type { AdminDict } from "@/lib/i18n/admin-translations";

const LINKS: { href: string; key: keyof AdminDict }[] = [
  { href: "/admin/doctors", key: "navDoctors" },
  { href: "/admin/services", key: "navServices" },
  { href: "/admin/promotions", key: "navPromotions" },
  { href: "/admin/about", key: "navAbout" },
];

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAdminLanguage();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/logo/logo.png"
            alt={t.logoAlt}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 object-contain"
          />
          <span className="text-sm font-semibold text-foreground">
            {t.panelTitle}
          </span>
        </div>

        {/* Georgian labels run noticeably longer than the Russian ones, so the
            tab strip wraps instead of forcing the row wider than the screen. */}
        <nav className="order-last flex w-full flex-wrap items-center gap-1 rounded-3xl border border-border-soft bg-surface-muted p-1 sm:order-none sm:w-auto sm:rounded-full sm:flex-nowrap">
          {LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
                  active
                    ? "bg-brand-red text-white"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {t[link.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {email && (
            <span className="hidden max-w-[12rem] truncate text-xs text-foreground/50 lg:block">
              {email}
            </span>
          )}
          <AdminLanguageSwitcher />
          <button
            type="button"
            onClick={handleSignOut}
            className="shrink-0 rounded-full border border-border-soft px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-brand-red hover:text-brand-red sm:px-4"
          >
            {t.signOut}
          </button>
        </div>
      </div>
    </header>
  );
}
