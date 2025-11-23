import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Images for grades
const gradeImages: Record<string, string> = {
  "9": "/assets/grade9.png",
  "10": "/assets/grade10.png",
  "11": "/assets/grade11.png",
  "12": "/assets/grade12.png",
  "Entrance": "/assets/entrance.png",
};

// Images for streams
const streamImages: Record<string, string> = {
  "Natural Science": "/assets/natural.png",
  "Social Science": "/assets/social.png",
};

// Images for semesters
const semesterImages: Record<string, string> = {
  "All First Semester Subjects": "/assets/semester1.png",
  "All Second Semester Subjects": "/assets/semester2.png",
};

// Subjects by grade/stream
const subjectsData: Record<string, string[]> = {
  "9": ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Geography", "Civics", "Afaan Oromo", "Amharic"],
  "10": ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Geography", "Civics", "Afaan Oromo", "Amharic"],
  "11-Natural Science": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Civics", "Agriculture"],
  "11-Social Science": ["Mathematics", "Economics", "History", "Geography", "English", "Civics"],
  "12-Natural Science": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Civics"],
  "12-Social Science": ["Mathematics", "Economics", "History", "Geography", "English", "Civics"],
  "Entrance-Natural Science": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Civics"],
  "Entrance-Social Science": ["Mathematics", "Economics", "History", "Geography", "English", "Civics"],
};

// Subject images by grade/stream
const subjectImagesByGrade: Record<string, Record<string, string>> = {
  "9": {
    "Mathematics": "/assets/courses/math9.png",
    "English": "/assets/courses/english9.png",
    "Physics": "/assets/courses/physics9.png",
    "Chemistry": "/assets/courses/chemistry9.png",
    "Biology": "/assets/courses/biology9.png",
    "History": "/assets/courses/history9.png",
    "Geography": "/assets/courses/geography9.png",
    "Civics": "/assets/courses/civics9.png",
    "Afaan Oromo": "/assets/courses/afaan-oromo9.png",
    "Amharic": "/assets/courses/amharic9.png",
  },
  "10": {
    "Mathematics": "/assets/courses/math10.png",
    "English": "/assets/courses/english10.png",
    "Physics": "/assets/courses/physics10.png",
    "Chemistry": "/assets/courses/chemistry10.png",
    "Biology": "/assets/courses/biology10.png",
    "History": "/assets/courses/history10.png",
    "Geography": "/assets/courses/geography10.png",
    "Civics": "/assets/courses/civics10.png",
    "Afaan Oromo": "/assets/courses/afaanoromo10.png",
    "Amharic": "/assets/courses/amharic10.png",
  },
  "11-Natural Science": {
    "Mathematics": "/assets/courses/math11.png",
    "Physics": "/assets/courses/physics11.png",
    "Chemistry": "/assets/courses/chemistry11.png",
    "Biology": "/assets/courses/biology11.png",
    "English": "/assets/courses/english11.png",
    "Civics": "/assets/courses/civics11.png",
    "Agriculture": "/assets/courses/agriculture11.png",
  },
  "11-Social Science": {
    "Mathematics": "/assets/courses/math11.png",
    "Economics": "/assets/courses/economics11.png",
    "History": "/assets/courses/history11.png",
    "Geography": "/assets/courses/geography11.png",
    "English": "/assets/courses/english11.png",
    "Civics": "/assets/courses/civics11.png",
  },
  "12-Natural Science": {
    "Mathematics": "/assets/courses/math12.png",
    "Physics": "/assets/courses/physics12.png",
    "Chemistry": "/assets/courses/chemistry12.png",
    "Biology": "/assets/courses/biology12.png",
    "English": "/assets/courses/english12.png",
    "Civics": "/assets/courses/civics12.png",
  },
  "12-Social Science": {
    "Mathematics": "/assets/courses/math12.png",
    "Economics": "/assets/courses/economics12.png",
    "History": "/assets/courses/history12.png",
    "Geography": "/assets/courses/geography12.png",
    "English": "/assets/courses/english12.png",
    "Civics": "/assets/courses/civics12.png",
  },
  "Entrance-Natural Science": {
    "Mathematics": "/assets/math.png",
    "Physics": "/assets/physics.png",
    "Chemistry": "/assets/chemistry.png",
    "Biology": "/assets/biology.png",
    "English": "/assets/english.png",
    "Civics": "/assets/civics.png",
  },
  "Entrance-Social Science": {
    "Mathematics": "/assets/math.png",
    "Economics": "/assets/economics.png",
    "History": "/assets/history.png",
    "Geography": "/assets/geography.png",
    "English": "/assets/english.png",
    "Civics": "/assets/civics.png",
  },
};

// Exams
const examsPerSubject = {
  midterms: ["Mid 1", "Mid 2", "Mid 3"],
  finals: ["Final 1", "Final 2", "Final 3"],
};

