import React, { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api, getApiErrorMessage } from "@/lib/api";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onRequestSent: (email: string) => void;
}

export function ForgotPasswordForm({ onBackToLogin, onRequestSent }: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError(t("auth.errors.enterEmail"));
      return;
    }
    if (!emailRegex.test(email)) {
      setError(t("auth.errors.invalidEmail"));
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      onRequestSent(email.trim());
    } catch (err) {
      setError(getApiErrorMessage(err, t("auth.errors.invalidEmail")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("auth.forgotTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {t("auth.forgotSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">{t("auth.email")}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex w-full h-11 px-3 py-2 pl-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
              placeholder={t("auth.email")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center w-full h-11 px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors rounded-md bg-slate-900 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 disabled:opacity-50"
        >
          {isSubmitting ? t("auth.sendResetCode") + "…" : t("auth.sendResetCode")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </form>

      <button
        type="button"
        onClick={onBackToLogin}
        className="inline-flex items-center text-sm font-medium text-slate-700 hover:underline dark:text-slate-300"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t("auth.backToLogin")}
      </button>
    </div>
  );
}
