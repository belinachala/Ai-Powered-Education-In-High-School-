// src/components/ImagesGallery.tsx

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, X, Download } from "lucide-react";

interface Uploader {
  id: number;
  first_name: string;
  last_name: string;
}

interface UploadedImage {
  id: number;
  category: string;
  stream: "natural" | "social" | null;
  subject: string;
  title: string;
  file_path: string;
  file_type: string;
  approval: "approved" | "pending" | "rejected";
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

const streamEnabledCategories = ["grade11", "grade12", "entrance", "remedial"];

const ImagesGallery: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [activeCategory, setActiveCategory] = useState("grade9");
  const [activeStream, setActiveStream] = useState<"natural" | "social">(
    "natural"
  );
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState<UploadedImage | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/image-upload/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [token]);

  const filteredImages = images.filter((img) => {
    if (img.category !== activeCategory) return false;
    if (streamEnabledCategories.includes(activeCategory)) {
      return img.stream === activeStream;
    }
    return true;
  });

  const getViewerUrl = (img: UploadedImage) =>
    `${API_BASE_URL}/${img.file_path}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Category Menu */}
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

        {/* Stream Tabs */}
        {streamEnabledCategories.includes(activeCategory) && (
          <div className="flex justify-center gap-4 mb-10">
            {["natural", "social"].map((s) => (
              <button
                key={s}
                onClick={() => setActiveStream(s as any)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
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

        {/* Gallery */}
        {loading ? (
          <div className="text-center py-20 text-purple-600">Loading images...</div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <p className="text-xl text-purple-700">No images available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={`${API_BASE_URL}/${img.file_path}`}
                    alt={img.title}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setOpenImage(img)}
                  />
                  
                </div>

                {/* Title + Actions */}
                <div className="p-2">
                  <h6 className="text-lg font-bold text-purple-800 mb-3 line-clamp-2">
                    {img.title}
                  </h6>

                  <div className="flex gap-4 mt-2">
                    <span
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() => setOpenImage(img)}
                    >
                      View
                    </span>

                    <a
                      href={`${API_BASE_URL}/${img.file_path}`}
                      download
                      className="text-indigo-600 underline cursor-pointer"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {openImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setOpenImage(null)}
                className="absolute top-4 right-4 p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition z-10"
              >
                <X size={24} />
              </button>

              <img
                src={`${API_BASE_URL}/${openImage.file_path}`}
                alt={openImage.title}
                className="w-full max-h-[85vh] object-contain"
              />

              <div className="p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <h3 className="text-xl font-bold">{openImage.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesGallery;
