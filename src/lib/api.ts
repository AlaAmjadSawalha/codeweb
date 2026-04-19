import type { AxiosError } from "axios";
import { api } from "@/api/axiosInstance";
import i18n from "@/i18n";

export { api };

/** Module API + legacy v1 envelope */
export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "user";
const LEGACY_AUTH_TOKEN_KEY = "sp-auth-token";

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  const t = localStorage.getItem(AUTH_TOKEN_KEY);
  if (t) return t;
  const legacy = localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
  if (legacy) {
    localStorage.setItem(AUTH_TOKEN_KEY, legacy);
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
    return legacy;
  }
  return null;
}

export function setStoredUser(user: unknown | null): void {
  if (user === null) {
    localStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T = Record<string, unknown>>(): T | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem("sp-authenticated");
}

type ModuleErrorBody = {
  success?: boolean;
  error?: string;
  code?: number;
};

type V1ErrorBody = {
  success?: boolean;
  message?: string;
  data?: { errors?: Record<string, string[]> };
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as AxiosError<ModuleErrorBody & V1ErrorBody>;
  if (!err.response) {
    return i18n.t("errors.connection");
  }

  const status = err.response.status;
  const body = err.response.data;

  if (body && typeof body === "object") {
    if (typeof body.error === "string" && body.error.length > 0) {
      return body.error;
    }
    if (body.data?.errors && typeof body.data.errors === "object") {
      const nested = body.data.errors;
      const firstKey = Object.keys(nested)[0];
      const firstMsg = firstKey ? nested[firstKey]?.[0] : undefined;
      if (firstMsg) return firstMsg;
    }
    if (typeof body.message === "string" && body.message.length > 0) {
      return body.message;
    }
  }

  if (status === 403) return i18n.t("errors.forbidden");
  if (status === 404) return i18n.t("errors.notFound");
  if (status === 429) return i18n.t("errors.rateLimit");
  if (status >= 500) return i18n.t("errors.serverError");

  return fallback;
}
