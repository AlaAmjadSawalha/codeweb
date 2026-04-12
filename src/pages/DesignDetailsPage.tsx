import { Icons } from "@/components/icons";

interface DesignDetailsPageProps {
    setPage: (page: string) => void;
}

export default function DesignDetailsPage({ setPage }: DesignDetailsPageProps) {
    return (
        <div className="p-5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            {/* Top Header & Actions */}
            <div className="d-flex flex-column sm:flex-row justify-content-between align-items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <button
                        onClick={() => setPage("ai-designs")}
                        className="inline-flex align-items-center fs-6 text-muted fw-medium text-muted hover:text-foreground mb-4"
                    >
                        <Icons.arrowRight className="mr-2 h-4 w-4 rotate-180" />
                        Back to Results
                    </button>
                    <div className="d-flex align-items-center gap-3">
                        <h1 className="fs-2 fw-bold tracking-tight">Open Concept Minimalist</h1>
                        <div className="inline-flex align-items-center justify-content-center h-8 w-8 rounded-circle bg-green-100 text-green-700 fw-bold fs-6 text-muted">
                            94
                        </div>
                    </div>
                    <p className="text-muted mt-1">Version 1.0 &bull; Generated today</p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <button
                        className="inline-flex h-10 align-items-center justify-content-center rounded-2 border border-input bg-light px-3 py-2 fs-6 text-muted fw-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                    >
                        <Icons.layoutTemplate className="mr-2 h-4 w-4" />
                        Compare
                    </button>
                    <button
                        className="inline-flex h-10 align-items-center justify-content-center rounded-2 border border-input bg-light px-3 py-2 fs-6 text-muted fw-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                    >
                        <Icons.fileIcon className="mr-2 h-4 w-4" />
                        Export PDF
                    </button>
                    <button
                        className="inline-flex h-10 align-items-center justify-content-center rounded-2 bg-primary px-3 py-2 fs-6 text-muted fw-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
                    >
                        <Icons.bookmark className="mr-2 h-4 w-4" />
                        Save Design
                    </button>
                </div>
            </div>

            <div className="d-grid row-cols-lg-3 gap-5">
                {/* Left Col: Main Preview Image */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-4 overflow-hidden border shadow-sm aspect-[16/9] bg-light relative group">
                        <img
                            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
                            alt="Design Preview"
                            className="absolute inset-0 h-100 w-100 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <button className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background p-2 rounded-circle shadow-lg border">
                            <Icons.settings className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="rounded-4 border bg-white text-card-foreground p-4 shadow-sm">
                        <h2 className="fs-4 fw-semibold mb-4 d-flex align-items-center gap-2">
                            <Icons.brain className="h-5 w-5 text-purple-500" />
                            AI Explanation
                        </h2>
                        <div className="space-y-4 text-muted leading-relaxed">
                            <p>
                                Based on your preference for a Modern styling and a Medium budget, the AI has generated an open concept design. We removed the non-load-bearing partition wall between the original kitchen and living space to maximize natural light flow from the south-facing windows.
                            </p>
                            <p>
                                The color palette utilizes cool neutral tones with slate and earthy accents to create a calm, cohesive environment. Furniture placement prioritizes conversational seating while maintaining clear walkways.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Load-bearing structures were preserved completely.</li>
                                <li>HVAC vents repositioned for optimal flow without ceiling drops.</li>
                                <li>Strategic placement of area rugs defines spatial zones.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Col: Stats & Cost */}
                <div className="space-y-6">
                    {/* Detailed Scores */}
                    <div className="rounded-4 border bg-white text-card-foreground p-4 shadow-sm">
                        <h3 className="fw-semibold fs-5 mb-6">Design Scores</h3>
                        <div className="space-y-5">

                            <div className="space-y-2">
                                <div className="d-flex justify-content-between align-items-center fs-6 text-muted">
                                    <span className="fw-medium d-flex align-items-center gap-2"><Icons.layoutTemplate className="h-4 w-4 text-blue-500" /> Space Efficiency</span>
                                    <span className="fw-bold">96/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-blue-500 rounded-circle" style={{ width: "96%" }}></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="d-flex justify-content-between align-items-center fs-6 text-muted">
                                    <span className="fw-medium d-flex align-items-center gap-2"><Icons.lightbulb className="h-4 w-4 text-amber-500" /> Lighting Integration</span>
                                    <span className="fw-bold">92/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-amber-500 rounded-circle" style={{ width: "92%" }}></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="d-flex justify-content-between align-items-center fs-6 text-muted">
                                    <span className="fw-medium d-flex align-items-center gap-2"><Icons.settings className="h-4 w-4 text-pink-500" /> Comfort & Flow</span>
                                    <span className="fw-bold">95/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-pink-500 rounded-circle" style={{ width: "95%" }}></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="d-flex justify-content-between align-items-center fs-6 text-muted">
                                    <span className="fw-medium d-flex align-items-center gap-2"><Icons.folder className="h-4 w-4 text-emerald-500" /> Functionality</span>
                                    <span className="fw-bold">89/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-emerald-500 rounded-circle" style={{ width: "89%" }}></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Cost Estimate */}
                    <div className="rounded-4 border bg-white text-card-foreground p-4 shadow-sm bg-muted/20">
                        <h3 className="fw-semibold fs-5 mb-4">Estimated Cost</h3>
                        <div className="d-flex align-items-end gap-2 mb-6">
                            <span className="fs-1 font-extrabold tracking-tight">$12,450</span>
                            <span className="text-muted pb-1">USD</span>
                        </div>

                        <div className="space-y-3 fs-6 text-muted">
                            <div className="d-flex justify-content-between align-items-center border-b pb-2">
                                <span className="text-muted">Furniture</span>
                                <span className="fw-medium">$8,200</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-b pb-2">
                                <span className="text-muted">Demolition & Structural</span>
                                <span className="fw-medium">$1,500</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-b pb-2">
                                <span className="text-muted">Materials (Paint, Trim)</span>
                                <span className="fw-medium">$1,250</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">Labor & Contingency</span>
                                <span className="fw-medium">$1,500</span>
                            </div>
                        </div>

                        <button className="w-100 mt-6 inline-flex h-9 align-items-center justify-content-center rounded-2 border border-input bg-light fs-6 text-muted fw-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                            View Itemized Breakdown
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
