import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface SiteHeaderProps {
  setPage: (page: string) => void;
  isAuthenticated: boolean;
  onShowToast: (message: string) => void;
}

export function SiteHeader({ setPage, isAuthenticated, onShowToast }: SiteHeaderProps) {
  const { t } = useTranslation();

  const handleSearch = (query: string) => {
    const value = query.trim();
    if (!value) return;

    if (!isAuthenticated) {
      onShowToast("Please log in to search.");
      return;
    }

    onShowToast(`Searching for "${value}"...`);
    setPage("/projects");
  };

  return (
    <div className="d-grid">
      <header className="sticky top-0 z-40 w-100 border-b bg-light">
        <div className="container d-flex h-16 align-items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={siteConfig.mainNav} setPage={setPage} />
          <div className="d-flex flex-1 align-items-center justify-content-end space-x-4">
            {/* Search Bar */}
            <div className="d-none d-md-flex relative w-100 max-w-sm ml-auto mr-4">
              <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 pointer-events-none text-muted">
                <Icons.search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={t("nav.searchProjects")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch((e.target as HTMLInputElement).value);
                  }
                }}
                className="d-flex h-9 w-100 rounded-2 border border-input bg-transparent px-3 py-1 pl-10 fs-6 text-muted shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <nav className="d-flex align-items-center space-x-2">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <button className={buttonVariants({ size: "icon", variant: "ghost" }) + " relative hidden sm:flex"}>
                    <Icons.bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-circle bg-red-600"></span>
                    <span className="sr-only">{t("nav.notifications")}</span>
                  </button>

                  <button className={buttonVariants({ size: "icon", variant: "ghost" }) + " hidden sm:flex"}>
                    <Icons.help className="h-5 w-5" />
                    <span className="sr-only">{t("nav.helpCenter")}</span>
                  </button>

                  <ThemeToggle />

                  <div className="h-4 w-px bg-border mx-2 d-none sm:block"></div>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => setPage("/auth/login")}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setPage("/auth/signup")}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
