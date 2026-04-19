import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Chrome, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import { getApiErrorMessage, setAuthToken, setStoredUser } from "@/lib/api";
import { login as loginRequest } from "@/api/auth";

interface LoginFormProps {
    onSwitchToSignUp: () => void;
    onForgotPassword: () => void;
    onLoginSuccess: () => void;
}

export function LoginForm({ onSwitchToSignUp, onForgotPassword, onLoginSuccess }: LoginFormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            setError(t("auth.errors.fillAllFields"));
            return;
        }
        if (!emailRegex.test(email)) {
            setError(t("auth.errors.invalidEmail"));
            return;
        }
        if (password.length < 8) {
            setError(t("auth.errors.passwordMin"));
            return;
        }
        setError("");
        setIsSubmitting(true);
        try {
            const data = await loginRequest({ email, password });
            const token = data.data?.token;
            const user = data.data?.user;
            if (!token) {
                setError(t("auth.errors.fillAllFields"));
                return;
            }
            setAuthToken(token);
            if (user) setStoredUser(user);
            onLoginSuccess();
        } catch (err) {
            const ax = err as AxiosError;
            if (ax.response?.status === 401) {
                setError("Invalid email or password");
            } else {
                setError(getApiErrorMessage(err, t("auth.errors.fillAllFields")));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("auth.loginTitle")}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t("auth.loginSubtitle")}
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                            {t("auth.email")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex w-full h-11 px-3 py-2 pl-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder={t("auth.email")}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                            {t("auth.password")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex w-full h-11 px-3 py-2 pl-10 pr-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
                            >
                                {t("auth.rememberMe")}
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-sm font-medium text-slate-900 hover:underline dark:text-slate-100"
                        >
                            {t("auth.forgotPassword")}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center w-full h-11 px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors rounded-md bg-slate-900 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300"
                    >
                        {isSubmitting ? t("auth.signIn") + "…" : t("auth.signIn")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                            {t("auth.orContinueWith")}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center w-full h-11 px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md border-slate-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-300"
                >
                    <Chrome className="w-5 h-5 mr-2" />
                    {t("auth.google")}
                </button>
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {t("auth.noAccount")}{" "}
                <button
                    onClick={onSwitchToSignUp}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100 focus:outline-none"
                >
                    {t("auth.createAccount")}
                </button>
            </p>
        </div>
    );
}
