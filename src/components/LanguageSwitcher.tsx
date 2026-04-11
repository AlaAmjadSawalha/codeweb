import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";

  const toggleLanguage = () => {
    const nextLanguage = isArabic ? "en" : "ar";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("i18nextLng", nextLanguage);

    if (nextLanguage === "ar") {
      document.dir = "rtl";
      document.body.classList.add("rtl");
    } else {
      document.dir = "ltr";
      document.body.classList.remove("rtl");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="d-none sm:inline-flex h-9 align-items-center rounded-2 border border-input bg-transparent px-3 py-1 fs-6 text-muted fw-medium shadow-sm transition-colors hover:bg-muted"
      aria-label={t("nav.language")}
      title={t("nav.language")}
    >
      {isArabic ? t("nav.switchToEnglish") : t("nav.switchToArabic")}
    </button>
  );
}
