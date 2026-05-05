import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";
import { useTranslation } from "react-i18next";

interface MainNavProps {
  items?: NavItem[];
  setPage: (page: string) => void;
}

export function MainNav({ items, setPage }: MainNavProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-6 md:gap-10">
      {/* Wordmark logo */}
      <button
        onClick={() => setPage("landing")}
        className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0"
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-xs font-bold shrink-0 shadow-sm shadow-violet-500/30">
          SP
        </span>
        <span className="hidden sm:inline-block font-bold text-sm tracking-tight text-foreground">
          {siteConfig.name}
        </span>
      </button>

      {items?.length ? (
        <nav className="hidden md:flex items-center gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <button
                  key={index}
                  onClick={() => {
                    if (item.href === "/") window.scrollTo({ top: 0, behavior: "smooth" });
                    setPage(item.href || "landing");
                  }}
                  className={cn(
                    "relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none p-0 cursor-pointer",
                    "after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-violet-600 after:transition-all hover:after:w-full",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {item.title === "Home"
                    ? t("nav.home")
                    : item.title === "Pricing"
                      ? t("footer.pricing")
                      : item.title === "Features"
                        ? t("footer.features")
                        : item.title}
                </button>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
