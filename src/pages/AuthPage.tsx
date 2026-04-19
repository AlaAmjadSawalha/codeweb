import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Box } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

interface AuthPageProps {
    setPage: (page: string) => void;
    initialView?: "login" | "signup" | "forgot" | "reset";
    onAuthSuccess?: () => void;
    onShowToast?: (message: string) => void;
}

export default function AuthPage({ setPage, initialView = "login", onAuthSuccess, onShowToast }: AuthPageProps) {
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
        if (token) {
            setResetTokenFromLink(token);
            if (emailParam) setResetEmail(emailParam);
            setView("reset");
        }
    }, [searchParams]);

    const handleAuthSuccess = () => {
        onAuthSuccess?.();
        setPage("dashboard");
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-slate-950">
            {/* Left pane - Visual/Marketing */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-slate-900 dark:bg-black overflow-hidden">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/auth-bg.png"
                        alt={t("common.brand")}
                        className="object-cover w-full h-full opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent dark:from-black dark:via-black/60 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent z-10"></div>
                </div>

                {/* Logo area */}
                <div className="relative z-20 flex items-center space-x-2 text-white">
                    <Box className="w-8 h-8 text-indigo-400" />
                    <span className="text-xl font-bold tracking-wider">{t("common.brand")}</span>
                </div>

                {/* Tagline */}
                <div className="relative z-20 max-w-lg mt-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                        {t("auth.tagline")}
                    </h1>
                </div>

                {/* Footer links */}
                <div className="relative z-20 flex space-x-6 text-sm text-slate-400">
                    <Link to="/privacy-policy" className="hover:text-white transition-colors">
                        {t("common.privacyPolicy")}
                    </Link>
                    <Link to="/terms-of-service" className="hover:text-white transition-colors">
                        {t("common.termsOfService")}
                    </Link>
                </div>
            </div>

            {/* Right pane - Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-white dark:bg-slate-950">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center space-x-2 text-slate-900 dark:text-white mb-10">
                        <Box className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-2xl font-bold tracking-wider">{t("common.brand")}</span>
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
                        <ForgotPasswordForm onBackToLogin={() => setPage("/auth/login")} />
                    ) : (
                        <ResetPasswordForm
                            email={resetEmail}
                            initialResetToken={resetTokenFromLink}
                            onBackToForgot={() => setPage("/auth/forgot")}
                            onResetSuccess={() => {
                                onShowToast?.("Password updated successfully.");
                                setPage("/auth/login");
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
