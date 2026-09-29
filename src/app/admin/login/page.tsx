"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAdminLanguage } from "@/lib/i18n/AdminLanguageContext";
import { AdminLanguageSwitcher } from "@/components/admin/AdminLanguageSwitcher";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useAdminLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      // Supabase phrases this in English and leaks implementation detail, so
      // the editor sees one plain sentence and the rest goes to the console.
      console.error("Admin sign-in failed:", signInError);
      setError(t.loginFailed);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-border-soft bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex justify-end">
          <AdminLanguageSwitcher />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo/logo.png"
            alt={t.logoAlt}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-lg font-semibold text-foreground">
            Rcheuli Medical Center
          </h1>
          <p className="text-sm text-foreground/50">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground/70"
            >
              {t.loginEmail}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground/70"
            >
              {t.loginPassword}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>

          {error && <p className="text-sm text-brand-red-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark disabled:opacity-60"
          >
            {loading ? t.loginSubmitting : t.loginSubmit}
          </button>
        </form>
      </div>
    </div>
  );
}
