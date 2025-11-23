import React, { useEffect, useRef, useState } from "react";
import {
  FilePlus2,
  CloudUpload,
  Trash2,
  FileText,
  File,
  CheckCircle,
  XCircle,
  Mail,
  UserCheck
} from "lucide-react";

type GradeSection = "9" | "10" | "11" | "12" | "Entrance" | "";
type ExamType =
  | ""
  | "Mid1"
  | "Mid2"
  | "OtherMid"
  | "Final1"
  | "Final2"
  | "Final3"
  | "OtherFinal";

type UploadedFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  textContent?: string | null;
  needsServerProcessing: boolean;
};

type QAItem = {
  id: string;
  question: string;
  choices: [string, string, string, string]; // A, B, C, D
  correctOption: "A" | "B" | "C" | "D" | "";
  sourceFile?: string;
};

type ApprovalStatus = "not_requested" | "pending" | "approved" | "rejected";

const SUBJECTS_BY_GRADE: Record<Exclude<GradeSection, "">, string[]> = {
  "9": [
    "Mathematics",
    "English",
    "Amharic",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "History",
    "Civic & Ethical Education",
    "Information & Communication Technology (ICT)",
    "Agricultural Science",
    "Physical Education & Health",
    "Art & Design"
  ],
  "10": [
    "Mathematics",
    "English",
    "Amharic",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "History",
    "Civic & Ethical Education",
    "Information & Communication Technology (ICT)",
    "Agricultural Science",
    "Physical Education & Health",
    "Art & Design"
  ],
  "11": [
    "Mathematics (Advanced)",
    "Physics (Advanced)",
    "Chemistry (Advanced)",
    "Biology (Advanced)",
    "Integrated Science",
    "Economics",
    "Accounting",
    "Business Management",
    "Geography (Advanced)",
    "History (Advanced)",
    "English (Advanced)",
    "Information & Communication Technology (ICT)",
    "Computer Science",
    "Technical Drawing"
  ],
  "12": [
    "Mathematics (Advanced)",
    "Physics (Advanced)",
    "Chemistry (Advanced)",
    "Biology (Advanced)",
    "Economics",
    "Accounting",
    "Business Management",
    "Geography (Advanced)",
    "History (Advanced)",
    "English (Advanced)",
    "Information & Communication Technology (ICT)",
    "Computer Science",
    "Technical Drawing"
  ],
  Entrance: [
    "Mathematics (Entrance)",
    "Verbal Reasoning",
    "Quantitative Reasoning",
    "English (Entrance)",
    "General Knowledge",
    "Aptitude Test"
  ]
};

const humanFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${Math.round(size / (1024 * 1024))} MB`;
};

const isTextFile = (fileName: string, fileType: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const textTypes = ["txt", "md", "json", "csv"];
  if (textTypes.includes(ext)) return true;
  if (fileType.startsWith("text/")) return true;
  return false;
};

const mockAIExtractQA = (text: string | undefined, sourceName: string): QAItem[] => {
  const idBase = Math.random().toString(36).slice(2, 9);
  if (!text || text.trim().length === 0) {
    return [
      {
        id: `${idBase}-1`,
        question: `(From ${sourceName}) Example: What is the capital of Ethiopia?`,
        choices: ["Addis Ababa", "Bahir Dar", "Gondar", "Dire Dawa"],
        correctOption: "A",
        sourceFile: sourceName
      }
    ];
  }
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (paras.length === 0) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 6);
    return lines.map((l, idx) => ({
      id: `${idBase}-${idx + 1}`,
      question: l.length > 140 ? l.slice(0, 137) + "..." : l,
      choices: [
        "Correct answer (verify)",
        "Plausible distractor 1",
        "Plausible distractor 2",
        "Plausible distractor 3"
      ],
      correctOption: "A",
      sourceFile: sourceName
    }));
  }

  return paras.map((p, idx) => {
    const base = p.length > 120 ? p.slice(0, 117) + "..." : p;
    return {
      id: `${idBase}-${idx + 1}`,
      question: `(${sourceName}) ${base}`,
      choices: [
        "AI-extracted answer (verify)",
        "Distractor option B",
        "Distractor option C",
        "Distractor option D"
      ],
      correctOption: "A",
      sourceFile: sourceName
    };
  });
};

const allowedFileTypes = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".txt",
  ".md",
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

const TeacherCreateExam: React.FC = () => {
  const [examTitle, setExamTitle] = useState("");
  const [grade, setGrade] = useState<GradeSection>("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState<ExamType>("");
  const [examDate, setExamDate] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [categoryPaid, setCategoryPaid] = useState<"free" | "paid">("free");
  const [paidAgreementChecked, setPaidAgreementChecked] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("not_requested");
  const [approvalForm, setApprovalForm] = useState({
    directorName: "",
    directorEmail: "",
    priceInETB: "",
    approvalDocument: null as File | null,
    messageToDirector: ""
  });

  useEffect(() => {
    setSubject("");
    setExamType("");
  }, [grade]);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => { e.preventDefault(); el.classList.add("ring-4", "ring-indigo-200"); };
    const onDragLeave = () => el.classList.remove("ring-4", "ring-indigo-200");
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("ring-4", "ring-indigo-200");
      const dt = e.dataTransfer;
      if (!dt) return;
      const files = Array.from(dt.files || []);
      handleFiles(files);
    };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  const handleFiles = (files: File[]) => {
    const newFilesPromises = files.map(async (f) => {
      const name = f.name;
      const size = f.size;
      const type = f.type || name.split(".").pop() || "unknown";
      const id = Math.random().toString(36).slice(2, 9);
      const canRead = isTextFile(name, type);
      let textContent: string | null = null;
      if (canRead) {
        try { textContent = await f.text(); } catch { textContent = null; }
      }
      const needsServerProcessing = !canRead;
      return { id, file: f, name, size, type, textContent, needsServerProcessing } as UploadedFile;
    });

    Promise.all(newFilesPromises).then((newFiles) => {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      const extraQA: QAItem[] = [];
      newFiles.forEach((nf) => {
        const qas = mockAIExtractQA(nf.textContent ?? undefined, nf.name);
        extraQA.push(...qas);
      });
      setQaItems((prev) => {
        const combined = [...prev, ...extraQA];
        const map = new Map<string, QAItem>();
        combined.forEach((q) => { map.set((q.question + (q.sourceFile ?? "")).slice(0, 220), q); });
        return Array.from(map.values());
      });
    });
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    handleFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeUploadedFile = (id: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === id);
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    if (fileToRemove) setQaItems((prev) => prev.filter((q) => q.sourceFile !== fileToRemove.name));
  };

  const addEmptyQA = () => {
    setQaItems((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2, 9), question: "New multiple choice question", choices: ["", "", "", ""], correctOption: "" }
    ]);
  };

  const updateQAField = (id: string, field: keyof QAItem, value: any) => {
    setQaItems((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const updateChoice = (id: string, index: number, value: string) => {
    setQaItems((prev) =>
      prev.map((q) => q.id === id ? { ...q, choices: q.choices.map((c, i) => (i === index ? value : c)) as [string,string,string,string] } : q)
    );
  };

  const removeQA = (id: string) => setQaItems((prev) => prev.filter((q) => q.id !== id));

  const validateBeforePublish = (): boolean => {
    const errs: string[] = [];
    if (!examTitle.trim()) errs.push("Exam title is required.");
    if (!grade) errs.push("Grade / section is required.");
    if (!subject) errs.push("Subject is required.");
    if (grade !== "Entrance" && !examType) errs.push("Exam type is required for non-Entrance grades.");
    if (!examDate) errs.push("Exam date is required.");
    if (!duration || Number(duration) < 10) errs.push("Duration must be >= 10 minutes.");
    if (uploadedFiles.length === 0) errs.push("At least one file or description must be uploaded.");
    if (categoryPaid === "paid") {
      if (!paidAgreementChecked) errs.push("You must accept paid exam terms (checkbox).");
      if (!approvalForm.directorName.trim()) errs.push("Director name is required for approval.");
      if (!approvalForm.directorEmail.trim()) errs.push("Director email is required for approval.");
      if (!approvalForm.priceInETB.trim()) errs.push("Set a price for the paid exam.");
    }
    if (qaItems.length === 0) errs.push("Add or extract at least one question.");
    qaItems.forEach((q, idx) => {
      const missingChoice = q.choices.some((c) => !c || c.trim() === "");
      if (missingChoice) errs.push(`Question ${idx + 1} must have all 4 choices filled.`);
      if (!q.correctOption) errs.push(`Question ${idx + 1} must have a correct option (A/B/C/D) selected.`);
    });
    if (!confirmCreate) errs.push("You must confirm creating and publishing this exam.");
    setErrors(errs);
    return errs.length === 0;
  };

  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateBeforePublish()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const payload = {
      title: examTitle.trim(), grade, subject, examType: grade === "Entrance" ? null : examType,
      date: examDate, duration: Number(duration), category: categoryPaid,
      priceInETB: categoryPaid === "paid" ? approvalForm.priceInETB : null,
      paidAgreementAccepted: categoryPaid === "paid" ? paidAgreementChecked : null,
      files: uploadedFiles.map((f) => ({ name: f.name, size: f.size, needsServerProcessing: f.needsServerProcessing })),
      questions: qaItems.map((q, idx) => ({ index: idx + 1, question: q.question, choices: q.choices, correctOption: q.correctOption })),
      approvalRequest: categoryPaid === "paid" ? { ...approvalForm, status: approvalStatus } : null,
      publishedAt: new Date().toISOString()
    };
    console.log("Exam to publish:", payload);
    alert("✅ Exam created and published successfully!\n\nCheck the console for the exam payload (ready to send to backend).");

    setExamTitle(""); setGrade(""); setSubject(""); setExamType(""); setExamDate(""); setDuration("");
    setCategoryPaid("free"); setPaidAgreementChecked(false); setUploadedFiles([]); setQaItems([]); setConfirmCreate(false);
    setErrors([]); setApprovalStatus("not_requested"); setApprovalForm({ directorName: "", directorEmail: "", priceInETB: "", approvalDocument: null, messageToDirector: "" });
  };

  const sendApprovalRequest = () => {
    const errs: string[] = [];
    if (!approvalForm.directorName.trim()) errs.push("Director name is required.");
    if (!approvalForm.directorEmail.trim()) errs.push("Director email is required.");
    if (!approvalForm.priceInETB.trim()) errs.push("Exam price is required.");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]); setApprovalStatus("pending");
    setTimeout(() => { setApprovalStatus("approved"); alert("📨 Approval request simulated: Director approved the exam (demo)."); }, 1500);
  };

  const onApprovalDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setApprovalForm((prev) => ({ ...prev, approvalDocument: f ?? null }));
  };

  const currentSubjects = grade ? SUBJECTS_BY_GRADE[grade as Exclude<GradeSection, "">] ?? [] : [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3"><FilePlus2 size={28} className="text-white" aria-hidden="true" /></div>
            <div>
              <h1 className="text-white text-2xl font-bold">Create New Exam</h1>
              <p className="text-indigo-100/90 mt-1">AI-powered creation — upload files, extract MCQs, get school approval for paid content.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6">
          {errors.length > 0 && (
            <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3" role="alert" aria-live="assertive">
              <strong className="text-red-700">Please fix:</strong>
              <ul className="list-disc ml-5 mt-1 text-sm text-red-700">{errors.map((er, i) => <li key={i}>{er}</li>)}</ul>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6" aria-label="Create exam form">
            <div>
              <label htmlFor="exam-title" className="block text-sm font-semibold text-gray-700 mb-2">Exam Title</label>
              <input id="exam-title" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder="e.g., Grade 10 Final: Algebra - Term I" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="grade-select" className="block text-sm font-semibold text-gray-700 mb-2">Grade / Section</label>
                <select id="grade-select" value={grade} onChange={(e) => setGrade(e.target.value as GradeSection)} className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" aria-label="Select grade or entrance">
                  <option value="">Select grade or entrance</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                  <option value="Entrance">Entrance</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject-select" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select id="subject-select" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!grade} className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60" aria-label="Select subject">
                  <option value="">{grade ? "Select subject" : "Choose grade first"}</option>
                  {currentSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="examtype-select" className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
                {grade === "Entrance" ? (
                  <div className="text-sm text-gray-500">No exam type needed for Entrance — upload files directly.</div>
                ) : (
                  <select id="examtype-select" value={examType} onChange={(e) => setExamType(e.target.value as ExamType)} className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" aria-label="Select exam type">
                    <option value="">Select exam type</option>
                    <optgroup label="Mid Exams">
                      <option value="Mid1">Mid 1</option>
                      <option value="Mid2">Mid 2</option>
                      <option value="OtherMid">Other Mid</option>
                    </optgroup>
                    <optgroup label="Final Exams">
                      <option value="Final1">Final 1</option>
                      <option value="Final2">Final 2</option>
                      <option value="Final3">Final 3</option>
                      <option value="OtherFinal">Other Final</option>
                    </optgroup>
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="exam-date" className="block text-sm font-semibold text-gray-700 mb-2">Exam Date</label>
                <input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" aria-label="Exam date" />
              </div>

              <div>
                <label htmlFor="exam-duration" className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
                <input id="exam-duration" type="number" min={10} value={duration} onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g., 90" className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" aria-label="Duration in minutes" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Exam Files or Paste Questions</label>

              <div ref={dropRef} className="rounded-xl border-2 border-dashed border-gray-200 p-4 hover:border-indigo-300 transition-colors bg-gradient-to-b from-white to-gray-50" aria-label="File upload area">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg"><CloudUpload className="text-indigo-600" aria-hidden="true" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Drag & drop files here</div>
                        <div className="text-xs text-gray-500">Accepts PDF, DOCX, PPTX, TXT, MD. Text files are processed client-side in the demo.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input ref={fileInputRef} onChange={onFileInputChange} type="file" multiple accept={allowedFileTypes.join(",")} className="hidden" aria-hidden="true" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" title="Select files" aria-label="Select files to upload">
                          Select Files
                        </button>
                        <button type="button" onClick={() => { setUploadedFiles([]); setQaItems([]); }} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50" title="Clear uploaded files" aria-label="Clear uploaded files">
                          Clear
                        </button>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files</h4>
                        <ul className="space-y-2">
                          {uploadedFiles.map((uf) => (
                            <li key={uf.id} className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-md"><File size={18} className="text-gray-600" aria-hidden="true" /></div>
                                <div>
                                  <div className="font-medium text-gray-800">{uf.name}</div>
                                  <div className="text-xs text-gray-500">{humanFileSize(uf.size)} • {uf.needsServerProcessing ? "Server processing required" : "Client text processed"}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => removeUploadedFile(uf.id)} className="text-red-600 hover:text-red-800" title={`Remove file ${uf.name}`} aria-label={`Remove file ${uf.name}`}>
                                  <Trash2 aria-hidden="true" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="flex items-center gap-3" role="radiogroup" aria-label="Select category">
                  <button type="button" onClick={() => { setCategoryPaid("free"); setApprovalStatus("not_requested"); }} aria-pressed={categoryPaid === "free"} className={`px-4 py-2 rounded-xl font-medium ${categoryPaid === "free" ? "bg-green-50 border-green-400 text-green-700" : "bg-white border border-gray-200 text-gray-700"}`} title="Select free category" aria-label="Free category">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 align-middle" /> Free
                  </button>

                  <button type="button" onClick={() => setCategoryPaid("paid")} aria-pressed={categoryPaid === "paid"} className={`px-4 py-2 rounded-xl font-medium ${categoryPaid === "paid" ? "bg-amber-50 border-amber-400 text-amber-700" : "bg-white border border-gray-200 text-gray-700"}`} title="Select paid category" aria-label="Paid category">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2 align-middle" /> Paid
                  </button>

                  {categoryPaid === "paid" && (<div className="ml-4 text-sm text-gray-600">Paid exams require director approval before publishing to paid catalog.</div>)}
                </div>

                {categoryPaid === "paid" && (
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <label htmlFor="price-input" className="text-sm font-medium text-gray-700">Exam Price (ETB)</label>
                    <input id="price-input" value={approvalForm.priceInETB} onChange={(e) => setApprovalForm((p) => ({ ...p, priceInETB: e.target.value }))} placeholder="e.g., 150.00" className="rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-amber-200" aria-label="Exam price in Ethiopian Birr" />

                    <label htmlFor="director-name" className="text-sm font-medium text-gray-700">Director's Name</label>
                    <input id="director-name" value={approvalForm.directorName} onChange={(e) => setApprovalForm((p) => ({ ...p, directorName: e.target.value }))} placeholder="School Director full name" className="rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-amber-200" aria-label="Director name" />

                    <label htmlFor="director-email" className="text-sm font-medium text-gray-700">Director's Email</label>
                    <input id="director-email" value={approvalForm.directorEmail} onChange={(e) => setApprovalForm((p) => ({ ...p, directorEmail: e.target.value }))} placeholder="director@school.edu.et" className="rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-amber-200" aria-label="Director email" />

                    <label htmlFor="approval-doc" className="text-sm font-medium text-gray-700">Approval Document (optional)</label>
                    <input id="approval-doc" type="file" accept=".pdf,.doc,.docx" onChange={onApprovalDocChange} className="text-sm" aria-label="Approval document upload" />

                    <label htmlFor="director-message" className="text-sm font-medium text-gray-700">Message to Director</label>
                    <textarea id="director-message" value={approvalForm.messageToDirector} onChange={(e) => setApprovalForm((p) => ({ ...p, messageToDirector: e.target.value }))} rows={3} className="rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-amber-200" placeholder="Please review this exam for approval..." aria-label="Message to director" />

                    <div className="mt-2">
                      <label className="inline-flex items-start gap-3">
                        <input type="checkbox" checked={paidAgreementChecked} onChange={(e) => setPaidAgreementChecked(e.target.checked)} className="mt-1" aria-label="Accept paid exam terms" />
                        <div>
                          <div className="text-sm font-medium">I accept the Paid Exam Terms</div>
                          <div className="text-xs text-gray-500">I confirm I have rights to publish this exam as paid content and will request/obtain director approval before listing.</div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <button type="button" onClick={sendApprovalRequest} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700" title="Send approval request" aria-label="Send approval request to director">
                        <Mail aria-hidden="true" /> Send Approval Request
                      </button>

                      <div className="text-sm">
                        <div className="font-medium">Approval status:</div>
                        <div className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${approvalStatus === "not_requested" ? "bg-gray-100 text-gray-700" : approvalStatus === "pending" ? "bg-yellow-50 text-yellow-700" : approvalStatus === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} aria-live="polite">
                          {approvalStatus === "not_requested" && <span>Not requested</span>}
                          {approvalStatus === "pending" && <span>Pending director review</span>}
                          {approvalStatus === "approved" && <span><UserCheck aria-hidden="true" /> Approved</span>}
                          {approvalStatus === "rejected" && <span><XCircle aria-hidden="true" /> Rejected</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmation</label>
                <div className="rounded-lg border border-gray-100 p-4 bg-gradient-to-b from-white to-gray-50">
                  <p className="text-sm text-gray-600 mb-3">Check to confirm you are ready to create and publish this exam. For paid exams ensure director approval is requested and approved before publishing to paid catalog.</p>
                  <label className="inline-flex items-center gap-3">
                    <input id="confirm-create" type="checkbox" checked={confirmCreate} onChange={(e) => setConfirmCreate(e.target.checked)} aria-label="Confirm create and publish" />
                    <span className="text-sm">I confirm to create and publish this exam</span>
                  </label>
                  {categoryPaid === "paid" && (<div className="mt-3 text-xs text-gray-500">Paid exam publishing requires director approval in the approved state before listing as paid content.</div>)}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Extracted Questions (Editable) — Multiple Choice (A–D)</h3>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={addEmptyQA} className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" title="Add MCQ" aria-label="Add multiple choice question">
                    <FileText aria-hidden="true" /> Add MCQ
                  </button>
                </div>
              </div>

              {qaItems.length === 0 ? (
                <div className="text-sm text-gray-500">No questions extracted yet. Upload files or add MCQs manually.</div>
              ) : (
                <div className="space-y-4">
                  {qaItems.map((q, idx) => (
                    <div key={q.id} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">Q{idx + 1}</div>
                          <textarea id={`q-${q.id}`} value={q.question} onChange={(e) => updateQAField(q.id, "question", e.target.value)} rows={3} className="w-full rounded-md border border-gray-200 px-2 py-1 focus:ring-1 focus:ring-indigo-200" aria-label={`Question ${idx + 1} text`} />

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2" role="group" aria-label={`Choices for question ${idx + 1}`}>
                            {(["A", "B", "C", "D"] as const).map((letter, i) => (
                              <label key={letter} className="flex items-start gap-2">
                                <input type="radio" name={`correct-${q.id}`} checked={q.correctOption === letter} onChange={() => updateQAField(q.id, "correctOption", letter)} className="mt-1" aria-label={`Select ${letter} as correct option for question ${idx + 1}`} />
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-gray-600">Option {letter}</div>
                                  <input id={`q-${q.id}-choice-${letter}`} value={q.choices[i] ?? ""} onChange={(e) => updateChoice(q.id, i, e.target.value)} placeholder={`Enter choice ${letter}`} className="w-full rounded-md border border-gray-200 px-2 py-1 mt-1" aria-label={`Choice ${letter} for question ${idx + 1}`} />
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button type="button" onClick={() => removeQA(q.id)} className="text-red-600 hover:text-red-800" title="Remove question" aria-label={`Remove question ${idx + 1}`}>
                            <XCircle aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700" title="Publish exam" aria-label="Publish exam">
                <CheckCircle aria-hidden="true" /> Publish Exam
              </button>

              <button type="button" onClick={() => { console.log("Preview payload:", { title: examTitle, grade, subject, examType, date: examDate, duration, categoryPaid, approvalStatus, questionsCount: qaItems.length, filesCount: uploadedFiles.length }); alert("Preview logged to console."); }} className="px-4 py-3 border rounded-2xl hover:bg-gray-50" title="Preview exam" aria-label="Preview exam">
                Preview
              </button>

              <div className="ml-auto text-sm text-gray-500">All data remains local in this demo. Connect to your backend to persist.</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreateExam;