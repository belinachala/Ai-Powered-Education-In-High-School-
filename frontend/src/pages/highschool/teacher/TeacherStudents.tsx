import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  Download,
  XCircle
} from "lucide-react";

/**
 * TeacherStudents.tsx
 *
 * - Displays all students grouped/filtered by grade (class section).
 * - Supports search, grade filter, add, edit, view, delete and CSV export.
 * - Uses localStorage for demo persistence with seeded sample students.
 * - Integrates with student results storage (if present) to show exams taken count and last taken date.
 *
 * Drop into your React + TypeScript + Tailwind project.
 */

/* ---------- Types ---------- */
type Student = {
  id: string;
  studentName: string;
  studentNumber?: string;
  grade: string; // e.g., "9", "10", "11", "12", "Entrance"
  email?: string;
  phone?: string;
  parentName?: string;
  notes?: string;
  createdAt: string;
};

type SubjectResult = {
  id: string;
  subject: string;
  examTitle: string;
  grade: string;
  score: number;
  maxScore: number;
  takenAt?: string;
};

type StudentResult = {
  id: string;
  studentName: string;
  studentNumber?: string;
  grade: string;
  results: SubjectResult[];
  createdAt: string;
};

/* ---------- Storage keys & seeds ---------- */
const STUDENT_STORAGE_KEY = "ai_exam_platform_students_v1";
const RESULT_STORAGE_KEY = "ai_exam_platform_student_results_v1";

const sampleStudents = (): Student[] => [
  {
    id: "stu-001",
    studentName: "Abebe Bekele",
    studentNumber: "STD001",
    grade: "12",
    email: "abebe.bekele@student.edu.et",
    phone: "+251911000001",
    parentName: "Mr. Bekele",
    notes: "Prefers morning exams",
    createdAt: new Date().toISOString()
  },
  {
    id: "stu-002",
    studentName: "Hanna Tadesse",
    studentNumber: "STD002",
    grade: "11",
    email: "hanna.t@student.edu.et",
    phone: "+251911000002",
    parentName: "Mrs. Tadesse",
    notes: "",
    createdAt: new Date().toISOString()
  },
  {
    id: "stu-003",
    studentName: "Desta Alem",
    studentNumber: "STD003",
    grade: "10",
    email: "desta.alem@student.edu.et",
    phone: "+251911000003",
    parentName: "Mr. Alem",
    notes: "Needs additional support in English",
    createdAt: new Date().toISOString()
  }
];

const loadStudents = (): Student[] => {
  try {
    const raw = localStorage.getItem(STUDENT_STORAGE_KEY);
    if (!raw) {
      const seeds = sampleStudents();
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(seeds));
      return seeds;
    }
    return JSON.parse(raw) as Student[];
  } catch {
    const seeds = sampleStudents();
    return seeds;
  }
};

const saveStudents = (arr: Student[]) => {
  try {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
};

const loadResults = (): StudentResult[] => {
  try {
    const raw = localStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StudentResult[];
  } catch {
    return [];
  }
};

/* ---------- Helpers ---------- */
const newId = (prefix = "id") => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const csvDownload = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};

