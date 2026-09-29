import { translations } from "./translations";

/**
 * The admin panel is for the clinic's management, who are Georgian, so it ships
 * only ka and ru — English is a content language for the public site, not an
 * interface language here. Kept separate from the public dictionary because the
 * two switch independently.
 */
export type AdminLang = "ka" | "ru";

export const ADMIN_LANGS: AdminLang[] = ["ka", "ru"];

export const ADMIN_LANG_LABELS: Record<AdminLang, string> = {
  ka: "KA",
  ru: "RU",
};

export interface AdminDict {
  // shell
  panelTitle: string;
  navDoctors: string;
  navServices: string;
  navPromotions: string;
  navAbout: string;
  signOut: string;
  logoAlt: string;
  switchLanguage: string;

  // login
  loginSubtitle: string;
  loginEmail: string;
  loginPassword: string;
  loginSubmit: string;
  loginSubmitting: string;
  loginFailed: string;

  // shared controls
  save: string;
  saving: string;
  saved: string;
  cancel: string;
  edit: string;
  change: string;
  remove: string;
  loading: string;
  uploadPhoto: string;
  uploading: string;
  showOnSite: string;
  sortOrder: string;

  // shared failures (details go to console.error, never to the screen)
  saveFailed: string;
  deleteFailed: string;
  uploadFailed: string;
  loadFailed: string;

  // doctors
  doctorsTitle: string;
  doctorsAdd: string;
  doctorsEmpty: string;
  doctorsHiddenBadge: string;
  doctorNew: string;
  doctorEdit: string;
  doctorFullName: string;
  doctorSpecialty: string;
  doctorBio: string;
  doctorTags: string;
  doctorTagsPlaceholder: string;
  doctorTagsHint: string;
  doctorLanguages: string;
  doctorNameRequired: string;
  doctorPhotoAlt: string;
  contentLangKa: string;
  contentLangRu: string;
  contentLangEn: string;

  // services
  servicesTitle: string;
  serviceCategoryAdd: string;
  serviceAdd: string;
  serviceCategoryNew: string;
  serviceCategoryEdit: string;
  serviceNew: string;
  serviceEdit: string;
  serviceCategoryEmpty: string;
  servicePrice: string;
  servicePricePlaceholder: string;
  serviceFeatured: string;
  serviceCategoryTitleRequired: string;
  serviceTitleRequired: string;

  // promotions
  promotionsTitle: string;
  promotionsAdd: string;
  promotionsEmpty: string;
  promotionActive: string;
  promotionHidden: string;
  promotionNew: string;
  promotionEdit: string;
  promotionHeading: string;
  promotionDescription: string;
  promotionPrice: string;
  promotionOldPrice: string;
  promotionDeadline: string;
  promotionTitleRequired: string;
  promotionImageAlt: string;

  // about
  aboutTitle: string;
  aboutHint: string;
}

/**
 * Labels that also exist on the public site reuse its Georgian wording, so the
 * panel and the site never name the same section two different ways.
 */
const publicKa = translations.ka;

