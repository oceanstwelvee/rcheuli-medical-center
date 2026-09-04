-- Rcheuli Medical Center — schema
create extension if not exists "pgcrypto";

-- Doctors
create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  specialty_ru text,
  specialty_ka text,
  specialty_en text,
  bio_ru text,
  bio_ka text,
  bio_en text,
  photo_url text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Doctors: languages spoken + extra tag pills (per-language, comma-free arrays)
alter table doctors add column if not exists languages text[] default '{}';
alter table doctors add column if not exists tags_ru text[] default '{}';
alter table doctors add column if not exists tags_ka text[] default '{}';
alter table doctors add column if not exists tags_en text[] default '{}';

-- Service categories
create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  title_ru text not null,
  title_ka text not null,
  title_en text not null,
  sort_order int default 0
);

-- Services
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references service_categories(id) on delete cascade,
  title_ru text not null,
  title_ka text not null,
  title_en text not null,
  price numeric,
  currency text default 'GEL',
  sort_order int default 0
);

-- Promotions
create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title_ru text not null,
  title_ka text not null,
  title_en text not null,
  description_ru text,
  description_ka text,
  description_en text,
  price numeric,
  currency text default 'GEL',
  deadline date,
  image_url text,
  is_active boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Promotions: old (pre-discount) price, shown struck-through next to price
alter table promotions add column if not exists old_price numeric;

alter table promotions enable row level security;

-- Public read: only active promotions
drop policy if exists "public read promotions" on promotions;
create policy "public read promotions" on promotions
  for select using (is_active = true);

-- Authenticated: full access (read all + write), same pattern as doctors/services
drop policy if exists "auth write promotions" on promotions;
create policy "auth write promotions" on promotions for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Promotion photos are stored in the existing "doctor-photos" bucket under a
-- "promotions/" prefix — no separate bucket/policies needed.

-- Site content (key/value, multilingual)
create table if not exists site_content (
  key text primary key,
  value_ru text,
  value_ka text,
  value_en text
);

-- RLS
alter table doctors enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table site_content enable row level security;

-- Public read
drop policy if exists "public read doctors" on doctors;
create policy "public read doctors" on doctors for select using (true);

drop policy if exists "public read service_categories" on service_categories;
create policy "public read service_categories" on service_categories for select using (true);

drop policy if exists "public read services" on services;
create policy "public read services" on services for select using (true);

drop policy if exists "public read site_content" on site_content;
create policy "public read site_content" on site_content for select using (true);

-- Authenticated write
drop policy if exists "auth write doctors" on doctors;
create policy "auth write doctors" on doctors for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth write service_categories" on service_categories;
create policy "auth write service_categories" on service_categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth write services" on services;
create policy "auth write services" on services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth write site_content" on site_content;
create policy "auth write site_content" on site_content for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed: about us
insert into site_content (key, value_ru, value_ka, value_en) values (
  'about_us',
  'Rcheuli Medical Center — современная многопрофильная клиника в Тбилиси, где для каждого пациента доступны консультации ведущих врачей, точная диагностика и лабораторные исследования европейского уровня. Мы объединяем внимательный подход к пациенту с современным медицинским оборудованием и опытной командой специалистов.',
  'Rcheuli Medical Center არის თანამედროვე მრავალპროფილური კლინიკა თბილისში, სადაც პაციენტებს შეუძლიათ ისარგებლონ წამყვანი ექიმების კონსულტაციით, ზუსტი დიაგნოსტიკითა და ევროპული დონის ლაბორატორიული კვლევებით. ჩვენ ვაერთიანებთ პაციენტისადმი ყურადღებიან მიდგომას თანამედროვე აღჭურვილობასთან და გამოცდილ სპეციალისტთა გუნდთან.',
  'Rcheuli Medical Center is a modern multidisciplinary clinic in Tbilisi, offering consultations with leading doctors, precise diagnostics, and laboratory testing at a European standard. We combine an attentive approach to every patient with modern equipment and an experienced team of specialists.'
) on conflict (key) do nothing;

-- Seed: service categories
insert into service_categories (title_ru, title_ka, title_en, sort_order) values
  ('Консультации и направления', 'კონსულტაციები და მიმართვები', 'Consultations & Referrals', 1),
  ('Функциональная диагностика и инструментальные исследования', 'ფუნქციური დიაგნოსტიკა და ინსტრუმენტული კვლევები', 'Functional Diagnostics & Instrumental Tests', 2),
  ('Лабораторные исследования', 'ლაბორატორიული კვლევები', 'Laboratory Tests', 3),
  ('Вакцинация', 'ვაქცინაცია', 'Vaccination', 4)
on conflict do nothing;

