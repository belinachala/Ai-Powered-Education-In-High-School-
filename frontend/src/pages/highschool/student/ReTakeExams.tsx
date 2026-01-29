import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  RotateCcw, 
  BookOpen, 
  LayoutDashboard, 
  Search, 
  ArrowRight,
  Clock,
  Trophy,
  History,
  AlertCircle
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const ReTakeExams: React.FC = () => {
  const [takenExams, setTakenExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTakenExams = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      try {
        // Fetching history from my-results
        const res = await axios.get(`${API_BASE_URL}/free-exams/my-results`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        /** 
         * Logic: Group results by exam_id so each exam appears once.
         * This allows the student to retake any exam they have finished at least once.
         */
        const uniqueExams = Array.from(
          new Map(res.data.map((item: any) => [item.exam_id, item])).values()
        );
        
        setTakenExams(uniqueExams);
      } catch (err) {
        console.error("Error fetching taken exams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTakenExams();
  }, [navigate]);

  const filteredExams = takenExams.filter(exam =>
    exam.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-100">
                <RotateCcw size={22} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                EXAM <span className="text-indigo-600">RETAKES</span>
              </h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Review your previous performance and try for a perfect score.
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/h-s-student/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-[11px] uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            <LayoutDashboard size={14} className="text-indigo-500" /> 
            Dashboard
          </button>
        </div>

        {/* --- Toolbar --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search by exam title..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none shadow-sm shadow-slate-100"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <History className="text-indigo-600" size={18} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Retakes</span>
            </div>
            <span className="text-xl font-black text-slate-900">{takenExams.length}</span>
          </div>
        </div>

        {/* --- Exams Grid --- */}
        {filteredExams.length === 0 ? (
          <div className="bg-white py-20 rounded-[2rem] border-2 border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-slate-300" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">No Exams to Retake</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
              Complete your first exam to see it appear here for a retake attempt.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div 
                key={exam.exam_id} 
                className="bg-white border border-slate-200 rounded-[1.5rem] p-6 hover:border-indigo-400 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <BookOpen size={20} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-amber-500 mb-0.5">
                      <Trophy size={10} />
                      <p className="text-[9px] font-black uppercase tracking-widest">Previous</p>
                    </div>
                    <p className={`text-lg font-black ${exam.percentage >= 50 ? 'text-green-600' : 'text-rose-500'}`}>
                      {exam.percentage}%
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-700 transition-colors">
                    {exam.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-300" /> {exam.duration_minutes || '0'} min
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{exam.total_questions} Qs</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/h-s-student/take_exam/${exam.exam_id}`)}
                  className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-100 group-hover:shadow-indigo-100"
                >
                  New Attempt <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReTakeExams;