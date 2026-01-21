// FreeExamCreation.tsx
// Fully corrected version with "Exam Category" (Free / Paid) selection and badge left of the title.
// No price field — only category label is added and sent to backend.

import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Calendar,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

type Grade = "" | "9" | "10" | "11" | "12" | "Entrance" | "Remedial";
type Stream = "" | "Natural" | "Social";
type QuestionType = "MCQ" | "TRUE_FALSE" | "BLANK" | "MATCHING";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: { A: string; B: string; C: string; D: string };
  answer: string;
  matches?: { left: string; right: string }[];
}

const SUBJECTS: Record<Grade, { common?: string[]; natural?: string[]; social?: string[] }> = {
  "": {},
  "9": {
    common: [
      "English", "Mathematics", "Biology", "Physics", "Chemistry",
      "History", "Geography", "Civics", "ICT", "Afaan Oromoo", "Amharic"
    ],
  },
  "10": {
    common: [
      "English", "Mathematics", "Biology", "Physics", "Chemistry",
      "History", "Geography", "Civics", "ICT", "Afaan Oromoo", "Amharic"
    ],
  },
  "11": {
    natural: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Aptitude"],
    social: ["Mathematics", "History", "Geography", "Economics", "English", "Aptitude"],
  },
  "12": {
    natural: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Aptitude"],
    social: ["Mathematics", "History", "Geography", "Economics", "English", "Aptitude"],
  },
  Entrance: {
    natural: ["Mathematics", "Physics", "Biology", "English", "Aptitude"],
    social: ["Mathematics", "History", "Geography", "Economics", "English", "Aptitude"],
  },
  Remedial: {
    natural: ["Mathematics", "Physics", "Biology", "English", "Aptitude"],
    social: ["Mathematics", "History", "Geography", "Economics", "English", "Aptitude"],
  },
};