/* ---------- Component ---------- */
const TeacherStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [results] = useState<StudentResult[]>(() => loadResults());
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [viewing, setViewing] = useState<Student | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  const grades = useMemo(() => {
    const setG = new Set(students.map((s) => s.grade));
    // Ensure we present common grade order
    const common = ["9", "10", "11", "12", "Entrance"];
    const found = common.filter((g) => setG.has(g));
    const rest = Array.from(setG).filter((g) => !found.includes(g)).sort();
    return [...found, ...rest];
  }, [students]);

  const filtered = useMemo(() => {
    let list = [...students];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) =>
        `${s.studentName} ${s.studentNumber} ${s.email} ${s.phone}`.toLowerCase().includes(q)
      );
    }
    if (gradeFilter !== "all") list = list.filter((s) => s.grade === gradeFilter);
    return list;
  }, [students, query, gradeFilter]);

  // Helpers to get result stats for a student
  const getStudentResults = (student: Student) => {
    const sr = results.find((r) => {
      // match by studentNumber if available else by name
      if (student.studentNumber && r.studentNumber) return student.studentNumber === r.studentNumber;
      return r.studentName === student.studentName;
    });
    return sr ?? null;
  };

  const examsTakenCount = (student: Student) => {
    const sr = getStudentResults(student);
    return sr ? sr.results.length : 0;
  };

  const lastTaken = (student: Student) => {
    const sr = getStudentResults(student);
    if (!sr) return null;
    const dates = sr.results.map((r) => (r.takenAt ? new Date(r.takenAt).getTime() : 0)).filter(Boolean);
    if (dates.length === 0) return null;
    const maxi = Math.max(...dates);
    return new Date(maxi).toISOString();
  };

  // CRUD operations
  const addStudent = (s: Omit<Student, "id" | "createdAt">) => {
    const newS: Student = { ...s, id: newId("stu"), createdAt: new Date().toISOString() };
    setStudents((prev) => [newS, ...prev]);
    setShowAddModal(false);
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  };

  const exportAllCSV = () => {
    const header = ["Student Name", "Student #", "Grade", "Email", "Phone", "Parent", "Notes", "Created At"];
    const rows = students.map((s) => [
      s.studentName,
      s.studentNumber ?? "",
      s.grade,
      s.email ?? "",
      s.phone ?? "",
      s.parentName ?? "",
      s.notes ?? "",
      s.createdAt
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    csvDownload("students_export.csv", csv);
  };

  const exportStudentCSV = (s: Student) => {
    const header = ["Student Name", "Student #", "Grade", "Email", "Phone", "Parent", "Notes", "Created At"];
    const row = [
      s.studentName,
      s.studentNumber ?? "",
      s.grade,
      s.email ?? "",
      s.phone ?? "",
      s.parentName ?? "",
      s.notes ?? "",
      s.createdAt
    ];
    const csv = [header, row].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    csvDownload(`${s.studentName.replace(/\s+/g, "_")}_profile.csv`, csv);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Users className="text-white" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">Students</h2>
            <p className="text-indigo-100/90 text-sm mt-1">View and manage students by class section. You can add, edit or export student data.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <div className="relative flex-1">
              <label htmlFor="students-search" className="sr-only">Search students</label>
              <Search className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <input
                id="students-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students by name, number, email..."
                className="pl-10 pr-3 w-full rounded-xl border border-gray-200 py-2 focus:ring-2 focus:ring-indigo-200"
                aria-label="Search students by name, number, email"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              title="Add student"
              aria-label="Add student"
            >
              <PlusCircle aria-hidden="true" /> <span className="sr-only">Add Student</span>
              <span className="hidden">Add Student</span>
            </button>

            <button
              onClick={exportAllCSV}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
              title="Export all students"
              aria-label="Export all students"
            >
              <Download aria-hidden="true" /> Export CSV
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <label htmlFor="grade-filter" className="sr-only">Filter by grade</label>
            <select
              id="grade-filter"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="rounded-xl border px-3 py-2"
              aria-label="Filter students by grade"
            >
              <option value="all">All grades</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-500">Total: <span className="font-semibold text-gray-700">{filtered.length}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Student</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Student #</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Grade</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Exams Taken</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Last Exam</th>
              <th className="px-4 py-3 text-center text-xs text-gray-500">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">No students found.</td>
              </tr>
            )}

            {filtered.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{s.studentName}</div>
                  <div className="text-xs text-gray-500">Added {formatDate(s.createdAt)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.studentNumber ?? "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.grade}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{examsTakenCount(s)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lastTaken(s))}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      title="View"
                      aria-label={`View ${s.studentName}`}
                      onClick={() => setViewing(s)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Eye aria-hidden="true" />
                    </button>

                    <button
                      title="Edit"
                      aria-label={`Edit ${s.studentName}`}
                      onClick={() => setEditing(s)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 aria-hidden="true" />
                    </button>

                    <button
                      title="Export"
                      aria-label={`Export ${s.studentName}`}
                      onClick={() => exportStudentCSV(s)}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <Download aria-hidden="true" />
                    </button>

                    <button
                      title="Delete"
                      aria-label={`Delete ${s.studentName}`}
                      onClick={() => setConfirmDeleteId(s.id)}
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

      {/* Add Modal */}
      {showAddModal && (
        <StudentModal
          title="Add Student"
          initial={null}
          onCancel={() => setShowAddModal(false)}
          onSave={(vals) => addStudent(vals)}
        />
      )}

      {/* Edit Modal */}
      {editing && (
        <StudentModal
          title="Edit Student"
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(vals) => updateStudent(vals as Student)}
        />
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={`Student details for ${viewing.studentName}`}>
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{viewing.studentName}</h3>
                <div className="text-sm text-gray-500">{viewing.studentNumber ?? ""} • Grade {viewing.grade}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewing(null)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Close student details"
                  aria-label="Close student details"
                >
                  <XCircle aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-800">{viewing.email ?? "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium text-gray-800">{viewing.phone ?? "-"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Parent / Guardian</div>
                  <div className="font-medium text-gray-800">{viewing.parentName ?? "-"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Notes</div>
                  <div className="font-medium text-gray-800">{viewing.notes ?? "-"}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Exam Results Summary</h4>
                {(() => {
                  const sr = getStudentResults(viewing);
                  if (!sr || sr.results.length === 0) {
                    return <div className="text-sm text-gray-500">No exam results recorded for this student.</div>;
                  }
                  return (
                    <div className="space-y-2">
                      {sr.results.map((r) => {
                        const pct = ((r.score ?? 0) / (r.maxScore ?? 1)) * 100;
                        return (
                          <div key={r.id} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="text-xs text-gray-500">{r.subject}</div>
                                <div className="font-medium text-gray-800 mt-1">{r.examTitle}</div>
                                <div className="text-sm text-gray-700 mt-1">Score: <strong>{r.score}</strong> / {r.maxScore} • {pct.toFixed(2)}%</div>
                                {r.takenAt && <div className="text-xs text-gray-400 mt-1">Taken: {formatDate(r.takenAt)}</div>}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${pct >= 50 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                  {pct >= 50 ? "Pass" : "Fail"}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setViewing(null)} className="px-4 py-2 rounded-lg border" title="Close" aria-label="Close">Close</button>
                <button onClick={() => { exportStudentCSV(viewing); }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white" title="Export profile" aria-label={`Export profile for ${viewing.studentName}`}>Export Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Confirm delete student">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold">Delete student?</h3>
            <p className="text-sm text-gray-600 mt-2">This action will remove the student from local storage in the demo and cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 rounded-xl border" title="Cancel" aria-label="Cancel delete">Cancel</button>
              <button onClick={() => removeStudent(confirmDeleteId)} className="px-4 py-2 rounded-xl bg-red-600 text-white" title="Delete" aria-label="Confirm delete student">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;

/* ------------------------------------------------------------------
   StudentModal - used for Add and Edit (internal)
   ------------------------------------------------------------------ */
const StudentModal: React.FC<{
  title: string;
  initial: Student | null;
  onCancel: () => void;
  onSave: (vals: Omit<Student, "id" | "createdAt"> | Student) => void;
}> = ({ title, initial, onCancel, onSave }) => {
  const [studentName, setStudentName] = useState(initial?.studentName ?? "");
  const [studentNumber, setStudentNumber] = useState(initial?.studentNumber ?? "");
  const [grade, setGrade] = useState(initial?.grade ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [parentName, setParentName] = useState(initial?.parentName ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const handleSave = () => {
    if (!studentName.trim() || !grade.trim()) {
      alert("Please provide student name and grade.");
      return;
    }
    if (initial) {
      const updated: Student = {
        ...initial,
        studentName: studentName.trim(),
        studentNumber: studentNumber.trim() || undefined,
        grade: grade.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        parentName: parentName.trim() || undefined,
        notes: notes.trim() || undefined
      };
      onSave(updated);
    } else {
      onSave({
        studentName: studentName.trim(),
        studentNumber: studentNumber.trim() || undefined,
        grade: grade.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        parentName: parentName.trim() || undefined,
        notes: notes.trim() || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded-xl w-full max-w-xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onCancel} className="text-gray-600 hover:text-gray-800" title="Close" aria-label="Close student modal">
            <XCircle aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="student-name" className="text-sm text-gray-600 block mb-1">Student Name</label>
            <input id="student-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="student-number" className="text-sm text-gray-600 block mb-1">Student Number</label>
              <input id="student-number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>

            <div>
              <label htmlFor="student-grade" className="text-sm text-gray-600 block mb-1">Grade / Section</label>
              <select id="student-grade" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full rounded-xl border px-3 py-2" aria-label="Select student grade">
                <option value="">Select grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
                <option value="Entrance">Entrance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="student-email" className="text-sm text-gray-600 block mb-1">Email</label>
              <input id="student-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>

            <div>
              <label htmlFor="student-phone" className="text-sm text-gray-600 block mb-1">Phone</label>
              <input id="student-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          <div>
            <label htmlFor="student-parent" className="text-sm text-gray-600 block mb-1">Parent / Guardian</label>
            <input id="student-parent" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>

          <div>
            <label htmlFor="student-notes" className="text-sm text-gray-600 block mb-1">Notes</label>
            <textarea id="student-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border px-3 py-2" />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl border" title="Cancel" aria-label="Cancel">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-indigo-600 text-white" title="Save student" aria-label="Save student">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};