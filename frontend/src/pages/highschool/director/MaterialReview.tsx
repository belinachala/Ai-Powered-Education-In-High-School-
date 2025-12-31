import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, FileText, Clock, User, Download } from "lucide-react";
import { BookOpen } from "lucide-react";  // ← Add this
interface PendingMaterial {
  id: number;
  category: string;
  stream: string | null;
  subject: string;
  file_path: string;
  file_type: string;
  user_id: number;
  approval: string;
  created_at: string;
  uploader_username?: string; // Optional: if you join with user
}

const API_BASE_URL = "http://localhost:8000";

const categoryLabels: Record<string, string> = {
  grade9: "Grade 9",
  grade10: "Grade 10",
  grade11: "Grade 11",
  grade12: "Grade 12",
  entrance: "Entrance Exam",
  remedial: "Remedial Program",
};

const MaterialReview: React.FC = () => {
  const [materials, setMaterials] = useState<PendingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getAuthToken = () => localStorage.getItem("token") || "";

  const fetchPendingMaterials = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/subject-upload/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load pending materials");

      const data: PendingMaterial[] = await response.json();
      setMaterials(data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load materials." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMaterials();
  }, []);

  const handleApproval = async (id: number, action: "approved" | "rejected") => {
    setProcessing(id);
    setMessage(null);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/subject-upload/review/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approval: action }),
      });

      if (!response.ok) throw new Error("Action failed");

      setMessage({
        type: "success",
        text: `Material ${action === "approved" ? "approved" : "rejected"} successfully!`,
      });

      // Remove from list
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setMessage({ type: "error", text: "Action failed. Please try again." });
    } finally {
      setProcessing(null);
    }
  };

  // Group by category
  const grouped = materials.reduce((acc, mat) => {
    const cat = mat.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(mat);
    return acc;
  }, {} as Record<string, PendingMaterial[]>);

  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Material Review Dashboard
          </h1>
          <p className="text-xl text-purple-700">Review and approve learning materials for students</p>
        </div>

        {message && (
          <div
            className={`mb-8 p-6 rounded-xl text-center font-semibold ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-6 text-purple-700 text-xl">Loading pending materials...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl">
            <Clock size={80} className="mx-auto text-purple-500 mb-6" />
            <p className="text-2xl font-bold text-purple-800">No pending materials</p>
            <p className="text-purple-600 mt-4">All materials are up to date!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => (
              <div key={cat} className="bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <BookOpen size={32} />
                    {categoryLabels[cat] || cat}
                    {grouped[cat][0]?.stream && (
                      <span className="ml-4 text-lg font-normal">
                        ({grouped[cat][0].stream === "natural" ? "Natural Science" : "Social Science"})
                      </span>
                    )}
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {grouped[cat].map((material) => (
                      <div
                        key={material.id}
                        className="border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <FileText size={36} className="text-purple-600" />
                            <div>
                              <h3 className="font-bold text-xl text-purple-800">{material.subject}</h3>
                              <p className="text-sm text-purple-600">{material.file_type.toUpperCase()} file</p>
                            </div>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Pending
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-2 mb-6">
                          <p className="flex items-center gap-2">
                            <User size={18} />
                            Uploaded by: Teacher ID {material.user_id}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock size={18} />
                            {new Date(material.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApproval(material.id, "approved")}
                            disabled={processing === material.id}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-70"
                          >
                            <CheckCircle size={24} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(material.id, "rejected")}
                            disabled={processing === material.id}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-70"
                          >
                            <XCircle size={24} />
                            Reject
                          </button>
                        </div>

                        <a
                          href={`${API_BASE_URL}${material.file_path.replace("uploads", "/uploads")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-4 text-center text-purple-600 hover:text-purple-800 underline text-sm flex items-center justify-center gap-2"
                        >
                          <Download size={18} />
                          Preview File
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialReview;