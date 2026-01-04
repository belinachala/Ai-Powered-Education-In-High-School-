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

const MaterialReview: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeCategory, setActiveCategory] = useState("grade9");
  const [activeStream, setActiveStream] =
    useState<"natural" | "social">("natural");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [openFile, setOpenFile] = useState<Material | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/subject-upload/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMaterials(
          data.materials.filter((m: Material) => m.approval === "pending")
        );
        setLoading(false);
      });
  }, []);

  const handleApproval = async (
    id: number,
    action: "approved" | "rejected"
  ) => {
    setProcessing(id);

    await fetch(`${API_BASE_URL}/subject-upload/review/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approval: action }),
    });

    setMaterials((prev) => prev.filter((m) => m.id !== id));
    setProcessing(null);
  };

  const filteredMaterials = materials.filter((m) => {
    if (m.category !== activeCategory) return false;
    if (streamEnabledCategories.includes(activeCategory)) {
      return m.stream === activeStream;
    }
    return true;
  });

  const getViewerUrl = (material: Material) => {
    const fullUrl = `${API_BASE_URL}/${material.file_path}`;
    if (material.file_type.toLowerCase() === ".pdf") return fullUrl;
    return `https://docs.google.com/gview?url=${encodeURIComponent(
      fullUrl
    )}&embedded=true`;
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
          <div className="text-center py-20">Loading...</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow">
            No pending materials
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredMaterials.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl shadow-xl p-6"
              >
                <div className="flex gap-3 mb-4">
                  <FileText className="text-purple-600" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">
                      {m.subject}
                    </h3>
                    <p className="text-sm text-purple-600">
                      {m.file_type.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Uploader */}
                <div className="text-sm text-gray-600 space-y-2 mb-6">
                  <p className="flex gap-2 items-center">
                    <User size={16} />
                    <strong>
                      Mr {m.uploader.first_name} {m.uploader.last_name}
                    </strong>
                  </p>
                  <p className="flex gap-2 items-center">
                    <Clock size={16} />
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* OPEN / DOWNLOAD */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setOpenFile(m)}
                    className="flex-1 py-2 rounded-full bg-blue-600 text-white font-semibold"
                  >
                    Open
                  </button>

                  <a
                    href={`${API_BASE_URL}/${m.file_path}`}
                    download
                    className="flex-1 py-2 rounded-full bg-indigo-600 text-white font-semibold text-center"
                  >
                    Download
                  </a>
                </div>

                {/* APPROVAL */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproval(m.id, "approved")}
                    disabled={processing === m.id}
                    className="flex-1 py-2 rounded-full bg-green-600 text-white font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(m.id, "rejected")}
                    disabled={processing === m.id}
                    className="flex-1 py-2 rounded-full bg-red-600 text-white font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {openFile && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative w-11/12 md:w-3/4 lg:w-2/3 h-5/6 bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => setOpenFile(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <X size={24} />
              </button>

              <iframe
                src={getViewerUrl(openFile)}
                title={openFile.subject}
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialReview;
