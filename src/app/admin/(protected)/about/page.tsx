"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LangTabs } from "@/components/admin/LangTabs";
import { useAdminLanguage } from "@/lib/i18n/AdminLanguageContext";
import type { SiteContent } from "@/types/database";

const EMPTY: SiteContent = {
  key: "about_us",
  value_ru: "",
  value_ka: "",
  value_en: "",
};

export default function AboutAdminPage() {
  const supabase = createClient();
  const { t } = useAdminLanguage();
  const [content, setContent] = useState<SiteContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error: loadError } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", "about_us")
        .maybeSingle();
      if (loadError) console.error("Failed to load about_us content:", loadError);
      if (data) setContent(data as SiteContent);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: saveError } = await supabase.from("site_content").upsert({
      key: "about_us",
      value_ru: content.value_ru,
      value_ka: content.value_ka,
      value_en: content.value_en,
    });

    setSaving(false);

    if (saveError) {
      console.error("Failed to save about_us content:", saveError);
      setError(t.saveFailed);
      return;
    }
    setSaved(true);
  }

  if (loading) {
    return <p className="text-sm text-foreground/50">{t.loading}</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">{t.aboutTitle}</h1>
      <p className="mt-1 text-sm text-foreground/50">{t.aboutHint}</p>

      <div className="mt-6 max-w-2xl rounded-2xl border border-border-soft bg-surface p-6 shadow-sm">
        <LangTabs>
          {(lang) => (
            <textarea
              rows={8}
              value={content[`value_${lang}`] ?? ""}
              onChange={(e) =>
                setContent({ ...content, [`value_${lang}`]: e.target.value })
              }
              className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-brand-red"
            />
          )}
        </LangTabs>

        {error && <p className="mt-3 text-sm text-brand-red-dark">{error}</p>}
        {saved && !error && (
          <p className="mt-3 text-sm text-emerald-600">{t.saved}</p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
          >
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
