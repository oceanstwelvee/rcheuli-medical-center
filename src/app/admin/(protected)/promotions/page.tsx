"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LangTabs } from "@/components/admin/LangTabs";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
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
  currency: "GEL",
  deadline: null,
  image_url: "",
  is_active: false,
  sort_order: 0,
};

export default function PromotionsAdminPage() {
  const supabase = createClient();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DraftPromotion | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPromotions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("sort_order");
    if (!error) setPromotions((data as Promotion[]) ?? []);
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
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("promotion-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError("Не удалось загрузить фото: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("promotion-images").getPublicUrl(path);
    setEditing((prev) => (prev ? { ...prev, image_url: data.publicUrl } : prev));
    setUploading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title_ru.trim()) {
      setError("Укажите название акции.");
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
      setError("Ошибка сохранения: " + result.error.message);
      return;
    }

    setEditing(null);
    loadPromotions();
  }

  async function handleDelete(promotion: Promotion) {
    if (!window.confirm(`Удалить акцию «${promotion.title_ru}»?`)) return;
    const { error } = await supabase.from("promotions").delete().eq("id", promotion.id);
    if (!error) loadPromotions();
  }

  async function handleToggleActive(promotion: Promotion) {
    const nextActive = !promotion.is_active;
    setPromotions((prev) =>
      prev.map((p) => (p.id === promotion.id ? { ...p, is_active: nextActive } : p))
    );

    const { error } = await supabase
      .from("promotions")
      .update({ is_active: nextActive })
      .eq("id", promotion.id);

    if (error) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === promotion.id ? { ...p, is_active: promotion.is_active } : p
        )
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Акции</h1>
        <button
          type="button"
          onClick={openNew}
          className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          + Добавить акцию
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-foreground/50">Загрузка...</p>
      ) : promotions.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/50">Пока нет акций.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-surface p-4 shadow-sm"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                {promotion.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={promotion.image_url}
                    alt={promotion.title_ru}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {promotion.title_ru}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {promotion.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Активна
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-foreground/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                      Скрыта
                    </span>
                  )}
                </div>
              </div>

              <ToggleSwitch
                checked={promotion.is_active}
                onChange={() => handleToggleActive(promotion)}
                label={`Показывать акцию «${promotion.title_ru}» на сайте`}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(promotion)}
                  className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(promotion)}
                  className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-red hover:text-brand-red"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              {editing.id ? "Редактировать акцию" : "Новая акция"}
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
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
                    {uploading ? "Загрузка..." : "Загрузить фото"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground/70">
                  Заголовок
                </p>
                <LangTabs>
                  {(lang) => (
                    <input
                      value={editing[`title_${lang}`] ?? ""}
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
                  Описание
                </p>
                <LangTabs>
                  {(lang) => (
                    <textarea
                      rows={3}
                      value={editing[`description_${lang}`] ?? ""}
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
                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/70">
                    Цена (GEL)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="Не указана"
                    value={editing.price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/70">
                    Действует до
                  </label>
                  <input
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

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3 text-sm text-foreground/70">
                  <ToggleSwitch
                    checked={editing.is_active}
                    onChange={(checked) =>
                      setEditing({ ...editing, is_active: checked })
                    }
                    label="Показывать на сайте"
                  />
                  Показывать на сайте
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground/70">
                  Порядок
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

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-foreground/70"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
