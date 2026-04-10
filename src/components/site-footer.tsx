import { Home } from "lucide-react";
import { Icons } from "@/components/icons";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Home className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-wider">{t("common.brand")}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/features" className="hover:text-foreground transition-colors">{t("footer.features")}</a></li>
              <li><a href="/pricing" className="hover:text-foreground transition-colors">{t("footer.pricing")}</a></li>
              <li><a href="/gallery" className="hover:text-foreground transition-colors">{t("footer.gallery")}</a></li>
              <li><a href="/docs" className="hover:text-foreground transition-colors">{t("footer.apiDocs")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground transition-colors">{t("footer.aboutUs")}</a></li>
              <li><a href="/careers" className="hover:text-foreground transition-colors">{t("footer.careers")}</a></li>
              <li><a href="/blog" className="hover:text-foreground transition-colors">{t("footer.blog")}</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-foreground transition-colors">{t("common.privacyPolicy")}</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">{t("common.termsOfService")}</a></li>
              <li><a href="/cookies" className="hover:text-foreground transition-colors">{t("footer.cookiePolicy")}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/40 gap-4">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Icons.twitter className="w-5 h-5" />
              <span className="sr-only">{t("common.twitter")}</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Icons.gitHub className="w-5 h-5" />
              <span className="sr-only">{t("common.github")}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
