import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { NavItem } from "@/types/nav";
import { useTranslation } from "react-i18next";

interface MainNavProps {
  items?: NavItem[];
  setPage: (page: string) => void;
}

export function MainNav({ items, setPage }: MainNavProps) {
  const { t } = useTranslation();

  return (
    <div className="d-flex gap-5 md:gap-10">
      <button onClick={() => setPage("landing")} className="d-flex align-items-center space-x-2 bg-transparent border-none p-0 cursor-pointer">
        <Icons.laptop className="h-6 w-6" />
        <span className="d-inline-block fw-bold">{siteConfig.name}</span>
      </button>
      {items?.length ? (
        <nav className="d-flex gap-5">
          {items?.map(
            (item, index) =>
              item.href && (
                <button
                  key={index}
                  onClick={() => {
                    if (item.href === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    setPage(item.href || "landing");
                  }}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground bg-transparent border-none p-0 cursor-pointer",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title === "Home" ? t("nav.home") : item.title === "Pricing" ? t("footer.pricing") : item.title}
                </button>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
