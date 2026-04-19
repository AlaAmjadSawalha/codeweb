import { api } from "@/api/axiosInstance";

export type ModuleUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: string;
};

export type AuthPayload = {
  token: string;
  user: ModuleUser;
};

export async function register(body: { name: string; email: string; password: string }) {
  const payload = {
    name: body.name,
    email: body.email,
    password: body.password,
  };
  const { data } = await api.post<{ success: boolean; data: AuthPayload; message: string }>(
    "/auth/register",
    payload,
  );
  return data;
}

export async function login(body: { email: string; password: string }) {
  const { data } = await api.post<{ success: boolean; data: AuthPayload; message: string }>("/auth/login", body);
  return data;
}

export async function logout() {
  const { data } = await api.post<{ success: boolean; data: unknown; message: string }>("/auth/logout");
  return data;
}

export async function forgotPassword(body: { email: string }) {
  const { data } = await api.post<{ success: boolean; data: unknown; message: string }>("/auth/forgot-password", body);
  return data;
}

export async function resetPassword(body: { token: string; new_password: string }) {
  const { data } = await api.post<{ success: boolean; data: unknown; message: string }>("/auth/reset-password", body);
  return data;
}

export async function me() {
  const { data } = await api.get<{ success: boolean; data: ModuleUser; message: string }>("/auth/me");
  return data;
}
