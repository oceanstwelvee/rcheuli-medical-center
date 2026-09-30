import type { Lang } from "@/types/database";

export const LANGS: Lang[] = ["ka", "ru", "en"];

export const LANG_LABELS: Record<Lang, string> = {
  ka: "KA",
  ru: "RU",
  en: "EN",
};

export interface Dict {
  clinicName: string;
  navAbout: string;
  navServices: string;
  navDoctors: string;
  navContacts: string;
  callButton: string;
  addressButton: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCityBadge: string;
  heroFeature1: string;
  heroFeature2: string;
  heroFeature3: string;
  heroFeature4: string;
  aboutTitle: string;
  servicesPageTitle: string;
  servicesPageSubtitle: string;
  servicesSearchPlaceholder: string;
  servicesAllCategories: string;
  servicesPriceOnRequest: string;
  servicesNoResults: string;
  servicesPreviewTitle: string;
  servicesPreviewSubtitle: string;
  servicesPreviewEmpty: string;
  servicesViewAllButton: string;
  doctorsTitle: string;
  doctorsPageSubtitle: string;
  doctorsSearchPlaceholder: string;
  doctorsAllSpecialties: string;
  doctorsLanguagesLabel: string;
  doctorsNoResults: string;
  doctorsPreviewSubtitle: string;
  doctorsPreviewEmpty: string;
  doctorsViewAllButton: string;
  promotionsTitle: string;
  promotionsUntilLabel: string;
  contactsTitle: string;
  contactsAddressLabel: string;
  contactsPhoneLabel: string;
  contactsEmailLabel: string;
  contactsSocialLabel: string;
  footerRights: string;
  footerAboutTitle: string;
  footerNavTitle: string;
  footerBookTitle: string;
  footerBookText: string;
  loading: string;
  adminServiceFeaturedLabel: string;
}

