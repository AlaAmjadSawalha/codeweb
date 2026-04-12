import { Icons } from "@/components/icons";
import { useDemoDashboard } from "@/context/DemoDashboardContext";
import { formatRelativeTime } from "@/lib/utils";
import {
    ArrowUpRight,
    FolderOpen,
    Image as ImageIcon,
    MoveRight,
    MoreHorizontal,
    Copy,
    Trash2,
    ArrowUpCircle,
    CheckCircle2,
    Clock,
    Bell,
} from "lucide-react";

interface DashboardPageProps {
    setPage: (page: string) => void;
}

export default function DashboardPage({ setPage }: DashboardPageProps) {
    const {
        state,
        metrics,
        recentProjects,
        duplicateProject,
        deleteProject,
        markNotificationRead,
        markAllNotificationsRead,
    } = useDemoDashboard();

    const plan = state.plan;
    const usagePct = Math.min(
        100,
        Math.round((plan.generationsUsed / Math.max(1, plan.generationsLimit)) * 100)
    );
    const unreadCount = state.notifications.filter((n) => !n.read).length;

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Delete “${name}”? This cannot be undone in demo mode.`)) {
            deleteProject(id);
        }
    };

    return (
        <div className="p-3 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto bg-slate-50/50 dark:bg-background h-100 min-vh-100">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
                    <p className="text-muted-foreground mt-1">Here is the status of your AI designs, plan usage, and notifications.</p>
                </div>
                <button
                    onClick={() => setPage("create-project")}
                    className="inline-flex h-11 align-items-center justify-content-center rounded-4 bg-indigo-600 px-4 py-2 fs-6 text-muted fw-medium text-white shadow shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:scale-105 focus-visible:outline-none"
                >
                    <Icons.plus className="mr-2 h-4 w-4" />
                    Create New Project
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">

                    <section>
                        <h2 className="fs-5 fw-semibold tracking-tight mb-4">Quick Actions</h2>
                        <div className="d-grid row-cols-2 sm:grid-cols-4 gap-4">
                            <button onClick={() => setPage("create-project")} className="d-flex flex-column align-items-center justify-content-center p-3 h-28 rounded-4 border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group">
                                <div className="w-10 h-10 rounded-circle bg-white dark:bg-slate-800 shadow-sm d-flex align-items-center justify-content-center mb-2 group-hover:scale-110 transition-transform">
                                    <Icons.plus className="h-5 w-5" />
                                </div>
                                <span className="small fw-medium">New Project</span>
                            </button>
                            <button onClick={() => setPage("create-project")} className="d-flex flex-column align-items-center justify-content-center p-3 h-28 rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 group">
                                <div className="w-10 h-10 rounded-circle bg-blue-50 dark:bg-blue-900/30 d-flex align-items-center justify-content-center mb-2 group-hover:scale-110 transition-transform">
                                    <FolderOpen className="h-5 w-5" />
                                </div>
                                <span className="small fw-medium">Upload Blueprint</span>
                            </button>
                            <button onClick={() => setPage("create-project")} className="d-flex flex-column align-items-center justify-content-center p-3 h-28 rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 group">
                                <div className="w-10 h-10 rounded-circle bg-emerald-50 dark:bg-emerald-900/30 d-flex align-items-center justify-content-center mb-2 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                <span className="small fw-medium">Upload Photos</span>
                            </button>
                            <button onClick={() => setPage("ai-designs")} className="d-flex flex-column align-items-center justify-content-center p-3 h-28 rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 group">
                                <div className="w-10 h-10 rounded-circle bg-purple-50 dark:bg-purple-900/30 d-flex align-items-center justify-content-center mb-2 group-hover:scale-110 transition-transform">
                                    <Icons.lightbulb className="h-5 w-5" />
                                </div>
                                <span className="small fw-medium">Inspiration Mode</span>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h2 className="fs-5 fw-semibold tracking-tight mb-4">Overview Analytics</h2>
                        <div className="d-grid row-cols-2 md:grid-cols-4 gap-4">
                            <div className="rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="d-flex align-items-center justify-content-between text-muted mb-3">
                                    <Icons.folder className="h-4 w-4" />
                                    <span className="text-xs font-medium text-emerald-500 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> Live</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalProjects}</div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Total Projects</h3>
                            </div>

                            <div className="rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="d-flex align-items-center justify-content-between text-muted mb-3">
                                    <Icons.layoutTemplate className="h-4 w-4" />
                                    <span className="text-xs font-medium text-emerald-500 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> Live</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.designsGenerated}</div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Designs Generated</h3>
                            </div>

                            <div className="rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="d-flex align-items-center justify-content-between text-muted mb-3">
                                    <Icons.brain className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-medium text-muted-foreground">This month</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {metrics.generationsUsed}
                                    <span className="text-sm font-normal text-muted-foreground">/{metrics.generationsLimit}</span>
                                </div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Generations Used</h3>
                            </div>

                            <div className="rounded-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="d-flex align-items-center justify-content-between text-muted mb-3">
                                    <Icons.bookmark className="h-4 w-4" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.savedLayouts}</div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Saved Layouts</h3>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h2 className="fs-5 fw-semibold tracking-tight">Recent Projects</h2>
                            <button
                                onClick={() => setPage("projects")}
                                className="fs-6 text-muted text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 fw-medium hover:underline d-flex align-items-center"
                            >
                                View all <MoveRight className="ml-1 w-3 h-3" />
                            </button>
                        </div>
                        <div className="d-grid sm:grid-cols-2 gap-4">
                            {recentProjects.map((project) => (
                                <div key={project.id} className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden hover:shadow-md transition-all">
                                    <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <img src={project.coverImageUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-2 left-2">
                                            {project.status === "processing" ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-amber-100/90 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 text-[10px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                                                    <Icons.spinner className="w-3 h-3 mr-1 animate-spin" /> Processing AI
                                                </span>
                                            ) : (
                                                <span className="inline-flex align-items-center px-2 py-1 rounded bg-white/90 text-slate-800 dark:bg-black/90 dark:text-slate-300 text-[10px] fw-bold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                                                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Ready
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-3 flex-1 d-flex flex-column relative">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h3 className="fw-semibold fs-6 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => setPage("design-details")}>
                                                {project.name}
                                            </h3>
                                            <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 -mr-2" aria-label="More actions">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center mb-4">
                                            <Clock className="w-3 h-3 mr-1" /> {formatRelativeTime(project.createdAt)}
                                        </div>

                                        <div className="mt-auto flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                            <button type="button" onClick={() => setPage("design-details")} className="flex-1 inline-flex justify-center items-center h-8 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                                Open
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => duplicateProject(project.id)}
                                                className="inline-flex justify-center items-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(project.id, project.name)}
                                                className="inline-flex justify-center items-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">

                    <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 p-6 shadow-indigo-100/50 dark:shadow-none shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>

                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-3 text-indigo-600 dark:text-indigo-400">
                                <Icons.brain className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">Plan status</h2>
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{plan.name}</div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 relative z-10">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">AI generations</span>
                                    <span className="text-muted-foreground">{plan.generationsUsed} / {plan.generationsLimit}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${usagePct}%` }}></div>
                                </div>
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-2 mt-4">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center"><CheckCircle2 className="w-3 h-3 text-indigo-500 mr-2 shrink-0" /> {f}</li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={() => setPage("pricing")}
                            className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors relative z-10 flex justify-center items-center"
                        >
                            Upgrade plan <ArrowUpCircle className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                        </button>
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shrink-0">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-sm font-semibold tracking-tight">Notifications</h2>
                                    {unreadCount > 0 && (
                                        <p className="text-xs text-muted-foreground truncate">{unreadCount} unread</p>
                                    )}
                                </div>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => markAllNotificationsRead()}
                                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {state.notifications.slice(0, 6).map((n) => (
                                <li key={n.id}>
                                    <button
                                        type="button"
                                        onClick={() => !n.read && markNotificationRead(n.id)}
                                        className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${n.read
                                            ? "border-transparent bg-slate-50/80 dark:bg-slate-950/50"
                                            : "border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium leading-snug ${n.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && (
                                                <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" aria-hidden />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1.5">{formatRelativeTime(n.createdAt)}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
                        </div>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                            {state.activity.slice(0, 6).map((activity) => (
                                <div key={activity.id} className="relative flex items-start gap-4">
                                    <div className="absolute left-0 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 z-10">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                                    </div>
                                    <div className="pl-8">
                                        <p className="fs-6 text-muted fw-medium text-slate-700 dark:text-slate-300 leading-snug">{activity.action}</p>
                                        <p className="small text-muted"><span className="fw-medium text-slate-900 dark:text-slate-100">{activity.target}</span> • {activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-5 p-6 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/60 rounded-full shrink-0 text-blue-600 dark:text-blue-400">
                            <Icons.lightbulb className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Save styles for later</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">You can create custom preset styles in your settings to apply them to new projects with one click.</p>
                            <button type="button" onClick={() => setPage("settings")} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                Go to Settings
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
