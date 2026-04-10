import { Icons } from "@/components/icons";

interface ProjectsPageProps {
    setPage: (page: string) => void;
}

export default function ProjectsPage({ setPage }: ProjectsPageProps) {
    const allProjects = [
        { id: 1, name: "Modern Loft Renovation", date: "2 hours ago", designs: 3, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Suburban Family Home", date: "Yesterday", designs: 5, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Downtown Office Space", date: "Last week", designs: 2, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" },
        { id: 4, name: "Brooklyn Studio Layout", date: "2 weeks ago", designs: 4, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" },
        { id: 5, name: "Mountain Cabin", date: "1 month ago", designs: 3, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400" },
        { id: 6, name: "Airbnb Beach House", date: "2 months ago", designs: 6, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=400" },
    ];

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

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Icons.fileIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search projects..."
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                        <Icons.layoutTemplate className="mr-2 h-4 w-4" />
                        Style Filter
                    </button>
                    <button className="flex-1 sm:flex-none inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                        Sort: Newest
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allProjects.map((project) => (
                    <div key={project.id} className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300">
                        <div
                            className="h-48 w-full bg-muted bg-cover bg-center cursor-pointer relative"
                            style={{ backgroundImage: `url(${project.img})` }}
                            onClick={() => setPage("ai-designs")}
                        >
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-background/90 text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-xl">
                                    View Designs
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setPage("ai-designs")}>
                                {project.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-4">Last edited {project.date}</p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Icons.settings className="mr-1.5 h-4 w-4 text-primary" />
                                    <span className="font-medium">{project.designs} designs</span>
                                </div>
                                <button className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                                    <Icons.fileIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