-- Seed: services (category 1 — Consultations & Referrals)
insert into services (category_id, title_ru, title_ka, title_en, sort_order)
select id, v.title_ru, v.title_ka, v.title_en, v.sort_order
from service_categories, (values
  ('Персональная консультация врача', 'ექიმის პერსონალური კონსულტაცია', 'Personal doctor consultation', 1),
  ('Ангиология', 'ანგიოლოგია', 'Angiology', 2),
  ('Педиатрия', 'პედიატრია', 'Pediatrics', 3),
  ('Кардиологические услуги', 'კარდიოლოგიური მომსახურება', 'Cardiology services', 4),
  ('Оториноларингология', 'ოტორინოლარინგოლოგია', 'Otorhinolaryngology (ENT)', 5),
  ('Травматология-ортопедия', 'ტრავმატოლოგია-ორთოპედია', 'Traumatology & Orthopedics', 6),
  ('Общая хирургия', 'ზოგადი ქირურგია', 'General surgery', 7),
  ('Эндокринология', 'ენდოკრინოლოგია', 'Endocrinology', 8),
  ('Неврология', 'ნევროლოგია', 'Neurology', 9),
  ('Терапия', 'თერაპია', 'Internal medicine (Therapy)', 10),
  ('Урология', 'უროლოგია', 'Urology', 11),
  ('Гинекология', 'გინეკოლოგია', 'Gynecology', 12),
  ('Проктология', 'პროქტოლოგია', 'Proctology', 13),
  ('Ревматология', 'რევმატოლოგია', 'Rheumatology', 14),
  ('Дерматовенерология', 'დერმატოვენეროლოგია', 'Dermatovenereology', 15),
  ('Гастроэнтерология', 'გასტროენტეროლოგია', 'Gastroenterology', 16),
  ('Физиотерапия', 'ფიზიოთერაპია', 'Physiotherapy', 17),
  ('Маммология', 'მამოლოგია', 'Mammology', 18),
  ('Кабинет иммунизации', 'იმუნიზაციის კაბინეტი', 'Immunization room', 19),
  ('Полный сервис вызова врача на дом', 'ექიმის სახლში გამოძახების სრული სერვისი', 'Full doctor house-call service', 20)
) as v(title_ru, title_ka, title_en, sort_order)
where service_categories.title_ru = 'Консультации и направления';

-- Seed: services (category 2 — Functional diagnostics)
insert into services (category_id, title_ru, title_ka, title_en, sort_order)
select id, v.title_ru, v.title_ka, v.title_en, v.sort_order
from service_categories, (values
  ('Ультразвуковые исследования', 'ულტრაბგერითი კვლევები', 'Ultrasound examinations', 1),
  ('Эхокардиография', 'ექოკარდიოგრაფია', 'Echocardiography', 2),
  ('Суточное и 48-часовое мониторирование ЭКГ (Холтер)', 'ეკგ-ს 24-საათიანი და 48-საათიანი მონიტორინგი (ჰოლტერი)', '24-hour and 48-hour ECG monitoring (Holter)', 3),
  ('Оториноларингологические услуги', 'ოტორინოლარინგოლოგიური მომსახურება', 'ENT services', 4)
) as v(title_ru, title_ka, title_en, sort_order)
where service_categories.title_ru = 'Функциональная диагностика и инструментальные исследования';

-- Seed: services (category 3 — Laboratory tests)
insert into services (category_id, title_ru, title_ka, title_en, sort_order)
select id, v.title_ru, v.title_ka, v.title_en, v.sort_order
from service_categories, (values
  ('Клинические лабораторные исследования', 'კლინიკური ლაბორატორიული კვლევები', 'Clinical laboratory tests', 1),
  ('Гематология', 'ჰემატოლოგია', 'Hematology', 2),
  ('Биохимия', 'ბიოქიმია', 'Biochemistry', 3),
  ('Серология, иммунология', 'სეროლოგია, იმუნოლოგია', 'Serology, immunology', 4),
  ('Исследование системы свертывания крови', 'სისხლის შედედების სისტემის კვლევა', 'Blood coagulation testing', 5),
  ('Цитологические исследования', 'ციტოლოგიური კვლევები', 'Cytology tests', 6),
  ('Гистологические, иммуногистохимические, генетические и молекулярные исследования', 'ჰისტოლოგიური, იმუნოჰისტოქიმიური, გენეტიკური და მოლეკულური კვლევები', 'Histological, immunohistochemical, genetic and molecular tests', 7)
) as v(title_ru, title_ka, title_en, sort_order)
where service_categories.title_ru = 'Лабораторные исследования';

-- Seed: services (category 4 — Vaccination)
insert into services (category_id, title_ru, title_ka, title_en, sort_order)
select id, v.title_ru, v.title_ka, v.title_en, v.sort_order
from service_categories, (values
  ('Плановая вакцинация (для детей, согласно календарю прививок)', 'გეგმიური ვაქცინაცია (ბავშვებისთვის, აცრების კალენდრის მიხედვით)', 'Scheduled vaccination (for children, per immunization schedule)', 1)
) as v(title_ru, title_ka, title_en, sort_order)
where service_categories.title_ru = 'Вакцинация';

-- Seed: demo doctors (examples — replace via admin panel)
insert into doctors (full_name, specialty_ru, specialty_ka, specialty_en, bio_ru, bio_ka, bio_en, sort_order, is_active) values
  ('Доктор — пример', 'Терапия', 'თერაპია', 'Internal medicine (Therapy)', 'Пример карточки врача. Замените через админ-панель.', 'ექიმის ბარათის მაგალითი. შეცვალეთ ადმინ პანელიდან.', 'Example doctor card. Replace via the admin panel.', 1, true),
  ('Доктор — пример', 'Кардиология', 'კარდიოლოგია', 'Cardiology', 'Пример карточки врача. Замените через админ-панель.', 'ექიმის ბარათის მაგალითი. შეცვალეთ ადმინ პანელიდან.', 'Example doctor card. Replace via the admin panel.', 2, true),
  ('Доктор — пример', 'Педиатрия', 'პედიატრია', 'Pediatrics', 'Пример карточки врача. Замените через админ-панель.', 'ექიმის ბარათის მაგალითი. შეცვალეთ ადმინ პანელიდან.', 'Example doctor card. Replace via the admin panel.', 3, true)
on conflict do nothing;
