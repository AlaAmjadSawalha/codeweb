import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CheckCircle2,
    ArrowLeft,
    Home,
    Heart,
    Edit2,
    Maximize2,
    Download,
    Info,
    LayoutDashboard,
    Plus,
    X,
    GitCompare
} from "lucide-react";

interface AIGeneratedDesignsPageProps {
    setPage: (page: string) => void;
}

// Mock Data for Generated Layouts (labels via i18n keys under aiDesigns.*)
const MOCK_LAYOUTS = [
    {
        id: "l1",
        titleKey: "l1Title",
        descKey: "l1Desc",
        imageUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        overallScore: 94,
        metrics: [
            { metricKey: "metricSpaceUtil", score: 98 },
            { metricKey: "metricLighting", score: 92 },
            { metricKey: "metricMovement", score: 95 },
            { metricKey: "metricBudget", score: 88 },
            { metricKey: "metricFunctional", score: 96 },
        ],
    },
    {
        id: "l2",
        titleKey: "l2Title",
        descKey: "l2Desc",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        overallScore: 88,
        metrics: [
            { metricKey: "metricSpaceUtil", score: 82 },
            { metricKey: "metricLighting", score: 99 },
            { metricKey: "metricMovement", score: 90 },
            { metricKey: "metricBudget", score: 85 },
            { metricKey: "metricFunctional", score: 84 },
        ],
    },
    {
        id: "l3",
        titleKey: "l3Title",
        descKey: "l3Desc",
        imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        overallScore: 91,
        metrics: [
            { metricKey: "metricSpaceUtil", score: 90 },
            { metricKey: "metricLighting", score: 85 },
            { metricKey: "metricMovement", score: 88 },
            { metricKey: "metricBudget", score: 95 },
            { metricKey: "metricFunctional", score: 97 },
        ],
    },
];

