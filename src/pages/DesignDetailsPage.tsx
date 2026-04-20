import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Icons } from "@/components/icons";
import { getProject, type Project } from "@/api/projects";
import { getApiErrorMessage } from "@/lib/api";

interface DesignDetailsPageProps {
    setPage: (page: string) => void;
}

export default function DesignDetailsPage({ setPage }: DesignDetailsPageProps) {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get("id");
    const projectId = idParam ? Number.parseInt(idParam, 10) : NaN;

    const [project, setProject] = useState<Project | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!Number.isFinite(projectId) || projectId <= 0) {
            setError(t("errors.notFound"));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        getProject(projectId)
            .then((res) => setProject(res.data))
            .catch((e) => setError(getApiErrorMessage(e, t("errors.notFound"))))
            .finally(() => setLoading(false));
    }, [projectId, t]);

    const pref = project?.preferences;

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
                        {t("designDetails.backToResults")}
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {loading ? t("designDetails.loading") : project?.name ?? t("designDetails.projectFallback")}
                        </h1>
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                            94
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {error && <span className="text-red-600">{error}</span>}
                        {!error && project && (
                            <>
                                {project.mode} &bull; {project.status}
                            </>
                        )}
                    </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <button
                        className="inline-flex h-10 align-items-center justify-content-center rounded-2 border border-input bg-light px-3 py-2 fs-6 text-muted fw-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                    >
                        <Icons.layoutTemplate className="mr-2 h-4 w-4" />
                        {t("designDetails.compare")}
                    </button>
                    <button
                        className="inline-flex h-10 align-items-center justify-content-center rounded-2 border border-input bg-light px-3 py-2 fs-6 text-muted fw-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                    >
                        <Icons.fileIcon className="mr-2 h-4 w-4" />
                        {t("designDetails.exportPdf")}
                    </button>
                    <button
                        className="inline-flex h-10 align-items-center justify-content-center rounded-2 bg-primary px-3 py-2 fs-6 text-muted fw-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none"
                    >
                        <Icons.bookmark className="mr-2 h-4 w-4" />
                        {t("designDetails.saveDesign")}
                    </button>
                </div>
            </div>

            <div className="d-grid row-cols-lg-3 gap-5">
                {/* Left Col: Main Preview Image */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-4 overflow-hidden border shadow-sm aspect-[16/9] bg-light relative group">
                        <img
                            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
                            alt={t("designDetails.previewAlt")}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <button className="absolute bottom-4 right-4 rounded-full border bg-background/80 p-2 text-foreground shadow-lg backdrop-blur-sm hover:bg-background">
                            <Icons.settings className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="rounded-4 border bg-white text-card-foreground p-4 shadow-sm">
                        <h2 className="fs-4 fw-semibold mb-4 d-flex align-items-center gap-2">
                            <Icons.brain className="h-5 w-5 text-purple-500" />
                            {t("designDetails.aiExplanation")}
                        </h2>
                        <div className="space-y-4 text-muted leading-relaxed">
                            <p>
                                {pref
                                    ? t("designDetails.prefsLine", {
                                          style: String(pref.style ?? "—"),
                                          usage: String(pref.usage ?? "—"),
                                          budget: String(pref.budget ?? "—"),
                                      })
                                    : t("designDetails.fallbackParagraph")}
                            </p>
                            <p>{t("designDetails.paragraph2")}</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>{t("designDetails.bullet1")}</li>
                                <li>{t("designDetails.bullet2")}</li>
                                <li>{t("designDetails.bullet3")}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Col: Stats & Cost */}
                <div className="space-y-6">
                    {/* Detailed Scores */}
                    <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-6">{t("designDetails.designScores")}</h3>
                        <div className="space-y-5">

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-2"><Icons.layoutTemplate className="h-4 w-4 text-blue-500" /> {t("designDetails.spaceEfficiency")}</span>
                                    <span className="font-bold">96/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-blue-500 rounded-circle" style={{ width: "96%" }}></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-2"><Icons.lightbulb className="h-4 w-4 text-amber-500" /> {t("designDetails.lightingIntegration")}</span>
                                    <span className="font-bold">92/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-amber-500 rounded-circle" style={{ width: "92%" }}></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-2"><Icons.settings className="h-4 w-4 text-pink-500" /> {t("designDetails.comfortFlow")}</span>
                                    <span className="font-bold">95/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-pink-500 rounded-circle" style={{ width: "95%" }}></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-2"><Icons.folder className="h-4 w-4 text-emerald-500" /> {t("designDetails.functionality")}</span>
                                    <span className="font-bold">89/100</span>
                                </div>
                                <div className="h-2 w-100 bg-secondary rounded-circle overflow-hidden">
                                    <div className="h-100 bg-emerald-500 rounded-circle" style={{ width: "89%" }}></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Cost Estimate */}
                    <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm bg-muted/20">
                        <h3 className="font-semibold text-lg mb-4">{t("designDetails.estimatedCost")}</h3>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-4xl font-extrabold tracking-tight">$12,450</span>
                            <span className="text-muted-foreground pb-1">{t("designDetails.usd")}</span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">{t("designDetails.furniture")}</span>
                                <span className="font-medium">$8,200</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">{t("designDetails.demolitionStructural")}</span>
                                <span className="font-medium">$1,500</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-muted-foreground">{t("designDetails.materialsPaintTrim")}</span>
                                <span className="font-medium">$1,250</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{t("designDetails.laborContingency")}</span>
                                <span className="font-medium">$1,500</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                            {t("designDetails.viewBreakdown")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
