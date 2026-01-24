import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, Clock, Calendar, Tag, ArrowRight } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

interface Exam {
  id: string;
  title: string;
  exam_type: string;
  grade: string;
  stream: string | null;
  subject: string;
  duration_minutes: number;
  start_datetime: string;
  category: "free" | "paid";
  total_questions: number;
  status: string; // we only show "approved"
}

const AvailableExams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // You can get student grade from auth context / profile / token
  // For demo — let's assume it's stored or hardcoded
  const studentGrade = "10"; // ← replace with real value from auth

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          setError("Please login first");
          return;
        }

        // Option 1: filter by grade on backend (recommended)
        const res = await axios.get(
          `${API_BASE_URL}/free-exams/?status=approved&grade=${studentGrade}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Option 2: get all and filter on frontend
        // const res = await axios.get(`${API_BASE_URL}/free-exams/`, { ... });

        setExams(res.data.filter((e: Exam) => e.status === "approved"));
      } catch (err: any) {
        setError("Could not load exams. Try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) return <div className="p-10 text-center">Loading available exams...</div>;
  if (error) return <div className="p-10 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={32} />
          Available Exams – Grade {studentGrade}
        </h1>

        {exams.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500 mt-8">
            No approved exams available for your grade yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {exam.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        exam.category === "free"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {exam.category}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Tag size={16} />
                      <span>
                        {exam.subject} • {exam.exam_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{exam.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Starts: {formatDate(exam.start_datetime)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/student/take-exam/${exam.id}`)}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium"
                  >
                    Start Exam
                    <ArrowRight size={18} />
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

export default AvailableExams;