import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface AIResultsPageProps {
  setPage: (page: string) => void;
}

// =========================
// 🧊 Skeleton Component
// =========================
const SkeletonBox = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg ${className}`}
    />
  );
};

export default function AIResultsPage({ setPage }: AIResultsPageProps) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("images");

  const [regenerating, setRegenerating] = useState(false);

  // =========================
  // STEP 1 — Fetch Results
  // =========================
  const fetchResults = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("PROJECT DATA:", data);

    setProject(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [projectId]);

  // =========================
  // 🔁 Regenerate AI
  // =========================
  const regenerateAI = async () => {
    const token = localStorage.getItem("token");

    setRegenerating(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/regenerate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      console.log("REGENERATE RESPONSE:", data);

      await fetchResults();
    } catch (error) {
      console.error("Regenerate error:", error);
    } finally {
      setRegenerating(false);
    }
  };

  // =========================
  // 💥 SKELETON LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <SkeletonBox className="h-8 w-64" />
          <SkeletonBox className="h-8 w-20" />
        </div>

        {/* STATUS */}
        <SkeletonBox className="h-6 w-40 mb-6" />

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-6 w-20" />
        </div>

        {/* IMAGES GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} className="h-48 w-full" />
          ))}
        </div>

        {/* BLUEPRINT */}
        <div className="flex justify-center mb-10">
          <SkeletonBox className="h-64 w-full max-w-xl" />
        </div>

        {/* ROOMS */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <SkeletonBox className="h-5 w-40 mb-2" />
              <SkeletonBox className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Project Dashboard</h1>

        <button
          onClick={() => setPage("dashboard")}
          className="text-sm text-red-500"
        >
          Back
        </button>
      </div>

      {/* STATUS */}
      <div className="mb-6">
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
          Status: {project.status}
        </span>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab("images")}
          className={`pb-2 ${activeTab === "images" ? "border-b-2 border-blue-600 font-bold" : ""}`}
        >
          Images
        </button>

        <button
          onClick={() => setActiveTab("blueprint")}
          className={`pb-2 ${activeTab === "blueprint" ? "border-b-2 border-blue-600 font-bold" : ""}`}
        >
          Blueprint
        </button>

        <button
          onClick={() => setActiveTab("rooms")}
          className={`pb-2 ${activeTab === "rooms" ? "border-b-2 border-blue-600 font-bold" : ""}`}
        >
          Rooms
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "images" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.images?.map((img: string, i: number) => (
              <img
                key={i}
                src={`http://127.0.0.1:8000/storage/${img}`}
                className="rounded-lg shadow-md h-48 w-full object-cover"
              />
            ))}
          </div>
        )}

        {activeTab === "blueprint" && (
          <div className="flex flex-col items-center">
            {project.blueprint && (
              <img
                src={`http://127.0.0.1:8000/storage/${project.blueprint}`}
                className="rounded-lg shadow-lg max-w-xl"
              />
            )}
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-4">
            {project.rooms?.length > 0 ? (
              project.rooms.map((room: any, i: number) => (
                <div key={i} className="p-4 border rounded-lg bg-card">
                  <h3 className="font-bold">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {room.type}
                  </p>
                </div>
              ))
            ) : (
              <p>No rooms generated</p>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl">
          Download Results
        </button>

        <button
          onClick={regenerateAI}
          disabled={regenerating}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
        >
          {regenerating ? "Regenerating..." : "Regenerate AI"}
        </button>
      </div>
    </div>
  );
}
