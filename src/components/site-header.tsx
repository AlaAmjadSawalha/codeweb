import { useEffect, useRef, useState } from "react";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getStoredUser } from "@/lib/api";

interface SiteHeaderProps {
  setPage: (page: string) => void;
  isAuthenticated: boolean;
  onShowToast: (message: string) => void;
  onLogout: () => void;
}

export function SiteHeader({ setPage, isAuthenticated, onShowToast, onLogout }: SiteHeaderProps) {
  const { t } = useTranslation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = getStoredUser<{ name?: string; email?: string }>();
  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const handleSearch = (query: string) => {
    const value = query.trim();
    if (!value) return;
    if (!isAuthenticated) {
      onShowToast(t("nav.searchLoginRequired"));
      return;
    }
    onShowToast(t("nav.searching", { query: value }));
    setPage("/projects");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center gap-4 sm:justify-between">
        <MainNav items={siteConfig.mainNav} setPage={setPage} />

        <div className="flex flex-1 items-center justify-end gap-2">

          {/* Search bar */}
          <div className="relative hidden max-w-xs flex-1 md:flex mr-1">
            <Icons.search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, designs, uploads..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch((e.target as HTMLInputElement).value);
              }}
              className="h-9 w-full rounded-xl border border-border bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
            />
          </div>

          <nav className="flex shrink-0 items-center gap-1">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                {/* Notification bell */}
                <button
                  type="button"
                  className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label={t("nav.notifications")}
                >
                  <Icons.bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-500" />
                </button>

                <ThemeToggle />

                <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

                {/* User profile dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 active:bg-violet-800 transition-colors ring-2 ring-violet-100 dark:ring-violet-900/50 shadow-sm"
                    aria-label="User menu"
                    aria-expanded={profileOpen}
                  >
                    {initials}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-border bg-muted/40">
                        <p className="text-sm font-semibold text-foreground truncate">{user?.name || t("nav.account")}</p>
                        {user?.email && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                        )}
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <button
                          type="button"
                          onClick={() => { setPage("settings"); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Icons.settings className="h-4 w-4 text-muted-foreground shrink-0" />
                          Account Settings
                        </button>

                        {/* Billing — no route yet, disabled */}
                        <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground/50 cursor-not-allowed select-none">
                          <Icons.billing className="h-4 w-4 shrink-0" />
                          <span className="flex-1">Billing</span>
                          <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground/60 leading-none">
                            Soon
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          aria-label={t("nav.helpCenter")}
                        >
                          <Icons.help className="h-4 w-4 text-muted-foreground shrink-0" />
                          Help Center
                        </button>
                      </div>

                      <div className="border-t border-border py-1.5">
                        <button
                          type="button"
                          onClick={() => { onLogout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Icons.arrowRight className="h-4 w-4 rotate-180 shrink-0" />
                          {t("nav.logOut")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setPage("/auth/login")}
                  className="h-9 px-4 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {t("nav.logIn")}
                </button>
                <button
                  type="button"
                  onClick={() => setPage("/auth/signup")}
                  className="h-9 px-4 rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 shadow-sm shadow-violet-500/20 transition-colors"
                >
                  {t("nav.signUp")}
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
