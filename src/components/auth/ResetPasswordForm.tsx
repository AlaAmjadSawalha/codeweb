import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api";
import { resetPassword as resetPasswordRequest } from "@/api/auth";

interface ResetPasswordFormProps {
  email: string;
  initialResetToken?: string;
  onBackToForgot: () => void;
  onResetSuccess: () => void;
}

export function ResetPasswordForm({ email, initialResetToken, onBackToForgot, onResetSuccess }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState(initialResetToken ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialResetToken) {
      setCode(initialResetToken);
    }
  }, [initialResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!code || !password || !confirmPassword) {
      setError(t("auth.errors.fillAllFields"));
      return;
    }
    if (password.length < 8 || !hasUppercase || !hasNumber) {
      setError(t("auth.errors.passwordStrong"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.errors.passwordMismatch"));
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await resetPasswordRequest({
        token: code.trim(),
        new_password: password,
      });
      onResetSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, t("auth.errors.resetLinkInvalid")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-100 max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="fs-2 fw-bold tracking-tight text-slate-900 dark:text-white">{t("auth.resetTitle")}</h2>
        <p className="mt-2 fs-6 text-muted text-slate-600 dark:text-slate-400">
          {t("auth.resetSubtitle", { email })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 fs-6 text-muted text-red-500 bg-red-50 border border-red-200 rounded-3 dark:bg-red-900/10 dark:border-red-500/20 d-flex align-items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">{t("auth.resetCode")}</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("auth.resetCodePlaceholder")}
            className="d-flex w-100 h-11 px-3 py-2 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">{t("auth.newPassword")}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="d-flex w-100 h-11 px-3 py-2 pl-10 pr-9 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
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
          <label className="fs-6 text-muted fw-medium leading-none text-slate-700 dark:text-slate-300">{t("auth.confirmPassword")}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 d-flex align-items-center pl-3 text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="d-flex w-100 h-11 px-3 py-2 pl-10 pr-9 fs-6 text-muted bg-transparent border rounded-2 border-slate-200 ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex align-items-center justify-content-center w-100 h-11 px-3 py-2 fs-6 text-muted fw-medium tracking-wide text-white transition-colors rounded-2 bg-slate-900 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 disabled:opacity-50"
        >
          {isSubmitting ? t("auth.updatePassword") + "…" : t("auth.updatePassword")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </form>

      <button
        type="button"
        onClick={onBackToForgot}
        className="inline-flex align-items-center fs-6 text-muted fw-medium text-slate-700 hover:underline dark:text-slate-300"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t("auth.backToForgot")}
      </button>
    </div>
  );
}
