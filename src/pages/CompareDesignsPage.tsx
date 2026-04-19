import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CheckCircle2,
    Home,
    Maximize2,
    ArrowLeft,
    Save,
    Edit2,
    Info,
    LayoutDashboard,
    X
} from "lucide-react";

interface CompareDesignsPageProps {
    setPage: (page: string) => void;
}

// Mock Data for Comparison
const LAYOUT_A = {
    id: "l1",
    title: "",
    imageUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cost: {
        flooring: 2400,
        furniture: 4500,
        decoration: 1300,
        total: 8200
    },
    metrics: {
        spaceUsage: 85,
        lightingScore: 7.8,
        circulationScore: 8.2
    }
};

const LAYOUT_B = {
    id: "l2",
    title: "",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cost: {
        flooring: 2800,
        furniture: 5200,
        decoration: 1400,
        total: 9400
    },
    metrics: {
        spaceUsage: 90,
        lightingScore: 8.6,
        circulationScore: 9.1
    }
};

export default function CompareDesignsPage({ setPage }: CompareDesignsPageProps) {
    const { t } = useTranslation();
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Helpers to determine "winners" for highlighting
    const isCostWinner = (costA: number, costB: number, current: number) => current === Math.min(costA, costB);
    const isMetricWinner = (metricA: number, metricB: number, current: number) => current === Math.max(metricA, metricB);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-40 font-sans overflow-x-hidden relative">

            {/* Image Expansion Modal */}
            {expandedImage && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-white/20 rounded-full transition-colors z-50"
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

            <div className="max-w-6xl mx-auto px-6">

                {/* Header Section */}
                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{t("compareDesigns.title")}</h1>
                        <p className="text-lg text-gray-500 max-w-2xl">
                            {t("compareDesigns.subtitle")}
                        </p>
                    </div>
                    {/* Context Meta snippet */}
                    <div className="flex gap-3 text-sm font-medium text-gray-500 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex-wrap justify-center">
                        <span className="flex items-center gap-2"><Home className="w-4 h-4 text-blue-500" /> {t("compareDesigns.contextRoom")}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{t("compareDesigns.contextStyle")}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{t("compareDesigns.contextBudget")}</span>
                    </div>
                </div>

                {/* Side-by-Side Comparison Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    {[LAYOUT_A, LAYOUT_B].map((layout, idx) => {
                        const isSelected = selectedLayoutId === layout.id;
                        const labelName = idx === 0 ? t("compareDesigns.layoutA") : t("compareDesigns.layoutB");

                        return (
                            <div
                                key={layout.id}
                                onClick={() => setSelectedLayoutId(layout.id)}
                                className={`flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${isSelected
                                    ? 'ring-4 ring-blue-600 shadow-2xl scale-[1.01] relative z-10'
                                    : 'border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300'
                                    }`}
                            >
                                {/* Fixed Image Header Container */}
                                <div className="relative h-64 md:h-80 w-full bg-gray-100 overflow-hidden group">
                                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-bold shadow-lg border border-white/20">
                                        {labelName}: {t(`aiDesigns.${layout.id}Title`)}
                                    </div>
                                    <img
                                        src={layout.imageUrl}
                                        alt={t(`aiDesigns.${layout.id}Title`)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Overlay Action - Zoom */}
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedImage(layout.imageUrl); }}
                                            className="p-4 bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 rounded-full shadow-2xl transition-all hover:scale-110"
                                            title={t("compareDesigns.expandImage")}
                                        >
                                            <Maximize2 className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Selection Target Indicator Overlay */}
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white p-1 rounded-full shadow-lg animate-in zoom-in">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Body Content Metrics */}
                                <div className="p-6 md:p-8 flex flex-col gap-8 flex-grow">

                                    {/* Cost Breakdown */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                            {t("compareDesigns.costEstimate")}
                                            <div className="group/tooltip relative inline-flex cursor-help">
                                                <Info className="w-4 h-4 text-gray-300" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                                    {t("compareDesigns.costTooltip")}
                                                </div>
                                            </div>
                                        </h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span>{t("compareDesigns.flooring")}</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(layout.cost.flooring)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span>{t("compareDesigns.furniture")}</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(layout.cost.furniture)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span>{t("compareDesigns.decoration")}</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(layout.cost.decoration)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <span className="font-bold text-gray-900">{t("compareDesigns.totalEstimate")}</span>
                                                <span className={`font-bold text-lg ${isCostWinner(LAYOUT_A.cost.total, LAYOUT_B.cost.total, layout.cost.total) ? 'text-emerald-600' : 'text-gray-900'}`}>
                                                    {formatCurrency(layout.cost.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Space Usage Progress */}
                                    <div>
                                        <div className="flex justify-between items-end text-sm mb-2">
                                            <span className="font-bold text-gray-700">{t("compareDesigns.spaceUsage")}</span>
                                            <span className={`font-bold ${isMetricWinner(LAYOUT_A.metrics.spaceUsage, LAYOUT_B.metrics.spaceUsage, layout.metrics.spaceUsage) ? 'text-emerald-600' : 'text-gray-900'}`}>
                                                {layout.metrics.spaceUsage}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out bg-indigo-500`}
                                                style={{ width: `${layout.metrics.spaceUsage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Score Ratings Box */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                                            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">{t("compareDesigns.lightingScore")}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-2xl font-black ${isMetricWinner(LAYOUT_A.metrics.lightingScore, LAYOUT_B.metrics.lightingScore, layout.metrics.lightingScore) ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {layout.metrics.lightingScore}
                                                </span>
                                                <span className="text-sm font-medium text-amber-700/60">/ 10</span>
                                            </div>
                                            {/* Rating Visual */}
                                            <div className="flex gap-1 mt-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <div key={star} className={`flex-1 h-1.5 rounded-full ${star <= Math.round(layout.metrics.lightingScore / 2) ? 'bg-amber-400' : 'bg-amber-200/50'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                                            <span className="block text-xs font-bold text-sky-800 uppercase tracking-wide mb-1">{t("compareDesigns.movementFlow")}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-2xl font-black ${isMetricWinner(LAYOUT_A.metrics.circulationScore, LAYOUT_B.metrics.circulationScore, layout.metrics.circulationScore) ? 'text-emerald-600' : 'text-sky-600'}`}>
                                                    {layout.metrics.circulationScore}
                                                </span>
                                                <span className="text-sm font-medium text-sky-700/60">/ 10</span>
                                            </div>
                                            {/* Rating Visual */}
                                            <div className="flex gap-1 mt-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <div key={star} className={`flex-1 h-1.5 rounded-full ${star <= Math.round(layout.metrics.circulationScore / 2) ? 'bg-sky-400' : 'bg-sky-200/50'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Select Button Inside Card */}
                                    <div className="mt-auto pt-6">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedLayoutId(layout.id); }}
                                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isSelected
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

                {/* Visual Summary Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-12">
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-blue-600" /> {t("compareDesigns.summaryComparison")}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 border-b text-sm font-medium text-gray-500 bg-white w-1/3">{t("compareDesigns.feature")}</th>
                                    <th className={`px-6 py-4 border-b text-sm font-bold w-1/3 ${selectedLayoutId === LAYOUT_A.id ? 'bg-blue-50/50 text-blue-700' : 'bg-white text-gray-900'}`}>{t("compareDesigns.layoutA")}</th>
                                    <th className={`px-6 py-4 border-b text-sm font-bold w-1/3 ${selectedLayoutId === LAYOUT_B.id ? 'bg-blue-50/50 text-blue-700' : 'bg-white text-gray-900'}`}>{t("compareDesigns.layoutB")}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{t("compareDesigns.totalCostEstimate")}</td>
                                    <td className={`px-6 py-4 border-b border-gray-100 ${isCostWinner(LAYOUT_A.cost.total, LAYOUT_B.cost.total, LAYOUT_A.cost.total) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {formatCurrency(LAYOUT_A.cost.total)}
                                    </td>
                                    <td className={`px-6 py-4 border-b border-gray-100 ${isCostWinner(LAYOUT_A.cost.total, LAYOUT_B.cost.total, LAYOUT_B.cost.total) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {formatCurrency(LAYOUT_B.cost.total)}
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{t("compareDesigns.spaceUsage")}</td>
                                    <td className={`px-6 py-4 border-b border-gray-100 ${isMetricWinner(LAYOUT_A.metrics.spaceUsage, LAYOUT_B.metrics.spaceUsage, LAYOUT_A.metrics.spaceUsage) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {LAYOUT_A.metrics.spaceUsage}%
                                    </td>
                                    <td className={`px-6 py-4 border-b border-gray-100 ${isMetricWinner(LAYOUT_A.metrics.spaceUsage, LAYOUT_B.metrics.spaceUsage, LAYOUT_B.metrics.spaceUsage) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {LAYOUT_B.metrics.spaceUsage}%
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 border-b border-gray-100 text-gray-600">{t("compareDesigns.lightingQualityScore")}</td>
                                    <td className={`px-6 py-4 border-b border-gray-100 ${isMetricWinner(LAYOUT_A.metrics.lightingScore, LAYOUT_B.metrics.lightingScore, LAYOUT_A.metrics.lightingScore) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {LAYOUT_A.metrics.lightingScore} / 10
                                    </td>
                                    <td className={`px-6 py-4 border-b border-gray-100 ${isMetricWinner(LAYOUT_A.metrics.lightingScore, LAYOUT_B.metrics.lightingScore, LAYOUT_B.metrics.lightingScore) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {LAYOUT_B.metrics.lightingScore} / 10
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{t("compareDesigns.circulationMovement")}</td>
                                    <td className={`px-6 py-4 ${isMetricWinner(LAYOUT_A.metrics.circulationScore, LAYOUT_B.metrics.circulationScore, LAYOUT_A.metrics.circulationScore) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {LAYOUT_A.metrics.circulationScore} / 10
                                    </td>
                                    <td className={`px-6 py-4 ${isMetricWinner(LAYOUT_A.metrics.circulationScore, LAYOUT_B.metrics.circulationScore, LAYOUT_B.metrics.circulationScore) ? 'font-bold text-emerald-600 bg-emerald-50/30' : 'text-gray-900'}`}>
                                        {LAYOUT_B.metrics.circulationScore} / 10
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Bottom Fixed Navigation Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)] z-40 transform transition-transform duration-300">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setPage("ai-designs")}
                            className="whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" /> {t("compareDesigns.returnLayouts")}
                        </button>
                        <button
                            onClick={() => setPage("create-project")}
                            className="whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all flex items-center gap-2"
                        >
                            <Edit2 className="w-5 h-5" /> {t("compareDesigns.editPreferences")}
                        </button>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            disabled={!selectedLayoutId}
                            onClick={() => { /* Handle saving and proceeding */ setPage("/design-details"); }}
                            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${selectedLayoutId
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Save className="w-5 h-5" /> {t("compareDesigns.saveSelected")}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
