import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface SiteHeaderProps {
  setPage: (page: string) => void;
}

export function SiteHeader({ setPage }: SiteHeaderProps) {
  return (
    <div className="grid">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={siteConfig.mainNav} setPage={setPage} />
          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex relative w-full max-w-sm ml-auto mr-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Icons.search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <nav className="flex items-center space-x-2">
              <button className={buttonVariants({ size: "icon", variant: "ghost" }) + " relative hidden sm:flex"}>
                <Icons.bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-600"></span>
                <span className="sr-only">Notifications</span>
              </button>

              <button className={buttonVariants({ size: "icon", variant: "ghost" }) + " hidden sm:flex"}>
                <Icons.help className="h-5 w-5" />
                <span className="sr-only">Help Center</span>
              </button>

              <ThemeToggle />

              <div className="h-4 w-px bg-border mx-2 hidden sm:block"></div>

              {/* User Dropdown Profile Placeholder */}
              <button className="flex items-center gap-2 rounded-full border border-border p-1 hover:bg-muted transition-colors">
                <div className="h-7 w-7 rounded-full bg-blue-600 dark:bg-blue-500 flex flex-shrink-0 items-center justify-center text-white text-xs font-bold overflow-hidden border border-background">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Al" className="h-full w-full object-cover" />
                </div>
                <Icons.chevronDown className="h-4 w-4 text-muted-foreground mr-1 hidden sm:block" />
              </button>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
