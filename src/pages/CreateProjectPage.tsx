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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Blueprint Mode */}
                <div
                    onClick={() => updateForm("entryMode", "blueprint")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${formData.entryMode === 'blueprint' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'}`}
                >
                    {formData.entryMode === 'blueprint' && <div className="absolute top-4 right-4 text-blue-600"><CheckCircle2 className="w-6 h-6" /></div>}
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                        <FileImage className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t("createProject.blueprintTitle")}</h3>
                    <p className="text-sm text-gray-500 px-2">{t("createProject.blueprintDesc")}</p>
                </div>

                {/* Real Space Mode */}
                <div
                    onClick={() => updateForm("entryMode", "real_space")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${formData.entryMode === 'real_space' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200 hover:border-purple-300 hover:shadow-md bg-white'}`}
                >
                    {formData.entryMode === 'real_space' && <div className="absolute top-4 right-4 text-purple-600"><CheckCircle2 className="w-6 h-6" /></div>}
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                        <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t("createProject.realSpaceTitle")}</h3>
                    <p className="text-sm text-gray-500 px-2">{t("createProject.realSpaceDesc")}</p>
                </div>

                {/* Inspiration Mode */}
                <div
                    onClick={() => updateForm("entryMode", "inspiration")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${formData.entryMode === 'inspiration' ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 hover:border-amber-300 hover:shadow-md bg-white'}`}
                >
                    {formData.entryMode === 'inspiration' && <div className="absolute top-4 right-4 text-amber-500"><CheckCircle2 className="w-6 h-6" /></div>}
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-2">
                        <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t("createProject.inspirationTitle")}</h3>
                    <p className="text-sm text-gray-500 px-2">{t("createProject.inspirationDesc")}</p>
                </div>
            </div>
        </div>
    );

    // Step 2 UI (Changes based on mode)
    const renderStep2 = () => {
        if (formData.entryMode === 'inspiration') {
            // Render basic space details form for inspiration mode
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{t("createProject.spaceDetailsHeading")}</h2>
                            <p className="text-gray-500 mt-2">{t("createProject.spaceDetailsSub")}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t("createProject.projectName")}</label>
                                <input
                                    type="text"
                                    placeholder={t("createProject.projectNamePlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    value={formData.projectName}
                                    onChange={(e) => updateForm("projectName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t("createProject.totalArea")}</label>
                                <input
                                    type="text"
                                    placeholder={t("createProject.totalAreaPlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    value={formData.totalArea}
                                    onChange={(e) => updateForm("totalArea", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t("createProject.propertyType")}</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
                                    value={formData.roomType}
                                    onChange={(e) => updateForm("roomType", e.target.value)}
                                >
                                    <option value="">{t("createProject.selectPropertyType")}</option>
                                    <option value="apartment">{t("createProject.propertyApartment")}</option>
                                    <option value="house">{t("createProject.propertyHouse")}</option>
                                    <option value="studio">{t("createProject.propertyStudio")}</option>
                                    <option value="office">{t("createProject.propertyOffice")}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t("createProject.numberOfRooms")}</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    value={formData.roomsCount}
                                    onChange={(e) => updateForm("roomsCount", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const isBlueprint = formData.entryMode === 'blueprint';
        const uploadTitle = t("createProject.uploadYourSpace");
        const uploadDescription = t("createProject.uploadDescription");
        const helperText = isBlueprint
            ? t("createProject.helperBlueprint")
            : t("createProject.helperPhotos");
        const acceptedFormats = isBlueprint ? ".pdf,.jpg,.jpeg,.png" : ".jpg,.jpeg,.png";

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">{uploadTitle}</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">{uploadDescription}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                    {/* Upload Dropzone */}
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${formData.uploadedFiles.length > 0 && isBlueprint ? 'border-gray-200 bg-gray-50 cursor-not-allowed hidden' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer group'}`}
                        onClick={() => { if (!isBlueprint || formData.uploadedFiles.length === 0) fileInputRef.current?.click() }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept={acceptedFormats}
                            multiple={!isBlueprint}
                            onChange={handleFileSelect}
                        />
                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 group-hover:scale-110 transition-transform mb-6 shadow-sm border border-blue-100">
                            {isBlueprint ? <FileImage className="w-10 h-10" /> : <Camera className="w-10 h-10" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isBlueprint ? t("createProject.dragDropDoc") : t("createProject.dragDropPhotos")}
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            {helperText}
                        </p>
                        <div className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors pointer-events-none">
                            {t("createProject.browseFiles")}
                        </div>
                        <div className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
                            {t("createProject.acceptedLabel", { formats: acceptedFormats.replace(/\./g, " ").toUpperCase() })}
                        </div>
                    </div>

                    {/* File Preview Grid */}
                    {formData.uploadedFiles.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                                <span>{t("createProject.uploadedFiles")} <span className="text-gray-500 text-sm font-normal ml-2">({formData.uploadedFiles.length})</span></span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {formData.uploadedFiles.map((fileRecord) => (
                                    <div key={fileRecord.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow group relative pr-12">
                                        {/* Thumbnail */}
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {fileRecord.previewUrl ? (
                                                <img src={fileRecord.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>

                                        {/* File Info */}
                                        <div className="overflow-hidden">
                                            <p className="font-semibold text-gray-900 truncate" title={fileRecord.name}>{fileRecord.name}</p>
                                            <p className="text-sm text-gray-500">{formatFileSize(fileRecord.size)}</p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(fileRecord.id); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title={t("createProject.removeFile")}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reference Measurement (Only for Real Space Mode) */}
                    {!isBlueprint && (
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Settings className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{t("createProject.referenceMeasurement")}</h4>
                                    <p className="text-sm text-purple-700">{t("createProject.referenceMeasurementSub")}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-bold text-purple-900 uppercase">{t("createProject.knownLength")}</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder={t("createProject.knownLengthPlaceholder")}
                                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-white"
                                        value={formData.referenceMeasurement}
                                        onChange={(e) => updateForm("referenceMeasurement", e.target.value)}
                                    />
                                </div>
                                <div className="w-1/3 space-y-2">
                                    <label className="text-xs font-bold text-purple-900 uppercase">{t("createProject.unit")}</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-white"
                                        value={formData.measurementUnit}
                                        onChange={(e) => updateForm("measurementUnit", e.target.value)}
                                    >
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">{t("createProject.designPreferencesTitle")}</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">{t("createProject.designPreferencesSub")}</p>
                </div>

                {/* Style & Layout */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Paintbrush className="text-blue-500 w-5 h-5" /> {t("createProject.lookAndFeel")}
                    </h3>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700">{t("createProject.designStyle")}</label>
                        <div className="flex flex-wrap gap-3">
                            {designStyles.map(({ value: style, labelKey }) => (
                                <button
                                    key={style}
                                    type="button"
                                    onClick={() => updateForm("designStyle", style)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.designStyle === style ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {t(labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Layers className="text-gray-400 w-4 h-4" /> {t("createProject.layoutStyle")}
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {layoutStyles.map(({ value: layout, labelKey }) => (
                                <button
                                    key={layout}
                                    type="button"
                                    onClick={() => updateForm("layoutStyle", layout)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.layoutStyle === layout ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {t(labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Colors & Budget */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Palette className="text-pink-500 w-5 h-5" /> {t("createProject.colors")}
                        </h3>
                        <div className="space-y-4">
                            {colorPrefs.map(({ value: color, labelKey }) => (
                                <label key={color} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="colorPref" checked={formData.colorPreference === color} onChange={() => updateForm("colorPreference", color)} className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-700">{t(labelKey)}</span>
                                </label>
                            ))}
                            <div className="flex items-center gap-4 mt-4 p-3 rounded-xl border border-gray-200">
                                <input type="color" className="w-10 h-10 rounded cursor-pointer" value={formData.customColor} onChange={(e) => { updateForm("colorPreference", "Custom"); updateForm("customColor", e.target.value) }} />
                                <span className="font-medium text-gray-700">{t("createProject.customSelection")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Wallet className="text-emerald-500 w-5 h-5" /> {t("createProject.budget")}
                        </h3>
                        <div className="space-y-4">
                            {budgets.map(({ value: b, labelKey }) => (
                                <label key={b} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="budget" checked={formData.budget === b} onChange={() => updateForm("budget", b)} className="w-5 h-5 text-emerald-600" />
                                    <span className="font-medium text-gray-700">{t(labelKey)}</span>
                                </label>
                            ))}
                            <div>
                                <input
                                    type="text"
                                    placeholder={t("createProject.customBudgetPlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    value={formData.customBudget}
                                    onChange={(e) => { updateForm("budget", "Custom"); updateForm("customBudget", e.target.value) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage & Furniture */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users className="text-orange-500 w-5 h-5" /> {t("createProject.roomUsage")}
                        </h3>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
                            value={formData.roomUsage}
                            onChange={(e) => updateForm("roomUsage", e.target.value)}
                        >
                            <option value="">{t("createProject.selectIntendedUse")}</option>
                            {roomUsages.map(({ value: u, labelKey }) => (
                                <option key={u} value={u}>{t(labelKey)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Sofa className="text-teal-500 w-5 h-5" /> {t("createProject.furniture")}
                        </h3>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
                            value={formData.furniturePreference}
                            onChange={(e) => updateForm("furniturePreference", e.target.value)}
                        >
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">{t("createProject.reviewTitle")}</h2>
                        <p className="text-blue-100">{t("createProject.reviewSub")}</p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> {t("createProject.globalSettings")}
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                    <div className="flex justify-between items-center"><span className="text-gray-500">{t("createProject.entryMode")}</span> <span className="font-semibold text-gray-900 capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">{formData.entryMode.replace('_', ' ')}</span></div>
                                </div>
                            </div>

                            {formData.uploadedFiles.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <UploadCloud className="w-4 h-4" /> {t("createProject.spaceSources")}
                                    </h4>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                        <div className="flex justify-between"><span className="text-gray-500">{t("createProject.uploadedFiles")}</span> <span className="font-medium text-gray-900">{t("createProject.uploadedFilesCount", { count: formData.uploadedFiles.length })}</span></div>
                                        {formData.referenceMeasurement && (
                                            <div className="flex justify-between"><span className="text-gray-500">{t("createProject.knownRef")}</span> <span className="font-medium text-purple-700 bg-purple-100 px-2 rounded">{formData.referenceMeasurement} {formData.measurementUnit}</span></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formData.entryMode === 'inspiration' && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Settings className="w-4 h-4" /> {t("createProject.spaceDetailsSection")}
                                    </h4>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                        <div className="flex justify-between"><span className="text-gray-500">{t("createProject.projectName")}</span> <span className="font-medium text-gray-900">{formData.projectName || t("createProject.untitled")}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">{t("createProject.type")}</span> <span className="font-medium text-gray-900 capitalize">{formData.roomType || "-"}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">{t("createProject.area")}</span> <span className="font-medium text-gray-900">{formData.totalArea || "-"}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Paintbrush className="w-4 h-4" /> {t("createProject.designPreferencesSection")}
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                    <div className="flex justify-between"><span className="text-gray-500">{t("createProject.style")}</span> <span className="font-medium text-gray-900">{formData.designStyle || "-"}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">{t("createProject.layout")}</span> <span className="font-medium text-gray-900">{formData.layoutStyle || "-"}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">{t("createProject.usage")}</span> <span className="font-medium text-gray-900">{formData.roomUsage || "-"}</span></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">{t("createProject.colorPalette")}</span>
                                        <span className="flex items-center gap-2 font-medium text-gray-900">
                                            {formData.colorPreference === 'Custom' ? (
                                                <span className="w-4 h-4 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: formData.customColor }}></span>
                                            ) : null}
                                            {formData.colorPreference === "Custom" ? t("createProject.customSelection") : formData.colorPreference || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between"><span className="text-gray-500">{t("createProject.furniture")}</span> <span className="font-medium text-gray-900">{formData.furniturePreference || "-"}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">{t("createProject.budget")}</span> <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{formData.budget === 'Custom' ? formData.customBudget : formData.budget || "-"}</span></div>
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans overflow-x-hidden">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header content (Only Step 1 usually has this text, but I will keep it for consistency from original) */}
                {step === 1 && (
                    <div className="mb-10 text-center space-y-4 animate-in slide-in-from-top-4 duration-500">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t("createProject.title")}</h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            {t("createProject.subtitle")}
                        </p>
                    </div>
                )}

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 hidden md:block rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 hidden md:block transition-all duration-500 rounded-full"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>

                        {stepLabels.map((s) => (
                            <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-300 ${step >= s.num
                                        ? 'bg-blue-600 border-blue-100 text-white shadow-lg'
                                        : 'bg-white border-gray-200 text-gray-400'
                                        }`}
                                >
                                    {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
                                </div>
                                <span className={`text-sm font-semibold hidden md:block transition-colors ${step >= s.num ? 'text-blue-900' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Render Form Steps */}
                <div className="mb-12">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                        <button
                            onClick={() => setPage("dashboard")}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            {t("createProject.cancelProject")}
                        </button>
                    </div>
                    <div className="flex gap-4">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-2 outline-none"
                            >
                                <ChevronLeft className="w-5 h-5" /> {t("createProject.back")}
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                disabled={(step === 1 && !formData.entryMode) || (step === 2 && !isUploadStepValid())}
                                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all outline-none ${((step === 1 && !formData.entryMode) || (step === 2 && !isUploadStepValid()))
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg shadow-blue-500/30'
                                    }`}
                            >
                                {t("createProject.nextStep")} <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 outline-none"
                            >
                                {t("createProject.generateAiDesigns")} <Lightbulb className="w-5 h-5 fill-current" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