const PaidExam: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"grade" | "stream" | "semester" | "subjects" | "exams" | "payment">("grade");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [paid, setPaid] = useState<boolean>(false);

  const grades = ["9", "10", "11", "12", "Entrance"];
  const streams = ["Natural Science", "Social Science"];
  const semesters = ["All First Semester Subjects", "All Second Semester Subjects"];

  const handleBack = () => {
    if (step === "exams") {
      setStep("subjects");
      setSelectedSubject(null);
    } else if (step === "subjects") {
      if (["11", "12", "Entrance"].includes(selectedGrade!)) {
        setStep(selectedStream ? "semester" : "stream");
        setSelectedSemester(null);
      } else {
        setStep("semester");
      }
    } else if (step === "semester") {
      if (["11", "12", "Entrance"].includes(selectedGrade!)) {
        setStep("stream");
        setSelectedSemester(null);
      } else {
        setStep("grade");
        setSelectedGrade(null);
      }
    } else if (step === "stream") {
      setStep("grade");
      setSelectedGrade(null);
      setSelectedStream(null);
    } else if (step === "payment") {
      setStep(selectedGrade === "Entrance" || ["9","10"].includes(selectedGrade!) ? "semester" : "stream");
      setPaid(false);
    } else {
      navigate(-1);
    }
  };

  const currentSubjectsKey =
    ["9", "10"].includes(selectedGrade!)
      ? selectedGrade
      : `${selectedGrade}-${selectedStream}`;

  const handlePayment = () => {
    // Simulate payment process
    setPaid(true);
    setStep("subjects");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform"
        onClick={handleBack}
      >
        ← Back
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Paid Exam</h1>

        {/* Step guidance */}
        {step === "grade" && (
          <p className="text-center mb-6 max-w-3xl">
            🎯 Select your grade. This ensures you see exams that match your level.
          </p>
        )}
        {step === "stream" && (
          <p className="text-center mb-6 max-w-3xl">
            🔬 Select your stream to see subjects for your grade.
          </p>
        )}
        {step === "semester" && (
          <p className="text-center mb-6 max-w-3xl">
            📚 Choose the semester to match your syllabus. Entrance exams skip this step.
          </p>
        )}
        {step === "payment" && (
          <p className="text-center mb-6 max-w-3xl">
            💳 Complete the payment to access your paid exam. Retakes are allowed after payment.
          </p>
        )}
        {step === "subjects" && (
          <p className="text-center mb-6 max-w-3xl">
            ✅ Select a subject to see available Midterms and Final exams.
          </p>
        )}
        {step === "exams" && selectedSubject && (
          <p className="text-center mb-6 max-w-3xl">
            📌 Choose a specific exam for {selectedSubject}. Focus and complete honestly.
          </p>
        )}

        {/* Grade Selection */}
        {step === "grade" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {grades.map((grade) => (
              <div
                key={grade}
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
                onClick={() => {
                  setSelectedGrade(grade);
                  if (["11", "12", "Entrance"].includes(grade)) setStep("stream");
                  else setStep("semester");
                }}
              >
                <img src={gradeImages[grade]} alt={grade} className="h-24 mb-2" />
                <span className="font-semibold text-lg">{grade}</span>
                <button className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-transform">
                  Start
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stream Selection */}
        {step === "stream" && (
          <div className="grid grid-cols-2 gap-6">
            {streams.map((stream) => (
              <div
                key={stream}
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
                onClick={() => {
                  setSelectedStream(stream);
                  setStep(selectedGrade === "Entrance" ? "payment" : "semester");
                }}
              >
                <img src={streamImages[stream]} alt={stream} className="h-24 mb-2" />
                <span className="font-semibold text-lg">{stream}</span>
                <button className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-transform">
                  Select Stream
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Semester Selection */}
        {step === "semester" && (
          <div className="grid grid-cols-2 gap-6">
            {semesters.map((sem) => (
              <div
                key={sem}
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition"
                onClick={() => {
                  setSelectedSemester(sem);
                  setStep("payment");
                }}
              >
                <img src={semesterImages[sem]} alt={sem} className="h-24 mb-2" />
                <span className="font-semibold text-lg">{sem}</span>
                <button className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-transform">
                  Get Start
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && !paid && (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-xl font-semibold mb-4">💳 Payment Required</h2>
            <p className="mb-4">You must complete the payment to access your paid exams for grade {selectedGrade}.</p>
            <button
              className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-transform"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Subjects */}
        {step === "subjects" && currentSubjectsKey && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl">
            {subjectsData[currentSubjectsKey].map((subj) => (
              <div
                key={subj}
                className="bg-white p-4 rounded-lg shadow-lg text-center flex flex-col items-center cursor-pointer hover:shadow-xl transition"
                onClick={() => {
                  setSelectedSubject(subj);
                  setStep("exams");
                }}
              >
                <img
                  src={subjectImagesByGrade[currentSubjectsKey][subj]}
                  alt={subj}
                  className="h-24 mb-2"
                />
                <h3 className="font-semibold mb-2">{subj}</h3>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-transform">
                  Start Exam
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Exams */}
        {step === "exams" && selectedSubject && (
          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold mb-4">{selectedSubject} Exams</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {examsPerSubject.midterms.map((exam) => (
                <button
                  key={exam}
                  className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform"
                >
                  {exam}
                </button>
              ))}
              {examsPerSubject.finals.map((exam) => (
                <button
                  key={exam}
                  className="py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform"
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaidExam;
