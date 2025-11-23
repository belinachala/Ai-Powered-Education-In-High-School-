import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Search
} from "lucide-react";

type ApprovalStatus = "not_requested" | "pending" | "approved" | "rejected";
type Category = "free" | "paid";

type QAItem = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctOption: "A" | "B" | "C" | "D" | "";
  sourceFile?: string;
};

type StoredFile = {
  name: string;
  size?: number;
  needsServerProcessing?: boolean;
};

type ExamItem = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  examType?: string | null;
  date?: string | null;
  durationMinutes?: number | null;
  category: Category;
  priceInETB?: string | null;
  paidAgreementAccepted?: boolean | null;
  approvalRequest?: {
    directorName?: string;
    directorEmail?: string;
    messageToDirector?: string;
    status?: ApprovalStatus;
  } | null;
  questions: QAItem[];
  files: StoredFile[];
  published: boolean;
  createdAt: string;
};

const STORAGE_KEY = "ai_exam_platform_exams_v1";

const humanDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};

const sampleExams = (): ExamItem[] => [
  {
    id: "demo-1",
    title: "Mathematics Mid 1 - Algebra (MCQ)",
    subject: "Mathematics",
    grade: "12",
    examType: "Mid1",
    date: "2025-02-15",
    durationMinutes: 90,
    category: "free",
    priceInETB: null,
    paidAgreementAccepted: null,
    approvalRequest: null,
    questions: [
      { id: "q1", question: "What is the value of x if 2x + 3 = 11?", choices: ["4", "5", "3", "6"], correctOption: "A" },
      { id: "q2", question: "Factorize x^2 - 5x + 6.", choices: ["(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x-3)(x-2)"], correctOption: "A" }
    ],
    files: [{ name: "algebra-mid1.pdf", size: 102400 }],
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-2",
    title: "Physics Final - Mechanics (MCQ)",
    subject: "Physics",
    grade: "11",
    examType: "Final1",
    date: "2025-03-10",
    durationMinutes: 120,
    category: "paid",
    priceInETB: "200",
    paidAgreementAccepted: true,
    approvalRequest: {
      directorName: "Dr. Gebre",
      directorEmail: "director@school.edu.et",
      messageToDirector: "Please approve publishing this paid exam.",
      status: "approved"
    },
    questions: [
      { id: "q1", question: "Which law states F = ma?", choices: ["Newton's Second Law", "Newton's First Law", "Newton's Third Law", "Law of Gravitation"], correctOption: "A" },
      { id: "q2", question: "What remains conserved in a closed system?", choices: ["Momentum", "Temperature", "Entropy", "Charge (only)"], correctOption: "A" }
    ],
    files: [{ name: "physics-final-mechanics.pdf", size: 204800 }],
    published: false,
    createdAt: new Date().toISOString()
  }
];

const useStoredExams = () => {
  const [exams, setExams] = useState<ExamItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeds = sampleExams();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
        return seeds;
      }
      return JSON.parse(raw) as ExamItem[];
    } catch {
      const seeds = sampleExams();
      return seeds;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    } catch {
      // ignore
    }
  }, [exams]);

  return { exams, setExams };
};

