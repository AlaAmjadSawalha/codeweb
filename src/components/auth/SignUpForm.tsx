import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Chrome, ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api, getApiErrorMessage, setAuthToken } from "@/lib/api";

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
            const { data } = await api.post<{ data: { token: string } }>("/auth/register", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                role: formData.role,
                accept_terms: formData.acceptTerms,
            });
            const token = data.data?.token;
            if (!token) {
                setError(t("auth.errors.fillAllRequiredFields"));
                return;
            }
            setAuthToken(token);
            onSignUpSuccess();
        } catch (err) {
            setError(getApiErrorMessage(err, t("auth.errors.fillAllRequiredFields")));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-100 max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="fs-2 fw-bold tracking-tight text-slate-900 dark:text-white">{t("auth.signupTitle")}</h2>
                <p className="mt-2 fs-6 text-muted text-slate-600 dark:text-slate-400">
                    {t("auth.signupSubtitle")}
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 fs-6 text-muted text-red-500 bg-red-50 border border-red-200 rounded-3 dark:bg-red-900/10 dark:border-red-500/20 d-flex align-items-center gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">
                            {t("auth.fullName")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 pointer-events-none text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="d-flex w-100 h-11 px-3 py-2 pl-10 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder={t("auth.fullName")}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">
                            {t("auth.email")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 pointer-events-none text-slate-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="d-flex w-100 h-11 px-3 py-2 pl-10 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder={t("auth.email")}
                            />
                        </div>
                    </div>

                    <div className="d-grid row-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">
                                {t("auth.password")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="d-flex w-100 h-11 px-3 py-2 pl-10 pr-9 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 d-flex align-items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300 d-flex align-items-center justify-content-between">
                                {t("auth.confirmPassword")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="d-flex w-100 h-11 px-3 py-2 pl-10 pr-9 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 d-flex align-items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">
                            {t("auth.roleLabel")}
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="d-flex w-100 h-11 px-3 py-2 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-950 transition-colors"
                        >
                            <option value="Homeowner">{t("auth.roleHomeowner")}</option>
                            <option value="Architect">{t("auth.roleArchitect")}</option>
                            <option value="Designer">{t("auth.roleDesigner")}</option>
                        </select>
                    </div>

                    <div className="d-flex align-items-start space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                        />
                        <label
                            htmlFor="acceptTerms"
                            className="fs-6 text-muted leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
                        >
                            {t("auth.acceptTermsPrefix")} <a href="#" className="fw-medium text-slate-900 dark:text-slate-100 hover:underline">{t("common.termsOfService")}</a> {t("auth.acceptTermsJoiner")} <a href="#" className="fw-medium text-slate-900 dark:text-slate-100 hover:underline">{t("common.privacyPolicy")}</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex align-items-center justify-content-center w-100 h-11 px-3 py-2 mt-2 fs-6 text-muted fw-medium tracking-wide text-white transition-colors rounded-2 bg-slate-900 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300"
                    >
                        {isSubmitting ? t("auth.createAccount") + "…" : t("auth.createAccount")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 d-flex align-items-center">
                        <span className="w-100 border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative d-flex justify-content-center small uppercase">
                        <span className="px-2 bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                            {t("auth.orSignUpWith")}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex align-items-center justify-content-center w-100 h-11 px-3 py-2 fs-6 text-muted fw-medium transition-colors bg-white border rounded-2 border-slate-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-300"
                >
                    <Chrome className="w-5 h-5 mr-2" />
                    {t("auth.google")}
                </button>
            </div>

            <p className="text-center fs-6 text-muted text-slate-600 dark:text-slate-400">
                {t("auth.alreadyHaveAccount")}{" "}
                <button
                    onClick={onSwitchToLogin}
                    className="fw-medium text-slate-900 hover:underline dark:text-slate-100 focus:outline-none"
                >
                    {t("auth.signInLink")}
                </button>
            </p>
        </div>
    );
}
