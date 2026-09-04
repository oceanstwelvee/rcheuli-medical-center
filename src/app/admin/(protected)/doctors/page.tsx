"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/Avatar";
import { LangTabs } from "@/components/admin/LangTabs";
import { LANGS } from "@/lib/i18n/translations";
import type { Doctor, Lang } from "@/types/database";

const LANGUAGE_CHECKBOX_LABELS: Record<Lang, string> = {
  ka: "Грузинский",
  ru: "Русский",
  en: "Английский",
};

type DraftDoctor = Omit<
  Doctor,
  "id" | "created_at" | "tags_ru" | "tags_ka" | "tags_en"
> & {
  id?: string;
  tags_ru: string;
  tags_ka: string;
  tags_en: string;
};

const EMPTY_DRAFT: DraftDoctor = {
  full_name: "",
  specialty_ru: "",
  specialty_ka: "",
  specialty_en: "",
  bio_ru: "",
  bio_ka: "",
  bio_en: "",
  photo_url: "",
  languages: [],
  tags_ru: "",
  tags_ka: "",
  tags_en: "",
  sort_order: 0,
  is_active: true,
};

function tagsArrayToInput(tags: string[] | null | undefined) {
  return (tags ?? []).join(", ");
}

function tagsInputToArray(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function DoctorsAdminPage() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DraftDoctor | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDoctors() {
    setLoading(true);
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("sort_order");
    if (!error) setDoctors((data as Doctor[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openNew() {
    setError(null);
    setEditing({ ...EMPTY_DRAFT, sort_order: doctors.length });
  }

  function openEdit(doctor: Doctor) {
    setError(null);
    setEditing({
      ...doctor,
      tags_ru: tagsArrayToInput(doctor.tags_ru),
      tags_ka: tagsArrayToInput(doctor.tags_ka),
      tags_en: tagsArrayToInput(doctor.tags_en),
    });
  }

  function toggleLanguage(lang: Lang) {
    setEditing((prev) => {
      if (!prev) return prev;
      const has = prev.languages.includes(lang);
      const languages = has
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("doctor-photos")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError("Не удалось загрузить фото: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("doctor-photos").getPublicUrl(path);
    setEditing((prev) => (prev ? { ...prev, photo_url: data.publicUrl } : prev));
    setUploading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.full_name.trim()) {
      setError("Укажите имя врача.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      full_name: editing.full_name,
      specialty_ru: editing.specialty_ru,
      specialty_ka: editing.specialty_ka,
      specialty_en: editing.specialty_en,
      bio_ru: editing.bio_ru,
      bio_ka: editing.bio_ka,
      bio_en: editing.bio_en,
      photo_url: editing.photo_url || null,
      languages: editing.languages,
      tags_ru: tagsInputToArray(editing.tags_ru),
      tags_ka: tagsInputToArray(editing.tags_ka),
      tags_en: tagsInputToArray(editing.tags_en),
      sort_order: editing.sort_order,
      is_active: editing.is_active,
    };

    const result = editing.id
      ? await supabase.from("doctors").update(payload).eq("id", editing.id)
      : await supabase.from("doctors").insert(payload);

    setSaving(false);

    if (result.error) {
      setError("Ошибка сохранения: " + result.error.message);
      return;
    }

    setEditing(null);
    loadDoctors();
  }

  async function handleDelete(doctor: Doctor) {
    if (!window.confirm(`Удалить врача «${doctor.full_name}»?`)) return;
    const { error } = await supabase.from("doctors").delete().eq("id", doctor.id);
    if (!error) loadDoctors();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Врачи</h1>
        <button
          type="button"
          onClick={openNew}
          className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          + Добавить врача
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-foreground/50">Загрузка...</p>
      ) : doctors.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/50">Пока нет врачей.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border-soft bg-surface p-5 text-center shadow-sm"
            >
              <Avatar name={doctor.full_name} photoUrl={doctor.photo_url} size={72} />
              <div>
                <p className="font-semibold text-foreground">{doctor.full_name}</p>
                <p className="text-sm text-foreground/60">{doctor.specialty_ru}</p>
                {!doctor.is_active && (
                  <p className="mt-1 text-xs font-medium text-brand-red-dark">скрыт</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(doctor)}
                  className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-foreground/70 hover:border-brand-yellow-dark hover:text-brand-yellow-dark"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doctor)}
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
              {editing.id ? "Редактировать врача" : "Новый врач"}
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar name={editing.full_name || "?"} photoUrl={editing.photo_url} size={64} />
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

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/70">Имя врача</label>
                <input
                  value={editing.full_name}
                  onChange={(e) =>
                    setEditing({ ...editing, full_name: e.target.value })
                  }
                  className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground/70">
                  Специализация
                </p>
                <LangTabs>
                  {(lang) => (
                    <input
                      value={editing[`specialty_${lang}`] ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [`specialty_${lang}`]: e.target.value,
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
                      value={editing[`bio_${lang}`] ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [`bio_${lang}`]: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                    />
                  )}
                </LangTabs>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground/70">
                  Теги
                </p>
                <LangTabs>
                  {(lang) => (
                    <input
                      value={editing[`tags_${lang}`]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [`tags_${lang}`]: e.target.value,
                        })
                      }
                      placeholder="Например: Пациенты 18+, Хирургия"
                      className="w-full rounded-lg border border-border-soft bg-background px-3 py-2 text-sm outline-none focus:border-brand-red"
                    />
                  )}
                </LangTabs>
                <p className="mt-1 text-xs text-foreground/45">
                  Теги через запятую
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-foreground/70">
                  Языки
                </p>
                <div className="flex flex-wrap gap-4">
                  {LANGS.map((lang) => (
                    <label
                      key={lang}
                      className="flex items-center gap-2 text-sm text-foreground/70"
                    >
                      <input
                        type="checkbox"
                        checked={editing.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                      />
                      {LANGUAGE_CHECKBOX_LABELS[lang]}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground/70">
                  <input
                    type="checkbox"
                    checked={editing.is_active}
                    onChange={(e) =>
                      setEditing({ ...editing, is_active: e.target.checked })
                    }
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
