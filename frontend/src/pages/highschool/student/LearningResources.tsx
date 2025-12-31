import React, { useState, useEffect } from "react";
import { Download, FileText, BookOpen } from "lucide-react";

interface Material {
  id: number;
  category: string;
  stream: string | null;
  subject: string;
  file_path: string;
  file_type: string;
  approval: string;
}

const API_BASE_URL = "http://localhost:8000";

const categories = [
  { value: "grade9", label: "Grade 9" },
  { value: "grade10", label: "Grade 10" },
  { value: "grade11", label: "Grade 11" },
  { value: "grade12", label: "Grade 12" },
  { value: "entrance", label: "Entrance Exam" },
  { value: "remedial", label: "Remedial Program" },
];

const LearningResources: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("grade9"); // Default to Grade 9

  const getAuthToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/subject-upload/approved`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) throw new Error("Failed to load materials");

        const data: Material[] = await response.json();
        setMaterials(data);
      } catch (err) {
        console.error("Error loading materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Filter materials by selected category
  const filteredMaterials = materials.filter(
    (m) => m.category === selectedCategory && m.approval === "approved"
  );

  // Group by subject (in case multiple files per subject)
  const subjects = Array.from(new Set(filteredMaterials.map((m) => m.subject)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100">
      {/* Header */}
       
      {/* Category Menu - Fixed at Top */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all shadow-md ${
                  selectedCategory === cat.value
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-purple-700 text-lg">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
            <p className="text-purple-700 text-2xl font-semibold">No materials available yet</p>
            <p className="text-purple-600 mt-3">Check back soon for approved resources!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => {
              const files = filteredMaterials.filter((m) => m.subject === subject);
              return (
                <div
                  key={subject}
                  className="bg-white rounded-3xl shadow-2xl border-2 border-purple-200 p-8 hover:shadow-3xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <FileText size={40} className="text-purple-600" />
                    <h3 className="text-2xl font-bold text-purple-800">{subject}</h3>
                  </div>

                  <div className="space-y-4">
                    {files.map((file) => (
                      <a
                        key={file.id}
                        href={`${API_BASE_URL}${file.file_path.replace("uploads", "/uploads")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-between"
                      >
                        <span className="flex items-center gap-3">
                          <Download size={24} />
                          Download {file.file_type.toUpperCase()}
                        </span>
                        <span className="text-sm opacity-90">Open in new tab</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;