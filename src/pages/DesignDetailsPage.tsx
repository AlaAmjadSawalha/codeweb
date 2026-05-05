import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Icons } from "@/components/icons";
import { getDesign, selectDesign, type Design } from "@/api/designs";
import {
    Loader2,
    ArrowLeft,
    LayoutTemplate,
    FileText,
    Bookmark,
    BookmarkCheck,
    Sparkles,
    AlertCircle,
    DollarSign,
    Sofa,
    Hammer,
    Paintbrush,
    HardHat,
    ChevronRight,
    Maximize2,
} from "lucide-react";

interface DesignDetailsPageProps {
    setPage: (page: string) => void;
}

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200";

/* ── score gradient helpers ──────────────────────────────────────────────── */
const scoreGradient = (v: number) =>
    v >= 90 ? "from-emerald-400 to-emerald-600"
    : v >= 80 ? "from-violet-400 to-violet-600"
    : v >= 70 ? "from-amber-400 to-amber-600"
    : "from-red-400 to-red-500";

const scoreBg = (v: number) =>
    v >= 90 ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
    : v >= 80 ? "bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900/40"
    : v >= 70 ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40"
    : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40";

const scoreLabel = (v: number) =>
    v >= 90 ? "Excellent" : v >= 80 ? "Great" : v >= 70 ? "Good" : "Fair";

