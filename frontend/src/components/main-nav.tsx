import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { NavItem } from "@/types/nav";

interface MainNavProps {
  items?: NavItem[];
  setPage: (page: string) => void;
}

export function MainNav({ items, setPage }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <button onClick={() => setPage("landing")} className="flex items-center space-x-2 bg-transparent border-none p-0 cursor-pointer">
        <Icons.laptop className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </button>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <button
                  key={index}
                  onClick={() => setPage(item.href || "landing")}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground bg-transparent border-none p-0 cursor-pointer",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </button>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
