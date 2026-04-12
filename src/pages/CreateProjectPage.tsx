import { useDemoDashboard } from "@/context/DemoDashboardContext";
import { getDefaultCoverForMode } from "@/lib/demo-dashboard-storage";
import { useState, useRef } from "react";
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
    const { addProjectFromWizard } = useDemoDashboard();
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

    const handleGenerate = () => {
        const fromFile = formData.uploadedFiles[0]?.name.replace(/\.[^.]+$/, "");
        const name =
            formData.projectName.trim() ||
            fromFile ||
            "New project";

        const coverImageUrl =
            formData.uploadedFiles[0]?.previewUrl ||
            getDefaultCoverForMode(formData.entryMode);

        addProjectFromWizard({
            name,
            coverImageUrl,
            preferences: {
                budget: formData.budget,
                customBudget: formData.customBudget,
                designStyle: formData.designStyle,
                colorPreference: formData.colorPreference,
                customColor: formData.customColor,
                roomUsage: formData.roomUsage,
                furniturePreference: formData.furniturePreference,
                layoutStyle: formData.layoutStyle,
                entryMode: formData.entryMode,
            },
        });

        setTimeout(() => {
            setPage("ai-processing");
        }, 300);
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
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
                { num: 1, label: "Mode Selection" },
                { num: 2, label: "Upload Files" },
                { num: 3, label: "Design Preferences" },
                { num: 4, label: "Review & Generate" },
            ];
        }
        return [
            { num: 1, label: "Mode Selection" },
            { num: 2, label: "Space Details" },
            { num: 3, label: "Design Preferences" },
            { num: 4, label: "Review & Generate" },
        ];
    };

    // Step 1 UI
    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="d-grid row-cols-md-3 gap-5">
                {/* Blueprint Mode */}
                <div
                    onClick={() => updateForm("entryMode", "blueprint")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${formData.entryMode === 'blueprint' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'}`}
                >
                    {formData.entryMode === 'blueprint' && <div className="absolute top-4 right-4 text-blue-600"><CheckCircle2 className="w-6 h-6" /></div>}
                    <div className="w-16 h-16 rounded-circle bg-blue-100 d-flex align-items-center justify-content-center text-blue-600 mb-2">
                        <FileImage className="w-8 h-8" />
                    </div>
                    <h3 className="fs-4 fw-bold text-gray-900">Blueprint Mode</h3>
                    <p className="fs-6 text-muted text-gray-500 px-2">Upload an architectural blueprint or floor plan in PDF or image format. AI will analyze dimensions.</p>
                </div>

                {/* Real Space Mode */}
                <div
                    onClick={() => updateForm("entryMode", "real_space")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${formData.entryMode === 'real_space' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200 hover:border-purple-300 hover:shadow-md bg-white'}`}
                >
                    {formData.entryMode === 'real_space' && <div className="absolute top-4 right-4 text-purple-600"><CheckCircle2 className="w-6 h-6" /></div>}
                    <div className="w-16 h-16 rounded-circle bg-purple-100 d-flex align-items-center justify-content-center text-purple-600 mb-2">
                        <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="fs-4 fw-bold text-gray-900">Real Space Mode</h3>
                    <p className="fs-6 text-muted text-gray-500 px-2">Upload photos of an existing room or space. AI will estimate dimensions based on images.</p>
                </div>

                {/* Inspiration Mode */}
                <div
                    onClick={() => updateForm("entryMode", "inspiration")}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${formData.entryMode === 'inspiration' ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 hover:border-amber-300 hover:shadow-md bg-white'}`}
                >
                    {formData.entryMode === 'inspiration' && <div className="absolute top-4 right-4 text-amber-500"><CheckCircle2 className="w-6 h-6" /></div>}
                    <div className="w-16 h-16 rounded-circle bg-amber-100 d-flex align-items-center justify-content-center text-amber-500 mb-2">
                        <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="fs-4 fw-bold text-gray-900">Inspiration Mode</h3>
                    <p className="fs-6 text-muted text-gray-500 px-2">Start without images. Enter space details and preferences, and AI will generate conceptual ideas.</p>
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
                    <div className="bg-white p-5 rounded-4 border border-gray-200 shadow-sm space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="fs-3 fw-bold text-gray-900">Space Details</h2>
                            <p className="text-gray-500 mt-2">Provide the dimensions and purpose of your new space.</p>
                        </div>

                        <div className="d-grid row-cols-md-2 gap-5">
                            <div className="space-y-2">
                                <label className="fs-6 text-muted fw-medium text-gray-700">Project Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. My Dream Living Room"
                                    className="w-100 px-3 py-3 rounded-4 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    value={formData.projectName}
                                    onChange={(e) => updateForm("projectName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="fs-6 text-muted fw-medium text-gray-700">Total Area (m² or sqft)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 45 m²"
                                    className="w-100 px-3 py-3 rounded-4 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    value={formData.totalArea}
                                    onChange={(e) => updateForm("totalArea", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="fs-6 text-muted fw-medium text-gray-700">Property Type</label>
                                <select
                                    className="w-100 px-3 py-3 rounded-4 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
                                    value={formData.roomType}
                                    onChange={(e) => updateForm("roomType", e.target.value)}
                                >
                                    <option value="">Select Property Type...</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="studio">Studio</option>
                                    <option value="office">Office</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="fs-6 text-muted fw-medium text-gray-700">Number of Rooms</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-100 px-3 py-3 rounded-4 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
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
        const uploadTitle = "Upload Your Space";
        const uploadDescription = "Upload your blueprint or room photos so SmartPlan AI can analyze your space and generate optimized layouts.";
        const helperText = isBlueprint
            ? "Upload a clear floor plan so the AI can analyze the layout and structure."
            : "Upload photos from different angles so the AI can better understand the space.";
        const acceptedFormats = isBlueprint ? ".pdf,.jpg,.jpeg,.png" : ".jpg,.jpeg,.png";

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="fs-2 fw-bold text-gray-900">{uploadTitle}</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">{uploadDescription}</p>
                </div>

                <div className="bg-white p-5 rounded-4 border border-gray-200 shadow-sm space-y-8">
                    {/* Upload Dropzone */}
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${formData.uploadedFiles.length > 0 && isBlueprint ? 'border-gray-200 bg-gray-50 cursor-not-allowed hidden' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer group'}`}
                        onClick={() => { if (!isBlueprint || formData.uploadedFiles.length === 0) fileInputRef.current?.click() }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept={acceptedFormats}
                            multiple={!isBlueprint}
                            onChange={handleFileSelect}
                        />
                        <div className="w-20 h-20 rounded-circle bg-blue-50 d-flex align-items-center justify-content-center text-blue-500 group-hover:bg-blue-100 group-hover:scale-110 transition-transform mb-6 shadow-sm border border-blue-100">
                            {isBlueprint ? <FileImage className="w-10 h-10" /> : <Camera className="w-10 h-10" />}
                        </div>
                        <h3 className="fs-4 fw-bold text-gray-900 mb-2">
                            Drag & drop your {isBlueprint ? 'document' : 'photos'} here
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            {helperText}
                        </p>
                        <div className="px-4 py-3 bg-white border border-gray-300 rounded-4 fw-semibold text-gray-700 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors pointer-events-none">
                            Browse Files
                        </div>
                        <div className="mt-4 small fw-medium text-gray-400 uppercase tracking-wide">
                            Accepted: {acceptedFormats.replace(/\./g, ' ').toUpperCase()} • MAX 15MB
                        </div>
                    </div>

                    {/* File Preview Grid */}
                    {formData.uploadedFiles.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="fs-5 fw-bold text-gray-900 d-flex align-items-center justify-content-between">
                                <span>Uploaded Files <span className="text-gray-500 fs-6 text-muted font-normal ml-2">({formData.uploadedFiles.length})</span></span>
                            </h4>
                            <div className="d-grid row-cols-1 sm:grid-cols-2 gap-4">
                                {formData.uploadedFiles.map((fileRecord) => (
                                    <div key={fileRecord.id} className="d-flex align-items-center gap-4 p-3 rounded-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow group relative pr-12">
                                        {/* Thumbnail */}
                                        <div className="w-16 h-16 rounded-3 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center">
                                            {fileRecord.previewUrl ? (
                                                <img src={fileRecord.previewUrl} alt="preview" className="w-100 h-100 object-cover" />
                                            ) : (
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>

                                        {/* File Info */}
                                        <div className="overflow-hidden">
                                            <p className="fw-semibold text-gray-900 truncate" title={fileRecord.name}>{fileRecord.name}</p>
                                            <p className="fs-6 text-muted text-gray-500">{formatFileSize(fileRecord.size)}</p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(fileRecord.id); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-3 transition-colors"
                                            title="Remove File"
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
                        <div className="bg-purple-50 p-4 rounded-4 border border-purple-100 space-y-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-3 text-purple-600"><Settings className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="fs-5 fw-bold text-gray-900">Reference Measurement</h4>
                                    <p className="fs-6 text-muted text-purple-700">Provide one known dimension to help the AI scale accurately.</p>
                                </div>
                            </div>

                            <div className="d-flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="small fw-bold text-purple-900 uppercase">Known Length</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 4.5"
                                        className="w-100 px-3 py-3 rounded-4 border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-white"
                                        value={formData.referenceMeasurement}
                                        onChange={(e) => updateForm("referenceMeasurement", e.target.value)}
                                    />
                                </div>
                                <div className="w-1/3 space-y-2">
                                    <label className="small fw-bold text-purple-900 uppercase">Unit</label>
                                    <select
                                        className="w-100 px-3 py-3 rounded-4 border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-white"
                                        value={formData.measurementUnit}
                                        onChange={(e) => updateForm("measurementUnit", e.target.value)}
                                    >
                                        <option value="meters">Meters (m)</option>
                                        <option value="feet">Feet (ft)</option>
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
        const designStyles = ["Modern", "Minimalist", "Scandinavian", "Industrial", "Classic", "Luxury", "Arabic Traditional", "Eco Style", "Smart Home"];
        const layoutStyles = ["Open space", "Closed rooms", "Semi-open layout", "Open kitchen", "Closed kitchen"];
        const roomUsages = ["Family living", "Couple", "Students", "Elderly residents", "Airbnb / Rental", "Home office"];

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="fs-2 fw-bold text-gray-900">Design Preferences</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Customize how the AI generates the layout and visual style for your space.</p>
                </div>

                {/* Style & Layout */}
                <div className="bg-white p-5 rounded-4 border border-gray-200 shadow-sm space-y-6">
                    <h3 className="fs-4 fw-bold text-gray-900 d-flex align-items-center gap-2">
                        <Paintbrush className="text-blue-500 w-5 h-5" /> Look & Feel
                    </h3>

                    <div className="space-y-4">
                        <label className="fs-6 text-muted fw-medium text-gray-700">Design Style</label>
                        <div className="d-flex flex-wrap gap-3">
                            {designStyles.map(style => (
                                <button
                                    key={style}
                                    onClick={() => updateForm("designStyle", style)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.designStyle === style ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="fs-6 text-muted fw-medium text-gray-700 d-flex align-items-center gap-2">
                            <Layers className="text-gray-400 w-4 h-4" /> Layout Style
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                            {layoutStyles.map(layout => (
                                <button
                                    key={layout}
                                    onClick={() => updateForm("layoutStyle", layout)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.layoutStyle === layout ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {layout}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Colors & Budget */}
                <div className="d-grid row-cols-md-2 gap-5">
                    <div className="bg-white p-5 rounded-4 border border-gray-200 shadow-sm space-y-6">
                        <h3 className="fs-4 fw-bold text-gray-900 d-flex align-items-center gap-2">
                            <Palette className="text-pink-500 w-5 h-5" /> Colors
                        </h3>
                        <div className="space-y-4">
                            {["Warm colors", "Cool colors", "Neutral palette"].map(color => (
                                <label key={color} className="d-flex align-items-center gap-3 p-3 rounded-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="colorPref" checked={formData.colorPreference === color} onChange={() => updateForm("colorPreference", color)} className="w-5 h-5 text-blue-600" />
                                    <span className="fw-medium text-gray-700">{color}</span>
                                </label>
                            ))}
                            <div className="d-flex align-items-center gap-4 mt-4 p-3 rounded-4 border border-gray-200">
                                <input type="color" className="w-10 h-10 rounded cursor-pointer" value={formData.customColor} onChange={(e) => { updateForm("colorPreference", "Custom"); updateForm("customColor", e.target.value) }} />
                                <span className="fw-medium text-gray-700">Custom selection</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-4 border border-gray-200 shadow-sm space-y-6">
                        <h3 className="fs-4 fw-bold text-gray-900 d-flex align-items-center gap-2">
                            <Wallet className="text-emerald-500 w-5 h-5" /> Budget
                        </h3>
                        <div className="space-y-4">
                            {["Economy", "Medium", "Luxury"].map(b => (
                                <label key={b} className="d-flex align-items-center gap-3 p-3 rounded-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="budget" checked={formData.budget === b} onChange={() => updateForm("budget", b)} className="w-5 h-5 text-emerald-600" />
                                    <span className="fw-medium text-gray-700">{b}</span>
                                </label>
                            ))}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Custom budget (e.g. $10,000)"
                                    className="w-100 px-3 py-3 rounded-4 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    value={formData.customBudget}
                                    onChange={(e) => { updateForm("budget", "Custom"); updateForm("customBudget", e.target.value) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage & Furniture */}
                <div className="d-grid row-cols-md-2 gap-5">
                    <div className="bg-white p-4 rounded-4 border border-gray-200 shadow-sm space-y-4">
                        <h3 className="fs-5 fw-bold text-gray-900 d-flex align-items-center gap-2">
                            <Users className="text-orange-500 w-5 h-5" /> Room Usage
                        </h3>
                        <select
                            className="w-100 px-3 py-3 rounded-4 border border-gray-200 bg-white"
                            value={formData.roomUsage}
                            onChange={(e) => updateForm("roomUsage", e.target.value)}
                        >
                            <option value="">Select intended use...</option>
                            {roomUsages.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-4 border border-gray-200 shadow-sm space-y-4">
                        <h3 className="fs-5 fw-bold text-gray-900 d-flex align-items-center gap-2">
                            <Sofa className="text-teal-500 w-5 h-5" /> Furniture
                        </h3>
                        <select
                            className="w-100 px-3 py-3 rounded-4 border border-gray-200 bg-white"
                            value={formData.furniturePreference}
                            onChange={(e) => updateForm("furniturePreference", e.target.value)}
                        >
                            <option value="">Select preference...</option>
                            <option value="Space-saving">Space-saving</option>
                            <option value="Practical">Practical</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Smart">Smart</option>
                            <option value="Foldable">Foldable</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    // Step 4 UI
    const renderStep4 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-4 border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <h2 className="fs-2 fw-bold mb-2">Review & Generate</h2>
                        <p className="text-blue-100">Please review your project details before the AI starts generating designs.</p>
                    </div>
                </div>

                <div className="p-5">
                    <div className="d-grid row-cols-md-2 gap-y-8 gap-x-12">

                        <div className="space-y-6">
                            <div>
                                <h4 className="fs-6 text-muted fw-semibold text-gray-500 uppercase tracking-wider mb-3 d-flex align-items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Global Settings
                                </h4>
                                <div className="bg-gray-50 rounded-4 p-3 space-y-3 border border-gray-100">
                                    <div className="d-flex justify-content-between align-items-center"><span className="text-gray-500">Entry Mode</span> <span className="fw-semibold text-gray-900 capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded-2 fs-6 text-muted">{formData.entryMode.replace('_', ' ')}</span></div>
                                </div>
                            </div>

                            {formData.uploadedFiles.length > 0 && (
                                <div>
                                    <h4 className="fs-6 text-muted fw-semibold text-gray-500 uppercase tracking-wider mb-3 d-flex align-items-center gap-2">
                                        <UploadCloud className="w-4 h-4" /> Space Sources
                                    </h4>
                                    <div className="bg-gray-50 rounded-4 p-3 space-y-3 border border-gray-100">
                                        <div className="d-flex justify-content-between"><span className="text-gray-500">Uploaded Files</span> <span className="fw-medium text-gray-900">{formData.uploadedFiles.length} file(s)</span></div>
                                        {formData.referenceMeasurement && (
                                            <div className="d-flex justify-content-between"><span className="text-gray-500">Known Ref</span> <span className="fw-medium text-purple-700 bg-purple-100 px-2 rounded">{formData.referenceMeasurement} {formData.measurementUnit}</span></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formData.entryMode === 'inspiration' && (
                                <div>
                                    <h4 className="fs-6 text-muted fw-semibold text-gray-500 uppercase tracking-wider mb-3 d-flex align-items-center gap-2">
                                        <Settings className="w-4 h-4" /> Space Details
                                    </h4>
                                    <div className="bg-gray-50 rounded-4 p-3 space-y-3 border border-gray-100">
                                        <div className="d-flex justify-content-between"><span className="text-gray-500">Project Name</span> <span className="fw-medium text-gray-900">{formData.projectName || "Untitled"}</span></div>
                                        <div className="d-flex justify-content-between"><span className="text-gray-500">Type</span> <span className="fw-medium text-gray-900 capitalize">{formData.roomType || "-"}</span></div>
                                        <div className="d-flex justify-content-between"><span className="text-gray-500">Area</span> <span className="fw-medium text-gray-900">{formData.totalArea || "-"}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="fs-6 text-muted fw-semibold text-gray-500 uppercase tracking-wider mb-3 d-flex align-items-center gap-2">
                                    <Paintbrush className="w-4 h-4" /> Design Preferences
                                </h4>
                                <div className="bg-gray-50 rounded-4 p-3 space-y-3 border border-gray-100">
                                    <div className="d-flex justify-content-between"><span className="text-gray-500">Style</span> <span className="fw-medium text-gray-900">{formData.designStyle || "-"}</span></div>
                                    <div className="d-flex justify-content-between"><span className="text-gray-500">Layout</span> <span className="fw-medium text-gray-900">{formData.layoutStyle || "-"}</span></div>
                                    <div className="d-flex justify-content-between"><span className="text-gray-500">Usage</span> <span className="fw-medium text-gray-900">{formData.roomUsage || "-"}</span></div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-gray-500">Color Palette</span>
                                        <span className="d-flex align-items-center gap-2 fw-medium text-gray-900">
                                            {formData.colorPreference === 'Custom' ? (
                                                <span className="w-4 h-4 rounded-circle border border-gray-300 d-inline-block" style={{ backgroundColor: formData.customColor }}></span>
                                            ) : null}
                                            {formData.colorPreference || "-"}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between"><span className="text-gray-500">Furniture</span> <span className="fw-medium text-gray-900">{formData.furniturePreference || "-"}</span></div>
                                    <div className="d-flex justify-content-between"><span className="text-gray-500">Budget</span> <span className="fw-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{formData.budget === 'Custom' ? formData.customBudget : formData.budget || "-"}</span></div>
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
        <div className="min-vh-100 bg-gray-50 pt-24 pb-12 font-sans overflow-x-hidden">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header content (Only Step 1 usually has this text, but I will keep it for consistency from original) */}
                {step === 1 && (
                    <div className="mb-10 text-center space-y-4 animate-in slide-in-from-top-4 duration-500">
                        <h1 className="fs-1 font-extrabold text-gray-900 tracking-tight">Create New Project</h1>
                        <p className="fs-5 text-gray-500 max-w-2xl mx-auto">
                            Provide your space details and preferences so SmartPlan AI can generate optimized layout designs tailored specifically to you.
                        </p>
                    </div>
                )}

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="d-flex align-items-center justify-content-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-100 h-1 bg-gray-200 z-0 d-none d-md-block rounded-circle"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 d-none d-md-block transition-all duration-500 rounded-circle"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>

                        {stepLabels.map((s) => (
                            <div key={s.num} className="relative z-10 d-flex flex-column align-items-center gap-3">
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
                <div className="d-flex align-items-center justify-content-between pt-6 border-t border-gray-200">
                    <div>
                        <button
                            type="button"
                            onClick={() => setPage("dashboard")}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Cancel Project
                        </button>
                    </div>
                    <div className="d-flex gap-4">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-3 rounded-4 fw-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all d-flex align-items-center gap-2 outline-none"
                            >
                                <ChevronLeft className="w-5 h-5" /> Back
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
                                Next Step <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-4 fw-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all d-flex align-items-center gap-2 outline-none"
                            >
                                Generate AI Designs <Lightbulb className="w-5 h-5 fill-current" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
