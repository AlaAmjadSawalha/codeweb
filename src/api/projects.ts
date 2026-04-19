import { api } from "@/api/axiosInstance";

export type ProjectMode = "residential" | "commercial" | "office" | "other";

export type ProjectPreferences = {
  id: number;
  project_id: number;
  budget: number | null;
  style: string | null;
  colors: string[] | null;
  usage: string | null;
  furniture: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Project = {
  id: number;
  user_id: number;
  name: string;
  mode: ProjectMode;
  status: string;
  created_at: string;
  updated_at: string;
  preferences: ProjectPreferences | null;
};

export async function listProjects(params?: { search?: string; status?: string }) {
  const { data } = await api.get<{ success: boolean; data: Project[]; message: string }>("/projects", { params });
  return data;
}

export async function getProject(id: number) {
  const { data } = await api.get<{ success: boolean; data: Project; message: string }>(`/projects/${id}`);
  return data;
}

export async function createProject(body: { name: string; mode: ProjectMode }) {
  const { data } = await api.post<{ success: boolean; data: Project; message: string }>("/projects", body);
  return data;
}

export async function updateProject(id: number, body: { name?: string; mode?: ProjectMode; status?: string }) {
  const { data } = await api.put<{ success: boolean; data: Project; message: string }>(`/projects/${id}`, body);
  return data;
}

export async function deleteProject(id: number) {
  const { data } = await api.delete<{ success: boolean; data: unknown; message: string }>(`/projects/${id}`);
  return data;
}

export async function duplicateProject(id: number) {
  const { data } = await api.post<{ success: boolean; data: Project; message: string }>(`/projects/${id}/duplicate`);
  return data;
}

export async function updateProjectPreferences(
  id: number,
  body: {
    budget?: number | null;
    style?: string | null;
    colors?: string[] | null;
    usage?: string | null;
    furniture?: boolean;
  },
) {
  const { data } = await api.put<{ success: boolean; data: ProjectPreferences; message: string }>(
    `/projects/${id}/preferences`,
    body,
  );
  return data;
}
