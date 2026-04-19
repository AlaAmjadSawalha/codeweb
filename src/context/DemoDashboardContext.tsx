import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoDashboardState, DemoProject } from "@/types/demo-dashboard";
import {
  appendActivity,
  createProjectRecord,
  duplicateProjectRecord,
  loadDemoState,
  pushNotification,
  saveDemoState,
} from "@/lib/demo-dashboard-storage";

export interface DashboardMetrics {
  totalProjects: number;
  designsGenerated: number;
  generationsUsed: number;
  generationsLimit: number;
  savedLayouts: number;
}

interface DemoDashboardContextValue {
  state: DemoDashboardState;
  metrics: DashboardMetrics;
  recentProjects: DemoProject[];
  addProjectFromWizard: (input: {
    name: string;
    coverImageUrl: string;
    preferences: DemoProject["preferences"];
  }) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DemoDashboardContext = createContext<DemoDashboardContextValue | null>(null);

function computeMetrics(state: DemoDashboardState): DashboardMetrics {
  const designsGenerated = state.projects.reduce((sum, p) => sum + p.designsCount, 0);
  return {
    totalProjects: state.projects.length,
    designsGenerated,
    generationsUsed: state.plan.generationsUsed,
    generationsLimit: state.plan.generationsLimit,
    savedLayouts: state.savedLayoutsCount,
  };
}

function sortProjectsRecent(projects: DemoProject[]): DemoProject[] {
  return [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function DemoDashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoDashboardState>(() => loadDemoState());

  const addProjectFromWizard = useCallback(
    (input: { name: string; coverImageUrl: string; preferences: DemoProject["preferences"] }) => {
      const project = createProjectRecord({
        name: input.name,
        coverImageUrl: input.coverImageUrl,
        preferences: input.preferences,
        designsCount: 3,
        status: "ready",
      });

      setState((prev) => {
        const generationsUsed = Math.min(
          prev.plan.generationsLimit,
          prev.plan.generationsUsed + 3
        );
        const next: DemoDashboardState = {
          ...prev,
          projects: [project, ...prev.projects],
          plan: { ...prev.plan, generationsUsed },
          savedLayoutsCount: prev.savedLayoutsCount + 2,
          activity: appendActivity(prev, "Created new project", project.name),
          notifications: pushNotification(prev, {
            title: "Project saved",
            body: `${project.name} is ready. AI generated initial layout ideas.`,
            createdAt: new Date().toISOString(),
          }),
        };
        saveDemoState(next);
        return next;
      });
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setState((prev) => {
      const project = prev.projects.find((p) => p.id === id);
      const next: DemoDashboardState = {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
        activity: project
          ? appendActivity(prev, "Deleted project", project.name)
          : prev.activity,
      };
      saveDemoState(next);
      return next;
    });
  }, []);

  const duplicateProject = useCallback((id: string) => {
    setState((prev) => {
      const original = prev.projects.find((p) => p.id === id);
      if (!original) return prev;
      const copy = duplicateProjectRecord(original);
      const next: DemoDashboardState = {
        ...prev,
        projects: [copy, ...prev.projects],
        activity: appendActivity(prev, "Duplicated project", copy.name),
        notifications: pushNotification(prev, {
          title: "Project duplicated",
          body: `${copy.name} was created from ${original.name}.`,
          createdAt: new Date().toISOString(),
        }),
      };
      saveDemoState(next);
      return next;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => {
      const next: DemoDashboardState = {
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      };
      saveDemoState(next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => {
      const next: DemoDashboardState = {
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      };
      saveDemoState(next);
      return next;
    });
  }, []);

  const sorted = useMemo(() => sortProjectsRecent(state.projects), [state.projects]);
  const recentProjects = useMemo(() => sorted.slice(0, 4), [sorted]);

  const metrics = useMemo(() => computeMetrics(state), [state]);

  const value = useMemo<DemoDashboardContextValue>(
    () => ({
      state,
      metrics,
      recentProjects,
      addProjectFromWizard,
      deleteProject,
      duplicateProject,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      state,
      metrics,
      recentProjects,
      addProjectFromWizard,
      deleteProject,
      duplicateProject,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return (
    <DemoDashboardContext.Provider value={value}>{children}</DemoDashboardContext.Provider>
  );
}

export function useDemoDashboard(): DemoDashboardContextValue {
  const ctx = useContext(DemoDashboardContext);
  if (!ctx) {
    throw new Error("useDemoDashboard must be used within DemoDashboardProvider");
  }
  return ctx;
}
