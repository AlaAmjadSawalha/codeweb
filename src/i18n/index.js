import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import arTranslation from "./locales/ar/translation.json";

const setDocumentDirection = (language) => {
  const isArabic = language === "ar";
  document.documentElement.lang = language;
  document.dir = isArabic ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", isArabic);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

setDocumentDirection(i18n.language || "en");
i18n.on("languageChanged", setDocumentDirection);

export default i18n;
