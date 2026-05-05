import { Icons } from "@/components/icons";
import { ArrowUpRight, FolderOpen, Image as ImageIcon, MoveRight, MoreHorizontal, Copy, Trash2, ArrowUpCircle, CheckCircle2, Clock } from "lucide-react";

interface DashboardPageProps {
    setPage: (page: string) => void;
}

export default function DashboardPage({ setPage }: DashboardPageProps) {
    const recentProjects = [
        { id: 1, name: "Modern Loft Renovation", date: "2 hours ago", status: "Processing", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400", views: 0 },
        { id: 2, name: "Suburban Family Home", date: "Yesterday", status: "Completed", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400", views: 4 },
        { id: 3, name: "Downtown Office Space", date: "Last week", status: "Completed", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400", views: 12 },
    ];

    const recentActivity = [
        { id: 1, action: "Generated 3 layout variations", target: "Modern Loft Renovation", time: "2 hours ago" },
        { id: 2, action: "Created new project", target: "Modern Loft Renovation", time: "2.5 hours ago" },
        { id: 3, action: "Exported PDF report", target: "Suburban Family Home", time: "Yesterday" },
        { id: 4, action: "Updated style preferences", target: "Account Settings", time: "2 days ago" },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto bg-slate-50/50 dark:bg-background h-full min-h-screen">

            {/* 2. Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, Alex.</h1>
                    <p className="text-muted-foreground mt-1">Here is the status of your AI designs and latest activity.</p>
                </div>
                <button
                    onClick={() => setPage("create-project")}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:scale-105 focus-visible:outline-none"
                >
                    <Icons.plus className="mr-2 h-4 w-4" />
                    Create New Project
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 3. Quick Action Buttons */}
                    <section>
                        <h2 className="text-lg font-semibold tracking-tight mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <button onClick={() => setPage("create-project")} className="flex flex-col items-center justify-center p-4 h-28 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Icons.plus className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium">New Project</span>
                            </button>
                            <button onClick={() => setPage("create-project")} className="flex flex-col items-center justify-center p-4 h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 group">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <FolderOpen className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium">Upload Blueprint</span>
                            </button>
                            <button onClick={() => setPage("create-project")} className="flex flex-col items-center justify-center p-4 h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 group">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium">Upload Photos</span>
                            </button>
                            <button onClick={() => setPage("ai-designs")} className="flex flex-col items-center justify-center p-4 h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 group">
                                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Icons.lightbulb className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium">Inspiration Mode</span>
                            </button>
                        </div>
                    </section>

                    {/* 5. Usage Statistics */}
                    <section>
                        <h2 className="text-lg font-semibold tracking-tight mb-4">Overview Analytics</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="flex items-center justify-between text-muted-foreground mb-3">
                                    <Icons.folder className="h-4 w-4" />
                                    <span className="text-xs font-medium text-emerald-500 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> 12%</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Total Projects</h3>
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="flex items-center justify-between text-muted-foreground mb-3">
                                    <Icons.layoutTemplate className="h-4 w-4" />
                                    <span className="text-xs font-medium text-emerald-500 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> 34%</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">48</div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Designs Generated</h3>
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="flex items-center justify-between text-muted-foreground mb-3">
                                    <Icons.brain className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-medium text-muted-foreground">This Month</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">14<span className="text-sm font-normal text-muted-foreground">/50</span></div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Generations Used</h3>
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                                <div className="flex items-center justify-between text-muted-foreground mb-3">
                                    <Icons.bookmark className="h-4 w-4" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">8</div>
                                <h3 className="text-xs font-medium text-muted-foreground mt-1">Saved Layouts</h3>
                            </div>
                        </div>
                    </section>

                    {/* 4. Recent Projects Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold tracking-tight">Recent Projects</h2>
                            <button
                                onClick={() => setPage("projects")}
                                className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium hover:underline flex items-center"
                            >
                                View all <MoveRight className="ml-1 w-3 h-3" />
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {recentProjects.map((project) => (
                                <div key={project.id} className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden hover:shadow-md transition-all">
                                    <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <img src={project.img} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-2 left-2">
                                            {project.status === "Processing" ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-amber-100/90 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 text-[10px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                                                    <Icons.spinner className="w-3 h-3 mr-1 animate-spin" /> Processing AI
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-white/90 text-slate-800 dark:bg-black/90 dark:text-slate-300 text-[10px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                                                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Ready
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => setPage("design-details")}>
                                                {project.name}
                                            </h3>
                                            {/* Context Menu Placeholder */}
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 -mr-2">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center mb-4">
                                            <Clock className="w-3 h-3 mr-1" /> {project.date}
                                        </div>

                                        <div className="mt-auto flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                            <button onClick={() => setPage("design-details")} className="flex-1 inline-flex justify-center items-center h-8 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                                Open
                                            </button>
                                            <button className="inline-flex justify-center items-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Duplicate">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="inline-flex justify-center items-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/50 transition-colors" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column (Sidebar Information) */}
                <div className="space-y-8">

                    {/* 6. Subscription / Plan Status */}
                    <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 p-6 shadow-indigo-100/50 dark:shadow-none shadow-sm relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Icons.brain className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">Current Plan</h2>
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Designer Pro</div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 relative z-10">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">AI Generations</span>
                                    <span className="text-muted-foreground">14 / 50</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                                </div>
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-2 mt-4">
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-indigo-500 mr-2" /> High-res PDF Exports</li>
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-indigo-500 mr-2" /> Cost Estimation Engine</li>
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-indigo-500 mr-2" /> Priority processing</li>
                            </ul>
                        </div>

                        <button className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors relative z-10 flex justify-center items-center">
                            Upgrade to Business <ArrowUpCircle className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                        </button>
                    </section>

                    {/* 7 & 8. Activity Timeline & Notifications */}
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-semibold tracking-tight">Recent Activity</h2>
                        </div>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="relative flex items-start gap-4">
                                    <div className="absolute left-0 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 z-10">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                                    </div>
                                    <div className="pl-8">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground "><span className="font-medium text-slate-900 dark:text-slate-100">{activity.target}</span> • {activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 9. Recommended Features Tip */}
                    <section className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-5 p-6 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/60 rounded-full shrink-0 text-blue-600 dark:text-blue-400">
                            <Icons.lightbulb className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Save styles for later</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">You can create custom preset styles in your settings to apply them to new projects with one click.</p>
                            <button onClick={() => setPage("settings")} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                Go to Settings
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
