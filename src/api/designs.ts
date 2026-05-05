import { api as axiosInstance } from "@/api/axiosInstance";

export type CostEstimate = {
  furniture: number;
  demolition: number;
  materials: number;
  labor: number;
  total: number;
};

export type Design = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  image_url: string | null;
  overall_score: number;
  score_space: number;
  score_lighting: number;
  score_circulation: number;
  score_budget: number;
  score_functional: number;
  cost_estimate: CostEstimate | null;
  is_saved: boolean;
  is_selected: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type ApiResponse<T> = { success: boolean; data: T; message: string };

export const listDesigns = (projectId: number) =>
  axiosInstance.get<ApiResponse<Design[]>>(`/projects/${projectId}/designs`);

export const getDesign = (projectId: number, designId: number) =>
  axiosInstance.get<ApiResponse<Design>>(`/projects/${projectId}/designs/${designId}`);

export const generateDesigns = (projectId: number) =>
  axiosInstance.post<ApiResponse<Design[]>>(`/projects/${projectId}/designs/generate`);

export const saveDesign = (projectId: number, data: Partial<Design>) =>
  axiosInstance.post<ApiResponse<Design>>(`/projects/${projectId}/designs`, data);

export const selectDesign = (projectId: number, designId: number) =>
  axiosInstance.put<ApiResponse<Design>>(`/projects/${projectId}/designs/${designId}/select`);

export const compareDesigns = (projectId: number, designAId: number, designBId: number) =>
  axiosInstance.post<ApiResponse<{ design_a: Design; design_b: Design }>>(
    `/projects/${projectId}/designs/compare`,
    { design_a_id: designAId, design_b_id: designBId }
  );

export const deleteDesign = (projectId: number, designId: number) =>
  axiosInstance.delete<ApiResponse<[]>>(`/projects/${projectId}/designs/${designId}`);