export default function AIGeneratedDesignsPage({ setPage }: AIGeneratedDesignsPageProps) {
    const { t } = useTranslation();
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [savedLayouts, setSavedLayouts] = useState<Record<string, boolean>>({});

    const toggleSave = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSavedLayouts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelect = (id: string) => {
        setSelectedLayoutId(id === selectedLayoutId ? null : id);
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 80) return 'bg-blue-500';
        if (score >= 70) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-vh-100 bg-gray-50 pt-24 pb-32 font-sans overflow-x-hidden relative">

            {/* Image Expansion Modal */}
            {expandedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm d-flex align-items-center justify-content-center p-3 animate-in fade-in duration-200">
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-6 right-6 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={expandedImage}
                        alt={t("aiDesigns.expandedLayoutAlt")}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">

                {/* Header Section */}
                <div className="mb-12 text-center md:text-left d-flex flex-column md:flex-row justify-content-between align-items-center gap-5">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{t("aiDesigns.title")}</h1>
                        <p className="text-lg text-gray-500 max-w-2xl">
                            {t("aiDesigns.subtitle")}
                        </p>
                    </div>
                    {/* Context Meta snippet */}
                    <div className="flex gap-4 text-sm font-medium text-gray-500 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex-wrap justify-center">
                        <span className="flex items-center gap-2"><Home className="w-4 h-4" /> {t("aiDesigns.contextRoom")}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{t("aiDesigns.contextStyle")}</span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{t("aiDesigns.contextBudget")}</span>
                    </div>
                </div>

                {/* Grid Display */}
                <div className="d-grid row-cols-1 row-cols-md-2 row-cols-lg-3 gap-5 mb-12">
                    {MOCK_LAYOUTS.map((layout) => {
                        const isSelected = selectedLayoutId === layout.id;

                        return (
                            <div
                                key={layout.id}
                                className={`group flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${isSelected
                                    ? 'ring-4 ring-blue-600 shadow-xl scale-[1.01]'
                                    : 'border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300'
                                    }`}
                                onClick={() => handleSelect(layout.id)}
                            >
                                {/* Fixed Image Header Container */}
                                <div className="relative h-64 w-100 bg-gray-100 overflow-hidden">
                                    <img
                                        src={layout.imageUrl}
                                        alt={t(`aiDesigns.${layout.titleKey}`)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 d-flex align-items-start justify-content-end p-3 gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedImage(layout.imageUrl); }}
                                            className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-lg transition-colors"
                                            title={t("aiDesigns.expandImage")}
                                        >
                                            <Maximize2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => toggleSave(layout.id, e)}
                                            className={`p-2 backdrop-blur-md rounded-lg transition-colors ${savedLayouts[layout.id] ? 'bg-red-500 text-white shadow-lg' : 'bg-white/20 hover:bg-white/40 text-white'}`}
                                            title={t("aiDesigns.saveFavorites")}
                                        >
                                            <Heart className={`w-5 h-5 ${savedLayouts[layout.id] ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>

                                    {/* AI Score Badge overlaying image */}
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-4 shadow-lg d-flex align-items-center gap-2 border border-white/50">
                                        <div className={`w-2.5 h-2.5 rounded-full ${getScoreColor(layout.overallScore)} animate-pulse`}></div>
                                        <span className="fw-bold text-gray-900">{layout.overallScore}<span className="small text-gray-500 font-normal">/100</span></span>
                                    </div>

                                    {/* Selection Target Indicator Overlay */}
                                    {isSelected && (
                                        <div className="absolute top-4 left-4 rounded-full bg-blue-600 p-1 text-white shadow-lg">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>

                                {/* Body Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`aiDesigns.${layout.titleKey}`)}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-6 h-10">
                                        {t(`aiDesigns.${layout.descKey}`)}
                                    </p>

                                    {/* Metrics/Scores Panel */}
                                    <div className="space-y-4 mb-8 mt-auto">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            {t("aiDesigns.evaluationMetrics")}
                                            <div className="group/tooltip relative inline-flex cursor-help">
                                                <Info className="w-3.5 h-3.5 text-gray-300" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                                    {t("aiDesigns.metricsTooltip")}
                                                </div>
                                            </div>
                                        </h4>
                                        <div className="space-y-3">
                                            {layout.metrics.map(({ metricKey, score }) => (
                                                <div key={metricKey} className="space-y-1">
                                                    <div className="flex justify-between items-end text-sm">
                                                        <span className="font-medium text-gray-700">{t(`aiDesigns.${metricKey}`)}</span>
                                                        <span className="font-bold text-gray-900">{score}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-100 bg-gray-100 rounded-circle overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                                                            style={{ width: `${score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="d-grid row-cols-4 gap-2 border-t border-gray-100 pt-6">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSelect(layout.id); }}
                                            className={`col-span-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isSelected
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                                                }`}
                                        >
                                            {isSelected ? (
                                                <><CheckCircle2 className="w-5 h-5" /> {t("aiDesigns.selectedLayout")}</>
                                            ) : (
                                                t("aiDesigns.selectThisDesign")
                                            )}
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setPage("compare-designs"); }}
                                            className="col-span-2 py-2.5 mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-4 fs-6 text-muted fw-semibold text-gray-700 transition-colors d-flex align-items-center justify-content-center gap-1.5"
                                        >
                                            <GitCompare className="w-4 h-4" /> {t("aiDesigns.compare")}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setPage("create-project"); }}
                                            className="col-span-1 py-2.5 mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition-colors flex items-center justify-center"
                                            title={t("aiDesigns.editConstraints")}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); /* export/share logic */ }}
                                            className="col-span-1 py-2.5 mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition-colors flex items-center justify-center"
                                            title={t("aiDesigns.exportShare")}
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Bottom Fixed Navigation Bar */}
            <div className="fixed bottom-0 left-0 w-100 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)] z-40 transform transition-transform duration-300">
                <div className="max-w-7xl mx-auto px-4 py-3 d-flex flex-column sm:flex-row align-items-center justify-content-between gap-4">
                    <div className="d-flex gap-4">
                        <button
                            onClick={() => setPage("dashboard")}
                            className="px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all flex items-center gap-2"
                        >
                            <LayoutDashboard className="w-5 h-5" /> {t("aiDesigns.backToDashboard")}
                        </button>
                        <button
                            onClick={() => setPage("create-project")}
                            className="d-none d-md-flex px-5 py-2.5 rounded-4 fw-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all align-items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> {t("aiDesigns.newDesign")}
                        </button>
                    </div>

                    <div className="d-flex gap-4 w-100 sm:w-auto">
                        <button
                            disabled={!selectedLayoutId}
                            onClick={() => setPage("/design-details")}
                            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${selectedLayoutId
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {t("aiDesigns.proceedSelected")} <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