export const translations: Record<Lang, Dict> = {
  ka: {
    clinicName: "Rcheuli Medical Center",
    navAbout: "ჩვენ შესახებ",
    navServices: "სერვისები",
    navDoctors: "ექიმები",
    navContacts: "კონტაქტი",
    callButton: "დარეკვა",
    addressButton: "ჩვენი მისამართი",
    heroTitle: "Rcheuli Medical Center",
    heroSubtitle: "თანამედროვე მრავალპროფილური კლინიკა თბილისის გულში",
    heroCityBadge: "თბილისი",
    heroFeature1: "გამოცდილი ექიმები",
    heroFeature2: "თანამედროვე აღჭურვილობა",
    heroFeature3: "ინდივიდუალური მიდგომა",
    heroFeature4: "ზრუნვა თითოეულზე",
    aboutTitle: "ჩვენ შესახებ",
    servicesPageTitle: "სერვისები და ფასები",
    servicesPageSubtitle: "სრული ჩამონათვალი ჩვენი სერვისებისა და ფასების შესახებ",
    servicesSearchPlaceholder: "მოძებნეთ სერვისი...",
    servicesAllCategories: "ყველა კატეგორია",
    servicesPriceOnRequest: "საფასო წარმოადგინეთ მოთხოვნით",
    servicesNoResults: "სერვისები ვერ მოიძებნა",
    servicesPreviewTitle: "ჩვენი სერვისები",
    servicesPreviewSubtitle: "ყველაზე მოთხოვნადი სერვისები ჩვენი კლინიკიდან",
    servicesPreviewEmpty: "ინფორმაცია მალე გამოჩნდება",
    servicesViewAllButton: "ყველა სერვისი და ფასი",
    doctorsTitle: "ჩვენი ექიმები",
    doctorsPageSubtitle: "იპოვეთ თქვენი ექიმი სპეციალობის, ენის ან სახელის მიხედვით",
    doctorsSearchPlaceholder: "ექიმის ძებნა...",
    doctorsAllSpecialties: "ყველა სპეციალობა",
    doctorsLanguagesLabel: "ენები:",
    doctorsNoResults: "ექიმები ვერ მოიძებნა",
    doctorsPreviewSubtitle: "ჩვენი გამოცდილი სამედიცინო გუნდი",
    doctorsPreviewEmpty: "ინფორმაცია მალე გამოჩნდება",
    doctorsViewAllButton: "ყველა ექიმი",
    promotionsTitle: "აქციები",
    promotionsUntilLabel: "ვადა:",
    contactsTitle: "კონტაქტი",
    contactsAddressLabel: "მისამართი",
    contactsPhoneLabel: "ტელეფონი",
    contactsEmailLabel: "ელ. ფოსტა",
    contactsSocialLabel: "სოციალური ქსელები",
    footerRights: "ყველა უფლება დაცულია",
    footerAboutTitle: "კლინიკის შესახებ",
    footerNavTitle: "ნავიგაცია",
    footerBookTitle: "კონსულტაციაზე ჩაწერა",
    footerBookText: "ჩასაწერად აირჩიეთ თქვენთვის მოსახერხებელი დრო",
    loading: "იტვირთება...",
    adminServiceFeaturedLabel: "მთავარ გვერდზე ჩვენება",
  },
  ru: {
    clinicName: "Rcheuli Medical Center",
    navAbout: "О нас",
    navServices: "Услуги",
    navDoctors: "Врачи",
    navContacts: "Контакты",
    callButton: "Позвонить",
    addressButton: "Наш адрес",
    heroTitle: "Rcheuli Medical Center",
    heroSubtitle: "Современная многопрофильная клиника в самом сердце Тбилиси",
    heroCityBadge: "ТБИЛИСИ",
    heroFeature1: "Опытные врачи",
    heroFeature2: "Современное оборудование",
    heroFeature3: "Индивидуальный подход",
    heroFeature4: "Забота о каждом",
    aboutTitle: "О нас",
    servicesPageTitle: "Услуги и цены",
    servicesPageSubtitle: "Полный перечень наших услуг и актуальные цены",
    servicesSearchPlaceholder: "Поиск услуги...",
    servicesAllCategories: "Все категории",
    servicesPriceOnRequest: "Цена по запросу",
    servicesNoResults: "Услуги не найдены",
    servicesPreviewTitle: "Наши услуги",
    servicesPreviewSubtitle: "Самые востребованные услуги нашей клиники",
    servicesPreviewEmpty: "Информация скоро появится",
    servicesViewAllButton: "Все услуги и цены",
    doctorsTitle: "Наши врачи",
    doctorsPageSubtitle: "Найдите своего врача по специальности, языку общения или имени",
    doctorsSearchPlaceholder: "Поиск врача...",
    doctorsAllSpecialties: "Все специализации",
    doctorsLanguagesLabel: "Языки:",
    doctorsNoResults: "Врачи не найдены",
    doctorsPreviewSubtitle: "Наша опытная команда врачей",
    doctorsPreviewEmpty: "Информация скоро появится",
    doctorsViewAllButton: "Все врачи",
    promotionsTitle: "Акции",
    promotionsUntilLabel: "до",
    contactsTitle: "Контакты",
    contactsAddressLabel: "Адрес",
    contactsPhoneLabel: "Телефон",
    contactsEmailLabel: "Email",
    contactsSocialLabel: "Соцсети",
    footerRights: "Все права защищены",
    footerAboutTitle: "О клинике",
    footerNavTitle: "Навигация",
    footerBookTitle: "Записаться на консультацию",
    footerBookText: "Для записи выберите удобное время",
    loading: "Загрузка...",
    adminServiceFeaturedLabel: "Показывать на главной",
  },
  en: {
    clinicName: "Rcheuli Medical Center",
    navAbout: "About us",
    navServices: "Services",
    navDoctors: "Doctors",
    navContacts: "Contacts",
    callButton: "Call us",
    addressButton: "Our Address",
    heroTitle: "Rcheuli Medical Center",
    heroSubtitle: "A modern multidisciplinary clinic in the heart of Tbilisi",
    heroCityBadge: "TBILISI",
    heroFeature1: "Experienced Doctors",
    heroFeature2: "Modern Equipment",
    heroFeature3: "Individual Approach",
    heroFeature4: "Care for Everyone",
    aboutTitle: "About us",
    servicesPageTitle: "Services & Prices",
    servicesPageSubtitle: "Full list of our services and current prices",
    servicesSearchPlaceholder: "Search services...",
    servicesAllCategories: "All categories",
    servicesPriceOnRequest: "Price on request",
    servicesNoResults: "No services found",
    servicesPreviewTitle: "Our services",
    servicesPreviewSubtitle: "The most requested services at our clinic",
    servicesPreviewEmpty: "Information coming soon",
    servicesViewAllButton: "All services & prices",
    doctorsTitle: "Our doctors",
    doctorsPageSubtitle: "Find your doctor by specialty, language, or name",
    doctorsSearchPlaceholder: "Search doctor...",
    doctorsAllSpecialties: "All specialties",
    doctorsLanguagesLabel: "Languages:",
    doctorsNoResults: "No doctors found",
    doctorsPreviewSubtitle: "Our experienced medical team",
    doctorsPreviewEmpty: "Information coming soon",
    doctorsViewAllButton: "All doctors",
    promotionsTitle: "Actions",
    promotionsUntilLabel: "until",
    contactsTitle: "Contacts",
    contactsAddressLabel: "Address",
    contactsPhoneLabel: "Phone",
    contactsEmailLabel: "Email",
    contactsSocialLabel: "Social media",
    footerRights: "All rights reserved",
    footerAboutTitle: "About the clinic",
    footerNavTitle: "Navigation",
    footerBookTitle: "Book a consultation",
    footerBookText: "Choose a convenient time to book your appointment",
    loading: "Loading...",
    adminServiceFeaturedLabel: "Show on homepage",
  },
};

// Display name of each spoken-language code, per current site language.
export const LANGUAGE_NAMES: Record<Lang, Record<Lang, string>> = {
  ka: { ka: "ქართული", ru: "Грузинский", en: "Georgian" },
  ru: { ka: "რუსული", ru: "Русский", en: "Russian" },
  en: { ka: "ინგლისური", ru: "Английский", en: "English" },
};

// BCP-47 locale for formatting dates/numbers per current site language.
export const DATE_LOCALES: Record<Lang, string> = {
  ka: "ka-GE",
  ru: "ru-RU",
  en: "en-US",
};