/* ── Skeleton ────────────────────────────────────────────────────────────── */
function Skeleton() {
    return (
        <div className="min-h-screen bg-background animate-pulse">
            <div className="bg-card border-b border-border px-6 py-8">
                <div className="max-w-6xl mx-auto space-y-4">
                    <div className="h-3 w-32 bg-muted rounded-full" />
                    <div className="h-7 w-64 bg-muted rounded-full" />
                    <div className="h-4 w-96 bg-muted/60 rounded-full" />
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl bg-muted aspect-[16/9]" />
                    <div className="rounded-2xl bg-card border border-border p-6 space-y-3">
                        <div className="h-5 w-40 bg-muted rounded-full" />
                        {[1,2,3,4].map(i => <div key={i} className="h-3 bg-muted/60 rounded-full" />)}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                        <div className="h-5 w-32 bg-muted rounded-full" />
                        {[1,2,3,4].map(i => <div key={i} className="h-8 bg-muted/60 rounded-lg" />)}
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                        <div className="h-10 w-40 bg-muted rounded-full" />
                        {[1,2,3,4].map(i => <div key={i} className="h-6 bg-muted/60 rounded-lg" />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function DesignDetailsPage({ setPage }: DesignDetailsPageProps) {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const projectId = Number.parseInt(searchParams.get("project") ?? "", 10);
    const designId  = Number.parseInt(searchParams.get("design")  ?? "", 10);

    const [design, setDesign] = useState<Design | null>(null);
    const [error,  setError]  = useState("");
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [saved,   setSaved]   = useState(false);

    /* ── unchanged logic ── */
    useEffect(() => {
        if (!Number.isFinite(projectId) || !Number.isFinite(designId)) {
            setError(t("errors.notFound"));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        getDesign(projectId, designId)
            .then(res => {
                setDesign(res.data.data);
                setSaved(res.data.data.is_selected);
            })
            .catch(() => setError(t("errors.serverError")))
            .finally(() => setLoading(false));
    }, [projectId, designId, t]);

    const handleSave = async () => {
        if (!design || !Number.isFinite(projectId)) return;
        setSaving(true);
        try {
            await selectDesign(projectId, design.id);
            setSaved(true);
        } catch { /* ignore */ }
        finally { setSaving(false); }
    };

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const scores = design
        ? [
              { label: t("designDetails.spaceEfficiency"),     value: design.score_space,       icon: <Icons.layoutTemplate className="h-4 w-4" />, iconBg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400" },
              { label: t("designDetails.lightingIntegration"), value: design.score_lighting,    icon: <Icons.lightbulb className="h-4 w-4" />,      iconBg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400" },
              { label: t("designDetails.comfortFlow"),         value: design.score_circulation, icon: <Icons.settings className="h-4 w-4" />,        iconBg: "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400" },
              { label: t("designDetails.functionality"),       value: design.score_functional,  icon: <Icons.folder className="h-4 w-4" />,          iconBg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" },
          ]
        : [];

    /* ── loading ── */
    if (loading) return <Skeleton />;

    /* ── error ── */
    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Could not load design</h3>
                <p className="text-sm text-muted-foreground mb-6">{error}</p>
                <button
                    onClick={() => setPage(Number.isFinite(projectId) ? `/ai-designs?project=${projectId}` : "ai-designs")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to designs
                </button>
            </div>
        </div>
    );

    /* ── main render ── */
    return (
        <div className="min-h-screen bg-background font-sans">

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        {/* Left: back + title */}
                        <div className="min-w-0">
                            <button
                                onClick={() => setPage(Number.isFinite(projectId) ? `/ai-designs?project=${projectId}` : "ai-designs")}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                {t("designDetails.backToResults")}
                            </button>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-xl font-bold text-foreground tracking-tight truncate">
                                    {design?.title ?? t("designDetails.projectFallback")}
                                </h1>
                                {design && (
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${scoreBg(design.overall_score)}`}>
                                        <span className="text-base leading-none">{design.overall_score}</span>
                                        <span className="opacity-60">/100</span>
                                        <span className="ml-0.5">{scoreLabel(design.overall_score)}</span>
                                    </span>
                                )}
                            </div>
                            {design && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1 max-w-xl">{design.description}</p>
                            )}
                        </div>

                        {/* Right: actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setPage(Number.isFinite(projectId) ? `/ai-designs?project=${projectId}` : "ai-designs")}
                                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors shadow-sm"
                            >
                                <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                                {t("designDetails.compare")}
                            </button>
                            <button
                                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors shadow-sm"
                            >
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {t("designDetails.exportPdf")}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || saved}
                                className={[
                                    "inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm",
                                    saved
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 cursor-default"
                                        : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200 dark:hover:shadow-violet-900/30 disabled:opacity-60",
                                ].join(" ")}
                            >
                                {saving
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : saved
                                        ? <BookmarkCheck className="h-4 w-4" />
                                        : <Bookmark className="h-4 w-4" />
                                }
                                {saved ? t("designDetails.saved") : t("designDetails.saveDesign")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ────────────────────────────────────────────────────── */}
            {design && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* ── Left column ─────────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* Hero image */}
                            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-muted shadow-md group">
                                <img
                                    src={design.image_url ?? FALLBACK_IMAGE}
                                    alt={t("designDetails.previewAlt")}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Bottom-left: title on image */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                                        <Sparkles className="w-3 h-3 text-violet-300" />
                                        AI-Generated Design
                                    </div>
                                    <h2 className="text-white text-xl font-bold mt-1.5 drop-shadow">{design.title}</h2>
                                </div>

                                {/* Top-right: expand hint */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md text-white">
                                        <Maximize2 className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Overall score strip */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Overall Score",  value: `${design.overall_score}/100`, sub: scoreLabel(design.overall_score),  accentClass: "text-violet-600 dark:text-violet-400" },
                                    { label: "Best Metric",    value: `${Math.max(design.score_space, design.score_lighting, design.score_circulation, design.score_budget, design.score_functional)}%`, sub: "Top category",    accentClass: "text-emerald-600 dark:text-emerald-400" },
                                    { label: "Est. Cost",      value: design.cost_estimate ? formatCurrency(design.cost_estimate.total) : "—", sub: "Total estimate", accentClass: "text-blue-600 dark:text-blue-400" },
                                ].map(({ label, value, sub, accentClass }) => (
                                    <div key={label} className="rounded-xl border border-border p-4 bg-card shadow-sm text-center">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                                        <p className={`text-2xl font-extrabold tracking-tight ${accentClass}`}>{value}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* AI Explanation card */}
                            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-violet-50/60 dark:from-violet-950/20 to-transparent">
                                    <div className="h-8 w-8 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                                        <Icons.brain className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">{t("designDetails.aiExplanation")}</h2>
                                        <p className="text-xs text-muted-foreground">Generated based on your space and preferences</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40">
                                        <Sparkles className="w-3 h-3 text-violet-500 dark:text-violet-400" />
                                        <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">AI</span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
                                    <p className="font-medium text-foreground">{design.description}</p>
                                    <p>{t("designDetails.paragraph2")}</p>
                                    <ul className="space-y-2">
                                        {[t("designDetails.bullet1"), t("designDetails.bullet2"), t("designDetails.bullet3")].map((b) => (
                                            <li key={b} className="flex items-start gap-2.5">
                                                <ChevronRight className="w-4 h-4 text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* ── Right column ─────────────────────────────────── */}
                        <div className="space-y-5">

                            {/* Design scores card */}
                            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-border">
                                    <h3 className="text-sm font-bold text-foreground">{t("designDetails.designScores")}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">AI performance analysis</p>
                                </div>
                                <div className="p-5 space-y-4">
                                    {scores.map(({ label, value, icon, iconBg }) => (
                                        <div key={label}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${iconBg}`}>
                                                        {icon}
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">{label}</span>
                                                </div>
                                                <span className={`text-sm font-bold px-2 py-0.5 rounded-lg border ${scoreBg(value)}`}>
                                                    {value}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${scoreGradient(value)} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${value}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost estimate card */}
                            {design.cost_estimate && (
                                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                    <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-slate-900 to-slate-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center">
                                                <DollarSign className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                                {t("designDetails.estimatedCost")}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-3xl font-extrabold text-white tracking-tight">
                                                {formatCurrency(design.cost_estimate.total)}
                                            </span>
                                            <span className="text-white/50 text-sm">{t("designDetails.usd")}</span>
                                        </div>
                                        <p className="text-white/40 text-xs mt-1">Full project estimate</p>
                                    </div>

                                    <div className="p-5 space-y-1">
                                        {[
                                            { icon: <Sofa className="w-3.5 h-3.5" />,       label: t("designDetails.furniture"),           value: design.cost_estimate.furniture,   color: "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20" },
                                            { icon: <Hammer className="w-3.5 h-3.5" />,      label: t("designDetails.demolitionStructural"), value: design.cost_estimate.demolition,  color: "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20" },
                                            { icon: <Paintbrush className="w-3.5 h-3.5" />,  label: t("designDetails.materialsPaintTrim"),   value: design.cost_estimate.materials,   color: "text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20" },
                                            { icon: <HardHat className="w-3.5 h-3.5" />,     label: t("designDetails.laborContingency"),     value: design.cost_estimate.labor,       color: "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" },
                                        ].map(({ icon, label, value, color }) => (
                                            <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`h-6 w-6 rounded-md flex items-center justify-center ${color}`}>
                                                        {icon}
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{label}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-foreground tabular-nums">
                                                    {formatCurrency(value)}
                                                </span>
                                            </div>
                                        ))}

                                        <button className="w-full mt-4 h-9 flex items-center justify-center gap-2 rounded-xl border border-border bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                                            {t("designDetails.viewBreakdown")}
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
