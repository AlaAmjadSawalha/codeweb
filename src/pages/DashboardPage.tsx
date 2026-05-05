import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "@/components/icons";
import { getDashboardMetrics } from "@/api/dashboard";
import { deleteProject, duplicateProject } from "@/api/projects";
import { getApiErrorMessage, getStoredUser } from "@/lib/api";
// getApiErrorMessage kept for handleDuplicate / handleDelete below
import type { DashboardMetrics } from "@/api/dashboard";
import { useDemoDashboard } from "@/context/DemoDashboardContext";
import type { DemoActivity, DemoNotification } from "@/types/demo-dashboard";
import {
    Bell,
    FolderOpen,
    Image as ImageIcon,
    MoveRight,
    MoreHorizontal,
    Copy,
    Trash2,
    ArrowUpCircle,
    CheckCircle2,
    Clock,
} from "lucide-react";

interface DashboardPageProps {
    setPage: (page: string) => void;
}

const placeholderImgs = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
];

function formatWhen(iso: string): string {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

function formatRelativeTime(iso: string): string {
    try {
        const diffMs = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    } catch {
        return iso;
    }
}

export default function DashboardPage({ setPage }: DashboardPageProps) {
    const { t } = useTranslation();
    const { state, markNotificationRead, markAllNotificationsRead, metrics: demoMetrics } = useDemoDashboard();
    const usagePct = demoMetrics.generationsLimit > 0
        ? Math.min(100, (demoMetrics.generationsUsed / demoMetrics.generationsLimit) * 100)
        : 0;
    const unreadCount = state.notifications.filter((n) => !n.read).length;
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDashboardMetrics();
            setMetrics(res.data);
        } catch {
            // Backend unavailable — demo data from DemoDashboardContext is still shown
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    const userName = getStoredUser<{ name?: string }>()?.name ?? t("dashboard.guestName");
    const recentProjects = metrics?.recent_projects ?? [];

    const handleDuplicate = async (id: number) => {
        try {
            await duplicateProject(id);
            await load();
            setPage("projects");
        } catch (e) {
            window.alert(getApiErrorMessage(e, t("errors.duplicateProject")));
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t("dashboard.deleteConfirm"))) return;
        try {
            await deleteProject(id);
            await load();
        } catch (e) {
            window.alert(getApiErrorMessage(e, t("errors.deleteProject")));
        }
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto min-h-screen">

            {/* Welcome hero banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 px-6 py-7 md:px-8 md:py-9 shadow-lg shadow-violet-500/25">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute bottom-0 left-16 w-56 h-56 rounded-full bg-indigo-400/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                </div>
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-violet-200 text-sm font-medium mb-0.5">{greeting},</p>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{userName} 👋</h1>
                        <p className="text-violet-200/80 text-sm mt-1.5 max-w-md">{t("dashboard.subtitle")}</p>
                        {loading && (
                            <p className="text-violet-300/70 text-xs mt-2 flex items-center gap-1.5">
                                <Icons.spinner className="h-3 w-3 animate-spin" />
                                {t("dashboard.loading")}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setPage("create-project")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 text-sm font-semibold hover:bg-violet-50 active:bg-violet-100 transition-colors shadow-md shrink-0"
                    >
                        <Icons.plus className="h-4 w-4" />
                        {t("dashboard.createNewProject")}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick actions */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("dashboard.quickActions")}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: t("dashboard.newProject"),      icon: <Icons.plus className="h-5 w-5" />,      page: "create-project", iconColor: "text-violet-600 dark:text-violet-400",    bg: "bg-violet-50 dark:bg-violet-900/30",    border: "hover:border-violet-300 dark:hover:border-violet-700" },
                                { label: t("dashboard.uploadBlueprint"), icon: <FolderOpen className="h-5 w-5" />,      page: "/upload",        iconColor: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-50 dark:bg-blue-900/30",        border: "hover:border-blue-300 dark:hover:border-blue-700" },
                                { label: t("dashboard.uploadPhotos"),    icon: <ImageIcon className="h-5 w-5" />,       page: "/upload",        iconColor: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30",  border: "hover:border-emerald-300 dark:hover:border-emerald-700" },
                                { label: t("dashboard.inspirationMode"), icon: <Icons.lightbulb className="h-5 w-5" />, page: "projects",       iconColor: "text-purple-600 dark:text-purple-400",   bg: "bg-purple-50 dark:bg-purple-900/30",    border: "hover:border-purple-300 dark:hover:border-purple-700" },
                            ].map((a) => (
                                <button
                                    key={a.label}
                                    onClick={() => setPage(a.page)}
                                    className={`group flex flex-col items-center justify-center gap-2.5 p-4 h-28 rounded-xl border border-border bg-card shadow-sm ${a.border} hover:shadow-md transition-all duration-200`}
                                >
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.iconColor} transition-transform duration-200 group-hover:scale-110`}>
                                        {a.icon}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Analytics cards */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("dashboard.overviewAnalytics")}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: <Icons.folder className="h-4 w-4" />,        value: metrics?.total_projects ?? "—",  label: t("dashboard.totalProjects"),     iconBg: "bg-violet-50 dark:bg-violet-900/30",  iconColor: "text-violet-600 dark:text-violet-400" },
                                { icon: <Icons.layoutTemplate className="h-4 w-4" />, value: metrics?.active_projects ?? "—", label: t("dashboard.activeProjects"),    iconBg: "bg-emerald-50 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
                                { icon: <Icons.brain className="h-4 w-4" />,          value: metrics?.monthly_usage ?? "—",   label: t("dashboard.projectsThisMonth"), iconBg: "bg-blue-50 dark:bg-blue-900/30",       iconColor: "text-blue-600 dark:text-blue-400" },
                                { icon: <Icons.bookmark className="h-4 w-4" />,       value: metrics?.plan_status ?? "—",     label: t("dashboard.plan"),              iconBg: "bg-amber-50 dark:bg-amber-900/30",     iconColor: "text-amber-600 dark:text-amber-400" },
                            ].map((card) => (
                                <div key={card.label} className="rounded-xl border border-border bg-card shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                                    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} mb-3`}>
                                        {card.icon}
                                    </div>
                                    <div className="text-2xl font-bold capitalize text-foreground">{card.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent projects */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dashboard.recentProjects")}</h2>
                            <button
                                onClick={() => setPage("projects")}
                                className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline underline-offset-4"
                            >
                                {t("dashboard.viewAll")} <MoveRight className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {recentProjects.length === 0 && !loading && (
                                <div className="col-span-full flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed border-border bg-card text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-3">
                                        <Icons.folder className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{t("dashboard.noProjectsYet")}</p>
                                    <p className="text-xs text-muted-foreground mt-1 mb-3">Start by creating your first AI room design.</p>
                                    <button
                                        onClick={() => setPage("create-project")}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline underline-offset-4"
                                    >
                                        <Icons.plus className="h-3.5 w-3.5" /> {t("dashboard.createNewProject")}
                                    </button>
                                </div>
                            )}
                            {recentProjects.map((project, idx) => {
                                const img = placeholderImgs[idx % placeholderImgs.length];
                                const active = project.status === "active";
                                return (
                                    <div key={project.id} className="group flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200">
                                        <div className="relative h-36 overflow-hidden bg-muted">
                                            <img src={img} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            <div className="absolute top-2.5 left-2.5">
                                                {!active ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100/95 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 text-[10px] font-bold uppercase backdrop-blur-sm shadow-sm">
                                                        <Icons.spinner className="h-3 w-3 animate-spin" /> {project.status}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 text-slate-800 dark:bg-black/80 dark:text-slate-200 text-[10px] font-bold uppercase backdrop-blur-sm shadow-sm">
                                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {t("dashboard.ready")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h3
                                                    className="font-semibold text-sm line-clamp-1 cursor-pointer group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                                                    onClick={() => setPage(`/ai-designs?project=${project.id}`)}
                                                >
                                                    {project.name}
                                                </h3>
                                                <button type="button" className="text-muted-foreground hover:text-foreground p-1 -mr-1 rounded-lg hover:bg-muted transition-colors">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                                                <Clock className="h-3 w-3" /> {formatWhen(project.created_at)}
                                            </p>
                                            <div className="mt-auto flex gap-2 pt-3 border-t border-border">
                                                <button
                                                    type="button"
                                                    onClick={() => setPage(`/ai-designs?project=${project.id}`)}
                                                    className="flex-1 flex justify-center items-center h-8 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors shadow-sm shadow-violet-500/20"
                                                >
                                                    {t("dashboard.open")}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); void handleDuplicate(project.id); }}
                                                    className="flex justify-center items-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                                    title={t("dashboard.duplicateTitle")}
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); void handleDelete(project.id); }}
                                                    className="flex justify-center items-center w-8 h-8 rounded-lg border border-border text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors"
                                                    title={t("dashboard.deleteTitle")}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right sidebar */}
                <div className="space-y-5">

                    {/* Plan card */}
                    <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white shrink-0">
                                    <Icons.brain className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-white">{t("dashboard.currentPlan")}</h2>
                                    <p className="text-xs font-medium text-violet-200 capitalize">{metrics?.plan_status ?? "free"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-muted-foreground">{t("dashboard.aiGenerations")}</span>
                                <span className="font-semibold">{demoMetrics.generationsUsed} / {demoMetrics.generationsLimit}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${usagePct}%` }} />
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-2 mb-5">
                                {[t("dashboard.planFeature1"), t("dashboard.planFeature2"), t("dashboard.planFeature3")].map(f => (
                                    <li key={f} className="flex items-center gap-2">
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 shrink-0">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-violet-600 dark:text-violet-400" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={() => setPage("/pricing")}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors shadow-md shadow-violet-500/20"
                            >
                                {t("dashboard.upgradeBusiness")} <ArrowUpCircle className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="rounded-2xl border border-border bg-card shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-sm font-semibold">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">{unreadCount}</span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => markAllNotificationsRead()}
                                    className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline underline-offset-4"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <ul className="space-y-2 max-h-60 overflow-y-auto -mx-1 px-1">
                            {state.notifications.slice(0, 6).map((n: DemoNotification) => (
                                <li key={n.id}>
                                    <button
                                        type="button"
                                        onClick={() => !n.read && markNotificationRead(n.id)}
                                        className={`w-full text-left rounded-xl px-3 py-2.5 transition-all duration-150 ${
                                            n.read
                                                ? "bg-muted/40 hover:bg-muted/70"
                                                : "bg-violet-50/80 dark:bg-violet-950/20 ring-1 ring-violet-200 dark:ring-violet-900"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-xs font-medium leading-snug ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && <span className="h-2 w-2 rounded-full bg-violet-500 shrink-0 mt-0.5" />}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1">{formatRelativeTime(n.createdAt)}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Activity timeline */}
                    <section className="rounded-2xl border border-border bg-card shadow-sm p-5">
                        <h2 className="text-sm font-semibold mb-4">{t("dashboard.recentActivity")}</h2>
                        <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                            {state.activity.slice(0, 5).map((activity: DemoActivity) => (
                                <div key={activity.id} className="relative flex items-start gap-3 pl-6">
                                    <div className="absolute left-0 mt-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 border-2 border-violet-300 dark:border-violet-700">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-foreground leading-snug">{activity.action}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            <span className="font-medium">{activity.target}</span>{activity.target ? " · " : ""}{activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tip */}
                    <section className="rounded-2xl border border-violet-100 dark:border-violet-900/30 bg-gradient-to-br from-violet-50/70 to-indigo-50/40 dark:from-violet-950/15 dark:to-indigo-950/10 p-5 flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 shrink-0">
                            <Icons.lightbulb className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-1">{t("dashboard.tipTitle")}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{t("dashboard.tipBody")}</p>
                            <button onClick={() => setPage("settings")} className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline underline-offset-4">
                                {t("dashboard.goToSettings")}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
