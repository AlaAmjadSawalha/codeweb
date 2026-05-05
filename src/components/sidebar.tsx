import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  className?: string;
}

type NavItem = {
  title: string;
  /** value passed to setPage() */
  id: string;
  /** URL path used to detect active state */
  path: string;
  icon: keyof typeof Icons;
};

type ComingSoonItem = {
  title: string;
  icon: keyof typeof Icons;
};

export function Sidebar({ currentPage, setPage, className }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const isItemActive = (item: NavItem): boolean => {
    // Path-based check (never match root "/" broadly)
    if (item.path.length > 1 && location.pathname.startsWith(item.path)) return true;
    // currentPage string check (strip leading slash if present)
    const cpId = item.id.startsWith("/") ? item.id.slice(1) : item.id;
    return currentPage === cpId;
  };

  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: t("sidebar.overview"),
      items: [
        { title: t("sidebar.dashboard"),  id: "dashboard",      path: "/dashboard",      icon: "laptop"         },
      ],
    },
    {
      label: "Projects",
      items: [
        { title: t("sidebar.projects"),   id: "projects",       path: "/projects",       icon: "folder"         },
        { title: t("sidebar.newProject"), id: "create-project", path: "/create-project", icon: "plus"           },
        { title: "Upload Files",          id: "/upload",        path: "/upload",         icon: "upload"         },
      ],
    },
    {
      label: "Design",
      items: [
        { title: "AI Designs",            id: "ai-designs",     path: "/ai-designs",     icon: "brain"          },
        { title: "Compare Designs",       id: "compare-designs",path: "/compare-designs",icon: "layoutTemplate" },
        { title: "Gallery",               id: "/gallery",       path: "/gallery",        icon: "bookmark"       },
      ],
    },
    {
      label: "Account",
      items: [
        { title: "Settings",              id: "settings",       path: "/settings",       icon: "settings"       },
      ],
    },
  ];

  const comingSoon: ComingSoonItem[] = [
    { title: "Billing", icon: "billing"   },
    { title: "Reports", icon: "fileIcon"  },
  ];

  return (
    <div className={cn("hidden lg:flex flex-col w-64 border-r border-border bg-card h-[calc(100vh-4rem)] shrink-0", className)}>

      {/* Scrollable nav area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 select-none">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = Icons[item.icon] ?? Icons.laptop;
                const active = isItemActive(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPage(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0",
                        active ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-left truncate">{item.title}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Coming soon items */}
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 select-none">
            More
          </p>
          <div className="space-y-0.5">
            {comingSoon.map((item) => {
              const Icon = Icons[item.icon] ?? Icons.laptop;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground/40 cursor-not-allowed select-none"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.title}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground/50 leading-none shrink-0">
                    Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Plan card footer */}
      <div className="px-3 py-4 border-t border-border">
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-100 dark:border-violet-900/40 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-violet-700 dark:text-violet-300">Free Plan</span>
            <span className="text-xs font-medium text-muted-foreground">2 / 5</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 overflow-hidden">
            <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 mb-3">2 of 5 projects used</p>
          <button
            type="button"
            onClick={() => setPage("/pricing")}
            className="w-full py-1.5 text-xs font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm shadow-violet-500/20"
          >
            Upgrade to Pro →
          </button>
        </div>
      </div>
    </div>
  );
}
