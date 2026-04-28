import { useState } from "react";
import { UploadCloud, Trash2, FileImage } from "lucide-react";

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

  // Handle multiple room images
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

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        Upload Project Files
      </h1>

      {/* Blueprint Upload */}
      <div className="mb-8 p-4 border rounded-xl bg-white dark:bg-slate-900">
        <h2 className="font-semibold mb-2">Blueprint (PDF / Image)</h2>

        {!blueprint ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-xl cursor-pointer">
            <UploadCloud className="w-10 h-10 text-slate-500" />
            <span className="text-sm mt-2">Click or drop file</span>
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
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <FileImage />
              <span className="text-sm">{blueprint.file.name}</span>
            </div>

            <button onClick={removeBlueprint}>
              <Trash2 className="text-red-500 w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Room Images Upload */}
      <div className="mb-8 p-4 border rounded-xl bg-white dark:bg-slate-900">
        <h2 className="font-semibold mb-2">Room Photos</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-xl cursor-pointer">
          <UploadCloud className="w-10 h-10 text-slate-500" />
          <span className="text-sm mt-2">Upload room images</span>
          <input
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={(e) => handleRooms(e.target.files)}
          />
        </label>

        {/* Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {rooms.map((item, index) => (
            <div key={index} className="relative group">
              <img
                src={item.preview}
                className="w-full h-28 object-cover rounded-lg"
              />
              <button
                onClick={() => removeRoom(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
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
        Start AI Processing
      </button>
      {uploadedData && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>

          {/* Blueprint */}
          <div className="mb-6">
            <p className="font-semibold">Blueprint:</p>
            <img
              src={`http://127.0.0.1:8000/storage/${uploadedData.blueprint}`}
              className="w-64 rounded-lg mt-2"
            />
          </div>

          {/* Rooms */}
          <div>
            <p className="font-semibold mb-2">Rooms:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {uploadedData.rooms.map((room: string, index: number) => (
                <img
                  key={index}
                  src={`http://127.0.0.1:8000/storage/${room}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
