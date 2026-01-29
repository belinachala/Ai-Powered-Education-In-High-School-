import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  X,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8000";

/* ================= TYPES ================= */
interface MCQOption { key: string; text: string; }
interface MatchingPair { position: number; left_text: string; right_text: string; }

interface Question {
  id: number;
  type: "MCQ" | "TRUE_FALSE" | "BLANK" | "MATCHING";
  text: string;
  position: number;
  mcq_options?: MCQOption[];
  matching_pairs?: MatchingPair[];
}

interface ExamDetail {
  id: number;
  title: string;
  duration_minutes: number;
  questions: Question[];
  grade: string;
  subject: string;
}

const TakeExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // Exam States
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // User Profile States
  const [fullName, setFullName] = useState("Student");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Guard: Prevent API call if examId is invalid or literally ":examId"
    if (!examId || examId.startsWith(":")) {
      console.error("Invalid Exam ID detected in URL");
      return;
    }

    const fetchExamData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/free-exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(res.data);
        setTimeLeft(res.data.duration_minutes * 60);
      } catch (err) { 
        console.error("Fetch Exam Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/students/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.first_name && data.last_name) {
          setFullName(`${data.first_name} ${data.last_name}`);
        }
        if (data.profile_picture_url) {
          const imgPath = data.profile_picture_url.replaceAll("\\", "/");
          setProfileImage(`${API_BASE_URL}/${imgPath}?t=${Date.now()}`);
        }
      } catch (err) {
        setFullName("Student");
        setProfileImage(null);
      }
    };

    fetchExamData();
    fetchProfile();
  }, [examId, navigate]);

  /* ================= SUBMISSION LOGIC ================= */
  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting || !examId || examId.startsWith(":")) return;
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/free-exams/${examId}/submit`,
        answers, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const finalResultId = response.data.id;

      if (finalResultId) {
        // Navigate to the dynamic result URL
        navigate(`/h-s-student/exam-result/${finalResultId}`);
      } else {
        navigate("/h-s-student/dashboard");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting exam.");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, examId, isSubmitting, navigate]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || !exam) {
      if (timeLeft === 0 && exam) handleFinalSubmit(); 
      return;
    }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam, handleFinalSubmit]);

  if (loading || !exam) return <div className="p-10 text-slate-500 font-medium">Loading Exam Environment...</div>;

  const currentQuestion = exam.questions[currentIndex];
  
  const isAnswered = (id: number) => {
    const ans = answers[id];
    if (!ans) return false;
    return ans.trim() !== "" && !ans.split(",").every(part => part === "");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-[400px] p-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Submit all and finish?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Once you submit, you will no longer be able to change your answers for this attempt.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-bold text-white bg-[#005a9c] hover:bg-[#004a80] rounded shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit all and finish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg text-slate-700">School Of Excellence |</span>
        </div>
        
        <div className="flex items-center gap-5 text-slate-500">
          <div className="flex items-center gap-2 text-rose-600 font-mono font-bold text-sm bg-rose-50 px-3 py-1 rounded-md border border-rose-100">
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
          
          <div className="flex items-center gap-2 border-l pl-4 relative">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
            ) : (
              <FaUserCircle size={24} className="text-slate-400" />
            )}
            <span className="text-xs font-bold text-slate-700 uppercase hidden sm:block">{fullName}</span> 
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto p-4 md:p-8"> 
        <div className="flex gap-6 text-sm text-blue-600 mb-6 border-b border-slate-200">
          <h6 className="pb-3 font-medium">Subject: <span className="text-green-600 font-bold">{exam.subject}</span></h6>
        </div>

        {!isReviewing ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row gap-8 shadow-sm h-fit">
              <div className="w-full md:w-36 flex flex-col gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-[11px] space-y-2">
                  <h4 className="font-bold text-sm text-slate-800">Question {currentIndex + 1}</h4>
                  <h6 className={`${isAnswered(currentQuestion.id) ? "text-slate-700" : "text-slate-500"} font-medium`}>
                    {isAnswered(currentQuestion.id) ? "Answered" : "Not yet answered"}
                  </h6>
                  <h6 className="text-slate-400">Marked out of 1.00</h6>
                  <button 
                    onClick={() => setFlagged(p => ({ ...p, [currentQuestion.id]: !p[currentQuestion.id] }))}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 mt-2 transition-colors"
                  >
                    <Flag size={12} fill={flagged[currentQuestion.id] ? "#475569" : "none"} /> 
                    <span className="text-[10px] font-bold">Flag question</span>
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-[#eef7fa] p-8 rounded-lg mb-8 border border-blue-50">
                  <p className="text-slate-800 text-[16px] leading-relaxed mb-6 font-medium">{currentQuestion.text}</p>
                  
                  <div className="space-y-4">
                    {(currentQuestion.type === "MCQ" || currentQuestion.type === "TRUE_FALSE") && (
                      <div className="flex flex-col gap-3">
                        {(currentQuestion.type === "MCQ" ? currentQuestion.mcq_options : [{key: 'a', text: 'True'}, {key: 'b', text: 'False'}])?.map((opt: any) => (
                          <label key={opt.key} className="flex items-start gap-4 cursor-pointer group py-1">
                            <input 
                              type="radio" 
                              name={`q-${currentQuestion.id}`}
                              checked={answers[currentQuestion.id] === opt.key}
                              onChange={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt.key }))}
                              className="mt-1 w-4 h-4 accent-blue-600" 
                            />
                            <span className="text-sm text-slate-700 group-hover:text-black">{opt.key}. {opt.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === "BLANK" && (
                      <div className="mt-4">
                        <label className="text-xs font-bold text-blue-800 uppercase mb-2 block tracking-tight">Answer:</label>
                        <input 
                          type="text"
                          className="w-full md:w-2/3 p-3 bg-white border border-slate-300 rounded shadow-inner text-sm outline-none focus:border-blue-500"
                          value={answers[currentQuestion.id] || ""}
                          onChange={(e) => setAnswers(p => ({ ...p, [currentQuestion.id]: e.target.value }))}
                          placeholder="Type your response here..."
                        />
                      </div>
                    )}

                    {currentQuestion.type === "MATCHING" && (
                      <div className="space-y-4 mt-2">
                        {currentQuestion.matching_pairs?.map((pair, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/50 p-3 rounded-md">
                            <span className="flex-1 text-sm font-semibold text-slate-700">{pair.left_text}</span>
                            <select 
                              className="w-full sm:w-56 p-2 bg-white border border-slate-300 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                              value={answers[currentQuestion.id]?.split(",")[idx] || ""}
                              onChange={(e) => {
                                  const parts = (answers[currentQuestion.id] || "").split(",");
                                  const newArr = Array.from({ length: currentQuestion.matching_pairs?.length || 0 }, (_, i) => parts[i] || "");
                                  newArr[idx] = e.target.value;
                                  setAnswers(p => ({ ...p, [currentQuestion.id]: newArr.join(",") }));
                              }}
                            >
                              <option value="">Choose...</option>
                              {currentQuestion.matching_pairs?.map((p, i) => (
                                <option key={i} value={p.right_text}>{p.right_text}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 border-t pt-6 border-slate-100">
                  <button 
                    onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-2 rounded-md font-semibold hover:bg-slate-200 transition-all text-sm disabled:opacity-30 shadow-sm border border-slate-200"
                  >
                    <ChevronLeft size={16} /> Previous page
                  </button>
                  <button 
                    onClick={() => {
                      if (currentIndex === exam.questions.length - 1) setIsReviewing(true);
                      else setCurrentIndex(p => p + 1);
                    }}
                    className="px-8 py-2.5 rounded-md font-bold transition-all text-sm shadow-md text-white bg-[#005a9c] hover:bg-[#004a80]"
                  >
                    {currentIndex === exam.questions.length - 1 ? "Finish Attempt" : "Next page"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="w-full lg:w-[350px] shrink-0">
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm sticky top-24">
                  <div className="flex justify-between items-center mb-5">
                     <h5 className="font-bold text-slate-800 text-sm">Quiz navigation</h5>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {exam.questions.map((q, idx) => {
                      const isAns = isAnswered(q.id);
                      const isCurr = idx === currentIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-8 h-10 border transition-all text-xs font-bold relative rounded-sm ${isCurr ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'} ${isAns ? 'bg-slate-100' : 'bg-white'}`}
                        >
                          <span className="relative z-10">{idx + 1}</span>
                          {flagged[q.id] && <div className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full" />}
                          {isAns && <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-400 opacity-60"></div>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <button onClick={() => setIsReviewing(true)} className="text-xs text-blue-600 font-bold hover:underline text-left">Finish attempt ...</button>
                  </div>
              </div>
            </aside>
          </div>
        ) : (
          /* ================= SUMMARY VIEW ================= */
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold">Summary of attempt</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 font-bold text-slate-600">
                  <tr>
                    <th className="p-4">Question</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exam.questions.map((q, idx) => (
                    <tr key={q.id}>
                      <td className="p-4 font-bold">Question {idx + 1}</td>
                      <td className="p-4">
                        {isAnswered(q.id) ? (
                          <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Answered</span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={14}/> Not yet answered</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => { setIsReviewing(false); setCurrentIndex(idx); }} className="text-blue-600 hover:underline">Return to attempt</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 border-t flex flex-col items-center gap-4">
              <p className="text-slate-500 text-sm">You can return to the attempt to change your answers before final submission.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsReviewing(false)} className="px-6 py-2 bg-slate-100 rounded font-bold text-sm">Back to quiz</button>
                <button 
                  onClick={() => setShowConfirmModal(true)} 
                  className="px-6 py-2 bg-[#005a9c] text-white rounded font-bold text-sm flex items-center gap-2"
                >
                  <Send size={14} /> Submit all and finish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExamPage;