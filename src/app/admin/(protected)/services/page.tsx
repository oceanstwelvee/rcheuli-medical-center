"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LangTabs } from "@/components/admin/LangTabs";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { useAdminLanguage } from "@/lib/i18n/AdminLanguageContext";
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
    is_featured: false,
  };
}

export default function ServicesAdminPage() {
  const supabase = createClient();
  const { t, phrases } = useAdminLanguage();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<DraftCategory | null>(
    null
  );
  const [editingService, setEditingService] = useState<DraftService | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const [categoriesRes, servicesRes] = await Promise.all([
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
    ]);
    if (categoriesRes.error || servicesRes.error) {
      console.error(
        "Failed to load services:",
        categoriesRes.error ?? servicesRes.error
      );
      setListError(t.loadFailed);
    } else {
      setListError(null);
    }
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
      setError(t.serviceCategoryTitleRequired);
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
      console.error("Failed to save service category:", result.error);
      setError(t.saveFailed);
      return;
    }
    setEditingCategory(null);
    loadData();
  }

  async function deleteCategory(category: ServiceCategory) {
    if (!window.confirm(phrases.confirmDeleteCategory(category.title_ru)))
      return;
    const { error: deleteError } = await supabase
      .from("service_categories")
      .delete()
      .eq("id", category.id);
    if (deleteError) {
      console.error("Failed to delete service category:", deleteError);
      setListError(t.deleteFailed);
      return;
    }
    setListError(null);
    loadData();
  }

  async function saveService() {
    if (!editingService) return;
    if (!editingService.title_ru.trim()) {
      setError(t.serviceTitleRequired);
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
      ? await supabase
          .from("services")
          .update(payload)
          .eq("id", editingService.id)
      : await supabase.from("services").insert(payload);

    setSaving(false);
    if (result.error) {
      console.error("Failed to save service:", result.error);
      setError(t.saveFailed);
      return;
    }
    setEditingService(null);
    loadData();
  }

  async function deleteService(service: Service) {
    if (!window.confirm(phrases.confirmDeleteService(service.title_ru))) return;
    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id);
    if (deleteError) {
      console.error("Failed to delete service:", deleteError);
      setListError(t.deleteFailed);
      return;
    }
    setListError(null);
    loadData();
  }

  async function handleToggleFeatured(service: Service) {
    const nextFeatured = !service.is_featured;
    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id ? { ...s, is_featured: nextFeatured } : s
      )
    );

    const { error: toggleError } = await supabase
      .from("services")
      .update({ is_featured: nextFeatured })
      .eq("id", service.id);

    if (toggleError) {
      console.error("Failed to toggle service visibility:", toggleError);
      setListError(t.saveFailed);
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, is_featured: service.is_featured } : s
        )
      );
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          {t.servicesTitle}
        </h1>
        <button
          type="button"
          onClick={() =>
            setEditingCategory({
              ...EMPTY_CATEGORY,
              sort_order: categories.length,
            })
          }
          className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          + {t.serviceCategoryAdd}
        </button>
      </div>

      {listError && (
        <p className="mt-4 text-sm text-brand-red-dark">{listError}</p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-foreground/50">{t.loading}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="min-w-0 break-words text-base font-semibold text-brand-red-dark">
                  {category.title_ru}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService(
                        emptyService(
                          category.id,
                          services.filter((s) => s.category_id === category.id)
                            .length
                        )
                      )
                    }
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                  >
                    + {t.serviceAdd}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory({ ...category })}
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                  >
                    {t.change}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-red hover:text-brand-red"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>

              <ul className="mt-4 flex flex-col divide-y divide-border-soft">
                {services
                  .filter((s) => s.category_id === category.id)
                  .map((service) => (
                    <li
                      key={service.id}
                      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 text-sm"
                    >
                      <span className="min-w-0 flex-1 truncate text-foreground/80">
                        {service.title_ru}
                      </span>
                      <span className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <label className="flex items-center gap-1.5 text-xs text-foreground/50">
                          <ToggleSwitch
                            checked={service.is_featured}
                            onChange={() => handleToggleFeatured(service)}
                            label={t.serviceFeatured}
                          />
                          {t.serviceFeatured}
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingService({ ...service })}
                          className="text-xs font-medium text-foreground/50 hover:text-brand-yellow-dark"
                        >
                          {t.change}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service)}
                          className="text-xs font-medium text-foreground/50 hover:text-brand-red"
                        >
                          {t.remove}
                        </button>
                      </span>
                    </li>
                  ))}
                {services.filter((s) => s.category_id === category.id).length ===
                  0 && (
                  <li className="py-2 text-sm text-foreground/40">
                    {t.serviceCategoryEmpty}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              {editingCategory.id ? t.serviceCategoryEdit : t.serviceCategoryNew}
            </h2>
            <div className="mt-5">
              <LangTabs>
                {(lang) => (
                  <input
                    value={editingCategory[`title_${lang}`] ?? ""}
                    aria-label={`${t.serviceCategoryAdd} — ${lang.toUpperCase()}`}
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
            {error && (
              <p className="mt-3 text-sm text-brand-red-dark">{error}</p>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setError(null);
                }}
                className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-foreground/70"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveCategory}
                disabled={saving}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              {editingService.id ? t.serviceEdit : t.serviceNew}
            </h2>
            <div className="mt-5">
              <LangTabs>
                {(lang) => (
                  <input
                    value={editingService[`title_${lang}`] ?? ""}
                    aria-label={`${t.serviceAdd} — ${lang.toUpperCase()}`}
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
              <label
                htmlFor="service-price"
                className="text-sm font-medium text-foreground/70"
              >
                {t.servicePrice}
              </label>
              <input
                id="service-price"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder={t.servicePricePlaceholder}
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

            {error && (
              <p className="mt-3 text-sm text-brand-red-dark">{error}</p>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setError(null);
                }}
                className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-foreground/70"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveService}
                disabled={saving}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
