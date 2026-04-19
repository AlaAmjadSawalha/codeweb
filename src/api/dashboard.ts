import { api } from "@/api/axiosInstance";

export type DashboardMetrics = {
  total_projects: number;
  active_projects: number;
  plan_status: string;
  recent_projects: Array<{
    id: number;
    name: string;
    mode: string;
    status: string;
    created_at: string;
  }>;
  monthly_usage: number;
};

export async function getDashboardMetrics() {
  const { data } = await api.get<{ success: boolean; data: DashboardMetrics; message: string }>("/dashboard/metrics");
  return data;
}
