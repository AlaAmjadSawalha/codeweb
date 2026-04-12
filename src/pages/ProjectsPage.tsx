import { Icons } from "@/components/icons";
import { useDemoDashboard } from "@/context/DemoDashboardContext";
import { formatRelativeTime } from "@/lib/utils";
import { useMemo, useState } from "react";

interface ProjectsPageProps {
    setPage: (page: string) => void;
}

type SortOption = "newest" | "oldest" | "name";

export default function ProjectsPage({ setPage }: ProjectsPageProps) {
    const { state, duplicateProject, deleteProject } = useDemoDashboard();
    const [query, setQuery] = useState("");
    const [styleFilter, setStyleFilter] = useState<string>("all");
    const [sort, setSort] = useState<SortOption>("newest");

    const styleOptions = useMemo(() => {
        const set = new Set<string>();
        state.projects.forEach((p) => {
            if (p.preferences.designStyle) set.add(p.preferences.designStyle);
        });
        return Array.from(set).sort();
    }, [state.projects]);

    const filtered = useMemo(() => {
        let list = [...state.projects];

        const q = query.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.preferences.designStyle.toLowerCase().includes(q) ||
                    p.preferences.roomUsage.toLowerCase().includes(q)
            );
        }

        if (styleFilter !== "all") {
            list = list.filter((p) => p.preferences.designStyle === styleFilter);
        }

        list.sort((a, b) => {
            if (sort === "name") {
                return a.name.localeCompare(b.name);
            }
            const ta = new Date(a.createdAt).getTime();
            const tb = new Date(b.createdAt).getTime();
            return sort === "newest" ? tb - ta : ta - tb;
        });

        return list;
    }, [state.projects, query, styleFilter, sort]);

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Delete “${name}”? This cannot be undone in demo mode.`)) {
            deleteProject(id);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage and organize your AI layout designs.</p>
                </div>
                <button
                    onClick={() => setPage("create-project")}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none"
                >
                    <Icons.plus className="mr-2 h-4 w-4" />
                    New Project
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Icons.fileIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search by name, style, or usage..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <select
                        value={styleFilter}
                        onChange={(e) => setStyleFilter(e.target.value)}
                        className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                        aria-label="Filter by design style"
                    >
                        <option value="all">All styles</option>
                        {styleOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                        aria-label="Sort projects"
                    >
                        <option value="newest">Sort: Newest</option>
                        <option value="oldest">Sort: Oldest</option>
                        <option value="name">Sort: Name (A–Z)</option>
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                    <p className="text-muted-foreground">No projects match your search or filters.</p>
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setStyleFilter("all");
                        }}
                        className="mt-4 text-sm font-medium text-primary hover:underline"
                    >
                        Clear search &amp; filter
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((project) => (
                        <div
                            key={project.id}
                            className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div
                                className="h-48 w-full bg-muted bg-cover bg-center cursor-pointer relative"
                                style={{ backgroundImage: `url(${project.coverImageUrl})` }}
                                onClick={() => setPage("ai-designs")}
                            >
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="bg-background/90 text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-xl">
                                        View Designs
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3
                                    className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                                    onClick={() => setPage("ai-designs")}
                                >
                                    {project.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mb-1">
                                    Last edited {formatRelativeTime(project.createdAt)}
                                </p>
                                <p className="text-xs text-muted-foreground mb-4 line-clamp-1">
                                    {project.preferences.designStyle || "Style"} · {project.preferences.roomUsage || "Usage"}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t gap-2">
                                    <div className="flex items-center text-sm text-muted-foreground min-w-0">
                                        <Icons.settings className="mr-1.5 h-4 w-4 text-primary shrink-0" />
                                        <span className="font-medium truncate">{project.designsCount} designs</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            title="Duplicate"
                                            onClick={() => duplicateProject(project.id)}
                                            className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <Icons.copy className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete"
                                            onClick={() => handleDelete(project.id, project.name)}
                                            className="h-8 w-8 rounded-full hover:bg-destructive/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-destructive"
                                        >
                                            <Icons.trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
