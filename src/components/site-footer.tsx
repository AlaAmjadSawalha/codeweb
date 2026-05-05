import { Sparkles } from "lucide-react";
import { Icons } from "@/components/icons";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand column */}
          <div className="col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-xs font-bold shrink-0">
                SP
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                {t("common.brand")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t("footer.description")}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-violet-300 dark:hover:border-violet-700 transition-all"
              >
                <Icons.twitter className="w-4 h-4" />
                <span className="sr-only">{t("common.twitter")}</span>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-violet-300 dark:hover:border-violet-700 transition-all"
              >
                <Icons.gitHub className="w-4 h-4" />
                <span className="sr-only">{t("common.github")}</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              <li><a href="/features"  className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.features")}</a></li>
              <li><a href="/pricing"   className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.pricing")}</a></li>
              <li><a href="/gallery"   className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.gallery")}</a></li>
              <li><a href="/docs"      className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.apiDocs")}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3">
              <li><a href="/about"   className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.aboutUs")}</a></li>
              <li><a href="/careers" className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.careers")}</a></li>
              <li><a href="/blog"    className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.blog")}</a></li>
              <li><a href="/contact" className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.contact")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("common.privacyPolicy")}</a></li>
              <li><a href="/terms"   className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("common.termsOfService")}</a></li>
              <li><a href="/cookies" className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t("footer.cookiePolicy")}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            <span>Built with AI · </span>
            <span className="font-medium text-foreground">{t("common.brand")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
