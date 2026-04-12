export type DemoProjectStatus = "processing" | "ready";

export interface DemoProjectPreferences {
  budget: string;
  customBudget: string;
  designStyle: string;
  colorPreference: string;
  customColor: string;
  roomUsage: string;
  furniturePreference: string;
  layoutStyle: string;
  entryMode: string;
}

export interface DemoProject {
  id: string;
  name: string;
  createdAt: string;
  status: DemoProjectStatus;
  coverImageUrl: string;
  views: number;
  designsCount: number;
  preferences: DemoProjectPreferences;
}

export interface DemoNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface DemoActivity {
  id: string;
  action: string;
  target: string;
  time: string;
}

export interface DemoPlan {
  name: string;
  generationsUsed: number;
  generationsLimit: number;
  features: string[];
}

export interface DemoDashboardState {
  projects: DemoProject[];
  notifications: DemoNotification[];
  activity: DemoActivity[];
  plan: DemoPlan;
  savedLayoutsCount: number;
}
