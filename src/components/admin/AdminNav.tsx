"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin/doctors", label: "Врачи" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/promotions", label: "Акции" },
  { href: "/admin/about", label: "О нас" },
];

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo/logo.png"
            alt="Rcheuli Medical Center"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-semibold text-foreground">Админ-панель</span>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-border-soft bg-surface-muted p-1">
          {LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-red text-white"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-xs text-foreground/50 sm:block">
              {email}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-border-soft px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-brand-red hover:text-brand-red"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
