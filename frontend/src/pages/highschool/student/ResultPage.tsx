import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  LayoutDashboard,
  FileText
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const ResultPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User session expired.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/free-exams/my-results`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(res.data);
      } catch (err: any) {
        setError("Unable to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Transcript</h1>
            <p className="text-slate-500 text-xs font-medium">Exam Performance History</p>
          </div>
          <button 
            onClick={() => navigate("/h-s-student/dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <LayoutDashboard size={14} /> Dashboard
          </button>
        </div>

        {error ? (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg border border-rose-100 text-xs font-bold mb-4">{error}</div>
        ) : results.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <Trophy className="mx-auto text-slate-200 mb-2" size={32} />
            <p className="text-slate-500 font-bold text-sm">No exam records found.</p>
          </div>
        ) : (
          /* ================= COMPACT TABLE ================= */
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-wider border-r border-slate-200">Exam Title</th>
                    <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-wider border-r border-slate-200">Date</th>
                    <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-wider border-r border-slate-200 text-center">Score</th>
                    <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-wider border-r border-slate-200 text-center">%</th>
                    <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-wider border-r border-slate-200">Status</th>
                    <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((exam) => (
                    <tr key={exam.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="px-4 py-2.5 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-indigo-500" />
                          <span className="font-bold text-slate-700 truncate max-w-[200px]">{exam.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 text-slate-500 font-medium">
                        {exam.date}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 text-center font-bold text-slate-600">
                        {exam.score} / {exam.total_questions}
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100 text-center">
                        <span className={`font-black ${exam.percentage >= 50 ? 'text-indigo-600' : 'text-rose-500'}`}>
                          {exam.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 border-r border-slate-100">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                          exam.status === "PASSED" ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {exam.status === "PASSED" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button 
                          onClick={() => navigate(`/h-s-student/exam-result/${exam.id}`)}
                          className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5"
                        >
                          Review <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Total Attempts: {results.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;