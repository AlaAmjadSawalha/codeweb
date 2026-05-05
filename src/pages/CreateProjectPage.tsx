import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { createProject, updateProjectPreferences, type ProjectMode } from "@/api/projects";
import { getApiErrorMessage } from "@/lib/api";
import {
    Camera,
    Lightbulb,
    UploadCloud,
    ChevronRight,
    ChevronLeft,
    Settings,
    CheckCircle2,
    FileImage,
    Layers,
    Palette,
    Sofa,
    Wallet,
    Users,
    Paintbrush,
    X,
    FileText
} from "lucide-react";

interface CreateProjectPageProps {
    setPage: (page: string) => void;
}

export default function CreateProjectPage({ setPage }: CreateProjectPageProps) {
    const { t } = useTranslation();
    const [step, setStep] = useState<number>(1);

    // File upload refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        // Step 1
        entryMode: "", // 'blueprint' | 'real_space' | 'inspiration'

        // Step 2 (Files & Measurements)
        uploadedFiles: [] as { id: string, file: File, previewUrl: string, name: string, size: number, type: string }[],
        referenceMeasurement: "",
        measurementUnit: "meters", // 'meters' | 'feet'

        // Step 3 (formally Step 2 in inspiration mode)
        projectName: "",
        totalArea: "",
        roomsCount: "1",
        roomType: "",
        ceilingHeight: "",

        // Step 4 (Preferences)
        budget: "",
        customBudget: "",
        designStyle: "",
        colorPreference: "",
        customColor: "#3b82f6",
        roomUsage: "",
        furniturePreference: "",
        layoutStyle: "",
    });

    const updateForm = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const mapProjectMode = (): ProjectMode => {
        if (formData.roomType === "office") return "office";
        return "residential";
    };

    const budgetValue = (): number | null => {
        if (formData.customBudget) {
            const n = parseFloat(formData.customBudget.replace(/[^0-9.]/g, ""));
            return Number.isFinite(n) ? n : null;
        }
        if (formData.budget === "Economy") return 10000;
        if (formData.budget === "Medium") return 50000;
        if (formData.budget === "Luxury") return 150000;
        return null;
    };

    const handleGenerate = async () => {
        const name = formData.projectName.trim() || t("createProject.newProjectDefault");
        const mode = mapProjectMode();
        try {
            const created = await createProject({ name, mode });
            const id = created.data.id;
            const colors = [formData.colorPreference, formData.customColor].filter(Boolean) as string[];
            await updateProjectPreferences(id, {
                budget: budgetValue(),
                style: formData.designStyle || null,
                colors: colors.length ? colors : null,
                usage: formData.roomUsage || null,
                furniture: Boolean(formData.furniturePreference),
            });
            setPage(`/design-details?id=${id}`);
        } catch (e) {
            window.alert(getApiErrorMessage(e, t("errors.createProject")));
        }
    };

    // File Upload Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files).map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : "",
            name: file.name,
            size: file.size,
            type: file.type
        }));

        if (formData.entryMode === 'blueprint') {
            // Blueprint is single file only
            updateForm("uploadedFiles", [newFiles[0]]);
        } else {
            // Real Space can handle multiple files
            updateForm("uploadedFiles", [...formData.uploadedFiles, ...newFiles].slice(0, 10));
        }

        // Reset input so same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (idToRemove: string) => {
        updateForm("uploadedFiles", formData.uploadedFiles.filter(f => f.id !== idToRemove));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return `0 ${t("createProject.sizeBytes")}`;
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const unit =
            i === 0 ? t("createProject.sizeBytes") : i === 1 ? t("createProject.sizeKb") : i === 2 ? t("createProject.sizeMb") : t("createProject.sizeGb");
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + unit;
    };

    // Derived State
    const isUploadStepValid = () => {
        if (formData.entryMode === 'inspiration') return true;
        return formData.uploadedFiles.length > 0;
    };


    // ─── helpers ────────────────────────────────────────────────────────────────
    const inputCls = "w-full h-11 px-4 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all duration-200";
    const selectCls = "w-full h-11 px-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all duration-200 cursor-pointer";
    const cardCls = "bg-card rounded-2xl border border-border shadow-sm";

    // UI Rendering
    const getStepLabels = () => {
        if (formData.entryMode === 'blueprint' || formData.entryMode === 'real_space') {
            return [
                { num: 1, label: t("createProject.stepModeSelection") },
                { num: 2, label: t("createProject.stepUploadFiles") },
                { num: 3, label: t("createProject.stepDesignPreferences") },
                { num: 4, label: t("createProject.stepReviewGenerate") },
            ];
        }
        return [
            { num: 1, label: t("createProject.stepModeSelection") },
            { num: 2, label: t("createProject.stepSpaceDetails") },
            { num: 3, label: t("createProject.stepDesignPreferences") },
            { num: 4, label: t("createProject.stepReviewGenerate") },
        ];
    };

    // Step 1 UI
    const renderStep1 = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Blueprint Mode */}
            <div
                onClick={() => updateForm("entryMode", "blueprint")}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer flex flex-col items-center text-center gap-4 transition-all duration-200 hover:shadow-lg ${formData.entryMode === 'blueprint' ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/20 shadow-md' : 'border-border hover:border-violet-300 dark:hover:border-violet-700 bg-card'}`}
            >
                {formData.entryMode === 'blueprint' && (
                    <div className="absolute top-3.5 right-3.5 text-violet-600 dark:text-violet-400"><CheckCircle2 className="w-5 h-5" /></div>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                    <FileImage className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{t("createProject.blueprintTitle")}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("createProject.blueprintDesc")}</p>
                </div>
            </div>

            {/* Real Space Mode */}
            <div
                onClick={() => updateForm("entryMode", "real_space")}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer flex flex-col items-center text-center gap-4 transition-all duration-200 hover:shadow-lg ${formData.entryMode === 'real_space' ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/20 shadow-md' : 'border-border hover:border-purple-300 dark:hover:border-purple-700 bg-card'}`}
            >
                {formData.entryMode === 'real_space' && (
                    <div className="absolute top-3.5 right-3.5 text-purple-600 dark:text-purple-400"><CheckCircle2 className="w-5 h-5" /></div>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <Camera className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{t("createProject.realSpaceTitle")}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("createProject.realSpaceDesc")}</p>
                </div>
            </div>

            {/* Inspiration Mode */}
            <div
                onClick={() => updateForm("entryMode", "inspiration")}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer flex flex-col items-center text-center gap-4 transition-all duration-200 hover:shadow-lg ${formData.entryMode === 'inspiration' ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 shadow-md' : 'border-border hover:border-amber-400 dark:hover:border-amber-600 bg-card'}`}
            >
                {formData.entryMode === 'inspiration' && (
                    <div className="absolute top-3.5 right-3.5 text-amber-500"><CheckCircle2 className="w-5 h-5" /></div>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400">
                    <Lightbulb className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{t("createProject.inspirationTitle")}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("createProject.inspirationDesc")}</p>
                </div>
            </div>
        </div>
    );

    // Step 2 UI (Changes based on mode)
    const renderStep2 = () => {
        if (formData.entryMode === 'inspiration') {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`${cardCls} p-6 space-y-5`}>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{t("createProject.spaceDetailsHeading")}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{t("createProject.spaceDetailsSub")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("createProject.projectName")}</label>
                                <input type="text" placeholder={t("createProject.projectNamePlaceholder")} className={inputCls} value={formData.projectName} onChange={(e) => updateForm("projectName", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("createProject.totalArea")}</label>
                                <input type="text" placeholder={t("createProject.totalAreaPlaceholder")} className={inputCls} value={formData.totalArea} onChange={(e) => updateForm("totalArea", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("createProject.propertyType")}</label>
                                <select className={selectCls} value={formData.roomType} onChange={(e) => updateForm("roomType", e.target.value)}>
                                    <option value="">{t("createProject.selectPropertyType")}</option>
                                    <option value="apartment">{t("createProject.propertyApartment")}</option>
                                    <option value="house">{t("createProject.propertyHouse")}</option>
                                    <option value="studio">{t("createProject.propertyStudio")}</option>
                                    <option value="office">{t("createProject.propertyOffice")}</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("createProject.numberOfRooms")}</label>
                                <input type="number" min="1" className={inputCls} value={formData.roomsCount} onChange={(e) => updateForm("roomsCount", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const isBlueprint = formData.entryMode === 'blueprint';
        const uploadTitle = t("createProject.uploadYourSpace");
        const uploadDescription = t("createProject.uploadDescription");
        const helperText = isBlueprint ? t("createProject.helperBlueprint") : t("createProject.helperPhotos");
        const acceptedFormats = isBlueprint ? ".pdf,.jpg,.jpeg,.png" : ".jpg,.jpeg,.png";

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h2 className="text-xl font-bold text-foreground">{uploadTitle}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{uploadDescription}</p>
                </div>

                <div className={`${cardCls} p-6 space-y-6`}>
                    {/* Upload Dropzone */}
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 ${formData.uploadedFiles.length > 0 && isBlueprint ? 'border-border bg-muted/20 cursor-not-allowed hidden' : 'border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/40 dark:hover:bg-violet-950/10 cursor-pointer group'}`}
                        onClick={() => { if (!isBlueprint || formData.uploadedFiles.length === 0) fileInputRef.current?.click(); }}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept={acceptedFormats} multiple={!isBlueprint} onChange={handleFileSelect} />
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform mb-4">
                            {isBlueprint ? <FileImage className="w-8 h-8" /> : <Camera className="w-8 h-8" />}
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-1.5">
                            {isBlueprint ? t("createProject.dragDropDoc") : t("createProject.dragDropPhotos")}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-5 max-w-sm leading-relaxed">{helperText}</p>
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold text-foreground shadow-sm group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all duration-200 pointer-events-none">
                            <UploadCloud className="w-4 h-4" />
                            {t("createProject.browseFiles")}
                        </div>
                        <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {t("createProject.acceptedLabel", { formats: acceptedFormats.replace(/\./g, " ").toUpperCase() })}
                        </p>
                    </div>

                    {/* File Preview */}
                    {formData.uploadedFiles.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                {t("createProject.uploadedFiles")}
                                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[11px] font-bold px-1.5">
                                    {formData.uploadedFiles.length}
                                </span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {formData.uploadedFiles.map((fileRecord) => (
                                    <div key={fileRecord.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors relative pr-11">
                                        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 border border-border overflow-hidden flex items-center justify-center">
                                            {fileRecord.previewUrl ? (
                                                <img src={fileRecord.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{fileRecord.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(fileRecord.size)}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(fileRecord.id); }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            title={t("createProject.removeFile")}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reference Measurement (Real Space only) */}
                    {!isBlueprint && (
                        <div className="rounded-2xl border border-purple-200 dark:border-purple-800/50 bg-purple-50/60 dark:bg-purple-950/15 p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shrink-0">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">{t("createProject.referenceMeasurement")}</h4>
                                    <p className="text-xs text-purple-700 dark:text-purple-300">{t("createProject.referenceMeasurementSub")}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-semibold text-purple-900 dark:text-purple-200 uppercase tracking-wide">{t("createProject.knownLength")}</label>
                                    <input type="number" step="0.1" placeholder={t("createProject.knownLengthPlaceholder")} className="w-full h-10 px-3.5 text-sm bg-white dark:bg-slate-800/60 border border-purple-200 dark:border-purple-700 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500 transition-all duration-200" value={formData.referenceMeasurement} onChange={(e) => updateForm("referenceMeasurement", e.target.value)} />
                                </div>
                                <div className="w-1/3 space-y-1.5">
                                    <label className="text-xs font-semibold text-purple-900 dark:text-purple-200 uppercase tracking-wide">{t("createProject.unit")}</label>
                                    <select className="w-full h-10 px-3 text-sm bg-white dark:bg-slate-800/60 border border-purple-200 dark:border-purple-700 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500 transition-all duration-200 cursor-pointer" value={formData.measurementUnit} onChange={(e) => updateForm("measurementUnit", e.target.value)}>
                                        <option value="meters">{t("createProject.meters")}</option>
                                        <option value="feet">{t("createProject.feet")}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Step 3 UI
    const renderStep3 = () => {
        const designStyles: { value: string; labelKey: string }[] = [
            { value: "Modern", labelKey: "createProject.styleModern" },
            { value: "Minimalist", labelKey: "createProject.styleMinimalist" },
            { value: "Scandinavian", labelKey: "createProject.styleScandinavian" },
            { value: "Industrial", labelKey: "createProject.styleIndustrial" },
            { value: "Classic", labelKey: "createProject.styleClassic" },
            { value: "Luxury", labelKey: "createProject.styleLuxury" },
            { value: "Arabic Traditional", labelKey: "createProject.styleArabicTraditional" },
            { value: "Eco Style", labelKey: "createProject.styleEcoStyle" },
            { value: "Smart Home", labelKey: "createProject.styleSmartHome" },
        ];
        const layoutStyles: { value: string; labelKey: string }[] = [
            { value: "Open space", labelKey: "createProject.layoutOpenSpace" },
            { value: "Closed rooms", labelKey: "createProject.layoutClosedRooms" },
            { value: "Semi-open layout", labelKey: "createProject.layoutSemiOpen" },
            { value: "Open kitchen", labelKey: "createProject.layoutOpenKitchen" },
            { value: "Closed kitchen", labelKey: "createProject.layoutClosedKitchen" },
        ];
        const roomUsages: { value: string; labelKey: string }[] = [
            { value: "Family living", labelKey: "createProject.usageFamily" },
            { value: "Couple", labelKey: "createProject.usageCouple" },
            { value: "Students", labelKey: "createProject.usageStudents" },
            { value: "Elderly residents", labelKey: "createProject.usageElderly" },
            { value: "Airbnb / Rental", labelKey: "createProject.usageAirbnb" },
            { value: "Home office", labelKey: "createProject.usageHomeOffice" },
        ];
        const colorPrefs: { value: string; labelKey: string }[] = [
            { value: "Warm colors", labelKey: "createProject.warmColors" },
            { value: "Cool colors", labelKey: "createProject.coolColors" },
            { value: "Neutral palette", labelKey: "createProject.neutralPalette" },
        ];
        const budgets: { value: string; labelKey: string }[] = [
            { value: "Economy", labelKey: "createProject.budgetEconomy" },
            { value: "Medium", labelKey: "createProject.budgetMedium" },
            { value: "Luxury", labelKey: "createProject.budgetLuxury" },
        ];
        const furnitureOpts: { value: string; labelKey: string }[] = [
            { value: "Space-saving", labelKey: "createProject.furnitureSpaceSaving" },
            { value: "Practical", labelKey: "createProject.furniturePractical" },
            { value: "Luxury", labelKey: "createProject.furnitureLuxury" },
            { value: "Smart", labelKey: "createProject.furnitureSmart" },
            { value: "Foldable", labelKey: "createProject.furnitureFoldable" },
        ];

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h2 className="text-xl font-bold text-foreground">{t("createProject.designPreferencesTitle")}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t("createProject.designPreferencesSub")}</p>
                </div>

                {/* Style & Layout */}
                <div className={`${cardCls} p-6 space-y-6`}>
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Paintbrush className="text-violet-500 w-4 h-4" /> {t("createProject.lookAndFeel")}
                    </h3>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("createProject.designStyle")}</label>
                        <div className="flex flex-wrap gap-2">
                            {designStyles.map(({ value: style, labelKey }) => (
                                <button
                                    key={style}
                                    type="button"
                                    onClick={() => updateForm("designStyle", style)}
                                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${formData.designStyle === style ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30' : 'bg-muted text-muted-foreground hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 border border-border'}`}
                                >
                                    {t(labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Layers className="text-muted-foreground w-4 h-4" /> {t("createProject.layoutStyle")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {layoutStyles.map(({ value: layout, labelKey }) => (
                                <button
                                    key={layout}
                                    type="button"
                                    onClick={() => updateForm("layoutStyle", layout)}
                                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${formData.layoutStyle === layout ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30' : 'bg-muted text-muted-foreground hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 border border-border'}`}
                                >
                                    {t(labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Colors & Budget */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className={`${cardCls} p-6 space-y-4`}>
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                            <Palette className="text-pink-500 w-4 h-4" /> {t("createProject.colors")}
                        </h3>
                        <div className="space-y-2.5">
                            {colorPrefs.map(({ value: color, labelKey }) => (
                                <label key={color} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${formData.colorPreference === color ? 'border-violet-300 dark:border-violet-700 bg-violet-50/60 dark:bg-violet-950/20' : 'border-border hover:bg-muted/50'}`}>
                                    <input type="radio" name="colorPref" checked={formData.colorPreference === color} onChange={() => updateForm("colorPreference", color)} className="w-4 h-4 text-violet-600 accent-violet-600" />
                                    <span className="text-sm font-medium text-foreground">{t(labelKey)}</span>
                                </label>
                            ))}
                            <div className="flex items-center gap-3 mt-1 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                                <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" value={formData.customColor} onChange={(e) => { updateForm("colorPreference", "Custom"); updateForm("customColor", e.target.value) }} />
                                <span className="text-sm font-medium text-foreground">{t("createProject.customSelection")}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${cardCls} p-6 space-y-4`}>
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                            <Wallet className="text-emerald-500 w-4 h-4" /> {t("createProject.budget")}
                        </h3>
                        <div className="space-y-2.5">
                            {budgets.map(({ value: b, labelKey }) => (
                                <label key={b} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${formData.budget === b ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-border hover:bg-muted/50'}`}>
                                    <input type="radio" name="budget" checked={formData.budget === b} onChange={() => updateForm("budget", b)} className="w-4 h-4 text-emerald-600 accent-emerald-600" />
                                    <span className="text-sm font-medium text-foreground">{t(labelKey)}</span>
                                </label>
                            ))}
                            <input
                                type="text"
                                placeholder={t("createProject.customBudgetPlaceholder")}
                                className={inputCls}
                                value={formData.customBudget}
                                onChange={(e) => { updateForm("budget", "Custom"); updateForm("customBudget", e.target.value) }}
                            />
                        </div>
                    </div>
                </div>

                {/* Usage & Furniture */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className={`${cardCls} p-6 space-y-4`}>
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                            <Users className="text-orange-500 w-4 h-4" /> {t("createProject.roomUsage")}
                        </h3>
                        <select className={selectCls} value={formData.roomUsage} onChange={(e) => updateForm("roomUsage", e.target.value)}>
                            <option value="">{t("createProject.selectIntendedUse")}</option>
                            {roomUsages.map(({ value: u, labelKey }) => (
                                <option key={u} value={u}>{t(labelKey)}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`${cardCls} p-6 space-y-4`}>
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                            <Sofa className="text-teal-500 w-4 h-4" /> {t("createProject.furniture")}
                        </h3>
                        <select className={selectCls} value={formData.furniturePreference} onChange={(e) => updateForm("furniturePreference", e.target.value)}>
                            <option value="">{t("createProject.selectFurniturePref")}</option>
                            {furnitureOpts.map(({ value: fv, labelKey }) => (
                                <option key={fv} value={fv}>{t(labelKey)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    // Step 4 UI
    const renderStep4 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`${cardCls} overflow-hidden`}>
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white relative">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-1">{t("createProject.reviewTitle")}</h2>
                        <p className="text-violet-100 text-sm">{t("createProject.reviewSub")}</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="space-y-5">
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> {t("createProject.globalSettings")}
                                </h4>
                                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("createProject.entryMode")}</span>
                                        <span className="text-sm font-semibold text-foreground capitalize px-2.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">{formData.entryMode.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            {formData.uploadedFiles.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <UploadCloud className="w-3.5 h-3.5" /> {t("createProject.spaceSources")}
                                    </h4>
                                    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
                                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.uploadedFiles")}</span> <span className="text-sm font-medium text-foreground">{t("createProject.uploadedFilesCount", { count: formData.uploadedFiles.length })}</span></div>
                                        {formData.referenceMeasurement && (
                                            <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.knownRef")}</span> <span className="text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">{formData.referenceMeasurement} {formData.measurementUnit}</span></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formData.entryMode === 'inspiration' && (
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <Settings className="w-3.5 h-3.5" /> {t("createProject.spaceDetailsSection")}
                                    </h4>
                                    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
                                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.projectName")}</span> <span className="text-sm font-medium text-foreground">{formData.projectName || t("createProject.untitled")}</span></div>
                                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.type")}</span> <span className="text-sm font-medium text-foreground capitalize">{formData.roomType || "-"}</span></div>
                                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.area")}</span> <span className="text-sm font-medium text-foreground">{formData.totalArea || "-"}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Paintbrush className="w-3.5 h-3.5" /> {t("createProject.designPreferencesSection")}
                                </h4>
                                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
                                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.style")}</span> <span className="text-sm font-medium text-foreground">{formData.designStyle || "-"}</span></div>
                                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.layout")}</span> <span className="text-sm font-medium text-foreground">{formData.layoutStyle || "-"}</span></div>
                                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.usage")}</span> <span className="text-sm font-medium text-foreground">{formData.roomUsage || "-"}</span></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("createProject.colorPalette")}</span>
                                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            {formData.colorPreference === 'Custom' && (
                                                <span className="inline-block w-4 h-4 rounded-full border border-border" style={{ backgroundColor: formData.customColor }} />
                                            )}
                                            {formData.colorPreference === "Custom" ? t("createProject.customSelection") : formData.colorPreference || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.furniture")}</span> <span className="text-sm font-medium text-foreground">{formData.furniturePreference || "-"}</span></div>
                                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">{t("createProject.budget")}</span> <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-0.5 rounded-full">{formData.budget === 'Custom' ? formData.customBudget : formData.budget || "-"}</span></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );

    const stepLabels = getStepLabels();

    return (
        <div className="p-4 md:p-8 pb-12 max-w-5xl mx-auto min-h-screen animate-in fade-in duration-500">
            {/* Step 1 header */}
            {step === 1 && (
                <div className="mb-10 text-center space-y-3 animate-in slide-in-from-top-4 duration-500">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{t("createProject.title")}</h1>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t("createProject.subtitle")}</p>
                </div>
            )}

            {/* Progress Indicator */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    {/* Track */}
                    <div className="absolute left-0 top-6 w-full h-0.5 bg-border hidden md:block" />
                    <div
                        className="absolute left-0 top-6 h-0.5 bg-violet-600 hidden md:block transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                    />
                    {stepLabels.map((s) => (
                        <div key={s.num} className="relative z-10 flex flex-col items-center gap-2.5">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold border-4 transition-all duration-300 ${step >= s.num
                                    ? 'bg-violet-600 border-violet-100 dark:border-violet-900 text-white shadow-lg shadow-violet-500/25'
                                    : 'bg-card border-border text-muted-foreground'
                                }`}
                            >
                                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                            </div>
                            <span className={`text-xs font-semibold hidden md:block transition-colors ${step >= s.num ? 'text-violet-700 dark:text-violet-300' : 'text-muted-foreground'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Steps */}
            <div className="mb-10">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
                <button
                    onClick={() => setPage("dashboard")}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    {t("createProject.cancelProject")}
                </button>

                <div className="flex items-center gap-3">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground bg-card border border-border hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> {t("createProject.back")}
                        </button>
                    )}

                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            disabled={(step === 1 && !formData.entryMode) || (step === 2 && !isUploadStepValid())}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${((step === 1 && !formData.entryMode) || (step === 2 && !isUploadStepValid()))
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30'
                            }`}
                        >
                            {t("createProject.nextStep")} <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
                        >
                            {t("createProject.generateAiDesigns")} <Lightbulb className="w-4 h-4 fill-current" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
