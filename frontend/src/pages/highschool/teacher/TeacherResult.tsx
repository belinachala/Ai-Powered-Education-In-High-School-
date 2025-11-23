import React, { useEffect, useMemo, useState } from "react";
import {
  Award,
  UserCheck,
  UserX,
  Search,
  FileText,
  Download,
  Eye,
  Filter,
} from "lucide-react";

/**
 * TeacherResult.tsx
 *
 * Shows student exam results across subjects and class sections.
 * - Uses localStorage to persist demo results (seed data if none).
 * - Filters: grade, student, exam title, and search.
 * - Displays per-student summary (total, percent, letter grade, pass/fail).
 * - Expand / View details modal with per-subject breakdown.
 * - Export student report as CSV (download).
 *
 * Drop into your React + TypeScript + Tailwind project.
 */

/* ---------- Types ---------- */
type SubjectResult = {
  id: string;
  subject: string;
  examTitle: string;
  grade: string; // grade/section, e.g., "12" or "Entrance"
  score: number;
  maxScore: number;
  // optional informational fields
  correctCount?: number;
  totalQuestions?: number;
  sourceFile?: string;
  takenAt?: string; // ISO
};

type StudentResult = {
  id: string;
  studentName: string;
  studentNumber?: string;
  grade: string;
  results: SubjectResult[]; // many subject results (one per exam/subject)
  createdAt: string;
};

type Aggregated = {
  totalScore: number;
  totalMax: number;
  percent: number;
  letter: string;
  passed: boolean;
};

/* ---------- Local storage key & sample data ---------- */
const STORAGE_KEY = "ai_exam_platform_student_results_v1";

const seedSampleResults = (): StudentResult[] => [
  {
    id: "s-001",
    studentName: "Abebe Bekele",
    studentNumber: "STD001",
    grade: "12",
    createdAt: new Date().toISOString(),
    results: [
      {
        id: "r-1",
        subject: "Mathematics",
        examTitle: "Mathematics Mid 1 - Algebra (MCQ)",
        grade: "12",
        score: 18,
        maxScore: 25,
        correctCount: 18,
        totalQuestions: 25,
        sourceFile: "algebra-mid1.pdf",
        takenAt: "2025-02-15",
      },
      {
        id: "r-2",
        subject: "Physics",
        examTitle: "Physics Final - Mechanics (MCQ)",
        grade: "12",
        score: 40,
        maxScore: 50,
        correctCount: 40,
        totalQuestions: 50,
        sourceFile: "physics-final.pdf",
        takenAt: "2025-03-10",
      },
      {
        id: "r-3",
        subject: "English (Advanced)",
        examTitle: "English Mid 1",
        grade: "12",
        score: 22,
        maxScore: 30,
        correctCount: 22,
        totalQuestions: 30,
        takenAt: "2025-02-20",
      },
    ],
  },
  {
    id: "s-002",
    studentName: "Hanna Tadesse",
    studentNumber: "STD002",
    grade: "11",
    createdAt: new Date().toISOString(),
    results: [
      {
        id: "r-4",
        subject: "Physics",
        examTitle: "Physics Final - Mechanics (MCQ)",
        grade: "11",
        score: 35,
        maxScore: 50,
        correctCount: 35,
        totalQuestions: 50,
        takenAt: "2025-03-10",
      },
      {
        id: "r-5",
        subject: "Chemistry",
        examTitle: "Chemistry Mid 1",
        grade: "11",
        score: 28,
        maxScore: 40,
        correctCount: 28,
        totalQuestions: 40,
        takenAt: "2025-02-12",
      },
      {
        id: "r-6",
        subject: "Mathematics",
        examTitle: "Mathematics Mid 1 - Algebra (MCQ)",
        grade: "11",
        score: 16,
        maxScore: 25,
        correctCount: 16,
        totalQuestions: 25,
        takenAt: "2025-02-15",
      },
    ],
  },
  {
    id: "s-003",
    studentName: "Desta Alem",
    studentNumber: "STD003",
    grade: "10",
    createdAt: new Date().toISOString(),
    results: [
      {
        id: "r-7",
        subject: "English",
        examTitle: "English Grammar Test",
        grade: "10",
        score: 14,
        maxScore: 20,
        correctCount: 14,
        totalQuestions: 20,
        takenAt: "2025-01-22",
      },
      {
        id: "r-8",
        subject: "Biology",
        examTitle: "Biology Mid",
        grade: "10",
        score: 30,
        maxScore: 40,
        correctCount: 30,
        totalQuestions: 40,
        takenAt: "2025-02-10",
      },
    ],
  },
];

