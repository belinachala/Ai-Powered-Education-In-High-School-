import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Tag, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  Lock
} from "lucide-react";

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
  status: "approved" | "pending_approval" | "rejected" | "draft"; 
}

const AvailableExams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // In a real app, get this from your Auth Context or decoded JWT token
  const studentGrade = "10"; 

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          setError("Please login first to view exams.");
          return;
        }

        // We call the generic endpoint. 
        // Our backend logic now automatically filters exams based on the Student role.
        const res = await axios.get(`${API_BASE_URL}/free-exams/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExams(res.data);
      } catch (err: any) {
        setError("Could not load exams. Please check your connection and try again.");
        console.error("Fetch Error:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading available exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Available Exams</h1>
            </div>
            <p className="text-gray-600">
              Showing exams for <span className="font-bold text-indigo-600">Grade {studentGrade}</span>
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium text-gray-500">
            Total Exams: {exams.length}
          </div>
        </header>

        {/* Exams Grid */}
        {exams.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm text-center border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">No Exams Found</h3>
            <p className="text-gray-500">There are no exams available for your grade level right now.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-200 flex flex-col group"
              >
                {/* Status Top Bar */}
                <div className={`h-2 w-full ${exam.status === 'approved' ? 'bg-green-500' : 'bg-amber-400'}`} />
                
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category & Status Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                      exam.category === "free" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {exam.category}
                    </span>
                    
                    {exam.status === "approved" ? (
                      <div className="flex items-center gap-1 text-green-600 font-bold text-[11px] uppercase">
                        <CheckCircle size={14} /> Approved
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 font-bold text-[11px] uppercase">
                        <Clock size={14} /> Pending
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h3>

                  <div className="space-y-3 mt-2 text-sm text-gray-600 mb-8 flex-1">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-400" />
                      <span className="font-medium">{exam.subject}</span>
                      <span className="text-gray-300">|</span>
                      <span>{exam.exam_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{exam.duration_minutes} Minutes Duration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{formatDate(exam.start_datetime)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/h-s-student/take_exam/${exam.id}`)}
                    disabled={exam.status !== "approved"}
                    className={`w-full py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm ${
                      exam.status === "approved" 
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {exam.status === "approved" ? (
                      <>
                        Start Examination
                        <ArrowRight size={18} />
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Waiting for Approval
                      </>
                    )}
                  </button>
                  
                  {exam.status !== "approved" && (
                    <p className="mt-3 text-[11px] text-amber-600 text-center font-medium bg-amber-50 py-1 rounded-lg">
                      You can start this exam once the director approves it.
                    </p>
                  )}
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