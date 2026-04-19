import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Loader2,
    CheckCircle2,
    Cpu,
    Layers,
    Lightbulb,
    Wand2,
    Home
} from "lucide-react";

interface AIProcessingPageProps {
    setPage: (page: string) => void;
}

export default function AIProcessingPage({ setPage }: AIProcessingPageProps) {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [activeTipIndex, setActiveTipIndex] = useState(0);

    const steps = [
        t("aiProcessing.step0"),
        t("aiProcessing.step1"),
        t("aiProcessing.step2"),
        t("aiProcessing.step3"),
        t("aiProcessing.step4"),
    ];

    const tips = [
        t("aiProcessing.tip0"),
        t("aiProcessing.tip1"),
        t("aiProcessing.tip2"),
        t("aiProcessing.tip3"),
    ];

    // Determine current step based on progress (0-100 mapped to 0-4)
    const currentStepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);

    // Progress simulation
    useEffect(() => {
        const duration = 12000; // 12 seconds total processing time
        const intervalTime = 100; // Update every 100ms
        const increment = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setPage("ai-designs"), 800); // Small delay at 100% before redirect
                    return 100;
                }
                // Add some random jitter to make it feel more "real"
                const jitter = Math.random() * 2 - 0.5;
                return Math.min(100, next + (Math.max(0, jitter)));
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [setPage]);

    // Rotating tips
    useEffect(() => {
        const tipTimer = setInterval(() => {
            setActiveTipIndex((prev) => (prev + 1) % tips.length);
        }, 4000); // Change tip every 4 seconds
        return () => clearInterval(tipTimer);
    }, [tips.length, t]);

    return (
        <div className="min-vh-100 bg-gray-50 d-flex flex-column align-items-center justify-content-center p-4 font-sans relative overflow-hidden">

            {/* Background elements for ambiance */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-circle blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-circle blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-2xl w-100 text-center space-y-12 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t("aiProcessing.title")}</h1>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        {t("aiProcessing.subtitle")}
                    </p>
                </div>

                {/* AI Animation Core */}
                <div className="relative w-48 h-48 mx-auto d-flex align-items-center justify-content-center">
                    {/* Outer rings */}
                    <div className="absolute inset-0 border-4 border-dashed border-blue-200 rounded-circle animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-2 border-4 border-dashed border-indigo-200 rounded-circle animate-[spin_8s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-6 border-4 border-blue-100 rounded-circle animate-pulse"></div>

                    {/* Central Hub */}
                    <div className="relative w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-circle shadow-2xl d-flex align-items-center justify-content-center z-20 overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        <Cpu className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>

                    {/* Orbiting Elements (Simulated Neural Nodes) */}
                    <div className="absolute w-100 h-100 animate-[spin_6s_linear_infinite] z-10">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-circle shadow-lg border border-gray-100 d-flex align-items-center justify-content-center text-blue-500">
                            <Layers className="w-5 h-5 -rotate-[0deg] animate-[spin_6s_linear_infinite_reverse]" />
                        </div>
                    </div>
                    <div className="absolute w-100 h-100 animate-[spin_8s_linear_infinite_reverse] z-10" style={{ animationDelay: '-2s' }}>
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-10 h-10 bg-white rounded-circle shadow-lg border border-gray-100 d-flex align-items-center justify-content-center text-amber-500">
                            <Lightbulb className="w-5 h-5 rotate-[90deg] animate-[spin_8s_linear_infinite]" />
                        </div>
                    </div>
                    <div className="absolute w-100 h-100 animate-[spin_7s_linear_infinite] z-10" style={{ animationDelay: '-4s' }}>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-circle shadow-lg border border-gray-100 d-flex align-items-center justify-content-center text-purple-500">
                            <Wand2 className="w-5 h-5 -rotate-[180deg] animate-[spin_7s_linear_infinite_reverse]" />
                        </div>
                    </div>
                    <div className="absolute w-100 h-100 animate-[spin_9s_linear_infinite_reverse] z-10" style={{ animationDelay: '-6s' }}>
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-10 h-10 bg-white rounded-circle shadow-lg border border-gray-100 d-flex align-items-center justify-content-center text-emerald-500">
                            <Home className="w-5 h-5 rotate-[270deg] animate-[spin_9s_linear_infinite]" />
                        </div>
                    </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-bold text-gray-700">{t("aiProcessing.overallProgress")}</span>
                        <span className="text-xl font-extrabold text-blue-600">{t("aiProcessing.percentComplete", { n: Math.floor(progress) })}</span>
                    </div>
                    <div className="h-3 w-100 bg-gray-200 rounded-circle overflow-hidden shadow-inner">
                        <div
                            className="h-100 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-circle transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Steps List */}
                <div className="bg-white p-4 rounded-4 shadow-sm border border-gray-100 text-start space-y-4 max-w-sm mx-auto">
                    {steps.map((stepMsg, index) => {
                        const isCompleted = index < currentStepIndex || progress >= 100;
                        const isActive = index === currentStepIndex && progress < 100;
                        const isPending = index > currentStepIndex;

                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-3 transition-opacity duration-500 ${isPending ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <div className="w-6 d-flex justify-content-center flex-shrink-0">
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : isActive ? (
                                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-circle bg-gray-300"></div>
                                    )}
                                </div>
                                <span className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                    {stepMsg}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Rotating Tips Container */}
                <div className="h-16 d-flex align-items-center justify-content-center">
                    <p
                        key={activeTipIndex} // Forces re-render for animation on change
                        className="fs-6 text-muted fw-medium text-indigo-600 px-4 py-3 bg-indigo-50 rounded-circle border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                        💡 {tips[activeTipIndex]}
                    </p>
                </div>

                {/* Cancel Button */}
                <div className="pt-8">
                    <button
                        onClick={() => setPage("dashboard")}
                        className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                    >
                        {t("aiProcessing.cancelGeneration")}
                    </button>
                </div>
            </div>
        </div>
    );
}
