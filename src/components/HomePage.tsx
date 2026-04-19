import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {t("home.title")} <br className="hidden sm:inline" />
          {t("home.titleBreak")}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {t("home.subtitle")}
        </p>
      </div>
      <div className="flex gap-4">
        <a href={siteConfig.links.docs} className={buttonVariants()}>
          {t("home.documentation")}
        </a>
        <a
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          {t("home.github")}
        </a>
      </div>
    </section>
  );
}
