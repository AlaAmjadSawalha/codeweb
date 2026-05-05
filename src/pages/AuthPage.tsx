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
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
            {/* Left pane - Visual/Marketing */}
            <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-900 p-12 lg:flex lg:w-[52%]">
                {/* Decorative background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -bottom-20 right-20 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl" />
                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-950/70 to-transparent" />
                </div>

                {/* Logo */}
                <div className="relative z-20 flex items-center gap-3 text-white">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                        <Box className="w-5 h-5 text-violet-300" />
                    </div>
                    <span className="text-xl font-bold tracking-wide">{t("common.brand")}</span>
                </div>

                {/* Main content */}
                <div className="relative z-20 flex-1 flex flex-col justify-center py-10">
                    <div className="max-w-sm">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-violet-200 text-xs font-medium mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                            AI-Powered Room Design
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                            {t("auth.tagline")}
                        </h1>
                        <p className="text-violet-200/75 text-base leading-relaxed">
                            Upload any room photo and let AI generate layouts, styles, and cost estimates in seconds.
                        </p>
                    </div>

                    {/* Testimonial card */}
                    <div className="mt-10 max-w-sm p-5 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/12">
                        <div className="flex gap-0.5 mb-3">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-white/85 text-sm leading-relaxed mb-4">{t("auth.testimonial")}</p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                                S
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold leading-none">{t("auth.testimonialName")}</p>
                                <p className="text-violet-300/65 text-xs mt-1">{t("auth.testimonialRole")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer links */}
                <div className="relative z-20 flex gap-6 text-xs text-violet-300/50">
                    <Link to="/privacy-policy" className="hover:text-violet-200 transition-colors">
                        {t("common.privacyPolicy")}
                    </Link>
                    <Link to="/terms-of-service" className="hover:text-violet-200 transition-colors">
                        {t("common.termsOfService")}
                    </Link>
                </div>
            </div>

            {/* Right pane - Forms */}
            <div className="flex w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-5 py-10 sm:px-10 lg:w-[48%]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600 shadow-lg shadow-violet-500/30">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">{t("common.brand")}</span>
                    </div>

                    {/* Form card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/80 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 p-8">
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
        </div>
    );
}
