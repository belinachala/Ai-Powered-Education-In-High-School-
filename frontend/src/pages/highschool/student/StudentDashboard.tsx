import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Exam {
  id: string;
  title: string;
  description: string;
  detailedDescription: string[];
  imageUrl: string;
  backgroundColor: string;
  buttonColor: string;
}

const exams: Exam[] = [
  {
    id: "free-exam",
    title: "Free Exam",
    description: "Access official unpaid academic exams like Midterms and Finals for free.",
    detailedDescription: [
      "💸 Completely free; everyone can take and practice.",
      "🔁 Retakes are allowed for additional practice.",
      "❌ Any form of cheating is strictly forbidden.",
      "📚 Includes Midterms and Finals based on semester subjects in your grade.",
      "🎓 Includes Entrance exam subjects for your grade.",
      "✅ Ideal for Grade 9-12 and remedial students in Ethiopia to improve knowledge and skills.",
    ],
    imageUrl: "/assets/free-exam.png",
    backgroundColor: "bg-blue-500",
    buttonColor: "bg-blue-700 hover:bg-blue-800",
  },
  {
    id: "paid-exam",
    title: "Paid Exam",
    description: "Take optional paid practice exams with AI grading and proctoring support.",
    detailedDescription: [
      "💰 Students must complete the payment process to access the exam.",
      "📚 Exams cover all subjects for the student's semester and grade.",
      "🤖 AI-powered grading ensures instant feedback on performance.",
      "🔒 Secure exam proctoring is included to prevent cheating.",
      "✅ Suitable for students who want structured practice and performance tracking.",
      "🎯 Helps students prepare more effectively and identify areas of improvement.",
    ],
    imageUrl: "/assets/paid-exam.png",
    backgroundColor: "bg-purple-600",
    buttonColor: "bg-purple-800 hover:bg-purple-900",
  },
];

const StudentDashboard: React.FC = () => {
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      

      {/* Exams Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {exams.map(
          ({
            id,
            title,
            description,
            detailedDescription,
            imageUrl,
            backgroundColor,
            buttonColor,
          }) => (
            <div
              key={id}
              className={`rounded-lg shadow-xl p-6 flex flex-col items-center text-white cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fadeIn`}
              style={{ animationDuration: "600ms" }}
            >
              {/* Colored banner */}
              <div
                className={`w-full rounded-t-lg p-4 ${backgroundColor} flex justify-center items-center`}
              >
                <img
                  src={imageUrl}
                  alt={`${title} illustration`}
                  className="h-32 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="bg-white rounded-b-lg w-full p-6 text-gray-800 text-center flex-grow flex flex-col justify-between">
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="mb-6">{description}</p>

                {/* Learn More button */}
                <button
                  className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-transform hover:scale-105"
                  onClick={() =>
                    setExpandedExamId(expandedExamId === id ? null : id)
                  }
                >
                  {expandedExamId === id ? "Show Less" : "Learn More"}
                </button>

                {/* Detailed Description */}
                {expandedExamId === id && (
                  <div className="text-left text-gray-700 mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 whitespace-pre-line">
                    <ul className="space-y-2 list-disc list-inside">
                      {detailedDescription.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Start Exam button */}
                <button
                  className={`w-full py-3 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${buttonColor} shadow-lg hover:scale-105 transform transition-transform`}
                  onClick={() =>
                    navigate(
                      `/h-s-student/${id === "free-exam" ? "free-exam" : "paid-exam"}`
                    )
                  }
                >
                  Start Exam
                </button>
              </div>
            </div>
          )
        )}
      </section>

      {/* Promotional Section */}
      <section className="max-w-4xl mx-auto mb-16 p-6 bg-white rounded-lg shadow-lg text-center animate-fadeInUp">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Boost Your Exam Success with Our AI-Powered Platform!
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Prepare smartly with personalized AI recommendations, real-time grading,
          and secure exam proctoring. Whether you want free official exams or paid
          practice sessions, we've got you covered.
        </p>
      </section>

      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation-name: fadeInUp;
          animation-fill-mode: both;
          animation-timing-function: ease-out;
        }
        .animate-fadeIn {
          animation: fadeInUp 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
