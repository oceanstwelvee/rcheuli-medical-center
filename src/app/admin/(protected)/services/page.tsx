"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LangTabs } from "@/components/admin/LangTabs";
import type { Service, ServiceCategory } from "@/types/database";

type DraftCategory = Omit<ServiceCategory, "id"> & { id?: string };
type DraftService = Omit<Service, "id"> & { id?: string };

const EMPTY_CATEGORY: DraftCategory = {
  title_ru: "",
  title_ka: "",
  title_en: "",
  sort_order: 0,
};

function emptyService(categoryId: string, sortOrder: number): DraftService {
  return {
    category_id: categoryId,
    title_ru: "",
    title_ka: "",
    title_en: "",
    price: null,
    currency: "GEL",
    sort_order: sortOrder,
  };
}

export default function ServicesAdminPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<DraftCategory | null>(null);
  const [editingService, setEditingService] = useState<DraftService | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const [categoriesRes, servicesRes] = await Promise.all([
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
    ]);
    setCategories((categoriesRes.data as ServiceCategory[]) ?? []);
    setServices((servicesRes.data as Service[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveCategory() {
    if (!editingCategory) return;
    if (!editingCategory.title_ru.trim()) {
      setError("Укажите название категории (хотя бы по-русски).");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title_ru: editingCategory.title_ru,
      title_ka: editingCategory.title_ka,
      title_en: editingCategory.title_en,
      sort_order: editingCategory.sort_order,
    };

    const result = editingCategory.id
      ? await supabase
          .from("service_categories")
          .update(payload)
          .eq("id", editingCategory.id)
      : await supabase.from("service_categories").insert(payload);

    setSaving(false);
    if (result.error) {
      setError("Ошибка сохранения: " + result.error.message);
      return;
    }
    setEditingCategory(null);
    loadData();
  }

  async function deleteCategory(category: ServiceCategory) {
    if (
      !window.confirm(
        `Удалить категорию «${category.title_ru}» вместе со всеми её услугами?`
      )
    )
      return;
    const { error } = await supabase
      .from("service_categories")
      .delete()
      .eq("id", category.id);
    if (!error) loadData();
  }

  async function saveService() {
    if (!editingService) return;
    if (!editingService.title_ru.trim()) {
      setError("Укажите название услуги (хотя бы по-русски).");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      category_id: editingService.category_id,
      title_ru: editingService.title_ru,
      title_ka: editingService.title_ka,
      title_en: editingService.title_en,
      price: editingService.price,
      sort_order: editingService.sort_order,
    };

    const result = editingService.id
      ? await supabase.from("services").update(payload).eq("id", editingService.id)
      : await supabase.from("services").insert(payload);

    setSaving(false);
    if (result.error) {
      setError("Ошибка сохранения: " + result.error.message);
      return;
    }
    setEditingService(null);
    loadData();
  }

  async function deleteService(service: Service) {
    if (!window.confirm(`Удалить услугу «${service.title_ru}»?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", service.id);
    if (!error) loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Услуги</h1>
        <button
          type="button"
          onClick={() =>
            setEditingCategory({ ...EMPTY_CATEGORY, sort_order: categories.length })
          }
          className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          + Категория
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-foreground/50">Загрузка...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-brand-red-dark">
                  {category.title_ru}
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService(
                        emptyService(
                          category.id,
                          services.filter((s) => s.category_id === category.id).length
                        )
                      )
                    }
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                  >
                    + Услуга
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory({ ...category })}
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-red hover:text-brand-red"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              <ul className="mt-4 flex flex-col divide-y divide-border-soft">
                {services
                  .filter((s) => s.category_id === category.id)
                  .map((service) => (
                    <li
                      key={service.id}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="text-foreground/80">{service.title_ru}</span>
                      <span className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingService({ ...service })}
                          className="text-xs font-medium text-foreground/50 hover:text-brand-yellow-dark"
                        >
                          Изменить
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service)}
                          className="text-xs font-medium text-foreground/50 hover:text-brand-red"
                        >
                          Удалить
                        </button>
                      </span>
                    </li>
                  ))}
                {services.filter((s) => s.category_id === category.id).length === 0 && (
                  <li className="py-2 text-sm text-foreground/40">Нет услуг</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              {editingCategory.id ? "Изменить категорию" : "Новая категория"}
            </h2>
            <div className="mt-5">
              <LangTabs>
                {(lang) => (
                  <input
                    value={editingCategory[`title_${lang}`] ?? ""}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        [`title_${lang}`]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                  />
                )}
              </LangTabs>
            </div>
            {error && <p className="mt-3 text-sm text-brand-red-dark">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setError(null);
                }}
                className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-foreground/70"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={saveCategory}
                disabled={saving}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              {editingService.id ? "Изменить услугу" : "Новая услуга"}
            </h2>
            <div className="mt-5">
              <LangTabs>
                {(lang) => (
                  <input
                    value={editingService[`title_${lang}`] ?? ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        [`title_${lang}`]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                  />
                )}
              </LangTabs>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/70">
                Цена (GEL)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder="Не указана"
                value={editingService.price ?? ""}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    price: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
              />
            </div>

            {error && <p className="mt-3 text-sm text-brand-red-dark">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setError(null);
                }}
                className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-foreground/70"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={saveService}
                disabled={saving}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
