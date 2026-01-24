import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Eye, Loader2, Search } from "lucide-react";
 
const API_BASE_URL =
  typeof window !== "undefined" && (window as any).__API_BASE_URL
    ? (window as any).__API_BASE_URL
    : "http://localhost:8000";

const getAuthToken = () => {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

/* -------------------- Types -------------------- */
type QuestionType = "MCQ" | "TRUE_FALSE" | "BLANK" | "MATCHING";

type MCQOption = { key: string; text: string };
type MatchingPair = { position: number; left_text: string; right_text: string };

type QuestionOut = {
  id: number;
  client_id?: string | null;
  type: QuestionType;
  text?: string | null;
  answer?: string | null;
  position: number;
  mcq_options?: MCQOption[] | null;
  matching_pairs?: MatchingPair[] | null;
};

type FreeExamSummary = {
  id: number;
  title: string;
  subject: string;
  grade: string;
  status: string;
  total_questions: number;
  start_datetime?: string | null;
  created_at?: string | null;
};

type FreeExamDetail = FreeExamSummary & {
  questions: QuestionOut[];
};

/* -------------------- Helpers -------------------- */
const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const statusBadge = (status?: string) => {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-green-100 text-green-800";
  if (s === "pending_approval" || s === "pending") return "bg-yellow-100 text-yellow-800";
  if (s === "rejected") return "bg-red-100 text-red-800";
  return "bg-indigo-100 text-indigo-800";
};

/* -------------------- Component -------------------- */
const TeacherMyExam: React.FC = () => {
  const [exams, setExams] = useState<FreeExamSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedExam, setSelectedExam] = useState<FreeExamDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Editing state
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editModel, setEditModel] = useState<any>(null);

  // Fetch exam list on mount
  useEffect(() => {
    let cancelled = false;
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const resp = await axios.get(`${API_BASE_URL}/free-exams/`, { headers, timeout: 8000 });
        const data = resp.data;
        const list: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.results)
          ? data.results
          : [];
        const normalized = list.map((it: any) => ({
          id: Number(it.id),
          title: it.title ?? "Untitled",
          subject: it.subject ?? "Unknown",
          grade: it.grade ?? "N/A",
          status: it.status ?? "unknown",
          total_questions: Number(it.total_questions ?? it.totalQuestions ?? 0),
          start_datetime: it.start_datetime ?? it.created_at ?? null,
          created_at: it.created_at ?? null,
        })) as FreeExamSummary[];
        if (!cancelled) setExams(normalized);
      } catch (err: any) {
        console.error("Failed to fetch exams", err);
        if (!cancelled) {
          setError(err?.response?.data?.detail ?? "Failed to load exams from server");
          setExams([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchList();
    return () => {
      cancelled = true;
    };
  }, []);

  // Open exam detail (fetch)
  const openDetail = async (examId: number) => {
    setSelectedExam(null);
    setDetailError(null);
    setDetailLoading(true);
    setModalOpen(true);
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const resp = await axios.get<FreeExamDetail>(`${API_BASE_URL}/free-exams/${examId}`, { headers, timeout: 8000 });
      // Ensure questions sorted by position for UI consistency
      const exam = resp.data;
      exam.questions = (exam.questions ?? []).slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      setSelectedExam(exam);
    } catch (err: any) {
      console.error("Failed to fetch exam detail", err);
      setDetailError(err?.response?.data?.detail ?? "Failed to load exam details");
      setModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedExam(null);
    setDetailError(null);
    setEditingQuestionId(null);
    setEditModel(null);
  };

  const filtered = useMemo(
    () =>
      exams
        .filter((e) =>
          `${e.title} ${e.subject} ${e.grade}`.toLowerCase().includes(query.trim().toLowerCase())
        )
        .filter((e) => (statusFilter ? e.status === statusFilter : true)),
    [exams, query, statusFilter]
  );

  /* ---------- Editing helpers ---------- */
  const beginEdit = (q: QuestionOut) => {
    setEditingQuestionId(q.id);
    if (q.type === "MCQ") {
      const opts: MCQOption[] = (q.mcq_options ?? []).map((o: any) => ({ key: String(o.key), text: String(o.text) }));
      // ensure A-D present
      const has = new Set(opts.map((o) => o.key));
      ["A", "B", "C", "D"].forEach((k) => {
        if (!has.has(k)) opts.push({ key: k, text: "" });
      });
      setEditModel({ text: q.text ?? "", answer: q.answer ?? "", mcq_options: opts });
    } else if (q.type === "MATCHING") {
      const pairs = (q.matching_pairs ?? []).map((p) => ({ position: p.position ?? 0, left_text: p.left_text ?? "", right_text: p.right_text ?? "" }));
      setEditModel({ matches: pairs, answer: q.answer ?? "" });
    } else {
      setEditModel({ text: q.text ?? "", answer: q.answer ?? "" });
    }
  };

  const cancelEdit = () => {
    setEditingQuestionId(null);
    setEditModel(null);
  };

  const saveEdit = async (questionId: number) => {
    if (!selectedExam) return;
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const payload: any = {};
      if (editModel.text !== undefined) payload.text = editModel.text;
      if (editModel.answer !== undefined) payload.answer = editModel.answer;
      if (editModel.mcq_options !== undefined) {
        payload.mcq_options = editModel.mcq_options.map((o: any) => ({ key: o.key, text: o.text }));
      }
      if (editModel.matches !== undefined) {
        // mapping to expected matching_pairs: left_text/right_text
        payload.matching_pairs = editModel.matches.map((m: any) => ({ left_text: m.left_text, right_text: m.right_text }));
      }

      const resp = await axios.patch(
        `${API_BASE_URL}/free-exams/${selectedExam.id}/questions/${questionId}`,
        payload,
        { headers, timeout: 8000 }
      );

      const updatedQuestion: QuestionOut = resp.data;
      setSelectedExam((prev) => {
        if (!prev) return prev;
        const newQs = prev.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));
        return { ...prev, questions: newQs };
      });

      setEditingQuestionId(null);
      setEditModel(null);
    } catch (err: any) {
      console.error("Failed to save question update", err);
      alert(err?.response?.data?.detail ?? "Failed to save changes");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <header className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h4 className="text-3xl font-extrabold text-slate-900">My Created Exams</h4>
            <p className="text-sm text-slate-600 mt-1">Open an exam to view and edit questions.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title / subject / grade"
                className="pl-9 pr-3 py-2 border rounded-lg shadow-sm w-64"
              />
            </div>

            <select
              className="px-3 py-2 border rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending_approval">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-md text-center">No exams found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ex) => (
              <div key={ex.id} className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h6 className="text-lg font-semibold text-slate-800">{ex.title}</h6>
                      <p className="text-sm text-slate-500 mt-1">{ex.subject} Grade {ex.grade}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(ex.status)}`}>
                      {ex.status.replace("_", " ").toLowerCase()}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-slate-600">
                    <div>Total Questions: <strong>{ex.total_questions}</strong></div>
                    <div className="mt-1">Start: <strong>{fmtDate(ex.start_datetime)}</strong></div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => openDetail(ex.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Eye size={14} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-auto max-h-[85vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{selectedExam?.title ?? "Exam details"}</h3>
                <p className="text-sm text-slate-500">{selectedExam ? `${selectedExam.subject} • Grade ${selectedExam.grade}` : ""}</p>
              </div>
              <button onClick={closeModal} className="px-3 py-1 border rounded">Close</button>
            </div>

            <div className="p-4 space-y-4">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
              ) : detailError ? (
                <div className="bg-red-50 text-red-800 p-3 rounded">{detailError}</div>
              ) : selectedExam ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="p-2 bg-indigo-50 rounded">{selectedExam.status}</div>
                    <div className="p-2 bg-white border rounded">Start: {fmtDate(selectedExam.start_datetime)}</div>
                    <div className="p-2 bg-white border rounded">Items: {selectedExam.total_questions}</div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Questions</h4>
                    <div className="mt-3 space-y-3">
                      {selectedExam.questions.length === 0 ? (
                        <div className="p-3 bg-slate-50 rounded">No questions</div>
                      ) : (
                        selectedExam.questions.map((q) => {
                          const isEditing = editingQuestionId === q.id;
                          return (
                            <div key={q.id} className="p-3 border rounded">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-sm">{q.type}</div>
                                      {isEditing ? (
                                        <input
                                          value={editModel?.text ?? ""}
                                          onChange={(e) => setEditModel((s: any) => ({ ...s, text: e.target.value }))}
                                          className="mt-2 w-full border rounded px-2 py-1"
                                        />
                                      ) : (
                                        q.text && <div className="mt-2 text-sm">{q.text}</div>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-400">{q.client_id ?? q.id}</div>
                                  </div>

                                  {/* MCQ */}
                                  {q.type === "MCQ" && (
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {(isEditing ? (editModel?.mcq_options || []) : (q.mcq_options || [])).map((opt: any, idx: number) => {
                                        const key = opt.key ?? String.fromCharCode(65 + idx);
                                        const text = opt.text ?? "";
                                        const currentAnswer = isEditing ? editModel?.answer : q.answer;
                                        const isCorrect = (currentAnswer || "").trim() === key;
                                        return (
                                          <div key={key + idx} className={`p-2 rounded ${isCorrect ? "bg-green-50" : ""}`}>
                                            <div className="flex items-center gap-2">
                                              <div className="font-semibold">{key}.</div>
                                              {isEditing ? (
                                                <input
                                                  value={text}
                                                  onChange={(e) =>
                                                    setEditModel((s: any) => {
                                                      const opts = (s.mcq_options || []).map((o: any) => (o.key === key ? { ...o, text: e.target.value } : o));
                                                      return { ...s, mcq_options: opts };
                                                    })
                                                  }
                                                  className="flex-1 border rounded px-2 py-1"
                                                />
                                              ) : (
                                                <div className="text-sm">{text}</div>
                                              )}
                                              {isEditing ? (
                                                <select
                                                  value={editModel?.answer ?? ""}
                                                  onChange={(e) => setEditModel((s: any) => ({ ...s, answer: e.target.value }))}
                                                  className="ml-2 border rounded px-2 py-1"
                                                >
                                                  <option value="">Select</option>
                                                  {["A", "B", "C", "D"].map((k) => (
                                                    <option key={k} value={k}>
                                                      {k}
                                                    </option>
                                                  ))}
                                                </select>
                                              ) : isCorrect ? (
                                                <span className="ml-3 text-xs text-green-700">Correct</span>
                                              ) : null}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* TRUE_FALSE */}
                                  {q.type === "TRUE_FALSE" && (
                                    <div className="mt-3">
                                      {isEditing ? (
                                        <select value={editModel?.answer ?? ""} onChange={(e) => setEditModel((s: any) => ({ ...s, answer: e.target.value }))} className="border rounded px-2 py-1">
                                          <option value="">Select</option>
                                          <option value="True">True</option>
                                          <option value="False">False</option>
                                        </select>
                                      ) : (
                                        <div>Answer: <strong>{q.answer ?? "—"}</strong></div>
                                      )}
                                    </div>
                                  )}

                                  {/* BLANK */}
                                  {q.type === "BLANK" && (
                                    <div className="mt-3">
                                      {isEditing ? (
                                        <input value={editModel?.answer ?? ""} onChange={(e) => setEditModel((s: any) => ({ ...s, answer: e.target.value }))} className="border rounded px-2 py-1 w-full" />
                                      ) : (
                                        <div>Answer: <strong>{q.answer ?? "—"}</strong></div>
                                      )}
                                    </div>
                                  )}

                                  {/* MATCHING */}
                                  {q.type === "MATCHING" && (
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div>
                                        <div className="text-xs text-slate-500 mb-2">Column A</div>
                                        <div className="space-y-1">
                                          {(isEditing ? (editModel?.matches || []) : (q.matching_pairs || [])).map((p: any, idx: number) =>
                                            isEditing ? (
                                              <input
                                                key={idx}
                                                value={p.left_text ?? p.left ?? ""}
                                                onChange={(e) =>
                                                  setEditModel((s: any) => {
                                                    const m = (s.matches || []).map((mp: any, i: number) => (i === idx ? { ...mp, left_text: e.target.value } : mp));
                                                    return { ...s, matches: m };
                                                  })
                                                }
                                                className="w-full border rounded px-2 py-1"
                                              />
                                            ) : (
                                              <div key={idx} className="text-sm">
                                                {(p.position ?? idx) + 1}. {p.left_text}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <div className="text-xs text-slate-500 mb-2">Column B</div>
                                        <div className="space-y-1">
                                          {(isEditing ? (editModel?.matches || []) : (q.matching_pairs || [])).map((p: any, idx: number) =>
                                            isEditing ? (
                                              <input
                                                key={idx}
                                                value={p.right_text ?? p.right ?? ""}
                                                onChange={(e) =>
                                                  setEditModel((s: any) => {
                                                    const m = (s.matches || []).map((mp: any, i: number) => (i === idx ? { ...mp, right_text: e.target.value } : mp));
                                                    return { ...s, matches: m };
                                                  })
                                                }
                                                className="w-full border rounded px-2 py-1"
                                              />
                                            ) : (
                                              <div key={idx} className="text-sm">
                                                {String.fromCharCode(65 + (p.position ?? idx))}. {p.right_text}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <div className="text-xs text-slate-500 mb-2">Answers</div>
                                        <div>
                                          {isEditing ? (
                                            <input
                                              value={editModel?.answer ?? ""}
                                              onChange={(e) => setEditModel((s: any) => ({ ...s, answer: e.target.value }))}
                                              className="w-full border rounded px-2 py-1"
                                              placeholder="e.g. A B C"
                                            />
                                          ) : (
                                            ((q.answer ?? "") as string)
                                              .split(/[\s,]+/)
                                              .filter(Boolean)
                                              .map((a, i) => <div key={i}>{i + 1}. {a}</div>)
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="ml-4 flex flex-col gap-2">
                                  {isEditing ? (
                                    <>
                                      <button onClick={() => saveEdit(q.id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                                      <button onClick={cancelEdit} className="px-3 py-1 border rounded">Cancel</button>
                                    </>
                                  ) : (
                                    <button onClick={() => beginEdit(q)} className="px-3 py-1 border rounded">Edit</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMyExam;