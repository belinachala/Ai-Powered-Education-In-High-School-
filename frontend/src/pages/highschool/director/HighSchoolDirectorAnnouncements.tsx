// src/pages/director/HighSchoolDirectorAnnouncements.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  AlertCircle,
  CheckCircle,
  Users,
  GraduationCap,
  BookOpen,
  School,
  Users2,
  BookCheck,
  BrainCircuit,
} from "lucide-react";

interface Announcement {
  id?: number;
  title: string;
  content: string;
  target_audience: "all" | "teachers" | "students";
  target_grades_teachers?: string[];     // "9","10","11","12"
  target_grades_students?: string[];     // "9","10","11","12"
  target_special_students?: string[];    // "entrance", "remedial"  ← NEW
  created_at?: string;
  is_active: boolean;
}

const regularGradeOptions = [
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

const specialStudentCategories = [
  { value: "entrance", label: "Entrance Exam Preparation", icon: <BrainCircuit size={20} /> },
  { value: "remedial", label: "Remedial Program", icon: <BookCheck size={20} /> },
];

const HighSchoolDirectorAnnouncements: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<"all" | "teachers" | "students">("all");

  const [gradesTeachers, setGradesTeachers] = useState<string[]>([]);
  const [gradesStudents, setGradesStudents] = useState<string[]>([]);
  const [specialStudents, setSpecialStudents] = useState<string[]>([]); // entrance, remedial

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    setToken(storedToken);
    fetchAnnouncements(storedToken);
  }, [navigate]);

  const fetchAnnouncements = async (authToken: string) => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/announcements/", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Title and content are required.");
      return;
    }

    if (!token) return;

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        target_audience: audience,
        target_grades_teachers: (audience === "all" || audience === "teachers") ? gradesTeachers : [],
        target_grades_students: (audience === "all" || audience === "students") ? gradesStudents : [],
        target_special_students: (audience === "all" || audience === "students") ? specialStudents : [],
        is_active: true,
      };

      const res = await axios.post("http://127.0.0.1:8000/announcements/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Announcement published successfully!");
      setAnnouncements((prev) => [res.data, ...prev]);

      // Reset
      setTitle("");
      setContent("");
      setAudience("all");
      setGradesTeachers([]);
      setGradesStudents([]);
      setSpecialStudents([]);

      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to publish announcement.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number | undefined, current: boolean) => {
    if (!id || !token) return;
    try {
      await axios.patch(
        `http://127.0.0.1:8000/announcements/${id}`,
        { is_active: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: !current } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelection = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[]
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const getAudienceLabel = (aud: string) => {
    switch (aud) {
      case "all": return "Everyone (Teachers & Students)";
      case "teachers": return "Teachers only";
      case "students": return "Students only";
      default: return aud;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center gap-4"
          >
            <Megaphone size={48} className="text-purple-600" />
            School Announcements
          </motion.h1> 
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <h4 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen size={32} />
              Create New Announcement
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-9">
            {/* Title & Content */}
            <div>
              <label className="block text-xl font-semibold text-purple-800 mb-3">Announcement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none text-lg transition shadow-sm"
                placeholder="e.g. Entrance Exam Preparation Schedule"
                required
              />
            </div>

            <div>
              <label className="block text-xl font-semibold text-purple-800 mb-3">Message / Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none text-base transition resize-y shadow-sm"
                placeholder="Write detailed announcement here..."
                required
              />
            </div>

            {/* Audience Selection */}
            <div>
              <label className="block text-xl font-semibold text-purple-800 mb-4 flex items-center gap-3">
                <Users2 size={28} className="text-purple-700" />
                Who should receive this announcement?
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { value: "all", label: "All (Teachers & Students)", icon: <Users size={24} /> },
                  { value: "teachers", label: "Teachers only", icon: <School size={24} /> },
                  { value: "students", label: "Students only", icon: <GraduationCap size={24} /> },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all text-center ${
                      audience === opt.value
                        ? "border-purple-600 bg-purple-50 shadow-md"
                        : "border-purple-200 hover:bg-purple-50 hover:border-purple-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={opt.value}
                      checked={audience === opt.value}
                      onChange={(e) => setAudience(e.target.value as any)}
                      className="sr-only"
                    />
                    <div className="text-purple-700 mb-3">{opt.icon}</div>
                    <span className="font-medium text-lg text-purple-900">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Teachers Grade Filter */}
            {(audience === "all" || audience === "teachers") && (
              <div className="bg-purple-50/40 p-6 rounded-2xl border border-purple-200">
                <label className="block text-xl font-semibold text-purple-800 mb-4 flex items-center gap-3">
                  <School size={24} />
                  Target teachers of which grades?
                </label>
                <p className="text-sm text-purple-700 mb-4 italic">
                  Leave empty = all teachers
                </p>
                <div className="flex flex-wrap gap-4">
                  {regularGradeOptions.map((g) => (
                    <label
                      key={g.value}
                      className={`flex items-center px-5 py-3 rounded-xl border-2 cursor-pointer transition-all text-base ${
                        gradesTeachers.includes(g.value)
                          ? "bg-purple-100 border-purple-600 text-purple-800 shadow-sm"
                          : "bg-white border-purple-200 hover:bg-purple-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={gradesTeachers.includes(g.value)}
                        onChange={() => toggleSelection(g.value, setGradesTeachers, gradesTeachers)}
                        className="w-5 h-5 text-purple-600 rounded mr-3"
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Students - Regular Grades + Special Programs */}
            {(audience === "all" || audience === "students") && (
              <div className="space-y-8">
                {/* Regular Grades */}
                <div className="bg-purple-50/40 p-6 rounded-2xl border border-purple-200">
                  <label className="block text-xl font-semibold text-purple-800 mb-4 flex items-center gap-3">
                    <GraduationCap size={24} />
                    Target students in which regular grades?
                  </label>
                  <p className="text-sm text-purple-700 mb-4 italic">
                    Leave empty = all regular students
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {regularGradeOptions.map((g) => (
                      <label
                        key={g.value}
                        className={`flex items-center px-5 py-3 rounded-xl border-2 cursor-pointer transition-all text-base ${
                          gradesStudents.includes(g.value)
                            ? "bg-purple-100 border-purple-600 text-purple-800 shadow-sm"
                            : "bg-white border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={gradesStudents.includes(g.value)}
                          onChange={() => toggleSelection(g.value, setGradesStudents, gradesStudents)}
                          className="w-5 h-5 text-purple-600 rounded mr-3"
                        />
                        {g.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Programs */}
                <div className="bg-indigo-50/40 p-6 rounded-2xl border border-indigo-200">
                  <label className="block text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-3">
                    <BrainCircuit size={24} />
                    Target special student programs?
                  </label>
                  <p className="text-sm text-indigo-700 mb-4 italic">
                    Leave empty = no special program targeting
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {specialStudentCategories.map((cat) => (
                      <label
                        key={cat.value}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-base ${
                          specialStudents.includes(cat.value)
                            ? "bg-indigo-100 border-indigo-600 text-indigo-800 shadow-sm"
                            : "bg-white border-indigo-200 hover:bg-indigo-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={specialStudents.includes(cat.value)}
                          onChange={() => toggleSelection(cat.value, setSpecialStudents, specialStudents)}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                        <div className="flex items-center gap-2">
                          {cat.icon}
                          <span>{cat.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-4"
                >
                  <AlertCircle size={32} className="text-red-600 flex-shrink-0" />
                  <p className="text-red-800 font-medium text-lg">{errorMsg}</p>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-green-50 border-2 border-green-300 rounded-2xl flex items-center gap-4"
                >
                  <CheckCircle size={32} className="text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-bold text-lg">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 text-xl font-bold text-white rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:brightness-110"
              }`}
            >
              {loading ? "Publishing..." : (
                <>
                  <Megaphone size={28} />
                  Publish Announcement
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Published Announcements List */}
        <div className="mt-16 space-y-8">
          <h4 className="text-3xl font-bold text-gray-800 text-center md:text-left flex items-center gap-4">
            <Megaphone size={36} className="text-purple-600" />
            Published Announcements
          </h4>

          {announcements.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-600 shadow border border-purple-100">
              <p className="text-xl">No announcements yet.</p>
              <p className="mt-3">Create one using the form above.</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl shadow-xl border-l-8 ${
                  ann.is_active
                    ? "border-green-500 bg-gradient-to-r from-green-50 to-white"
                    : "border-gray-400 bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-5 mb-6">
                  <div>
                    <h5 className="text-2xl font-bold text-gray-900">{ann.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {ann.created_at ? new Date(ann.created_at).toLocaleString() : "Just now"}
                    </p>
                  </div>
                  <button
                    onClick={() => ann.id && toggleActive(ann.id, ann.is_active)}
                    className={`px-6 py-2.5 rounded-full font-medium transition min-w-[110px] ${
                      ann.is_active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {ann.is_active ? "Active" : "Inactive"}
                  </button>
                </div>

                <p className="text-gray-700 whitespace-pre-line mb-6 leading-relaxed text-base">
                  {ann.content}
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-5 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                    {getAudienceLabel(ann.target_audience)}
                  </span>

                  {(ann.target_grades_teachers?.length ?? 0) > 0 && (
                    <span className="px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                      Teachers: Grades {ann.target_grades_teachers?.join(", ")}
                    </span>
                  )}

                  {(ann.target_grades_students?.length ?? 0) > 0 && (
                    <span className="px-5 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
                      Students: Grades {ann.target_grades_students?.join(", ")}
                    </span>
                  )}

                  {(ann.target_special_students?.length ?? 0) > 0 && (
                    <span className="px-5 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                      Special: {ann.target_special_students
                        ?.map(v => specialStudentCategories.find(c => c.value === v)?.label || v)
                        .join(", ")}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HighSchoolDirectorAnnouncements;