export const adminTranslations: Record<AdminLang, AdminDict> = {
  ka: {
    panelTitle: "ადმინ-პანელი",
    navDoctors: publicKa.navDoctors,
    navServices: publicKa.navServices,
    navPromotions: publicKa.promotionsTitle,
    navAbout: publicKa.navAbout,
    signOut: "გასვლა",
    logoAlt: "Rcheuli Medical Center",
    switchLanguage: "პანელის ენა",

    loginSubtitle: "ადმინისტრატორის პანელი",
    loginEmail: "Email",
    loginPassword: "პაროლი",
    loginSubmit: "შესვლა",
    loginSubmitting: "შესვლა...",
    loginFailed: "არასწორი email ან პაროლი.",

    save: "შენახვა",
    saving: "ინახება...",
    saved: "შენახულია.",
    cancel: "გაუქმება",
    edit: "რედაქტირება",
    change: "შეცვლა",
    remove: "წაშლა",
    loading: "იტვირთება...",
    uploadPhoto: "ფოტოს ატვირთვა",
    uploading: "იტვირთება...",
    showOnSite: "საიტზე ჩვენება",
    sortOrder: "თანმიმდევრობა",

    saveFailed: "შენახვის შეცდომა, სცადეთ თავიდან",
    deleteFailed: "წაშლის შეცდომა, სცადეთ თავიდან",
    uploadFailed: "ფოტოს ატვირთვის შეცდომა, სცადეთ თავიდან",
    loadFailed: "მონაცემები ვერ ჩაიტვირთა, განაახლეთ გვერდი",

    doctorsTitle: publicKa.navDoctors,
    doctorsAdd: "ექიმის დამატება",
    doctorsEmpty: "ექიმები ჯერ არ არის დამატებული.",
    doctorsHiddenBadge: "დამალულია",
    doctorNew: "ახალი ექიმი",
    doctorEdit: "ექიმის რედაქტირება",
    doctorFullName: "ექიმის სახელი",
    doctorSpecialty: "სპეციალობა",
    doctorBio: "აღწერა",
    doctorTags: "ტეგები",
    doctorTagsPlaceholder: "მაგალითად: პაციენტები 18+, ქირურგია",
    doctorTagsHint: "ტეგები მძიმით გამოყავით",
    doctorLanguages: "ენები",
    doctorNameRequired: "მიუთითეთ ექიმის სახელი.",
    doctorPhotoAlt: "ექიმის ფოტო",
    contentLangKa: "ქართული",
    contentLangRu: "რუსული",
    contentLangEn: "ინგლისური",

    servicesTitle: publicKa.navServices,
    serviceCategoryAdd: "კატეგორია",
    serviceAdd: "სერვისი",
    serviceCategoryNew: "ახალი კატეგორია",
    serviceCategoryEdit: "კატეგორიის რედაქტირება",
    serviceNew: "ახალი სერვისი",
    serviceEdit: "სერვისის რედაქტირება",
    serviceCategoryEmpty: "სერვისები არ არის",
    servicePrice: "ფასი (GEL)",
    servicePricePlaceholder: "მითითებული არ არის",
    serviceFeatured: publicKa.adminServiceFeaturedLabel,
    serviceCategoryTitleRequired:
      "მიუთითეთ კატეგორიის დასახელება (მინიმუმ რუსულად).",
    serviceTitleRequired: "მიუთითეთ სერვისის დასახელება (მინიმუმ რუსულად).",

    promotionsTitle: publicKa.promotionsTitle,
    promotionsAdd: "აქციის დამატება",
    promotionsEmpty: "აქციები ჯერ არ არის დამატებული.",
    promotionActive: "აქტიურია",
    promotionHidden: "დამალულია",
    promotionNew: "ახალი აქცია",
    promotionEdit: "აქციის რედაქტირება",
    promotionHeading: "სათაური",
    promotionDescription: "აღწერა",
    promotionPrice: "ფასი (GEL)",
    promotionOldPrice: "ძველი ფასი (GEL)",
    promotionDeadline: "მოქმედების ვადა",
    promotionTitleRequired: "მიუთითეთ აქციის დასახელება.",
    promotionImageAlt: "აქციის ფოტო",

    aboutTitle: publicKa.navAbout,
    aboutHint:
      "ტექსტი ჩანს მთავარ გვერდზე, განყოფილებაში «ჩვენ შესახებ».",
  },

  ru: {
    panelTitle: "Админ-панель",
    navDoctors: "Врачи",
    navServices: "Услуги",
    navPromotions: "Акции",
    navAbout: "О нас",
    signOut: "Выйти",
    logoAlt: "Rcheuli Medical Center",
    switchLanguage: "Язык панели",

    loginSubtitle: "Панель администратора",
    loginEmail: "Email",
    loginPassword: "Пароль",
    loginSubmit: "Войти",
    loginSubmitting: "Вход...",
    loginFailed: "Неверный email или пароль.",

    save: "Сохранить",
    saving: "Сохранение...",
    saved: "Сохранено.",
    cancel: "Отмена",
    edit: "Редактировать",
    change: "Изменить",
    remove: "Удалить",
    loading: "Загрузка...",
    uploadPhoto: "Загрузить фото",
    uploading: "Загрузка...",
    showOnSite: "Показывать на сайте",
    sortOrder: "Порядок",

    saveFailed: "Ошибка сохранения, попробуйте ещё раз",
    deleteFailed: "Ошибка удаления, попробуйте ещё раз",
    uploadFailed: "Не удалось загрузить фото, попробуйте ещё раз",
    loadFailed: "Не удалось загрузить данные, обновите страницу",

    doctorsTitle: "Врачи",
    doctorsAdd: "Добавить врача",
    doctorsEmpty: "Врачи пока не добавлены.",
    doctorsHiddenBadge: "скрыт",
    doctorNew: "Новый врач",
    doctorEdit: "Редактировать врача",
    doctorFullName: "Имя врача",
    doctorSpecialty: "Специализация",
    doctorBio: "Описание",
    doctorTags: "Теги",
    doctorTagsPlaceholder: "Например: Пациенты 18+, Хирургия",
    doctorTagsHint: "Теги через запятую",
    doctorLanguages: "Языки",
    doctorNameRequired: "Укажите имя врача.",
    doctorPhotoAlt: "Фото врача",
    contentLangKa: "Грузинский",
    contentLangRu: "Русский",
    contentLangEn: "Английский",

    servicesTitle: "Услуги",
    serviceCategoryAdd: "Категория",
    serviceAdd: "Услуга",
    serviceCategoryNew: "Новая категория",
    serviceCategoryEdit: "Изменить категорию",
    serviceNew: "Новая услуга",
    serviceEdit: "Изменить услугу",
    serviceCategoryEmpty: "Нет услуг",
    servicePrice: "Цена (GEL)",
    servicePricePlaceholder: "Не указана",
    serviceFeatured: "Показывать на главной",
    serviceCategoryTitleRequired:
      "Укажите название категории (хотя бы по-русски).",
    serviceTitleRequired: "Укажите название услуги (хотя бы по-русски).",

    promotionsTitle: "Акции",
    promotionsAdd: "Добавить акцию",
    promotionsEmpty: "Акции пока не добавлены.",
    promotionActive: "Активна",
    promotionHidden: "Скрыта",
    promotionNew: "Новая акция",
    promotionEdit: "Редактировать акцию",
    promotionHeading: "Заголовок",
    promotionDescription: "Описание",
    promotionPrice: "Цена (GEL)",
    promotionOldPrice: "Старая цена (GEL)",
    promotionDeadline: "Действует до",
    promotionTitleRequired: "Укажите название акции.",
    promotionImageAlt: "Фото акции",

    aboutTitle: "О нас",
    aboutHint: "Текст отображается в разделе «О нас» на главной странице.",
  },
};

