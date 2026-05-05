import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    ArrowRight,
    Home,
    Heart,
    Edit2,
    Maximize2,
    Download,
    Info,
    LayoutDashboard,
    X,
    GitCompare,
    RefreshCw,
    Loader2,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { listDesigns, generateDesigns, selectDesign, type Design } from "@/api/designs";
import { useNavigate } from "react-router-dom";

interface AIGeneratedDesignsPageProps {
    setPage: (page: string) => void;
}

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18efc2291?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

/* ─── unchanged logic helpers ─────────────────────────────────────────────── */

const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-violet-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-400";
};

const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-emerald-400 to-emerald-600";
    if (score >= 80) return "from-violet-400 to-violet-600";
    if (score >= 70) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
};

const getScoreLabel = (score: number) => {
    if (score >= 90) return { text: "Excellent", cls: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" };
    if (score >= 80) return { text: "Great",     cls: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30" };
    if (score >= 70) return { text: "Good",      cls: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" };
    return                  { text: "Fair",      cls: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30" };
};

/* ─── Skeleton card ───────────────────────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm animate-pulse">
            <div className="h-56 bg-muted" />
            <div className="p-6 space-y-4">
                <div className="h-5 bg-muted rounded-full w-2/3" />
                <div className="h-3 bg-muted/60 rounded-full w-full" />
                <div className="h-3 bg-muted/60 rounded-full w-4/5" />
                <div className="space-y-2 pt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-3 bg-muted/60 rounded-full flex-1" />
                            <div className="h-1.5 bg-muted rounded-full w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function AIGeneratedDesignsPage({ setPage }: AIGeneratedDesignsPageProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectIdParam = searchParams.get("project");
    const projectId = projectIdParam ? Number.parseInt(projectIdParam, 10) : NaN;

    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
    const [savingId, setSavingId] = useState<number | null>(null);

    /* ── unchanged logic ── */
    const loadDesigns = async (generate = false) => {
        if (!Number.isFinite(projectId) || projectId <= 0) {
            navigate("/projects", { replace: true });
            return;
        }
        setLoading(true);
        setError("");
        try {
            if (generate) {
                const res = await generateDesigns(projectId);
                setDesigns(res.data.data);
            } else {
                const res = await listDesigns(projectId);
                const fetched = res.data.data;
                if (fetched.length === 0) {
                    const gen = await generateDesigns(projectId);
                    setDesigns(gen.data.data);
                } else {
                    setDesigns(fetched);
                }
            }
        } catch {
            setError(t("errors.serverError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDesigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id].slice(-2)
        );
    };

    const toggleSave = async (design: Design, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!Number.isFinite(projectId)) return;
        setSavingId(design.id);
        try {
            await selectDesign(projectId, design.id);
            setSavedIds(prev => {
                const next = new Set(prev);
                if (next.has(design.id)) next.delete(design.id);
                else next.add(design.id);
                return next;
            });
        } catch { /* ignore */ }
        finally { setSavingId(null); }
    };

    const handleCompare = () => {
        if (selectedIds.length < 2) return;
        setPage(`/compare-designs?project=${projectId}&a=${selectedIds[0]}&b=${selectedIds[1]}`);
    };

    const handleProceed = () => {
        const id = selectedIds[selectedIds.length - 1];
        if (!id) return;
        setPage(`/design-details?project=${projectId}&design=${id}`);
    };

    const getImageUrl = (design: Design, idx: number) =>
        design.image_url ?? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

    const metrics = (design: Design) => [
        { label: t("aiDesigns.metricSpaceUtil"),  score: design.score_space },
        { label: t("aiDesigns.metricLighting"),   score: design.score_lighting },
        { label: t("aiDesigns.metricMovement"),   score: design.score_circulation },
        { label: t("aiDesigns.metricBudget"),     score: design.score_budget },
        { label: t("aiDesigns.metricFunctional"), score: design.score_functional },
    ];

    const selectionHint =
        selectedIds.length === 0 ? "Click a card to select, or pick 2 to compare side-by-side"
        : selectedIds.length === 1 ? "Select one more design to unlock Compare"
        : "2 selected — ready to compare or view details";

    /* ────────────────────────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-background font-sans overflow-x-hidden">

            {/* ── Lightbox ─────────────────────────────────────────────────── */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={() => setExpandedImage(null)}
                >
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-5 right-5 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <img
                        src={expandedImage}
                        alt={t("aiDesigns.expandedLayoutAlt")}
                        className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}

            {/* ── Hero / Page header ───────────────────────────────────────── */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-7">
                    {/* Breadcrumb */}
                    <button
                        onClick={() => setPage("dashboard")}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-5"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                        <span className="text-border">/</span>
                        <span className="text-muted-foreground">Design Results</span>
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                        <div>
                            {/* AI badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI-Generated Results
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                                {t("aiDesigns.title")}
                            </h1>
                            <p className="mt-1.5 text-muted-foreground text-sm max-w-xl">
                                {t("aiDesigns.subtitle")}
                            </p>
                        </div>

                        {/* Context chips */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-muted-foreground text-xs font-medium">
                                <Home className="w-3.5 h-3.5" />
                                {t("aiDesigns.contextRoom")}
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                                {t("aiDesigns.contextStyle")}
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                                {t("aiDesigns.contextBudget")}
                            </div>
                            {!loading && designs.length > 0 && (
                                <div className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold">
                                    {designs.length} layouts
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content area ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-40">

                {/* Loading skeleton */}
                {loading && (
                    <div>
                        <div className="flex items-center gap-2.5 mb-6 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                            <span className="text-sm font-medium">{t("aiDesigns.generating")}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SkeletonCard /><SkeletonCard /><SkeletonCard />
                        </div>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Something went wrong</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">{error}</p>
                        <button
                            onClick={() => loadDesigns()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {t("aiDesigns.retry")}
                        </button>
                    </div>
                )}

                {/* Design cards grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.map((design, idx) => {
                            const isSelected = selectedIds.includes(design.id);
                            const isSaved    = savedIds.has(design.id);
                            const imageUrl   = getImageUrl(design, idx);
                            const scoreLabel = getScoreLabel(design.overall_score);
                            const selOrder   = selectedIds.indexOf(design.id); // 0 or 1

                            return (
                                <div
                                    key={design.id}
                                    onClick={() => toggleSelect(design.id)}
                                    className={[
                                        "group relative flex flex-col bg-card rounded-2xl overflow-hidden cursor-pointer",
                                        "transition-all duration-300 ease-out",
                                        isSelected
                                            ? "ring-2 ring-violet-600 shadow-xl shadow-violet-100 dark:shadow-violet-900/30 -translate-y-1"
                                            : "border border-border shadow-sm hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-700 hover:-translate-y-0.5",
                                    ].join(" ")}
                                >
                                    {/* ── Image ── */}
                                    <div className="relative h-52 bg-muted overflow-hidden shrink-0">
                                        <img
                                            src={imageUrl}
                                            alt={design.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        {/* Persistent bottom gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                        {/* Top-right actions (appear on hover) */}
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={e => { e.stopPropagation(); setExpandedImage(imageUrl); }}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
                                                title={t("aiDesigns.expandImage")}
                                            >
                                                <Maximize2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={e => toggleSave(design, e)}
                                                disabled={savingId === design.id}
                                                className={[
                                                    "h-8 w-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors",
                                                    isSaved
                                                        ? "bg-rose-500 text-white"
                                                        : "bg-black/40 text-white hover:bg-black/60",
                                                ].join(" ")}
                                                title={t("aiDesigns.saveFavorites")}
                                            >
                                                {savingId === design.id
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                                                }
                                            </button>
                                        </div>

                                        {/* Selection badge */}
                                        {isSelected && (
                                            <div className="absolute top-3 left-3 h-7 w-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold shadow-lg">
                                                {selOrder + 1}
                                            </div>
                                        )}

                                        {/* Bottom: overall score */}
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10">
                                                <div className={`w-2 h-2 rounded-full ${getScoreColor(design.overall_score)}`} />
                                                <span className="text-white text-xs font-bold">{design.overall_score}</span>
                                                <span className="text-white/60 text-xs">/100</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${scoreLabel.cls}`}>
                                                {scoreLabel.text}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Body ── */}
                                    <div className="flex flex-col flex-1 p-5">
                                        {/* Title + description */}
                                        <div className="mb-4">
                                            <h3 className="text-base font-bold text-foreground leading-snug mb-1.5">
                                                {design.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {design.description}
                                            </p>
                                        </div>

                                        {/* Score bars */}
                                        <div className="mb-5 space-y-2.5">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                    {t("aiDesigns.evaluationMetrics")}
                                                    <div className="group/tip relative">
                                                        <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                                                            {t("aiDesigns.metricsTooltip")}
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                            {metrics(design).map(({ label, score }) => (
                                                <div key={label}>
                                                    <div className="flex justify-between items-center text-xs mb-1">
                                                        <span className="text-muted-foreground font-medium">{label}</span>
                                                        <span className="text-foreground font-bold tabular-nums">{score}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-1000 ease-out`}
                                                            style={{ width: `${score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Card actions */}
                                        <div className="mt-auto pt-4 border-t border-border flex gap-2">
                                            <button
                                                onClick={e => { e.stopPropagation(); toggleSelect(design.id); }}
                                                className={[
                                                    "flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all",
                                                    isSelected
                                                        ? "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                                                        : "bg-foreground text-background hover:opacity-90",
                                                ].join(" ")}
                                            >
                                                {isSelected
                                                    ? <><CheckCircle2 className="w-4 h-4" /> {t("aiDesigns.selectedLayout")}</>
                                                    : t("aiDesigns.selectThisDesign")
                                                }
                                            </button>
                                            <button
                                                onClick={e => { e.stopPropagation(); setPage("create-project"); }}
                                                className="h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-colors shrink-0"
                                                title={t("aiDesigns.editConstraints")}
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={e => { e.stopPropagation(); }}
                                                className="h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-colors shrink-0"
                                                title={t("aiDesigns.exportShare")}
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Fixed bottom action bar ──────────────────────────────────── */}
            <div className="fixed bottom-0 inset-x-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border shadow-[0_-4px_32px_-4px_rgba(0,0,0,0.08)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    {/* Selection progress indicator */}
                    {!loading && designs.length > 0 && (
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                {[0, 1].map(i => (
                                    <div
                                        key={i}
                                        className={[
                                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                                            selectedIds[i]
                                                ? "bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30"
                                                : "border-2 border-dashed border-border text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        {selectedIds[i] ? i + 1 : ""}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">{selectionHint}</span>
                        </div>
                    )}

                    {/* Actions row */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Left: secondary actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage("dashboard")}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted border border-border transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">{t("aiDesigns.backToDashboard")}</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                            <button
                                onClick={() => loadDesigns(true)}
                                disabled={loading}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                <span className="hidden sm:inline">{t("aiDesigns.regenerate")}</span>
                            </button>
                        </div>

                        {/* Right: primary CTA buttons */}
                        <div className="flex items-center gap-2.5">
                            {/* Compare */}
                            <button
                                onClick={handleCompare}
                                disabled={selectedIds.length < 2}
                                className={[
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                                    selectedIds.length === 2
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:bg-indigo-700 hover:-translate-y-0.5"
                                        : "bg-muted text-muted-foreground cursor-not-allowed",
                                ].join(" ")}
                            >
                                <GitCompare className="w-4 h-4" />
                                {t("aiDesigns.compare")}
                                {selectedIds.length === 2 && (
                                    <span className="h-4 w-4 flex items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">2</span>
                                )}
                            </button>

                            {/* Proceed */}
                            <button
                                onClick={handleProceed}
                                disabled={selectedIds.length === 0}
                                className={[
                                    "inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                                    selectedIds.length > 0
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30 hover:bg-violet-700 hover:-translate-y-0.5"
                                        : "bg-muted text-muted-foreground cursor-not-allowed",
                                ].join(" ")}
                            >
                                {t("aiDesigns.proceedSelected")}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
