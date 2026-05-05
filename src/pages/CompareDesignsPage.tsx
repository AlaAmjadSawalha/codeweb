import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    Home,
    Maximize2,
    ArrowLeft,
    Save,
    Edit2,
    Info,
    LayoutDashboard,
    X,
    Loader2
} from "lucide-react";
import { compareDesigns, selectDesign, type Design } from "@/api/designs";

interface CompareDesignsPageProps {
    setPage: (page: string) => void;
}

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

export default function CompareDesignsPage({ setPage }: CompareDesignsPageProps) {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const projectId = Number.parseInt(searchParams.get("project") ?? "", 10);
    const aId = Number.parseInt(searchParams.get("a") ?? "", 10);
    const bId = Number.parseInt(searchParams.get("b") ?? "", 10);

    const [designA, setDesignA] = useState<Design | null>(null);
    const [designB, setDesignB] = useState<Design | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isFinite(projectId) || !Number.isFinite(aId) || !Number.isFinite(bId)) {
            setError(t("errors.notFound"));
            setLoading(false);
            return;
        }
        setLoading(true);
        compareDesigns(projectId, aId, bId)
            .then(res => {
                setDesignA(res.data.data.design_a);
                setDesignB(res.data.data.design_b);
            })
            .catch(() => setError(t("errors.serverError")))
            .finally(() => setLoading(false));
    }, [projectId, aId, bId, t]);

    const handleSaveSelected = async () => {
        if (!selectedId || !Number.isFinite(projectId)) return;
        setSaving(true);
        try {
            await selectDesign(projectId, selectedId);
            setPage(`/design-details?project=${projectId}&design=${selectedId}`);
        } catch {
            /* ignore */
        } finally {
            setSaving(false);
        }
    };

    const isCostWinner = (a: number, b: number, current: number) => current === Math.min(a, b);
    const isMetricWinner = (a: number, b: number, current: number) => current === Math.max(a, b);
    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const imageOf = (d: Design, fallbackIdx: number) =>
        d.image_url ?? FALLBACK_IMAGES[fallbackIdx];

    const layouts = designA && designB ? [designA, designB] : [];
    const totalA = designA?.cost_estimate?.total ?? 0;
    const totalB = designB?.cost_estimate?.total ?? 0;

    return (
        <div className="min-h-screen bg-background pt-24 pb-40 font-sans overflow-x-hidden relative">

            {expandedImage && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-6 right-6 z-50 rounded-full bg-black/50 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={expandedImage}
                        alt={t("compareDesigns.expandedLayoutAlt")}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                    />
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4">

                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-5">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{t("compareDesigns.title")}</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">{t("compareDesigns.subtitle")}</p>
                    </div>
                    <div className="flex gap-3 text-sm font-medium text-muted-foreground bg-card px-5 py-3 rounded-xl shadow-sm border border-border flex-wrap justify-center">
                        <span className="flex items-center gap-2"><Home className="w-4 h-4 text-violet-500 dark:text-violet-400" /> {t("compareDesigns.contextRoom")}</span>
                        <span className="hidden sm:inline text-muted-foreground/40">•</span>
                        <span className="text-foreground bg-muted px-2 py-0.5 rounded">{t("compareDesigns.contextStyle")}</span>
                        <span className="hidden sm:inline text-muted-foreground/40">•</span>
                        <span className="text-foreground bg-muted px-2 py-0.5 rounded">{t("compareDesigns.contextBudget")}</span>
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-32 text-muted-foreground gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-lg">{t("compareDesigns.loading")}</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-20 text-red-500 dark:text-red-400">
                        <p className="text-lg mb-4">{error}</p>
                        <button
                            onClick={() => setPage(`/ai-designs?project=${projectId}`)}
                            className="px-5 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            {t("compareDesigns.returnLayouts")}
                        </button>
                    </div>
                )}

                {!loading && !error && designA && designB && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                            {layouts.map((design, idx) => {
                                const isSelected = selectedId === design.id;
                                const labelName = idx === 0 ? t("compareDesigns.layoutA") : t("compareDesigns.layoutB");
                                const imgUrl = imageOf(design, idx);
                                const cost = design.cost_estimate;
                                const lightingScore = design.score_lighting / 10;
                                const circulationScore = design.score_circulation / 10;

                                return (
                                    <div
                                        key={design.id}
                                        onClick={() => setSelectedId(design.id)}
                                        className={`flex flex-col bg-card rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${isSelected
                                            ? 'ring-4 ring-violet-600 shadow-2xl scale-[1.01] relative z-10'
                                            : 'border border-border shadow-sm hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700'
                                            }`}
                                    >
                                        <div className="relative h-64 md:h-80 w-full bg-muted overflow-hidden group">
                                            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-bold shadow-lg border border-white/20">
                                                {labelName}: {design.title}
                                            </div>
                                            <img
                                                src={imgUrl}
                                                alt={design.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setExpandedImage(imgUrl); }}
                                                    className="p-4 bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 rounded-full shadow-2xl transition-all hover:scale-110"
                                                >
                                                    <Maximize2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-4 right-4 z-20 animate-in zoom-in rounded-full bg-violet-600 p-1 text-white shadow-lg">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 md:p-8 flex flex-col gap-5 flex-grow">
                                            {cost && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                                        {t("compareDesigns.costEstimate")}
                                                        <div className="group/tooltip relative inline-flex cursor-help">
                                                            <Info className="w-4 h-4 text-muted-foreground/40" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                                                {t("compareDesigns.costTooltip")}
                                                            </div>
                                                        </div>
                                                    </h4>
                                                    <div className="space-y-2 text-sm text-muted-foreground">
                                                        <div className="flex justify-between border-b border-border pb-2">
                                                            <span>{t("compareDesigns.furniture")}</span>
                                                            <span className="font-medium text-foreground">{formatCurrency(cost.furniture)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-border pb-2">
                                                            <span>{t("compareDesigns.flooring")}</span>
                                                            <span className="font-medium text-foreground">{formatCurrency(cost.demolition)}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-border pb-2">
                                                            <span>{t("compareDesigns.decoration")}</span>
                                                            <span className="font-medium text-foreground">{formatCurrency(cost.materials)}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-2">
                                                            <span className="font-bold text-foreground">{t("compareDesigns.totalEstimate")}</span>
                                                            <span className={`font-bold text-lg ${isCostWinner(totalA, totalB, cost.total) ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                                                {formatCurrency(cost.total)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex justify-between items-end text-sm mb-2">
                                                    <span className="font-bold text-foreground">{t("compareDesigns.spaceUsage")}</span>
                                                    <span className={`font-bold ${isMetricWinner(designA.score_space, designB.score_space, design.score_space) ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                                        {design.score_space}%
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 ease-out bg-violet-500"
                                                        style={{ width: `${design.score_space}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/40">
                                                    <span className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1">{t("compareDesigns.lightingScore")}</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`text-2xl font-black ${isMetricWinner(designA.score_lighting, designB.score_lighting, design.score_lighting) ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                            {lightingScore.toFixed(1)}
                                                        </span>
                                                        <span className="text-sm font-medium text-amber-700/60 dark:text-amber-300/60">/ 10</span>
                                                    </div>
                                                    <div className="flex gap-1 mt-2">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <div key={star} className={`flex-1 h-1.5 rounded-full ${star <= Math.round(lightingScore / 2) ? 'bg-amber-400' : 'bg-amber-200/50 dark:bg-amber-900/30'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-sky-50 dark:bg-sky-950/20 rounded-2xl p-4 border border-sky-100 dark:border-sky-900/40">
                                                    <span className="block text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wide mb-1">{t("compareDesigns.movementFlow")}</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`text-2xl font-black ${isMetricWinner(designA.score_circulation, designB.score_circulation, design.score_circulation) ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'}`}>
                                                            {circulationScore.toFixed(1)}
                                                        </span>
                                                        <span className="text-sm font-medium text-sky-700/60 dark:text-sky-300/60">/ 10</span>
                                                    </div>
                                                    <div className="flex gap-1 mt-2">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <div key={star} className={`flex-1 h-1.5 rounded-full ${star <= Math.round(circulationScore / 2) ? 'bg-sky-400' : 'bg-sky-200/50 dark:bg-sky-900/30'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-6">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedId(design.id); }}
                                                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isSelected
                                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                        }`}
                                                >
                                                    {isSelected ? (
                                                        <><CheckCircle2 className="w-5 h-5" /> {t("compareDesigns.selected")}</>
                                                    ) : (
                                                        t("compareDesigns.selectLayout", { label: labelName })
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary Table */}
                        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden mb-12">
                            <div className="bg-muted border-b border-border px-6 py-4">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <LayoutDashboard className="w-5 h-5 text-violet-600 dark:text-violet-400" /> {t("compareDesigns.summaryComparison")}
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 border-b border-border text-sm font-medium text-muted-foreground bg-card w-1/3">{t("compareDesigns.feature")}</th>
                                            <th className={`px-6 py-4 border-b border-border text-sm font-bold w-1/3 ${selectedId === designA.id ? 'bg-violet-50/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300' : 'bg-card text-foreground'}`}>{t("compareDesigns.layoutA")}: {designA.title}</th>
                                            <th className={`px-6 py-4 border-b border-border text-sm font-bold w-1/3 ${selectedId === designB.id ? 'bg-violet-50/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300' : 'bg-card text-foreground'}`}>{t("compareDesigns.layoutB")}: {designB.title}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-muted-foreground">
                                        <tr className="hover:bg-muted/40 transition-colors">
                                            <td className="px-6 py-4 border-b border-border">{t("compareDesigns.totalCostEstimate")}</td>
                                            <td className={`px-6 py-4 border-b border-border ${isCostWinner(totalA, totalB, totalA) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {formatCurrency(totalA)}
                                            </td>
                                            <td className={`px-6 py-4 border-b border-border ${isCostWinner(totalA, totalB, totalB) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {formatCurrency(totalB)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-muted/40 transition-colors">
                                            <td className="px-6 py-4 border-b border-border">{t("compareDesigns.spaceUsage")}</td>
                                            <td className={`px-6 py-4 border-b border-border ${isMetricWinner(designA.score_space, designB.score_space, designA.score_space) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {designA.score_space}%
                                            </td>
                                            <td className={`px-6 py-4 border-b border-border ${isMetricWinner(designA.score_space, designB.score_space, designB.score_space) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {designB.score_space}%
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-muted/40 transition-colors">
                                            <td className="px-6 py-4 border-b border-border">{t("compareDesigns.lightingQualityScore")}</td>
                                            <td className={`px-6 py-4 border-b border-border ${isMetricWinner(designA.score_lighting, designB.score_lighting, designA.score_lighting) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {(designA.score_lighting / 10).toFixed(1)} / 10
                                            </td>
                                            <td className={`px-6 py-4 border-b border-border ${isMetricWinner(designA.score_lighting, designB.score_lighting, designB.score_lighting) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {(designB.score_lighting / 10).toFixed(1)} / 10
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-muted/40 transition-colors">
                                            <td className="px-6 py-4">{t("compareDesigns.circulationMovement")}</td>
                                            <td className={`px-6 py-4 ${isMetricWinner(designA.score_circulation, designB.score_circulation, designA.score_circulation) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {(designA.score_circulation / 10).toFixed(1)} / 10
                                            </td>
                                            <td className={`px-6 py-4 ${isMetricWinner(designA.score_circulation, designB.score_circulation, designB.score_circulation) ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10' : 'text-foreground'}`}>
                                                {(designB.score_circulation / 10).toFixed(1)} / 10
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)] z-40 transform transition-transform duration-300">
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setPage(Number.isFinite(projectId) ? `/ai-designs?project=${projectId}` : "ai-designs")}
                            className="whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-muted-foreground bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" /> {t("compareDesigns.returnLayouts")}
                        </button>
                        <button
                            onClick={() => setPage("create-project")}
                            className="whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-muted-foreground bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all flex items-center gap-2"
                        >
                            <Edit2 className="w-5 h-5" /> {t("compareDesigns.editPreferences")}
                        </button>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            disabled={!selectedId || saving}
                            onClick={handleSaveSelected}
                            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${selectedId && !saving
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-700 hover:-translate-y-0.5'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {t("compareDesigns.saveSelected")}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