/* ---------- Helpers ---------- */
const loadResults = (): StudentResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeds = seedSampleResults();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      return seeds;
    }
    return JSON.parse(raw) as StudentResult[];
  } catch {
    const seeds = seedSampleResults();
    return seeds;
  }
};

const saveResults = (data: StudentResult[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

const aggregateStudent = (s: StudentResult): Aggregated => {
  const totalScore = s.results.reduce((a, r) => a + (r.score ?? 0), 0);
  const totalMax = s.results.reduce((a, r) => a + (r.maxScore ?? 0), 0) || 1;
  const percent = (totalScore / totalMax) * 100;
  const letter =
    percent >= 90 ? "A+" : percent >= 80 ? "A" : percent >= 70 ? "B+" : percent >= 60 ? "B" : percent >= 50 ? "C" : "F";
  const passed = percent >= 50;
  return { totalScore, totalMax, percent: Math.round(percent * 100) / 100, letter, passed };
};

const formatPercent = (n: number) => `${n.toFixed(2)}%`;

/* ---------- Component ---------- */
const TeacherResult: React.FC = () => {
  const [students, setStudents] = useState<StudentResult[]>(() => loadResults());
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [examFilter, setExamFilter] = useState<string>("all");
  const [showing, setShowing] = useState<StudentResult | null>(null);

  useEffect(() => {
    saveResults(students);
  }, [students]);

  const allGrades = useMemo(() => {
    const setGrades = new Set<string>();
    students.forEach((s) => setGrades.add(s.grade));
    return Array.from(setGrades).sort();
  }, [students]);

  const allStudents = useMemo(() => {
    const arr = students.map((s) => s.studentName);
    return Array.from(new Set(arr)).sort();
  }, [students]);

  const allExams = useMemo(() => {
    const setEx = new Set<string>();
    students.forEach((s) => s.results.forEach((r) => setEx.add(r.examTitle)));
    return Array.from(setEx).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => `${s.studentName} ${s.studentNumber}`.toLowerCase().includes(q) || s.results.some((r) => `${r.subject} ${r.examTitle}`.toLowerCase().includes(q)));
    }
    if (gradeFilter !== "all") list = list.filter((s) => s.grade === gradeFilter);
    if (studentFilter !== "all") list = list.filter((s) => s.studentName === studentFilter);
    if (examFilter !== "all") list = list.filter((s) => s.results.some((r) => r.examTitle === examFilter));
    return list;
  }, [students, query, gradeFilter, studentFilter, examFilter]);

  const deleteStudent = (id: string) => {
    const ok = confirm("Delete student results? This action cannot be undone in the demo.");
    if (!ok) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
  };

  const exportStudentCSV = (s: StudentResult) => {
    // Build CSV with header and rows per subject result
    const header = ["Student Name", "Student #", "Grade", "Exam Title", "Subject", "Score", "Max Score", "Percent", "Taken At", "Source File"];
    const rows = s.results.map((r) => [
      s.studentName,
      s.studentNumber ?? "",
      r.grade,
      r.examTitle,
      r.subject,
      String(r.score),
      String(r.maxScore),
      `${((r.score / (r.maxScore || 1)) * 100).toFixed(2)}%`,
      r.takenAt ?? "",
      r.sourceFile ?? "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${s.studentName.replace(/\s+/g, "_")}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // UI helpers
  const statusBadge = (agg: Aggregated) =>
    agg.passed ? (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
        <UserCheck size={14} /> Passed
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-semibold">
        <UserX size={14} /> Failed
      </span>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 shadow-lg mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Award className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Student Results</h1>
            <p className="text-white/90 text-sm mt-1">View and manage students' exam results per class section and subject.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by student name, subject or exam..."
                className="pl-10 pr-3 w-full rounded-xl border border-gray-200 py-2 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <button title="Filters" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
              <Filter size={16} /> <span className="text-xs text-gray-600">Filters</span>
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="rounded-xl border px-3 py-2">
              <option value="all">All grades</option>
              {allGrades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>

            <select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} className="rounded-xl border px-3 py-2">
              <option value="all">All students</option>
              {allStudents.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select value={examFilter} onChange={(e) => setExamFilter(e.target.value)} className="rounded-xl border px-3 py-2">
              <option value="all">All exams</option>
              {allExams.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Student</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Grade</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Exams Taken</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Total / Max</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Percent</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Grade</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Status</th>
              <th className="px-4 py-3 text-center text-xs text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-8 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}

            {filteredStudents.map((s, idx) => {
              const agg = aggregateStudent(s);
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{s.studentName}</div>
                    <div className="text-xs text-gray-500">{s.studentNumber ?? ""}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.grade}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.results.length}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {agg.totalScore} / {agg.totalMax}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">{formatPercent(agg.percent)}</div>
                      <div className="w-36 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div style={{ width: `${Math.min(100, agg.percent)}%` }} className={`h-2 ${agg.passed ? "bg-green-500" : "bg-red-500"}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{agg.letter}</td>
                  <td className="px-4 py-3">{statusBadge(agg)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button title="View" onClick={() => setShowing(s)} className="text-indigo-600 hover:text-indigo-800">
                        <Eye />
                      </button>
                      <button title="Export CSV" onClick={() => exportStudentCSV(s)} className="text-emerald-600 hover:text-emerald-800">
                        <Download />
                      </button>
                      <button title="View student record" onClick={() => alert("Open student profile (not implemented in demo).")} className="text-gray-600 hover:text-gray-800">
                        <FileText />
                      </button>
                      <button title="Delete results" onClick={() => deleteStudent(s.id)} className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Student details modal */}
      {showing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{showing.studentName}</h3>
                <div className="text-sm text-gray-500">{showing.studentNumber ?? ""} • Grade {showing.grade}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowing(null)} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Close</button>
                <button onClick={() => exportStudentCSV(showing)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
                  <Download /> Export CSV
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Total Exams</div>
                  <div className="text-xl font-semibold">{showing.results.length}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Overall</div>
                  <div className="text-xl font-semibold">
                    {aggregateStudent(showing).percent.toFixed(2)}% • {aggregateStudent(showing).letter}{" "}
                    {aggregateStudent(showing).passed ? <span className="text-green-600"> (Passed)</span> : <span className="text-red-600"> (Failed)</span>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Detailed Results</h4>
                <div className="space-y-3">
                  {showing.results.map((r, i) => {
                    const pct = (r.score / (r.maxScore || 1)) * 100;
                    const pass = pct >= 50;
                    return (
                      <div key={r.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500">Subject • {r.subject}</div>
                            <div className="font-medium text-gray-800 mt-1">{r.examTitle}</div>
                            <div className="text-sm text-gray-700 mt-1">
                              Score: <strong>{r.score}</strong> / {r.maxScore} • {pct.toFixed(2)}%
                            </div>
                            {typeof r.correctCount === "number" && typeof r.totalQuestions === "number" && (
                              <div className="text-xs text-gray-500 mt-1">Correct: {r.correctCount} / {r.totalQuestions}</div>
                            )}
                            {r.takenAt && <div className="text-xs text-gray-400 mt-1">Taken: {r.takenAt}</div>}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${pass ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                              {pass ? "Pass" : "Fail"}
                            </div>
                            <div className="w-36 bg-white rounded-full h-2 overflow-hidden border">
                              <div style={{ width: `${Math.min(100, pct)}%` }} className={`${pass ? "bg-green-500" : "bg-red-500"} h-2`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowing(null)} className="px-4 py-2 rounded-lg border">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherResult;