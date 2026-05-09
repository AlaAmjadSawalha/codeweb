import { useState } from "react";
import {
  UploadCloud,
  Trash2,
  FileImage,
  Camera,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Cpu,
  Loader2,
  Ruler,
} from "lucide-react";

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

  const [referenceLength, setReferenceLength] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace later with dynamic project id from route/context
  const projectId = 1;

  // ─────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─────────────────────────────────────────────────────────────
  // Blueprint Upload
  // ─────────────────────────────────────────────────────────────

  const handleBlueprint = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid blueprint file type");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Blueprint file too large (max 20MB)");
      return;
    }

    if (blueprint?.preview) {
      URL.revokeObjectURL(blueprint.preview);
    }

    const preview = URL.createObjectURL(file);

    setBlueprint({
      file,
      preview,
    });
  };

  // ─────────────────────────────────────────────────────────────
  // Room Uploads
  // ─────────────────────────────────────────────────────────────

  const handleRooms = (files: FileList | null) => {
    if (!files) return;

    const validFiles: FileItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`);
        return;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    setRooms((prev) => [...prev, ...validFiles]);
  };

  // ─────────────────────────────────────────────────────────────
  // Remove handlers
  // ─────────────────────────────────────────────────────────────

  const removeRoom = (index: number) => {
    URL.revokeObjectURL(rooms[index].preview);

    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const removeBlueprint = () => {
    if (blueprint?.preview) {
      URL.revokeObjectURL(blueprint.preview);
    }

    setBlueprint(null);
  };

  // ─────────────────────────────────────────────────────────────
  // Submit Upload
  // ─────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!blueprint) {
      alert("Please upload blueprint first");
      return;
    }

    if (!referenceLength) {
      alert("Please enter reference measurement");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // Blueprint
      formData.append("blueprint", blueprint.file);

      // Rooms
      rooms.forEach((item) => {
        formData.append("rooms[]", item.file);
      });

      // Reference measurement
      formData.append("reference_length", referenceLength);

      const token = localStorage.getItem("token");
      console.log("TOKEN =", token);
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      console.log("FULL RESPONSE:", data);

      setUploadedData(data.data);

      alert("Files uploaded successfully");

      // Navigate to processing/results page
      setPage(`/ai-designs?id=${data.data.project_id || projectId}`);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ───────────────── Header ───────────────── */}

      <div className="mb-8">
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
          Upload your architectural blueprint and room photos. Our AI will
          analyze the space and generate optimal layout designs.
        </p>
      </div>

      {/* ───────────────── Blueprint Upload ───────────────── */}

      <div className="mb-5 bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
            <FileImage className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Blueprint</h2>

            <p className="text-xs text-muted-foreground">
              PDF or image file · Single file · Required
            </p>
          </div>

          {blueprint && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </span>
          )}
        </div>

        {!blueprint ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-2xl p-10 cursor-pointer hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/40 dark:hover:bg-violet-950/10 transition-all duration-200 group">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30 mb-4 group-hover:scale-105 transition-transform duration-200">
              <UploadCloud className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>

            <p className="text-sm font-semibold text-foreground mb-1">
              Click to upload or drag & drop
            </p>

            <p className="text-xs text-muted-foreground mb-5 text-center max-w-xs leading-relaxed">
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
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30 relative pr-14">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-violet-50 dark:bg-violet-900/30">
              {blueprint.file.type.startsWith("image/") ? (
                <img
                  src={blueprint.preview}
                  alt="Blueprint preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileImage className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {blueprint.file.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatSize(blueprint.file.size)}
              </p>
            </div>

            <button
              onClick={removeBlueprint}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ───────────────── Room Upload ───────────────── */}

      <div className="mb-6 bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">
              Room Photos
            </h2>

            <p className="text-xs text-muted-foreground">
              Multiple images · Optional
            </p>
          </div>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl p-8 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition-all duration-200 group">
          <Camera className="h-8 w-8 text-purple-600 mb-3" />

          <p className="text-sm font-semibold">Upload Room Photos</p>

          <p className="text-xs text-muted-foreground mt-2">
            JPG · PNG · WEBP · up to 10MB each
          </p>

          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={(e) => handleRooms(e.target.files)}
          />
        </label>

        {rooms.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {rooms.map((item, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden border border-border"
              >
                <img
                  src={item.preview}
                  alt={`Room ${index + 1}`}
                  className="w-full h-40 object-cover"
                />

                <button
                  onClick={() => removeRoom(index)}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ───────────────── Reference Measurement ───────────────── */}

      <div className="mb-6 bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Ruler className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Reference Measurement
            </h2>

            <p className="text-xs text-muted-foreground">
              Enter a real-world wall length in meters
            </p>
          </div>
        </div>

        <input
          type="number"
          step="0.1"
          placeholder="Example: 4.5"
          value={referenceLength}
          onChange={(e) => setReferenceLength(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* ───────────────── Submit ───────────────── */}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading & Processing...
          </>
        ) : (
          <>
            <Cpu className="h-5 w-5" />
            Start AI Processing
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {!blueprint && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          A blueprint is required to continue
        </p>
      )}

      {/* ───────────────── Uploaded Result ───────────────── */}

      {uploadedData && (
        <div className="mt-10 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Upload Complete</h2>

            <p className="text-sm text-muted-foreground">
              Files uploaded successfully and sent for AI processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
