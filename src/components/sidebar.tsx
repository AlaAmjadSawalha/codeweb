import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  className?: string;
}

export function Sidebar({ currentPage, setPage, className }: SidebarProps) {
  const { t } = useTranslation();

  const navItems = [
    {
      title: t("sidebar.dashboard"),
      id: "dashboard",
      icon: "laptop" as keyof typeof Icons,
    },
    {
      title: t("sidebar.projects"),
      id: "projects",
      icon: "folder" as keyof typeof Icons,
    },
    {
      title: t("sidebar.newProject"),
      id: "create-project",
      icon: "plus" as keyof typeof Icons,
    },
  ];

  return (
    <div className={cn("hidden lg:block w-64 border-r bg-background h-[calc(100vh-4rem)] p-4", className)}>
      <div className="space-y-4 py-3">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{t("sidebar.overview")}</h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = Icons[item.icon] || Icons.laptop;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={cn(
                    buttonVariants({ variant: currentPage === item.id ? "secondary" : "ghost" }),
                    "w-full justify-start gap-2 h-10 px-4"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
