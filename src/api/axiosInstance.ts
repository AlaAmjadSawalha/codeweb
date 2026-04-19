import axios from "axios";

function apiOrigin(): string {
  const raw =
    import.meta.env.VITE_API_URL ??
    (import.meta.env as { REACT_APP_API_URL?: string }).REACT_APP_API_URL;
  const s = typeof raw === "string" && raw.length > 0 ? raw : "http://localhost:8000";
  return s.replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: `${apiOrigin()}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url ?? "");
    const isPublicAuth =
      url.includes("auth/login") ||
      url.includes("auth/register") ||
      url.includes("auth/forgot-password") ||
      url.includes("auth/reset-password");

    if (status === 401 && !isPublicAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.assign("/auth/login");
      }
    }
    return Promise.reject(error);
  },
);
