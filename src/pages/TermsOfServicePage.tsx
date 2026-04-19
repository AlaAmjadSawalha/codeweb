import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 lg:px-8">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("legal.backToLogin")}
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t("termsOfServicePage.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("legal.lastUpdated")}</p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{t("termsOfServicePage.intro")}</p>
        </header>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground md:text-base">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.acceptanceTitle")}</h2>
            <p>{t("termsOfServicePage.acceptanceBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.serviceTitle")}</h2>
            <p>{t("termsOfServicePage.serviceBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.accountsTitle")}</h2>
            <p>{t("termsOfServicePage.accountsBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.ipTitle")}</h2>
            <p>{t("termsOfServicePage.ipBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.prohibitedTitle")}</h2>
            <p>{t("termsOfServicePage.prohibitedIntro")}</p>
            <ul className="mt-4 list-disc space-y-2 ps-5">
              <li>{t("termsOfServicePage.prohibitedItem1")}</li>
              <li>{t("termsOfServicePage.prohibitedItem2")}</li>
              <li>{t("termsOfServicePage.prohibitedItem3")}</li>
              <li>{t("termsOfServicePage.prohibitedItem4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.liabilityTitle")}</h2>
            <p>{t("termsOfServicePage.liabilityBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.terminationTitle")}</h2>
            <p>{t("termsOfServicePage.terminationBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.changesTitle")}</h2>
            <p>{t("termsOfServicePage.changesBody")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{t("termsOfServicePage.contactTitle")}</h2>
            <p>{t("termsOfServicePage.contactBody")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
