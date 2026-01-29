import React, { useEffect, useState } from "react";
import {
  FileText,
  User,
  Clock,
  X,
} from "lucide-react";

interface Uploader {
  id: number;
  first_name: string;
  last_name: string;
}

interface Material {
  id: number;
  category: string;
  stream: "natural" | "social" | null;
  subject: string;
  file_path: string;
  file_type: string;
  approval: string;
  created_at: string;
  uploader: Uploader;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const categories = [
  { key: "grade9", label: "Grade 9" },
  { key: "grade10", label: "Grade 10" },
  { key: "grade11", label: "Grade 11" },
  { key: "grade12", label: "Grade 12" },
  { key: "entrance", label: "Entrance Exam" },
  { key: "remedial", label: "Remedial Program" },
];

const streamEnabledCategories = [
  "grade11",
  "grade12",
  "entrance",
  "remedial",
];

const LearningResources: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeCategory, setActiveCategory] = useState("grade9");
  const [activeStream, setActiveStream] = useState<"natural" | "social">("natural");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  // Removed openFile state — we use new tab instead of modal

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/subject-upload/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMaterials(
          data.materials.filter((m: Material) => m.approval === "pending")
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load materials:", err);
        setLoading(false);
      });
  }, []);

  const handleApproval = async (
    id: number,
    action: "approved" | "rejected"
  ) => {
    setProcessing(id);

    try {
      const res = await fetch(`${API_BASE_URL}/subject-upload/review/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approval: action }),
      });

      if (!res.ok) throw new Error("Approval failed");

      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to update approval status");
    } finally {
      setProcessing(null);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    if (m.category !== activeCategory) return false;
    if (streamEnabledCategories.includes(activeCategory)) {
      return m.stream === activeStream;
    }
    return true;
  });

  // Helper: build correct file URL (handles common prefix issues)
  const getFileUrl = (filePath: string) => {
    let path = filePath.trim();

    // Remove leading slash if present
    if (path.startsWith("/")) {
      path = path.slice(1);
    }

    // If path already starts with "uploads/", keep it
    // If not, add "uploads/" prefix (common fix for 404)
    if (!path.startsWith("uploads/")) {
      path = `uploads/${path}`;
    }

    return `${API_BASE_URL}/${path}`;
  };

  const handleOpen = (material: Material) => {
    const url = getFileUrl(material.file_path);
    console.log("Opening URL:", url); // ← debug: check this in console!

    window.open(url, "_blank", "noopener,noreferrer");

    // Optional: fallback alert if you want feedback
    // setTimeout(() => {
    //   if (!document.hasFocus()) return;
    //   alert("File may not have opened — check if URL is correct or popup blocked.");
    // }, 1500);
  };

  const handleDownload = (material: Material) => {
    const url = getFileUrl(material.file_path);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${material.subject.replace(/\s+/g, "_")}${material.file_type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* CATEGORY MENU */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeCategory === c.key
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-700 hover:bg-purple-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* STREAM TABS */}
        {streamEnabledCategories.includes(activeCategory) && (
          <div className="flex justify-center gap-4 mb-10">
            {["natural", "social"].map((s) => (
              <button
                key={s}
                onClick={() => setActiveStream(s as any)}
                className={`px-6 py-2 rounded-full font-semibold ${
                  activeStream === s
                    ? "bg-pink-600 text-white"
                    : "bg-white text-pink-700 hover:bg-pink-100"
                }`}
              >
                {s === "natural" ? "Natural Science" : "Social Science"}
              </button>
            ))}
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-20">Loading materials...</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow">
            No pending materials found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredMaterials.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl shadow-xl p-6 transition hover:shadow-2xl"
              >
                <div className="flex gap-3 mb-4">
                  <FileText className="text-purple-600" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">
                      {m.subject}
                    </h3>
                    <p className="text-sm text-purple-600 font-medium">
                      {m.file_type.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Uploader info */}
                <div className="text-sm text-gray-600 space-y-2 mb-6">
                  <p className="flex gap-2 items-center">
                    <User size={16} />
                    <strong>
                      {m.uploader.first_name} {m.uploader.last_name}
                    </strong>
                  </p>
                  <p className="flex gap-2 items-center">
                    <Clock size={16} />
                    {new Date(m.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {/* OPEN / DOWNLOAD buttons */}
                <div className="flex gap-3 mb-5">
                  <button
                    onClick={() => handleOpen(m)}
                    className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-sm"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => handleDownload(m)}
                    className="flex-1 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-sm"
                  >
                    Download
                  </button>
                </div>

                {/* Approval buttons (kept from original) */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproval(m.id, "approved")}
                    disabled={processing === m.id}
                    className="flex-1 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50 transition"
                  >
                    {processing === m.id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleApproval(m.id, "rejected")}
                    disabled={processing === m.id}
                    className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50 transition"
                  >
                    {processing === m.id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;