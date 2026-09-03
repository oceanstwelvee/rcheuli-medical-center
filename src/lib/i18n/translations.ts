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
  aboutTitle: string;
  servicesTitle: string;
  doctorsTitle: string;
  doctorsExampleBadge: string;
  contactsTitle: string;
  contactsAddressLabel: string;
  contactsPhoneLabel: string;
  contactsSocialLabel: string;
  footerRights: string;
  loading: string;
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
    aboutTitle: "ჩვენ შესახებ",
    servicesTitle: "სერვისები",
    doctorsTitle: "ჩვენი ექიმები",
    doctorsExampleBadge: "მაგალითი",
    contactsTitle: "კონტაქტი",
    contactsAddressLabel: "მისამართი",
    contactsPhoneLabel: "ტელეფონი",
    contactsSocialLabel: "სოციალური ქსელები",
    footerRights: "ყველა უფლება დაცულია",
    loading: "იტვირთება...",
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
    aboutTitle: "О нас",
    servicesTitle: "Услуги",
    doctorsTitle: "Наши врачи",
    doctorsExampleBadge: "пример",
    contactsTitle: "Контакты",
    contactsAddressLabel: "Адрес",
    contactsPhoneLabel: "Телефон",
    contactsSocialLabel: "Соцсети",
    footerRights: "Все права защищены",
    loading: "Загрузка...",
  },
  en: {
    clinicName: "Rcheuli Medical Center",
    navAbout: "About us",
    navServices: "Services",
    navDoctors: "Doctors",
    navContacts: "Contacts",
    callButton: "Call us",
    addressButton: "Our address",
    heroTitle: "Rcheuli Medical Center",
    heroSubtitle: "A modern multidisciplinary clinic in the heart of Tbilisi",
    aboutTitle: "About us",
    servicesTitle: "Services",
    doctorsTitle: "Our doctors",
    doctorsExampleBadge: "example",
    contactsTitle: "Contacts",
    contactsAddressLabel: "Address",
    contactsPhoneLabel: "Phone",
    contactsSocialLabel: "Social media",
    footerRights: "All rights reserved",
    loading: "Loading...",
  },
};
