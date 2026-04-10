import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Sidebar } from "@/components/sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setPage: (page: string) => void;
  isAuthenticated: boolean;
  onShowToast: (message: string) => void;
}

export default function RootLayout({ children, currentPage, setPage, isAuthenticated, onShowToast }: RootLayoutProps) {
  const isLanding = currentPage === "landing";
  const isAuth = currentPage === "auth";
  const hideLayout = isLanding || isAuth;

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          {!isAuth && (
            <SiteHeader
              setPage={setPage}
              isAuthenticated={isAuthenticated}
              onShowToast={onShowToast}
            />
          )}

          <div className="flex flex-1">
            {!hideLayout && (
              <Sidebar currentPage={currentPage} setPage={setPage} />
            )}
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
        <TailwindIndicator />
      </ThemeProvider>
    </div>
  );
}
