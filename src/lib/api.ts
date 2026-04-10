import axios, { type AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const AUTH_TOKEN_KEY = "sp-auth-token";

export const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

type ApiEnvelope<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

type ValidationPayload = {
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as AxiosError<ApiEnvelope<ValidationPayload>>;
  const data = err.response?.data;

  if (data && data.success === false && typeof data.message === "string") {
    const nested = data.data?.errors;
    if (nested && typeof nested === "object") {
      const firstKey = Object.keys(nested)[0];
      const firstMsg = firstKey ? nested[firstKey]?.[0] : undefined;
      if (firstMsg) {
        return firstMsg;
      }
    }
    return data.message;
  }

  return fallback;
}