const Badge: React.FC<{ category: Category; approval?: ApprovalStatus | null; published?: boolean }> = ({ category, approval, published }) => {
  if (category === "free") {
    return <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">Free</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">Paid</span>
      {approval === "approved" ? <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 rounded-full px-2 py-1">Approved</span> : approval === "pending" ? <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 rounded-full px-2 py-1">Pending</span> : approval === "rejected" ? <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 rounded-full px-2 py-1">Rejected</span> : <span className="inline-flex items-center gap-1 text-xs text-gray-700 bg-gray-100 rounded-full px-2 py-1">No Request</span>}
      {published ? <span className="ml-2 inline-flex items-center gap-1 text-xs text-white bg-indigo-600 rounded-full px-2 py-1">Published</span> : null}
    </div>
  );
};

const TeacherMyExam: React.FC = () => {
  const { exams, setExams } = useStoredExams();
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);

  const [viewing, setViewing] = useState<ExamItem | null>(null);
  const [editing, setEditing] = useState<ExamItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const allSubjects = useMemo(() => {
    const s = new Set<string>();
    exams.forEach((ex) => ex.subject && s.add(ex.subject));
    return Array.from(s).sort();
  }, [exams]);

  const filtered = useMemo(() => {
    let list = [...exams];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => `${e.title} ${e.subject} ${e.grade}`.toLowerCase().includes(q));
    }
    if (gradeFilter !== "all") list = list.filter((e) => e.grade === gradeFilter);
    if (subjectFilter !== "all") list = list.filter((e) => e.subject === subjectFilter);
    if (categoryFilter !== "all") list = list.filter((e) => e.category === (categoryFilter as Category));
    if (sortAsc !== null) {
      list.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return sortAsc ? da - db : db - da;
      });
    }
    return list;
  }, [exams, query, gradeFilter, subjectFilter, categoryFilter, sortAsc]);

  const togglePublish = (id: string) => setExams((prev) => prev.map((e) => (e.id === id ? { ...e, published: !e.published } : e)));
  const removeExam = (id: string) => { setExams((prev) => prev.filter((e) => e.id !== id)); setConfirmDeleteId(null); };
  const saveEditedExam = (updated: ExamItem) => { setExams((prev) => prev.map((e) => (e.id === updated.id ? { ...updated } : e))); setEditing(null); };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FileText className="text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">My Exams</h2>
            <p className="text-indigo-100/90 text-sm mt-1">Manage your created exams — view, edit, publish or remove. Data is stored locally in this demo.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <div className="relative flex-1">
              <label htmlFor="exam-search" className="sr-only">Search exams</label>
              <Search className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <input
                id="exam-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, subject, grade..."
                className="pl-10 pr-3 w-full rounded-xl border border-gray-200 py-2 focus:ring-2 focus:ring-indigo-200"
                aria-label="Search exams by title, subject or grade"
              />
            </div>

            <button
              onClick={() => setSortAsc((s) => (s === null ? false : s === false ? true : null))}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
              title="Toggle sort by date (new/old/none)"
              aria-label="Toggle sort by date"
            >
              <ArrowUpDown size={16} aria-hidden="true" /> <span className="text-xs text-gray-600">Sort by Date</span>
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <label htmlFor="grade-filter" className="sr-only">Filter by grade</label>
            <select id="grade-filter" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="rounded-xl border px-3 py-2" aria-label="Filter exams by grade">
              <option value="all">All grades</option>
              {Array.from(new Set(exams.map((x) => x.grade))).map((g) => (<option key={g} value={g}>{g}</option>))}
            </select>

            <label htmlFor="subject-filter" className="sr-only">Filter by subject</label>
            <select id="subject-filter" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="rounded-xl border px-3 py-2" aria-label="Filter exams by subject">
              <option value="all">All subjects</option>
              {allSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <label htmlFor="category-filter" className="sr-only">Filter by category</label>
            <select id="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border px-3 py-2" aria-label="Filter exams by category">
              <option value="all">All categories</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Exam Title</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Subject</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Grade</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Category / Status</th>
              <th className="px-4 py-3 text-center text-xs text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">No exams found.</td>
              </tr>
            )}

            {filtered.map((exam, idx) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{exam.title}</div>
                  <div className="text-xs text-gray-500 mt-1">Created {new Date(exam.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{exam.subject}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{exam.grade}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{humanDate(exam.date)}</td>
                <td className="px-4 py-3">
                  <Badge category={exam.category} approval={exam.approvalRequest?.status ?? null} published={exam.published} />
                  {exam.category === "paid" && exam.priceInETB && <div className="text-xs text-gray-500 mt-1">ETB {exam.priceInETB}</div>}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      title={`View ${exam.title}`}
                      aria-label={`View exam details for ${exam.title}`}
                      onClick={() => setViewing(exam)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Eye aria-hidden="true" />
                    </button>

                    <button
                      title={`Edit ${exam.title}`}
                      aria-label={`Edit exam ${exam.title}`}
                      onClick={() => setEditing(exam)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 aria-hidden="true" />
                    </button>

                    <button
                      title={exam.published ? `Unpublish ${exam.title}` : `Publish ${exam.title}`}
                      aria-label={exam.published ? `Unpublish exam ${exam.title}` : `Publish exam ${exam.title}`}
                      onClick={() => togglePublish(exam.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircle aria-hidden="true" />
                    </button>

                    <button
                      title={`Delete ${exam.title}`}
                      aria-label={`Delete exam ${exam.title}`}
                      onClick={() => setConfirmDeleteId(exam.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={`Exam details for ${viewing.title}`}>
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{viewing.title}</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setViewing(null)} className="text-gray-600 hover:text-gray-800" title="Close details" aria-label="Close exam details">
                  <XCircle aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Subject</div>
                  <div className="font-medium text-gray-800">{viewing.subject}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Grade / Type</div>
                  <div className="font-medium text-gray-800">{viewing.grade} {viewing.examType ? `• ${viewing.examType}` : null}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium text-gray-800">{humanDate(viewing.date)}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium text-gray-800">{viewing.durationMinutes ?? "-"} minutes</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Category & Approval</div>
                <div className="mt-2"><Badge category={viewing.category} approval={viewing.approvalRequest?.status ?? null} published={viewing.published} /></div>
                {viewing.category === "paid" && viewing.priceInETB && <div className="text-sm text-gray-600 mt-2">Price: ETB {viewing.priceInETB}</div>}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Questions ({viewing.questions.length})</h4>
                <div className="space-y-3">
                  {viewing.questions.map((q, idx) => (
                    <div key={q.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-500">Q{idx + 1}</div>
                      <div className="font-medium text-gray-800 mb-2">{q.question}</div>
                      <div className="grid gap-2">
                        {(["A", "B", "C", "D"] as const).map((letter, i) => {
                          const isCorrect = q.correctOption === letter;
                          return (
                            <div key={letter} className={`flex items-start gap-3 p-2 rounded-md ${isCorrect ? "bg-green-50 border border-green-200" : "bg-white"}`}>
                              <div className="w-6 flex-shrink-0 font-semibold text-sm">{letter}.</div>
                              <div className="flex-1 text-sm text-gray-700">{q.choices[i] ?? ""}</div>
                              {isCorrect && <div className="text-sm text-green-700 font-semibold">Correct</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Files</h4>
                {viewing.files.length === 0 ? (
                  <div className="text-sm text-gray-500">No files uploaded.</div>
                ) : (
                  <ul className="space-y-2">
                    {viewing.files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{f.name}</div>
                          <div className="text-xs text-gray-500">{f.size ? `${Math.round((f.size as number) / 1024)} KB` : ""}{f.needsServerProcessing ? " • Server processing" : ""}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button title={`Download ${f.name}`} aria-label={`Download file ${f.name}`} className="text-indigo-600 hover:text-indigo-800">Download</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setViewing(null)} className="px-4 py-2 rounded-lg border hover:bg-gray-50" title="Close" aria-label="Close details">Close</button>
                <button onClick={() => { setEditing(viewing); setViewing(null); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" title="Edit exam" aria-label={`Edit exam ${viewing.title}`}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && <EditModal exam={editing} onCancel={() => setEditing(null)} onSave={(updated) => saveEditedExam(updated)} />}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Confirm delete exam">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold">Delete exam?</h3>
            <p className="text-sm text-gray-600 mt-2">This action will permanently remove the exam from local storage. This cannot be undone in the demo.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 rounded-xl border" title="Cancel" aria-label="Cancel delete">Cancel</button>
              <button onClick={() => removeExam(confirmDeleteId)} className="px-4 py-2 rounded-xl bg-red-600 text-white" title="Delete" aria-label="Confirm delete exam">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMyExam;

/* ------------------------------
   EditModal component (internal)
   ------------------------------ */
const EditModal: React.FC<{
  exam: ExamItem;
  onCancel: () => void;
  onSave: (updated: ExamItem) => void;
}> = ({ exam, onCancel, onSave }) => {
  const [draft, setDraft] = useState<ExamItem>({ ...exam });

  const updateField = <K extends keyof ExamItem>(k: K, v: ExamItem[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const updateQA = (id: string, key: "question" | "choice" | "correctOption", value: any, choiceIndex?: number) => {
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q) => {
        if (q.id !== id) return q;
        if (key === "question") return { ...q, question: value };
        if (key === "correctOption") return { ...q, correctOption: value };
        if (key === "choice" && typeof choiceIndex === "number") {
          const newChoices = [...q.choices] as [string, string, string, string];
          newChoices[choiceIndex] = value;
          return { ...q, choices: newChoices };
        }
        return q;
      })
    }));
  };

  const addQA = () => setDraft((d) => ({ ...d, questions: [...d.questions, { id: Math.random().toString(36).slice(2, 9), question: "New multiple choice question", choices: ["", "", "", ""], correctOption: "" }] }));

  const removeQA = (id: string) => setDraft((d) => ({ ...d, questions: d.questions.filter((q) => q.id !== id) }));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={`Edit exam ${exam.title}`}>
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Edit: {exam.title}</h3>
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="text-gray-600 hover:text-gray-800" title="Close edit" aria-label="Close edit modal"><XCircle aria-hidden="true" /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-title" className="text-sm text-gray-600 block mb-1">Exam Title</label>
            <input id="edit-title" value={draft.title} onChange={(e) => updateField("title", e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="edit-grade" className="text-sm text-gray-600 block mb-1">Grade</label>
              <input id="edit-grade" value={draft.grade} onChange={(e) => updateField("grade", e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>

            <div>
              <label htmlFor="edit-subject" className="text-sm text-gray-600 block mb-1">Subject</label>
              <input id="edit-subject" value={draft.subject} onChange={(e) => updateField("subject", e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>

            <div>
              <label htmlFor="edit-date" className="text-sm text-gray-600 block mb-1">Exam Date</label>
              <input id="edit-date" type="date" value={draft.date ?? ""} onChange={(e) => updateField("date", e.target.value ?? null)} className="w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="edit-duration" className="text-sm text-gray-600 block mb-1">Duration (minutes)</label>
              <input id="edit-duration" type="number" min={10} value={draft.durationMinutes ?? ""} onChange={(e) => updateField("durationMinutes", e.target.value === "" ? null : Number(e.target.value))} className="w-full rounded-xl border px-3 py-2" />
            </div>

            <div>
              <label htmlFor="edit-category" className="text-sm text-gray-600 block mb-1">Category</label>
              <select id="edit-category" value={draft.category} onChange={(e) => updateField("category", e.target.value as Category)} className="w-full rounded-xl border px-3 py-2" aria-label="Edit exam category">
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {draft.category === "paid" ? (
              <div>
                <label htmlFor="edit-price" className="text-sm text-gray-600 block mb-1">Price (ETB)</label>
                <input id="edit-price" value={draft.priceInETB ?? ""} onChange={(e) => updateField("priceInETB", e.target.value)} className="w-full rounded-xl border px-3 py-2" />
              </div>
            ) : (<div />)}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Questions (MCQ)</h4>
            <div className="space-y-3">
              {draft.questions.map((q, idx) => (
                <div key={q.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Q{idx + 1}</div>
                      <input value={q.question} onChange={(e) => updateQA(q.id, "question", e.target.value)} className="w-full rounded-md border px-2 py-1 mt-1" />
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(["A", "B", "C", "D"] as const).map((letter, i) => (
                          <div key={letter} className="flex items-start gap-2">
                            <input type="radio" name={`correct-${q.id}`} checked={q.correctOption === letter} onChange={() => updateQA(q.id, "correctOption", letter)} className="mt-1" aria-label={`Select ${letter} as correct option for question ${idx + 1}`} />
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-600">Option {letter}</div>
                              <input value={q.choices[i] ?? ""} onChange={(e) => updateQA(q.id, "choice", e.target.value, i)} className="w-full rounded-md border px-2 py-1 mt-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <button onClick={() => removeQA(q.id)} className="text-red-600 hover:text-red-800" title={`Remove question ${idx + 1}`} aria-label={`Remove question ${idx + 1}`}><Trash2 aria-hidden="true" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <button onClick={addQA} className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg" title="Add MCQ" aria-label="Add MCQ"><FileText aria-hidden="true" /> Add MCQ</button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl border" title="Cancel" aria-label="Cancel edit">Cancel</button>
            <button onClick={() => onSave({ ...draft, createdAt: draft.createdAt ?? new Date().toISOString() })} className="px-4 py-2 rounded-xl bg-indigo-600 text-white" title="Save changes" aria-label="Save changes">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};