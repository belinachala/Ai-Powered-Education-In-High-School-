import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import FreeExamCreation from "./FreeExamCreation";

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.3, duration: 0.6 },
  }),
};

const TeacherCreateExam: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/70 via-white to-blue-50/40
                    dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30
                    relative overflow-hidden flex flex-col items-center px-5 sm:px-8 py-10 md:py-16 transition-colors duration-300">

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        {/* Announcement / Guideline Banner */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-14 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 dark:from-indigo-900/30 dark:to-blue-900/20 
                     border border-indigo-200/60 dark:border-indigo-700/40 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-start gap-6">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-800/40 rounded-xl flex-shrink-0">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-1.5 flex items-center gap-2">
                Welcome Ethiopian Educators! <span className="text-xs bg-indigo-600/80 text-white px-2.5 py-0.5 rounded-full font-medium">New 2026</span>
              </h3>
              <p className="text-indigo-800/90 dark:text-indigo-300 text-base leading-relaxed">
                Create unlimited <strong>Free </strong>and <strong>Paid practice exams</strong> with powerful AI assistance. Save up to 80% time • Ethiopian curriculum aligned • Instant question generation & answer keys.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-14 md:mb-20"
        >
           

          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-950 dark:text-indigo-50 tracking-tight leading-tight"> 
            <span className="block mt-2 text-3xl sm:text-2xl md:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              with Ethiopian AI
            </span>
          </h3>

          <p className="mt-6 text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Fast, Smart, Curriculum-aligned exam builder — designed for Ethiopian High School and Remedial Program teachers.
          </p>
        </motion.div>

        {/* Main Free Exam Card – bigger & more premium */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.4 } }}
          onClick={() => navigate("/h-s-teacher/free-exam")}
          className="group relative bg-white/90 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/50 
                     overflow-hidden cursor-pointer max-w-4xl mx-auto"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col items-center text-center">

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mb-10"
            >
              <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-14 md:h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                <BookOpen className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
              </div>
            </motion.div>

            <h4 className="text-4xl sm:text-5xl font-bold text-indigo-900 dark:text-indigo-50 mb-6">
              Free Exam Creator
            </h4>

            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-10 max-w-1xl leading-relaxed">
              Unlimited creation • AI-powered questions • Instant grading keys • Perfect for classroom practice, revision & mock exams — no limits, no payment needed.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-2xl">
              {[
                { icon: Brain, text: "AI generates questions in seconds" },
                { icon: GraduationCap, text: "Supports Ethiopian New curriculum" },
                { icon: Sparkles, text: "Beautiful PDFs & sharing" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center gap-3"
                >
                  <div className="p-4 bg-blue-100/70 dark:bg-blue-900/30 rounded-xl">
                    <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 text-center">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                               hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xl rounded-2xl shadow-lg transition-all">
                Start Creating Free Exam
                <Sparkles className="w-3 h-3" />
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Motivation / Stat Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 md:mt-24 bg-white/60 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 md:p-7 shadow-xl border border-indigo-100/50 dark:border-indigo-800/30 text-center max-w-4xl mx-auto"
        >
          <Brain className="w-12 h-12 mx-auto mb-6 text-indigo-600 dark:text-indigo-400" />
          <p className="text-xl md:text-1xl font-semibold text-indigo-900 dark:text-indigo-100 leading-relaxed">
            Teachers using AI create exams <span className="text-indigo-600 dark:text-indigo-400 font-bold">60% faster </span>  
            with higher quality questions start today!
          </p>
        </motion.div>

        {/* Footer quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 md:mt-24 text-center text-slate-600 dark:text-slate-400 italic text-lg md:text-xl"
        >
          “The best teachers are those who show you where to look but don't tell you what to see.”  
          <span className="block mt-4 text-base not-italic text-indigo-600/80 dark:text-indigo-400/80">
            — Designed for Ethiopian High School Teachers • 2026
          </span>
        </motion.p>

      </div>

      {/* Nested route */}
      <div className="w-full max-w-6xl mt-16">
        <Routes>
          <Route path="free-exam" element={<FreeExamCreation />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherCreateExam;