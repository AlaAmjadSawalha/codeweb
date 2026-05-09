import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { pusher } from "../services/pusher";
import { Cpu } from "lucide-react";

interface AIProcessingPageProps {
  setPage: (page: string) => void;
}

export default function AIProcessingPage({ setPage }: AIProcessingPageProps) {
  const { t } = useTranslation();

  // =========================
  // STEP 1 — Project ID
  // =========================
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  // =========================
  // STATES
  // =========================
  const [status, setStatus] = useState("idle");

  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const tips = [
    t("aiProcessing.tip0"),
    t("aiProcessing.tip1"),
    t("aiProcessing.tip2"),
    t("aiProcessing.tip3"),
  ];

  // =========================
  // Tips rotation
  // =========================
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(tipTimer);
  }, [tips.length]);

  // =========================
  // LIVE AI STATUS (PUSHER)
  // =========================
  useEffect(() => {
    if (!projectId) return;

    const channel = pusher.subscribe(`ai.${projectId}`);

    channel.bind("ai.status.updated", (data: any) => {
      console.log("LIVE STATUS:", data);

      setStatus(data.status);
      setProgress(data.progress);

      if (data.progress >= 100) {
        console.log("AI COMPLETED");

        setTimeout(() => {
          setPage(`/ai-results?id=${projectId}`);
        }, 1500);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`ai.${projectId}`);
    };
  }, [projectId]);

  // =========================
  // STEP 3 — Start AI
  // =========================
  const startProcessing = async () => {
    try {
      const token = localStorage.getItem("token");

      setStatus("queued");

      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/process`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      console.log("PROCESS STARTED:", data);

      pollStatus();
    } catch (error) {
      console.error("START PROCESS ERROR:", error);
    }
  };

  // =========================
  // STEP 4 — Polling backend
  // =========================
  const pollStatus = () => {
    const token = localStorage.getItem("token");

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        const currentStatus = data.data.status;

        setStatus(currentStatus);

        console.log("STATUS:", currentStatus);

        // =========================
        // DONE → GET RESULTS
        // =========================
        if (currentStatus === "done" || currentStatus === "failed") {
          clearInterval(interval);

          const resultRes = await fetch(
            `http://127.0.0.1:8000/api/projects/${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const resultData = await resultRes.json();

          console.log("AI RESULTS:", resultData);

          setResults(resultData.data);
          setStatus(currentStatus);
        }
      } catch (error) {
        console.error("POLLING ERROR:", error);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">{t("aiProcessing.title")}</h1>

      <p className="text-muted-foreground mb-6">{t("aiProcessing.subtitle")}</p>

      {/* AI ICON */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <div className="absolute inset-0 border-4 border-dashed rounded-full animate-spin" />

        <Cpu className="w-12 h-12 text-violet-600" />
      </div>

      {/* STATUS */}
      <p className="text-lg font-bold mb-4">AI Status: {status}</p>

      <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
        <div
          className="bg-violet-600 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground mb-6">{progress}%</p>

      {/* BUTTON */}
      <button
        onClick={startProcessing}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Start AI Processing
      </button>

      {/* RESULTS */}
      {results && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">AI Results</h2>

          {/* IMAGES */}
          {results.images && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={`http://127.0.0.1:8000/storage/${img}`}
                  alt="AI Result"
                  className="rounded-lg shadow-md w-full h-40 object-cover"
                />
              ))}
            </div>
          )}

          {/* MESSAGE */}
          {results.message && (
            <p className="mt-4 text-green-600 font-bold">{results.message}</p>
          )}
        </div>
      )}

      {/* TIP */}
      <p className="text-sm text-violet-600 mt-8">💡 {tips[activeTipIndex]}</p>

      {/* CANCEL */}
      <button
        onClick={() => setPage("dashboard")}
        className="text-sm text-red-500 mt-4"
      >
        Cancel
      </button>
    </div>
  );
}
