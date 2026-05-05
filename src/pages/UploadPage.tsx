import { useState } from "react";
import { UploadCloud, Trash2, FileImage, Camera, CheckCircle2, ArrowRight, ChevronRight, Cpu } from "lucide-react";

type FileItem = {
  file: File;
  preview: string;
};

interface UploadPageProps {
  setPage: (page: string) => void;
}

export default function UploadPage({ setPage }: UploadPageProps) {
  const [blueprint, setBlueprint] = useState<FileItem | null>(null);
  const [rooms, setRooms] = useState<FileItem[]>([]);
  const [uploadedData, setUploadedData] = useState<any>(null);

  // Handle single file (blueprint)
  const handleBlueprint = (file: File) => {
    const preview = URL.createObjectURL(file);
    setBlueprint({ file, preview });
  };

  const handleRooms = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setRooms((prev) => [...prev, ...newFiles]);
  };

  const removeRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const removeBlueprint = () => {
    setBlueprint(null);
  };

  // Display helper — does not affect state or logic
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <button
            onClick={() => setPage("projects")}
            className="hover:text-foreground transition-colors"
          >
            Projects
          </button>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium">Upload Files</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Upload Project Files
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
          Upload your architectural blueprint and room photos. Our AI will analyze
          the space and generate optimal layout designs.
        </p>
      </div>

      {/* ── Blueprint Upload ─────────────────────────────────────── */}
      <div className="mb-5 bg-card rounded-2xl border border-border shadow-sm p-6">
        {/* Card header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
            <FileImage className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Blueprint</h2>
            <p className="text-xs text-muted-foreground">PDF or image file · Single file · Required</p>
          </div>
          {blueprint && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </span>
          )}
        </div>

        {!blueprint ? (
          /* Drop zone */
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-2xl p-10 cursor-pointer hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/40 dark:hover:bg-violet-950/10 transition-all duration-200 group">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30 mb-4 group-hover:scale-105 transition-transform duration-200">
              <UploadCloud className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Click to upload or drag &amp; drop
            </p>
            <p className="text-xs text-muted-foreground mb-5 text-center max-w-xs leading-relaxed">
              Architectural floor plans, blueprints, or site layout documents
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground shadow-sm group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all duration-200 pointer-events-none">
              <UploadCloud className="h-4 w-4" />
              Browse Files
            </div>
            <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
              PDF · JPG · PNG · up to 20 MB
            </p>
            <input
              type="file"
              className="hidden"
              accept="application/pdf,image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleBlueprint(e.target.files[0]);
                }
              }}
            />
          </label>
        ) : (
          /* File preview row */
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors relative pr-14">
            {/* Thumbnail or icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 overflow-hidden">
              {blueprint.file.type.startsWith("image/") ? (
                <img src={blueprint.preview} alt="Blueprint preview" className="h-full w-full object-cover" />
              ) : (
                <FileImage className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{blueprint.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(blueprint.file.size)}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0 mr-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ready
            </span>
            <button
              onClick={removeBlueprint}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Remove blueprint"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Room Photos Upload ───────────────────────────────────── */}
      <div className="mb-6 bg-card rounded-2xl border border-border shadow-sm p-6">
        {/* Card header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Room Photos</h2>
            <p className="text-xs text-muted-foreground">Images of your space · Multiple files · Optional</p>
          </div>
          {rooms.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {rooms.length} file{rooms.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Drop zone */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl p-8 cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/40 dark:hover:bg-purple-950/10 transition-all duration-200 group">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30 mb-3 group-hover:scale-105 transition-transform duration-200">
            <Camera className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            Click to upload or drag &amp; drop
          </p>
          <p className="text-xs text-muted-foreground mb-4 text-center max-w-xs leading-relaxed">
            Living room, bedroom, kitchen — any view helps the AI understand your space
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground shadow-sm group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-200 pointer-events-none">
            <UploadCloud className="h-4 w-4" />
            Browse Photos
          </div>
          <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
            JPG · PNG · WEBP · up to 10 MB each
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={(e) => handleRooms(e.target.files)}
          />
        </label>

        {/* Preview grid */}
        {rooms.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Selected Photos
              </h4>
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[11px] font-bold px-1.5">
                {rooms.length}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {rooms.map((item, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-border bg-muted"
                  style={{ aspectRatio: "1" }}
                >
                  <img
                    src={item.preview}
                    alt={`Room ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200" />
                  {/* Remove button */}
                  <button
                    onClick={() => removeRoom(index)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 dark:bg-slate-900/90 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 shadow-sm"
                    title="Remove photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {/* Photo label */}
                  <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Photo {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Submit ───────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <button
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 active:bg-violet-800 transition-all shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35"
          onClick={async () => {
            if (!blueprint) {
              alert("Please upload blueprint first");
              return;
            }

            const formData = new FormData();

            // blueprint
            formData.append("blueprint", blueprint.file);

            // rooms
            rooms.forEach((item) => {
              formData.append("rooms[]", item.file);
            });

            try {
              const token = localStorage.getItem("token");

              const res = await fetch(
                "http://127.0.0.1:8000/api/projects/1/upload",
                {
                  method: "POST",
                  body: formData,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              const data = await res.json();

              console.log(" FULL RESPONSE:", data);
              console.log(" DATA:", data.data);
              setUploadedData(data.data);

              alert("Uploaded successfully ");

              setPage(`/ai-designs?id=${data.data.project_id || 1}`);
            } catch (err) {
              console.error("ERROR:", err);
              alert("Upload failed");
            }
          }}
        >
          <Cpu className="h-5 w-5" />
          Start AI Processing
          <ArrowRight className="h-4 w-4" />
        </button>

        {!blueprint && (
          <p className="text-center text-xs text-muted-foreground">
            A blueprint is required to start AI analysis
          </p>
        )}
      </div>

      {/* ── Uploaded data display ────────────────────────────────── */}
      {uploadedData && (
        <div className="mt-10 bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Upload Complete</h2>
              <p className="text-xs text-muted-foreground">Files processed and ready for AI analysis</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Blueprint result */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Blueprint
              </p>
              <div className="w-48 rounded-xl overflow-hidden border border-border bg-muted">
                <img
                  src={`http://127.0.0.1:8000/storage/${uploadedData.blueprint}`}
                  className="w-full object-cover"
                  alt="Uploaded blueprint"
                />
              </div>
            </div>

            {/* Room results */}
            {uploadedData.rooms?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Room Photos
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadedData.rooms.map((room: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden border border-border bg-muted"
                      style={{ aspectRatio: "1" }}
                    >
                      <img
                        src={`http://127.0.0.1:8000/storage/${room}`}
                        className="w-full h-full object-cover"
                        alt={`Room ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
