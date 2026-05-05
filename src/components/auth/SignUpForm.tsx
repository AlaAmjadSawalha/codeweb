import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Chrome, ArrowRight, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage, setAuthToken, setStoredUser } from "@/lib/api";
import { register as registerRequest } from "@/api/auth";

interface SignUpFormProps {
    onSwitchToLogin: () => void;
    onSignUpSuccess: () => void;
}

export function SignUpForm({ onSwitchToLogin, onSignUpSuccess }: SignUpFormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Homeowner",
        acceptTerms: false
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hasUppercase = /[A-Z]/.test(formData.password);
        const hasNumber = /\d/.test(formData.password);

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError(t("auth.errors.fillAllRequiredFields"));
            return;
        }
        if (formData.name.trim().length < 2) {
            setError(t("auth.errors.invalidFullName"));
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setError(t("auth.errors.invalidEmail"));
            return;
        }
        if (formData.password.length < 8 || !hasUppercase || !hasNumber) {
            setError(t("auth.errors.passwordStrong"));
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError(t("auth.errors.passwordMismatch"));
            return;
        }
        if (!formData.acceptTerms) {
            setError(t("auth.errors.acceptTerms"));
            return;
        }
        setError("");
        setIsSubmitting(true);
        try {
            const registerPayload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            };
            const data = await registerRequest(registerPayload);
            const token = data.data?.token;
            const user = data.data?.user;
            if (!token) {
                setError(t("auth.errors.fillAllRequiredFields"));
                return;
            }
            setAuthToken(token);
            if (user) setStoredUser(user);
            onSignUpSuccess();
        } catch (error: unknown) {
            setError(getApiErrorMessage(error, t("auth.errors.fillAllRequiredFields")));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t("auth.signupTitle")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("auth.signupSubtitle")}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error message */}
                {error && (
                    <div className="flex items-start gap-2.5 p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl dark:bg-red-950/30 dark:border-red-500/20 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Full name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("auth.fullName")}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200"
                            placeholder="Jane Smith"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("auth.email")}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                {/* Password + Confirm side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.password")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-11 pl-9 pr-9 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t("auth.confirmPassword")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full h-11 pl-9 pr-9 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500 -mt-1">
                    8+ characters · one uppercase letter · one number
                </p>

                {/* Role selector */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("auth.roleLabel")}
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full h-11 px-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200 cursor-pointer"
                    >
                        <option value="Homeowner">{t("auth.roleHomeowner")}</option>
                        <option value="Architect">{t("auth.roleArchitect")}</option>
                        <option value="Designer">{t("auth.roleDesigner")}</option>
                    </select>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3 pt-1">
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 transition-colors accent-violet-600 shrink-0"
                    />
                    <label
                        htmlFor="acceptTerms"
                        className="text-sm text-slate-500 dark:text-slate-400 leading-snug cursor-pointer"
                    >
                        {t("auth.acceptTermsPrefix")}{" "}
                        <Link to="/terms-of-service" className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
                            {t("common.termsOfService")}
                        </Link>{" "}
                        {t("auth.acceptTermsJoiner")}{" "}
                        <Link to="/privacy-policy" className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
                            {t("common.privacyPolicy")}
                        </Link>
                    </label>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 mt-1"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {t("auth.createAccount") + "…"}
                        </>
                    ) : (
                        <>
                            {t("auth.createAccount")}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 uppercase tracking-widest">
                        {t("auth.orSignUpWith")}
                    </span>
                </div>
            </div>

            {/* Google button */}
            <button
                type="button"
                className="w-full h-11 flex items-center justify-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
            >
                <Chrome className="w-4 h-4" />
                {t("auth.google")}
            </button>

            {/* Sign in link */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-1">
                {t("auth.alreadyHaveAccount")}{" "}
                <button
                    onClick={onSwitchToLogin}
                    className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors focus:outline-none"
                >
                    {t("auth.signInLink")}
                </button>
            </p>
        </div>
    );
}
