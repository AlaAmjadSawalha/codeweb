import { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateProjectPage from "@/pages/CreateProjectPage";
import AIProcessingPage from "@/pages/AIProcessingPage";
import AIGeneratedDesignsPage from "@/pages/AIGeneratedDesignsPage";
import CompareDesignsPage from "@/pages/CompareDesignsPage";
import DesignDetailsPage from "@/pages/DesignDetailsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import AuthPage from "@/pages/AuthPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "@/lib/api";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const setPage = (page: string) => {
    switch (page) {
      case "landing":
        navigate("/");
        return;
      case "auth":
        navigate("/auth/login");
        return;
      case "dashboard":
        navigate("/dashboard");
        return;
      case "projects":
        navigate("/projects");
        return;
      case "create-project":
        navigate("/create-project");
        return;
      case "ai-processing":
        navigate("/ai-processing");
        return;
      case "ai-designs":
        navigate("/ai-designs");
        return;
      case "compare-designs":
        navigate("/compare-designs");
        return;
      case "design-details":
        navigate("/design-details");
        return;
      case "settings":
        navigate("/settings");
        return;
      default:
        // If it's already a pathname, navigate to it directly.
        if (page.startsWith("/")) navigate(page);
    }
  };

  const currentPage = (() => {
    const path = location.pathname;
    if (path === "/") return "landing";
    if (path.startsWith("/auth")) return "auth";
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/projects")) return "projects";
    if (path.startsWith("/create-project")) return "create-project";
    if (path.startsWith("/ai-processing")) return "ai-processing";
    if (path.startsWith("/ai-designs")) return "ai-designs";
    if (path.startsWith("/compare-designs")) return "compare-designs";
    if (path.startsWith("/design-details")) return "design-details";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/pricing")) return "landing";
    return "landing";
  })();

  const protectedPage = useMemo(
    () => (element: JSX.Element) => (isAuthenticated ? element : <Navigate to="/auth/login" replace />),
    [isAuthenticated]
  );

  return (
    <Layout
      currentPage={currentPage}
      setPage={setPage}
      isAuthenticated={isAuthenticated}
      onShowToast={showToast}
    >
      <Routes>
        <Route
          path="/"
          element={<LandingPage setPage={setPage} isAuthenticated={isAuthenticated} onShowToast={showToast} />}
        />
        <Route
          path="/pricing"
          element={<LandingPage setPage={setPage} isAuthenticated={isAuthenticated} onShowToast={showToast} />}
        />

        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/login"
          element={<AuthPage setPage={setPage} initialView="login" onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/auth/signup"
          element={<AuthPage setPage={setPage} initialView="signup" onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/auth/forgot"
          element={<AuthPage setPage={setPage} initialView="forgot" onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/auth/reset"
          element={<AuthPage setPage={setPage} initialView="reset" onAuthSuccess={() => setIsAuthenticated(true)} />}
        />

        <Route path="/dashboard" element={protectedPage(<DashboardPage setPage={setPage} />)} />
        <Route path="/projects" element={protectedPage(<ProjectsPage setPage={setPage} />)} />
        <Route path="/create-project" element={protectedPage(<CreateProjectPage setPage={setPage} />)} />
        <Route path="/ai-processing" element={protectedPage(<AIProcessingPage setPage={setPage} />)} />
        <Route path="/ai-designs" element={protectedPage(<AIGeneratedDesignsPage setPage={setPage} />)} />
        <Route path="/compare-designs" element={protectedPage(<CompareDesignsPage setPage={setPage} />)} />
        <Route path="/design-details" element={protectedPage(<DesignDetailsPage setPage={setPage} />)} />
        <Route path="/settings" element={protectedPage(<PlaceholderPage title="Settings" />)} />

        <Route path="/features" element={<PlaceholderPage title="Features" />} />
        <Route path="/gallery" element={<PlaceholderPage title="Gallery" />} />
        <Route path="/docs" element={<PlaceholderPage title="API Docs" />} />
        <Route path="/about" element={<PlaceholderPage title="About Us" />} />
        <Route path="/careers" element={<PlaceholderPage title="Careers" />} />
        <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
        <Route path="/cookies" element={<PlaceholderPage title="Cookie Policy" />} />
        <Route path="/changelog" element={<PlaceholderPage title="Changelog" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-[80] rounded-2 bg-slate-900 px-3 py-2 fs-6 text-muted text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          {toastMessage}
        </div>
      )}
    </Layout>
  );
}

export default App;
