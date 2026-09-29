"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LangTabs } from "@/components/admin/LangTabs";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { computeDiscountPercent } from "@/lib/promotions";
import { useAdminLanguage } from "@/lib/i18n/AdminLanguageContext";
import type { Promotion } from "@/types/database";

type DraftPromotion = Omit<Promotion, "id" | "created_at"> & { id?: string };

const EMPTY_DRAFT: DraftPromotion = {
  title_ru: "",
  title_ka: "",
  title_en: "",
  description_ru: "",
  description_ka: "",
  description_en: "",
  price: null,
  old_price: null,
  currency: "GEL",
  deadline: null,
  image_url: "",
  is_active: false,
  sort_order: 0,
};

export default function PromotionsAdminPage() {
  const supabase = createClient();
  const { t, phrases } = useAdminLanguage();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DraftPromotion | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  async function loadPromotions() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("promotions")
      .select("*")
      .order("sort_order");
    if (loadError) {
      console.error("Failed to load promotions:", loadError);
      setListError(t.loadFailed);
    } else {
      setListError(null);
      setPromotions((data as Promotion[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadPromotions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openNew() {
    setError(null);
    setEditing({ ...EMPTY_DRAFT, sort_order: promotions.length });
  }

  function openEdit(promotion: Promotion) {
    setError(null);
    setEditing({ ...promotion });
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `promotions/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("doctor-photos")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      console.error("Failed to upload promotion image:", uploadError);
      setError(t.uploadFailed);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("doctor-photos").getPublicUrl(path);
    setEditing((prev) => (prev ? { ...prev, image_url: data.publicUrl } : prev));
    setUploading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title_ru.trim()) {
      setError(t.promotionTitleRequired);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title_ru: editing.title_ru,
      title_ka: editing.title_ka,
      title_en: editing.title_en,
      description_ru: editing.description_ru,
      description_ka: editing.description_ka,
      description_en: editing.description_en,
      price: editing.price,
      old_price: editing.old_price,
      currency: editing.currency,
      deadline: editing.deadline || null,
      image_url: editing.image_url || null,
      is_active: editing.is_active,
      sort_order: editing.sort_order,
    };

    const result = editing.id
      ? await supabase.from("promotions").update(payload).eq("id", editing.id)
      : await supabase.from("promotions").insert(payload);

    setSaving(false);

    if (result.error) {
      console.error("Failed to save promotion:", result.error);
      setError(t.saveFailed);
      return;
    }

    setEditing(null);
    loadPromotions();
  }

  async function handleDelete(promotion: Promotion) {
    if (!window.confirm(phrases.confirmDeletePromotion(promotion.title_ru)))
      return;
    const { error: deleteError } = await supabase
      .from("promotions")
      .delete()
      .eq("id", promotion.id);
    if (deleteError) {
      console.error("Failed to delete promotion:", deleteError);
      setListError(t.deleteFailed);
      return;
    }
    setListError(null);
    loadPromotions();
  }

  async function handleToggleActive(promotion: Promotion) {
    const nextActive = !promotion.is_active;
    setPromotions((prev) =>
      prev.map((p) =>
        p.id === promotion.id ? { ...p, is_active: nextActive } : p
      )
    );

    const { error: toggleError } = await supabase
      .from("promotions")
      .update({ is_active: nextActive })
      .eq("id", promotion.id);

    if (toggleError) {
      console.error("Failed to toggle promotion visibility:", toggleError);
      setListError(t.saveFailed);
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === promotion.id ? { ...p, is_active: promotion.is_active } : p
        )
      );
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          {t.promotionsTitle}
        </h1>
        <button
          type="button"
          onClick={openNew}
          className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          + {t.promotionsAdd}
        </button>
      </div>

      {listError && (
        <p className="mt-4 text-sm text-brand-red-dark">{listError}</p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-foreground/50">{t.loading}</p>
      ) : promotions.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/50">{t.promotionsEmpty}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {promotions.map((promotion) => {
            const discount = computeDiscountPercent(
              promotion.price,
              promotion.old_price
            );

            return (
              <div
                key={promotion.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-surface p-4 shadow-sm"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  {promotion.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={promotion.image_url}
                      alt={t.promotionImageAlt}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {promotion.title_ru}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {promotion.is_active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {t.promotionActive}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-foreground/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                        {t.promotionHidden}
                      </span>
                    )}
                    {(promotion.price != null ||
                      promotion.old_price != null) && (
                      <span className="text-xs text-foreground/60">
                        {discount != null ? (
                          <>
                            <span className="line-through">
                              {promotion.old_price} {promotion.currency}
                            </span>{" "}
                            <span className="font-semibold text-foreground">
                              {promotion.price} {promotion.currency}
                            </span>{" "}
                            <span className="font-semibold text-brand-red-dark">
                              -{discount}%
                            </span>
                          </>
                        ) : (
                          promotion.price != null && (
                            <span className="font-semibold text-foreground">
                              {promotion.price} {promotion.currency}
                            </span>
                          )
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <ToggleSwitch
                  checked={promotion.is_active}
                  onChange={() => handleToggleActive(promotion)}
                  label={phrases.togglePromotionLabel(promotion.title_ru)}
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(promotion)}
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                  >
                    {t.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promotion)}
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-red hover:text-brand-red"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              {editing.id ? t.promotionEdit : t.promotionNew}
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  {editing.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editing.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <label className="inline-block cursor-pointer rounded-full border border-border-soft px-3 py-1.5 text-xs font-medium text-foreground/70 hover:border-brand-red hover:text-brand-red">
                    {uploading ? t.uploading : t.uploadPhoto}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      aria-label={t.uploadPhoto}
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground/70">
                  {t.promotionHeading}
                </p>
                <LangTabs>
                  {(lang) => (
                    <input
                      value={editing[`title_${lang}`] ?? ""}
                      aria-label={`${t.promotionHeading} — ${lang.toUpperCase()}`}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [`title_${lang}`]: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                    />
                  )}
                </LangTabs>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground/70">
                  {t.promotionDescription}
                </p>
                <LangTabs>
                  {(lang) => (
                    <textarea
                      rows={3}
                      value={editing[`description_${lang}`] ?? ""}
                      aria-label={`${t.promotionDescription} — ${lang.toUpperCase()}`}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [`description_${lang}`]: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                    />
                  )}
                </LangTabs>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="promotion-price"
                    className="text-sm font-medium text-foreground/70"
                  >
                    {t.promotionPrice}
                  </label>
                  <input
                    id="promotion-price"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder={t.servicePricePlaceholder}
                    value={editing.price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                  />
                </div>

                <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="promotion-old-price"
                    className="text-sm font-medium text-foreground/70"
                  >
                    {t.promotionOldPrice}
                  </label>
                  <input
                    id="promotion-old-price"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder={t.servicePricePlaceholder}
                    value={editing.old_price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        old_price:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                  />
                </div>

                <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="promotion-deadline"
                    className="text-sm font-medium text-foreground/70"
                  >
                    {t.promotionDeadline}
                  </label>
                  <input
                    id="promotion-deadline"
                    type="date"
                    value={editing.deadline ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        deadline: e.target.value || null,
                      })
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <label className="flex items-center gap-3 text-sm text-foreground/70">
                  <ToggleSwitch
                    checked={editing.is_active}
                    onChange={(checked) =>
                      setEditing({ ...editing, is_active: checked })
                    }
                    label={t.showOnSite}
                  />
                  {t.showOnSite}
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground/70">
                  {t.sortOrder}
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        sort_order: Number(e.target.value),
                      })
                    }
                    className="w-16 rounded-lg border border-border-soft bg-background px-2 py-1 text-sm outline-none focus:border-brand-red"
                  />
                </label>
              </div>

              {error && <p className="text-sm text-brand-red-dark">{error}</p>}

              <div className="mt-2 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-foreground/70"
                >
                  {t.cancel}
                </button>
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
        </div>
      )}
    </div>
  );
}
