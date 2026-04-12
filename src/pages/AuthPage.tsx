import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Box } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface AuthPageProps {
    setPage: (page: string) => void;
    initialView?: "login" | "signup" | "forgot" | "reset";
    onAuthSuccess?: () => void;
}

export default function AuthPage({ setPage, initialView = "login", onAuthSuccess }: AuthPageProps) {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [view, setView] = useState<"login" | "signup" | "forgot" | "reset">(initialView);
    const [resetEmail, setResetEmail] = useState("");
    const [resetTokenFromLink, setResetTokenFromLink] = useState<string | undefined>(undefined);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    useEffect(() => {
        const token = searchParams.get("token") ?? undefined;
        const emailParam = searchParams.get("email") ?? "";
        if (token && emailParam) {
            setResetTokenFromLink(token);
            setResetEmail(emailParam);
            setView("reset");
        }
    }, [searchParams]);

    const handleAuthSuccess = () => {
        localStorage.setItem("sp-authenticated", "true");
        onAuthSuccess?.();
        // Navigate to dashboard after successful login/signup
        setPage("dashboard");
    };

    return (
        <div className="min-vh-100 w-100 d-flex bg-white dark:bg-slate-950">
            {/* Left pane - Visual/Marketing */}
            <div className="d-none d-lg-flex lg:w-1/2 relative flex-column justify-content-between p-12 bg-slate-900 dark:bg-black overflow-hidden">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/auth-bg.png"
                        alt={t("common.brand")}
                        className="object-cover w-100 h-100 opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent dark:from-black dark:via-black/60 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent z-10"></div>
                </div>

                {/* Logo area */}
                <div className="relative z-20 d-flex align-items-center space-x-2 text-white">
                    <Box className="w-8 h-8 text-indigo-400" />
                    <span className="fs-4 fw-bold tracking-wider">{t("common.brand")}</span>
                </div>

                {/* Testimonial / Value prop */}
                <div className="relative z-20 max-w-lg mt-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="fs-1 fw-bold text-white tracking-tight leading-tight">
                        {t("auth.tagline")}
                    </h1>
                    <p className="mt-6 fs-5 text-slate-300">
                        {t("auth.testimonial")}
                    </p>
                    <div className="mt-8 d-flex align-items-center space-x-4">
                        <div className="w-12 h-12 rounded-circle overflow-hidden border-2 border-indigo-500/50 bg-slate-800">
                            <img src="https://i.pravatar.cc/150?img=42" alt="Avatar" className="w-100 h-100 object-cover" />
                        </div>
                        <div>
                            <div className="fs-6 fw-medium text-white">{t("auth.testimonialName")}</div>
                            <div className="fs-6 text-muted text-slate-400">{t("auth.testimonialRole")}</div>
                        </div>
                    </div>
                </div>

                {/* Footer links */}
                <div className="relative z-20 d-flex space-x-6 fs-6 text-muted text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">{t("common.privacyPolicy")}</a>
                    <a href="#" className="hover:text-white transition-colors">{t("common.termsOfService")}</a>
                </div>
            </div>

            {/* Right pane - Forms */}
            <div className="w-100 lg:w-1/2 d-flex align-items-center justify-content-center p-5 sm:p-12 xl:p-24 bg-white dark:bg-slate-950">
                <div className="w-100 max-w-md">
                    {/* Mobile Logo */}
                    <div className="d-lg-none d-flex align-items-center justify-content-center space-x-2 text-slate-900 dark:text-white mb-10">
                        <Box className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="fs-3 fw-bold tracking-wider">{t("common.brand")}</span>
                    </div>

                    {view === "login" ? (
                        <LoginForm
                            onSwitchToSignUp={() => setPage("/auth/signup")}
                            onForgotPassword={() => setPage("/auth/forgot")}
                            onLoginSuccess={handleAuthSuccess}
                        />
                    ) : view === "signup" ? (
                        <SignUpForm
                            onSwitchToLogin={() => setPage("/auth/login")}
                            onSignUpSuccess={handleAuthSuccess}
                        />
                    ) : view === "forgot" ? (
                        <ForgotPasswordForm
                            onBackToLogin={() => setPage("/auth/login")}
                            onRequestSent={(email) => {
                                setResetTokenFromLink(undefined);
                                setResetEmail(email);
                                setPage("/auth/reset");
                            }}
                        />
                    ) : (
                        <ResetPasswordForm
                            email={resetEmail}
                            initialResetToken={resetTokenFromLink}
                            onBackToForgot={() => setPage("/auth/forgot")}
                            onResetSuccess={() => setPage("/auth/login")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
