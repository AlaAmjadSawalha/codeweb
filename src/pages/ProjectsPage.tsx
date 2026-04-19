import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "@/components/icons";
import { deleteProject, duplicateProject, listProjects, type Project } from "@/api/projects";
import { getApiErrorMessage } from "@/lib/api";

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
        <div className="p-5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <div className="d-flex flex-column sm:flex-row justify-content-between align-items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("projects.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("projects.subtitle")}</p>
                </div>
                <button
                    onClick={() => setPage("create-project")}
                    className="inline-flex h-10 align-items-center justify-content-center rounded-2 bg-blue-600 px-3 py-2 fs-6 text-muted fw-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none"
                >
                    <Icons.plus className="mr-2 h-4 w-4" />
                    {t("projects.newProject")}
                </button>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Icons.fileIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder={t("projects.searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={cycleStatus}
                        className="flex-1 sm:flex-none inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <Icons.layoutTemplate className="mr-2 h-4 w-4" />
                        {statusFilter === "" ? t("projects.statusAll") : t("projects.status", { status: statusFilter })}
                    </button>
                    <button className="flex-1 sm:flex-none inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                        {t("projects.sortNewest")}
                    </button>
                </div>
            </div>

            {loading && <p className="text-sm text-muted-foreground">{t("projects.loading")}</p>}

            {/* Projects Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {!loading && projects.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-full">{t("projects.noMatches")}</p>
                )}
                {projects.map((project, idx) => (
                    <div
                        key={project.id}
                        className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div
                            className="h-48 w-full bg-muted bg-cover bg-center cursor-pointer relative"
                            style={{ backgroundImage: `url(${placeholderImgs[idx % placeholderImgs.length]})` }}
                            onClick={() => setPage(`/design-details?id=${project.id}`)}
                        >
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-background/90 text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-xl">
                                    {t("projects.viewDesigns")}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                                onClick={() => setPage(`/design-details?id=${project.id}`)}
                            >
                                {project.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-4">{t("projects.updated", { date: formatWhen(project.updated_at) })}</p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Icons.settings className="mr-1.5 h-4 w-4 text-primary" />
                                    <span className="font-medium capitalize">{project.mode}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        void handleDup(project.id);
                                    }}
                                    className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                                    title={t("projects.duplicateTitle")}
                                >
                                    <Icons.fileIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => void handleDel(project.id)}
                                className="mt-2 text-xs text-red-600 hover:underline text-left"
                            >
                                {t("projects.deleteProject")}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
