import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "@/components/icons";
import { deleteProject, duplicateProject, listProjects, type Project } from "@/api/projects";
import { getApiErrorMessage } from "@/lib/api";
import { AlertCircle, Calendar, CheckCircle2, Copy, Trash2, ChevronDown } from "lucide-react";

interface ProjectsPageProps {
    setPage: (page: string) => void;
}

const placeholderImgs = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
];

function formatWhen(iso: string): string {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

export default function ProjectsPage({ setPage }: ProjectsPageProps) {
    const { t } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await listProjects({
                search: search.trim() || undefined,
                status: statusFilter.trim() || undefined,
            });
            setProjects(res.data ?? []);
        } catch (e) {
            setError(getApiErrorMessage(e, t("errors.projectsLoad")));
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, t]);

    useEffect(() => {
        const t = window.setTimeout(() => {
            void load();
        }, 300);
        return () => window.clearTimeout(t);
    }, [load]);

    const cycleStatus = () => {
        setStatusFilter((prev) => (prev === "" ? "active" : prev === "active" ? "draft" : ""));
    };

    const handleDup = async (id: number) => {
        try {
            await duplicateProject(id);
            await load();
        } catch (e) {
            window.alert(getApiErrorMessage(e, t("errors.duplicate")));
        }
    };

    const handleDel = async (id: number) => {
        if (!window.confirm(t("projects.deleteConfirm"))) return;
        try {
            await deleteProject(id);
            await load();
        } catch (e) {
            window.alert(getApiErrorMessage(e, t("errors.delete")));
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto min-h-screen">

            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("projects.title")}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{t("projects.subtitle")}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setPage("create-project")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-md shadow-violet-500/20 cursor-pointer"
                >
                    <Icons.plus className="h-4 w-4" />
                    {t("projects.newProject")}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1 sm:max-w-sm">
                    <Icons.search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="search"
                        placeholder={t("projects.searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all duration-200"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={cycleStatus}
                        className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            statusFilter
                                ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                                : "border-border bg-card hover:bg-muted text-foreground"
                        }`}
                    >
                        <Icons.layoutTemplate className="h-4 w-4" />
                        {statusFilter === "" ? t("projects.statusAll") : t("projects.status", { status: statusFilter })}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted text-sm font-medium text-foreground transition-colors"
                    >
                        {t("projects.sortNewest")}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    {t("projects.loading")}
                </div>
            )}

            {/* Projects grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {!loading && projects.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                            <Icons.folder className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{t("projects.noMatches")}</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            {search || statusFilter ? "Try adjusting your search or filters." : "Create your first project to get started."}
                        </p>
                        <button
                            type="button"
                            onClick={() => setPage("create-project")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline underline-offset-4"
                        >
                            <Icons.plus className="h-3.5 w-3.5" />
                            {t("projects.newProject")}
                        </button>
                    </div>
                )}

                {projects.map((project, idx) => (
                    <div
                        key={project.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300"
                    >
                        {/* Project image */}
                        <div
                            className="relative h-44 w-full cursor-pointer overflow-hidden bg-muted"
                            onClick={() => setPage(`/ai-designs?project=${project.id}`)}
                        >
                            <img
                                src={placeholderImgs[idx % placeholderImgs.length]}
                                alt={project.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/15 transition-colors duration-300 flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-black/80 text-foreground px-4 py-2 rounded-full font-semibold text-xs shadow-lg backdrop-blur-sm">
                                    {t("projects.viewDesigns")}
                                </span>
                            </div>
                            {/* Status badge */}
                            <div className="absolute top-2.5 left-2.5">
                                {project.status === "active" ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 dark:bg-black/80 text-[10px] font-bold uppercase text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-sm">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100/95 dark:bg-amber-900/90 text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 shadow-sm backdrop-blur-sm">
                                        <Icons.spinner className="h-3 w-3 animate-spin" /> {project.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Card body */}
                        <div className="p-4 flex-1 flex flex-col">
                            <h3
                                className="font-semibold text-sm leading-snug line-clamp-1 mb-1 cursor-pointer group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                                onClick={() => setPage(`/ai-designs?project=${project.id}`)}
                            >
                                {project.name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                                <Calendar className="h-3 w-3 shrink-0" />
                                {t("projects.updated", { date: formatWhen(project.updated_at) })}
                            </p>

                            {/* Footer row */}
                            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Icons.settings className="h-3.5 w-3.5 text-violet-500" />
                                    <span className="font-medium capitalize">{project.mode}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); void handleDup(project.id); }}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        title={t("projects.duplicateTitle")}
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); void handleDel(project.id); }}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors"
                                        title={t("projects.deleteProject")}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