/**
 * Confirmations and aria-labels that need the record's own name spliced in.
 * Kept as functions so the sentence can be built the way each language wants
 * rather than by gluing fragments together.
 */
export const adminPhrases: Record<
  AdminLang,
  {
    confirmDeleteDoctor: (name: string) => string;
    confirmDeleteCategory: (title: string) => string;
    confirmDeleteService: (title: string) => string;
    confirmDeletePromotion: (title: string) => string;
    togglePromotionLabel: (title: string) => string;
  }
> = {
  ka: {
    confirmDeleteDoctor: (name) => `წაშალოთ ექიმი «${name}»?`,
    confirmDeleteCategory: (title) =>
      `წაშალოთ კატეგორია «${title}» მასში შემავალ ყველა სერვისთან ერთად?`,
    confirmDeleteService: (title) => `წაშალოთ სერვისი «${title}»?`,
    confirmDeletePromotion: (title) => `წაშალოთ აქცია «${title}»?`,
    togglePromotionLabel: (title) => `აქცია «${title}» საიტზე ჩვენება`,
  },
  ru: {
    confirmDeleteDoctor: (name) => `Удалить врача «${name}»?`,
    confirmDeleteCategory: (title) =>
      `Удалить категорию «${title}» вместе со всеми её услугами?`,
    confirmDeleteService: (title) => `Удалить услугу «${title}»?`,
    confirmDeletePromotion: (title) => `Удалить акцию «${title}»?`,
    togglePromotionLabel: (title) => `Показывать акцию «${title}» на сайте`,
  },
};
