import type {
  DemoActivity,
  DemoDashboardState,
  DemoNotification,
  DemoPlan,
  DemoProject,
  DemoProjectPreferences,
} from "@/types/demo-dashboard";

const STORAGE_KEY = "smartplan_demo_dashboard_v1";

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=400",
];

const defaultPreferences = (overrides: Partial<DemoProjectPreferences> = {}): DemoProjectPreferences => ({
  budget: "",
  customBudget: "",
  designStyle: "Modern",
  colorPreference: "Neutral palette",
  customColor: "#3b82f6",
  roomUsage: "Family living",
  furniturePreference: "Practical",
  layoutStyle: "Open space",
  entryMode: "blueprint",
  ...overrides,
});

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function getSeedState(): DemoDashboardState {
  const projects: DemoProject[] = [
    {
      id: "seed-1",
      name: "Modern Loft Renovation",
      createdAt: hoursAgo(2),
      status: "processing",
      coverImageUrl: STOCK_IMAGES[0],
      views: 0,
      designsCount: 3,
      preferences: defaultPreferences({ designStyle: "Modern", entryMode: "blueprint" }),
    },
    {
      id: "seed-2",
      name: "Suburban Family Home",
      createdAt: daysAgo(1),
      status: "ready",
      coverImageUrl: STOCK_IMAGES[1],
      views: 4,
      designsCount: 5,
      preferences: defaultPreferences({ designStyle: "Scandinavian", entryMode: "real_space" }),
    },
    {
      id: "seed-3",
      name: "Downtown Office Space",
      createdAt: daysAgo(5),
      status: "ready",
      coverImageUrl: STOCK_IMAGES[2],
      views: 12,
      designsCount: 2,
      preferences: defaultPreferences({ designStyle: "Industrial", entryMode: "inspiration" }),
    },
    {
      id: "seed-4",
      name: "Brooklyn Studio Layout",
      createdAt: daysAgo(12),
      status: "ready",
      coverImageUrl: STOCK_IMAGES[3],
      views: 6,
      designsCount: 4,
      preferences: defaultPreferences({ designStyle: "Minimalist", entryMode: "blueprint" }),
    },
    {
      id: "seed-5",
      name: "Mountain Cabin",
      createdAt: daysAgo(28),
      status: "ready",
      coverImageUrl: STOCK_IMAGES[4],
      views: 9,
      designsCount: 3,
      preferences: defaultPreferences({ designStyle: "Eco Style", entryMode: "real_space" }),
    },
    {
      id: "seed-6",
      name: "Airbnb Beach House",
      createdAt: daysAgo(55),
      status: "ready",
      coverImageUrl: STOCK_IMAGES[5],
      views: 21,
      designsCount: 6,
      preferences: defaultPreferences({ designStyle: "Luxury", entryMode: "inspiration" }),
    },
  ];

  const plan: DemoPlan = {
    name: "Designer Pro",
    generationsUsed: 14,
    generationsLimit: 50,
    features: ["High-res PDF Exports", "Cost Estimation Engine", "Priority processing"],
  };

  const notifications: DemoNotification[] = [
    {
      id: "n1",
      title: "Layout generation finished",
      body: "Modern Loft Renovation has 3 new layout variations ready to review.",
      createdAt: hoursAgo(2),
      read: false,
    },
    {
      id: "n2",
      title: "Usage reminder",
      body: "You have used 14 of 50 AI generations this month.",
      createdAt: hoursAgo(5),
      read: false,
    },
    {
      id: "n3",
      title: "Export complete",
      body: "Your PDF for Suburban Family Home is ready to download.",
      createdAt: daysAgo(1),
      read: true,
    },
    {
      id: "n4",
      title: "Style presets",
      body: "Tip: save favorite styles in Settings for faster project setup.",
      createdAt: daysAgo(2),
      read: true,
    },
  ];

  const activity: DemoActivity[] = [
    { id: "a1", action: "Generated 3 layout variations", target: "Modern Loft Renovation", time: "2 hours ago" },
    { id: "a2", action: "Created new project", target: "Modern Loft Renovation", time: "2.5 hours ago" },
    { id: "a3", action: "Exported PDF report", target: "Suburban Family Home", time: "Yesterday" },
    { id: "a4", action: "Updated style preferences", target: "Account Settings", time: "2 days ago" },
  ];

  return {
    projects,
    notifications,
    activity,
    plan,
    savedLayoutsCount: 8,
  };
}

export function loadDemoState(): DemoDashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSeedState();
    const parsed = JSON.parse(raw) as DemoDashboardState;
    if (!parsed.projects || !Array.isArray(parsed.projects)) return getSeedState();
    return parsed;
  } catch {
    return getSeedState();
  }
}

export function saveDemoState(state: DemoDashboardState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetDemoState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const COVER_BY_MODE: Record<string, string> = {
  blueprint: STOCK_IMAGES[0],
  real_space: STOCK_IMAGES[1],
  inspiration: STOCK_IMAGES[2],
};

export function getDefaultCoverForMode(entryMode: string): string {
  return COVER_BY_MODE[entryMode] ?? STOCK_IMAGES[0];
}

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function appendActivity(
  state: DemoDashboardState,
  action: string,
  target: string
): DemoActivity[] {
  const item: DemoActivity = {
    id: newId(),
    action,
    target,
    time: "Just now",
  };
  return [item, ...state.activity].slice(0, 12);
}

export function createProjectRecord(input: {
  name: string;
  coverImageUrl: string;
  preferences: DemoProjectPreferences;
  designsCount?: number;
  status?: DemoProject["status"];
}): DemoProject {
  const createdAt = new Date().toISOString();
  return {
    id: newId(),
    name: input.name.trim() || "Untitled project",
    createdAt,
    status: input.status ?? "ready",
    coverImageUrl: input.coverImageUrl,
    views: 0,
    designsCount: input.designsCount ?? 3,
    preferences: input.preferences,
  };
}

export function duplicateProjectRecord(project: DemoProject): DemoProject {
  const copy: DemoProject = {
    ...project,
    id: newId(),
    name: `${project.name} (Copy)`,
    createdAt: new Date().toISOString(),
    status: "ready",
    views: 0,
  };
  return copy;
}

export function pushNotification(
  state: DemoDashboardState,
  n: Omit<DemoNotification, "id" | "read">
): DemoNotification[] {
  const note: DemoNotification = {
    ...n,
    id: newId(),
    read: false,
  };
  return [note, ...state.notifications].slice(0, 20);
}
