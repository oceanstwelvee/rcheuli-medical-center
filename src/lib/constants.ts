export const CLINIC = {
  phones: [
    { display: "551 066 066", tel: "+995551066066" },
    { display: "0322 052 666", tel: "+995322052666" },
  ],
  email: "info@rcheulimedical.ge",
  address: {
    ka: "თბილისი, პეკინის გამზ.5",
    ru: "Тбилиси, пр. Пекина 5",
    en: "Tbilisi, Pekini Ave. 5",
  },
  instagram: "https://www.instagram.com/rcheuli_medical_center/",
  facebook: "https://www.facebook.com/profile.php?id=61578732666447",
  // Spelled out as "Avenue" rather than "Ave." or "St.": the old "Pekini
  // Street 5" query landed on Jemal Gaganidze Street, ~180 m from the clinic.
  mapQuery: "Tbilisi, Pekini Avenue 5",
  get mapEmbedSrc() {
    return (
      "https://www.google.com/maps?q=" +
      encodeURIComponent(this.mapQuery) +
      "&output=embed"
    );
  },
  get mapLink() {
    return "https://www.google.com/maps?q=" + encodeURIComponent(this.mapQuery);
  },
};
