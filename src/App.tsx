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
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getAuthToken, clearSession, setStoredUser } from "@/lib/api";
import { logout as logoutRequest, me } from "@/api/auth";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    me()
      .then((res) => {
        if (res.data) setStoredUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        clearSession();
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      /* still clear locally */
    }
    clearSession();
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

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
    if (path.startsWith("/pricing")) return "landing";
    if (path.startsWith("/privacy-policy")) return "privacy-policy";
    if (path.startsWith("/terms-of-service")) return "terms-of-service";
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
      onLogout={handleLogout}
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
          element={
            <AuthPage
              setPage={setPage}
              initialView="login"
              onAuthSuccess={() => setIsAuthenticated(true)}
              onShowToast={showToast}
            />
          }
        />
        <Route
          path="/auth/signup"
          element={
            <AuthPage
              setPage={setPage}
              initialView="signup"
              onAuthSuccess={() => setIsAuthenticated(true)}
              onShowToast={showToast}
            />
          }
        />
        <Route
          path="/auth/forgot"
          element={
            <AuthPage setPage={setPage} initialView="forgot" onAuthSuccess={() => setIsAuthenticated(true)} onShowToast={showToast} />
          }
        />
        <Route
          path="/auth/reset"
          element={
            <AuthPage setPage={setPage} initialView="reset" onAuthSuccess={() => setIsAuthenticated(true)} onShowToast={showToast} />
          }
        />

        <Route path="/dashboard" element={protectedPage(<DashboardPage setPage={setPage} />)} />
        <Route path="/projects" element={protectedPage(<ProjectsPage setPage={setPage} />)} />
        <Route path="/create-project" element={protectedPage(<CreateProjectPage setPage={setPage} />)} />
        <Route path="/ai-processing" element={protectedPage(<AIProcessingPage setPage={setPage} />)} />
        <Route path="/ai-designs" element={protectedPage(<AIGeneratedDesignsPage setPage={setPage} />)} />
        <Route path="/compare-designs" element={protectedPage(<CompareDesignsPage setPage={setPage} />)} />
        <Route path="/design-details" element={protectedPage(<DesignDetailsPage setPage={setPage} />)} />

        <Route path="/features" element={<PlaceholderPage titleKey="placeholder.features" />} />
        <Route path="/gallery" element={<PlaceholderPage titleKey="placeholder.gallery" />} />
        <Route path="/docs" element={<PlaceholderPage titleKey="placeholder.apiDocs" />} />
        <Route path="/about" element={<PlaceholderPage titleKey="placeholder.aboutUs" />} />
        <Route path="/careers" element={<PlaceholderPage titleKey="placeholder.careers" />} />
        <Route path="/blog" element={<PlaceholderPage titleKey="placeholder.blog" />} />
        <Route path="/contact" element={<PlaceholderPage titleKey="placeholder.contact" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PlaceholderPage titleKey="placeholder.privacyPolicy" />} />
        <Route path="/terms" element={<PlaceholderPage titleKey="placeholder.termsOfService" />} />
        <Route path="/cookies" element={<PlaceholderPage titleKey="placeholder.cookiePolicy" />} />
        <Route path="/changelog" element={<PlaceholderPage titleKey="placeholder.changelog" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-[80] rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          {toastMessage}
        </div>
      )}
    </Layout>
  );
}

export default App;