const FreeExamCreation: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [examTitle, setExamTitle] = useState("");
  const [examType, setExamType] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [grade, setGrade] = useState<Grade>("");
  const [stream, setStream] = useState<Stream>("");
  const [subject, setSubject] = useState("");
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // NEW: category state only (no price)
  const [category, setCategory] = useState<"free" | "paid">("free");

  const [publishLoading, setPublishLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>("MCQ");
  const [questionCount, setQuestionCount] = useState<number>(1);

  // Use the SAME token key as your working TeacherUploadForm.tsx
  const getAuthToken = () => localStorage.getItem("token") || "";

  const subjects =
    grade === "9" || grade === "10"
      ? SUBJECTS[grade]?.common || []
      : grade && stream
      ? SUBJECTS[grade]?.[stream.toLowerCase() as "natural" | "social"] || []
      : [];

  const getQuestionDisplayNumber = (currentIndex: number): number => {
    let total = 0;
    for (let i = 0; i < currentIndex; i++) {
      const q = questions[i];
      total += q.type === "MATCHING" && q.matches ? q.matches.length : 1;
    }
    return total + 1;
  };

  const addNewQuestions = () => {
    if (questionCount < 1) {
      alert("Please enter a number of questions (1 or more)");
      return;
    }

    const newQs: Question[] = [];
    for (let i = 0; i < questionCount; i++) {
      const id = `${Date.now()}-${i}`;
      let q: Question;

      switch (newQuestionType) {
        case "MCQ":
          q = { id, type: "MCQ", text: "", options: { A: "", B: "", C: "", D: "" }, answer: "" };
          break;
        case "TRUE_FALSE":
          q = { id, type: "TRUE_FALSE", text: "", answer: "True" };
          break;
        case "BLANK":
          q = { id, type: "BLANK", text: "", answer: "" };
          break;
        case "MATCHING":
          q = {
            id,
            type: "MATCHING",
            text: "",
            matches: Array(4).fill(null).map(() => ({ left: "", right: "" })),
            answer: "",
          };
          break;
        default:
          continue;
      }
      newQs.push(q);
    }

    setQuestions((prev) => [...prev, ...newQs]);
    setShowAddForm(false);
    setQuestionCount(1);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const isQuestionValid = (q: Question): boolean => {
    if (q.type !== "MATCHING" && !q.text?.trim()) return false;

    switch (q.type) {
      case "MCQ":
        return (
          !!q.options &&
          Object.values(q.options).every((v) => v.trim()) &&
          ["A", "B", "C", "D"].includes(q.answer)
        );
      case "TRUE_FALSE":
        return ["True", "False"].includes(q.answer);
      case "BLANK":
        return !!q.answer?.trim();
      case "MATCHING":
        if (!q.matches?.length) return false;
        const answers = q.answer.split(/[\s,]+/).filter(Boolean);
        return (
          q.matches.every((m) => m.left.trim() && m.right.trim()) &&
          answers.length === q.matches.length &&
          answers.every((a) => /^[A-Z]$/.test(a)) &&
          new Set(answers).size === answers.length // no duplicates
        );
      default:
        return false;
    }
  };

  const isPublishDisabled =
    !examTitle.trim() ||
    !examType.trim() ||
    !grade ||
    !subject ||
    !startDateTime ||
    questions.length === 0 ||
    publishLoading ||
    questions.some((q) => !isQuestionValid(q));

  const handlePublish = async () => {
    if (!window.confirm("Are you sure you want to publish this exam?")) return;

    setPublishLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const token = getAuthToken();

    if (!token) {
      setErrorMsg("You are not logged in. Please log in again.");
      setPublishLoading(false);
      return;
    }

    console.log("DEBUG: Using token:", token.substring(0, 20) + "..."); // partial log for security

    try {
      // Clean data
      const cleanedQuestions = questions.map((q) => {
        if (q.type === "MCQ" && q.options) {
          return {
            ...q,
            options: Object.fromEntries(
              Object.entries(q.options).map(([k, v]) => [k, v.trim()])
            ),
          };
        }
        return {
          ...q,
          text: q.text.trim(),
          answer: q.answer.trim(),
        };
      });

      const totalItems = questions.reduce(
        (sum, q) => sum + (q.type === "MATCHING" && q.matches ? q.matches.length : 1),
        0
      );

      const payload = {
        title: examTitle.trim(),
        exam_type: examType.trim(),
        grade,
        stream: stream || null,
        subject: subject.trim(),
        duration_minutes: duration,
        start_datetime: startDateTime,
        questions: cleanedQuestions,
        total_questions: totalItems,
        // include only category (no price)
        category,
      };

      console.log("DEBUG: Sending payload to:", `${API_BASE_URL}/free-exams/`);

      const response = await axios.post(
        `${API_BASE_URL}/free-exams/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("DEBUG: Publish success!", response.status);

      setSuccessMsg("Exam submitted successfully! Waiting for director approval.");

      // Reset form after success
      setExamTitle("");
      setExamType("");
      setDuration(60);
      setGrade("");
      setStream("");
      setSubject("");
      setStartDateTime("");
      setQuestions([]);
      setShowAddForm(false);
      setCategory("free");

    } catch (err: any) {
      console.error("Publish failed with error:", err);

      let message = "Failed to publish exam. Please try again.";

      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const detail = err.response.data?.detail;

        if (status === 401) {
          message = "Authentication failed. Please log in again.";
        } else if (status === 400 || status === 422) {
          message = detail || "Invalid data. Please check all fields.";
        } else if (status === 500) {
          message = "Server error. Please contact support.";
        } else {
          message = detail || `Server responded with error ${status}`;
        }
      } else if (err.request) {
        // No response received (network issue)
        message = "No response from server. Check your internet connection.";
      } else {
        // Something else (e.g. setup error)
        message = err.message || "Unknown error occurred.";
      }

      setErrorMsg(message);
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-700 transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-8 py-10 text-white">
          <div className="flex items-center gap-4">
            <CheckCircle size={40} />
            <h1 className="text-3xl font-bold">Create New Exam</h1>
          </div>
          <p className="mt-2 opacity-90">Date: {today}</p>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          {/* Exam Info */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-4">
              {/* Category badge left of title */}
              <div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    category === "free" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {category === "free" ? "Free" : "Paid"}
                </div>

                {/* toggle */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setCategory("free")}
                    className={`px-3 py-1 rounded-md text-sm ${category === "free" ? "bg-emerald-600 text-white" : "bg-white border"}`}
                    type="button"
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setCategory("paid")}
                    className={`px-3 py-1 rounded-md text-sm ${category === "paid" ? "bg-amber-600 text-white" : "bg-white border"}`}
                    type="button"
                  >
                    Paid
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Mathematics – Unit 1 & 2 Test"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                placeholder="Midterm / Final / Quiz / Entrance / Remedial program"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <Clock className="text-indigo-600" size={20} />
                <input
                  type="number"
                  min="1"
                  className="w-full outline-none"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition">
                <Calendar className="text-indigo-600" size={20} />
                <input
                  type="datetime-local"
                  className="w-full outline-none"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value as Grade);
                  setStream("");
                  setSubject("");
                }}
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
                <option value="Entrance">Entrance</option>
                <option value="Remedial">Remedial</option>
              </select>
            </div>

            {(grade === "11" || grade === "12" || grade === "Entrance" || grade === "Remedial") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={stream}
                  onChange={(e) => {
                    setStream(e.target.value as Stream);
                    setSubject("");
                  }}
                >
                  <option value="">Select Stream</option>
                  <option value="Natural">Natural Science</option>
                  <option value="Social">Social Science</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!subjects.length}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Questions (total items: {questions.reduce((sum, q) => sum + (q.type === "MATCHING" && q.matches ? q.matches.length : 1), 0)})
              </h2>

              {questions.map((q, qIndex) => {
                const baseNumber = getQuestionDisplayNumber(qIndex);

                return (
                  <div
                    key={q.id}
                    className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove question"
                    >
                      <Trash2 size={22} />
                    </button>

                    {q.type !== "MATCHING" ? (
                      <div className="flex items-center gap-4 mb-5">
                        <span className="text-3xl font-extrabold text-indigo-700">
                          {baseNumber}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full uppercase">
                          {q.type.replace("_", " ")}
                        </span>
                      </div>
                    ) : null}

                    {q.type !== "MATCHING" && (
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none resize-y transition"
                        placeholder="Write question here..."
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      />
                    )}

                    {/* MCQ */}
                    {q.type === "MCQ" && q.options && (
                      <div className="space-y-3">
                        {(["A", "B", "C", "D"] as const).map((opt) => (
                          <div
                            key={opt}
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                              q.answer === opt ? "bg-green-50 border-green-400" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <span className="font-bold w-10 text-center text-lg">{opt}.</span>
                            <input
                              className="flex-1 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                              value={q.options![opt]}
                              onChange={(e) =>
                                updateQuestion(q.id, {
                                  options: { ...q.options!, [opt]: e.target.value },
                                })
                              }
                              placeholder={`Option ${opt}`}
                            />
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.answer === opt}
                              onChange={() => updateQuestion(q.id, { answer: opt })}
                              className="w-5 h-5 accent-indigo-600"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TRUE/FALSE */}
                    {q.type === "TRUE_FALSE" && (
                      <div className="flex gap-16 mt-4">
                        {["True", "False"].map((val) => (
                          <label key={val} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`tf-${q.id}`}
                              value={val}
                              checked={q.answer === val}
                              onChange={() => updateQuestion(q.id, { answer: val })}
                              className="w-5 h-5 accent-indigo-600"
                            />
                            <span className="text-lg font-medium">{val}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* BLANK */}
                    {q.type === "BLANK" && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer
                        </label>
                        <input
                          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                          value={q.answer}
                          onChange={(e) => updateQuestion(q.id, { answer: e.target.value })}
                          placeholder="Type the correct answer..."
                        />
                      </div>
                    )}

                    {/* MATCHING */}
                    {q.type === "MATCHING" && q.matches && (
                      <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gray-50 p-5 rounded-lg border">
                            <h4 className="font-bold text-lg mb-4 text-center text-gray-800">Column A</h4>
                            {q.matches.map((pair, idx) => (
                              <div key={idx} className="flex items-center gap-4 mb-4">
                                <span className="font-bold w-10 text-right text-base">
                                  {baseNumber + idx}.
                                </span>
                                <input
                                  className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                  value={pair.left}
                                  onChange={(e) => {
                                    const newMatches = [...q.matches!];
                                    newMatches[idx].left = e.target.value;
                                    updateQuestion(q.id, { matches: newMatches });
                                  }}
                                  placeholder="Item / Term / Person"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(q.id, {
                                  matches: [...q.matches!, { left: "", right: "" }],
                                })
                              }
                              className="mt-3 w-full py-2.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition text-sm font-medium"
                            >
                              + Add item
                            </button>
                          </div>

                          <div className="bg-gray-50 p-5 rounded-lg border">
                            <h4 className="font-bold text-lg mb-4 text-center text-gray-800">Column B</h4>
                            {q.matches.map((pair, idx) => {
                              const letter = String.fromCharCode(65 + idx);
                              return (
                                <div key={idx} className="flex items-center gap-4 mb-4">
                                  <span className="font-bold w-10 text-center text-base">
                                    {letter}.
                                  </span>
                                  <input
                                    className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={pair.right}
                                    onChange={(e) => {
                                      const newMatches = [...q.matches!];
                                      newMatches[idx].right = e.target.value;
                                      updateQuestion(q.id, { matches: newMatches });
                                    }}
                                    placeholder="Description / Definition"
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-gray-50 p-5 rounded-lg border">
                            <h4 className="font-bold text-lg mb-4 text-center text-gray-800">Answers</h4>
                            {q.matches.map((_, idx) => (
                              <div key={idx} className="flex items-center gap-4 mb-4">
                                <span className="font-bold w-10 text-right text-base">
                                  {baseNumber + idx}.
                                </span>
                                <input
                                  type="text"
                                  maxLength={1}
                                  className="w-16 p-3 text-center border rounded-md uppercase font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                  value={q.answer.split(/[\s,]+/)[idx] || ""}
                                  onChange={(e) => {
                                    const val = e.target.value.toUpperCase().trim();
                                    if (val === "" || /^[A-Z]$/.test(val)) {
                                      const arr = q.answer.split(/[\s,]+/).filter(Boolean);
                                      arr[idx] = val;
                                      updateQuestion(q.id, { answer: arr.join(" ") });
                                    }
                                  }}
                                  placeholder="_"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Questions Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-md"
              disabled={publishLoading}
            >
              <PlusCircle size={24} />
              Add New Questions
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-white border rounded-xl p-8 mt-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Questions</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <select
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="BLANK">Fill in the Blank</option>
                    <option value="MATCHING">Matching</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  disabled={publishLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={addNewQuestions}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  disabled={publishLoading}
                >
                  Add {questionCount} {questionCount === 1 ? "Question" : "Questions"}
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          {successMsg && (
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl text-green-800 font-medium mt-8">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-red-800 font-medium mt-8">
              {errorMsg}
            </div>
          )}

          {/* Publish Button */}
          <button
            disabled={isPublishDisabled || publishLoading}
            onClick={handlePublish}
            className={`w-full py-5 rounded-xl text-lg font-bold transition-all mt-10 flex items-center justify-center gap-2 ${
              isPublishDisabled || publishLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:brightness-110 shadow-lg"
            }`}
          >
            {publishLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle size={22} />
                Publish & Schedule Exam
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeExamCreation;