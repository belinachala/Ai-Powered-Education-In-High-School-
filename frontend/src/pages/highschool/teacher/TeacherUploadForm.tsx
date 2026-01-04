import React, { useState } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

const TeacherUploadForm: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const [subject, setSubject] = useState("");
  const [stream, setStream] = useState("");
  const [category, setCategory] = useState("");

  // Change this if your backend runs on a different port
  const API_BASE_URL = "http://localhost:8000";

  // Get token from localStorage (standard way)
  const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

  // Generate subject options based on category and stream
  const getSubjectOptions = () => {
    if (!category) return [];

    switch (category) {
      case "grade9":
        return [
          "Grade 9 Mathmathics",
          "Grade 9 English",
          "Grade 9 Biology",
          "Grade 9 Physics",
          "Grade 9 Chemistry",
          "Grade 9 History",
          "Grade 9 Geography",
          "Grade 9 Civics",
          "Grade 9 ICT",
          "Grade 9 Afaan Oromo",
          "Grade 9 Amharic",
        ];

      case "grade10":
        return [
          "Grade 10 Mathmathics",
          "Grade 10 English",
          "Grade 10 Biology",
          "Grade 10 Physics",
          "Grade 10 Chemistry",
          "Grade 10 History",
          "Grade 10 Geography",
          "Grade 10 Civics",
          "Grade 10 ICT",
          "Grade 10 Afaan Oromo",
          "Grade 10 Amharic",
        ];

      case "grade11":
      case "grade12":
        if (stream === "natural") {
          return [
            `${category === "grade11" ? "Grade 11" : "Grade 12"} English`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Mathmathics`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Physics`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Chemistry`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Biology`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Agriculture`,
          ];
        }
        if (stream === "social") {
          return [
            `${category === "grade11" ? "Grade 11" : "Grade 12"} English`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Mathmathics`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} History`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Geography`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Economics`,
            `${category === "grade11" ? "Grade 11" : "Grade 12"} Civics`,
          ];
        }
        return [];

      case "entrance":
        if (stream === "natural") {
          return [
            "English Entrance Exam",
            "Mathmathics Entrance Exam",
            "Physics Entrance Exam",
            "Chemistry Entrance Exam",
            "Biology Entrance Exam",
            "Agriculture Entrance Exam",
          ];
        }
        if (stream === "social") {
          return [
            "English Entrance Exam",
            "Mathmathics Entrance Exam",
            "History Entrance Exam",
            "Geography Entrance Exam",
            "Economics Entrance Exam",
            "Aptitude Entrance Exam",
          ];
        }
        return [];

      case "remedial":
        if (stream === "natural") {
          return [
            "English Remedial",
            "Mathmathics Remedial",
            "Physics Remedial",
            "Chemistry Remedial",
            "Biology Remedial",
            "Aptitude Remedial",
          ];
        }
        if (stream === "social") {
          return [
            "English Remedial",
            "Mathmathics Remedial",
            "History Remedial",
            "Geography Remedial",
            "Economics Remedial",
            "Aptitude Remedial",
          ];
        }
        return [];

      default:
        return [];
    }
  };

  const subjectOptions = getSubjectOptions();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const ext = file.name.toLowerCase().split(".").pop();
    const allowed = ["pdf", "ppt", "pptx", "doc", "docx"];
    if (ext && allowed.includes(ext)) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Invalid file type. Allowed: PDF, PPT, PPTX, DOC, DOCX");
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !subject || !category) {
      setError("Please fill all fields and select a file.");
      return;
    }

    if (["grade11", "grade12", "entrance", "remedial"].includes(category) && !stream) {
      setError("Please select a stream.");
      return;
    }

    setUploading(true);
    setError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("category", category);
    if (stream) formData.append("stream", stream);
    formData.append("subject", subject);
    formData.append("file", selectedFile);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("You are not logged in. Please log in again.");
        setUploading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subject-upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setError("");
        // Reset form
        setSelectedFile(null);
        setSubject("");
        setStream("");
        setCategory("");
      } else {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.detail || `Upload failed (${response.status})`;
        setError(msg);
      }
    } catch (err) {
      setError("Network error. Check your connection or try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-200">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <h4 className="text-2xl font-bold flex items-center gap-3">
              <Upload size={28} />
              Upload New Subject Material
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Category */}
            <div>
              <label className="block text-lg font-semibold text-purple-800 mb-3">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setStream("");
                  setSubject("");
                }}
                className="w-full px-5 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none text-lg"
                required
              >
                <option value="">Select Category</option>
                <option value="grade9">Grade 9</option>
                <option value="grade10">Grade 10</option>
                <option value="grade11">Grade 11</option>
                <option value="grade12">Grade 12</option>
                <option value="entrance">Entrance Exam</option>
                <option value="remedial">Remedial Program</option>
              </select>
            </div>

            {/* Stream */}
            {(category === "grade11" || category === "grade12" || category === "entrance" || category === "remedial") && (
              <div>
                <label className="block text-lg font-semibold text-purple-800 mb-3">Stream</label>
                <div className="grid grid-cols-2 gap-4">
                  {["natural", "social"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center p-4 border-2 border-purple-300 rounded-xl cursor-pointer hover:bg-purple-50 transition-all"
                    >
                      <input
                        type="radio"
                        name="stream"
                        value={s}
                        checked={stream === s}
                        onChange={(e) => {
                          setStream(e.target.value);
                          setSubject("");
                        }}
                        className="mr-3 w-5 h-5 text-purple-600"
                        required
                      />
                      <span className="font-medium text-purple-800 capitalize">
                        {s === "natural" ? "Natural Science" : "Social Science"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Subject */}
            {category && (["grade9", "grade10"].includes(category) || stream) && (
              <div>
                <label className="block text-lg font-semibold text-purple-800 mb-3">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none text-lg"
                  required
                  disabled={subjectOptions.length === 0}
                >
                  <option value="">
                    {subjectOptions.length === 0 ? "Select stream first" : "Choose a subject"}
                  </option>
                  {subjectOptions.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-lg font-semibold text-purple-800 mb-3">
                Upload File (PDF, PPT, PPTX, DOC, DOCX)
              </label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-2xl p-10 text-center transition-all ${
                  dragActive ? "border-purple-600 bg-purple-50" : "border-purple-300 bg-purple-50/30"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload size={48} className="mx-auto text-purple-600 mb-4" />
                <p className="text-xl font-semibold text-purple-800">Drag & drop your file here</p>
                <p className="text-purple-600 mt-2">or click to browse</p>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={32} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">{selectedFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-red-600 hover:text-red-800">
                    <X size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-3">
                <AlertCircle size={24} className="text-red-600" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3">
                <CheckCircle size={28} className="text-green-600" />
                <p className="text-green-800 font-bold text-lg">
                  Upload successful! Your material has been submitted for director approval.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || !selectedFile || !subject}
              className={`w-full py-5 text-xl font-bold text-white rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 ${
                uploading || !selectedFile || !subject
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              }`}
            >
              {uploading ? (
                <>Uploading... Please wait</>
              ) : (
                <>
                  <Upload size={28} />
                  Upload Material
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-purple-700 mt-8 text-sm italic">
          All uploaded materials will be reviewed and made available to students across Ethiopia based on the New Curriculum.
        </p>
        <p className="text-center text-purple-700 mt-4 text-sm italic font-semibold">
          Wait for Director Approval
        </p>
      </div>
    </div>
  );
};

export default TeacherUploadForm;