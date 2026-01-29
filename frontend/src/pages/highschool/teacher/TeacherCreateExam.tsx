import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Zap,
} from "lucide-react";
import FreeExamCreation from "./FreeExamCreation";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1 + 0.5, duration: 0.5 },
  }),
};

const TeacherCreateExam: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreating = location.pathname.includes("free-exam");

  // If we are in the creation sub-route, just render the child and exit
  if (isCreating) {
    return <Routes><Route path="free-exam" element={<FreeExamCreation />} /></Routes>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center px-4 sm:px-6 py-12 transition-colors duration-500 bg-[#fdfeff] dark:bg-[#020617]">
      
      {/* --- NEW ATTRACTIVE BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 dark:bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-100/30 dark:bg-purple-900/10 blur-[80px]" />
        
        {/* Subtle Paper/Technical Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" 
             style={{ backgroundImage: `radial-gradient(#6366f1 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-semibold shadow-sm">
            <Sparkles size={14} className="fill-current" />
            <span>2026 Ethiopian Curriculum Support</span>
            <ChevronRight size={14} />
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]">
            Generate Exams <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-500 bg-clip-text text-transparent">
              in Seconds, Not Hours.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            AI-powered drafting for High School & Remedial programs. 
            Aligned with the latest Ethiopian Ministry of Education standards.
          </p>
        </motion.div>

        {/* Main Selection Card with "Glassmorphism" */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -8 }}
          className="group relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white dark:border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5 items-stretch">
              
              {/* Left Column (Image & Icon) */}
              <div className="md:col-span-2 bg-indigo-50/50 dark:bg-indigo-900/20 p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-gray-800">
                <div className="relative mb-8 w-full aspect-video rounded-2xl overflow-hidden border border-white dark:border-gray-700 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                  <img 
                    src="assets/create-exan.png" 
                    alt="Creation Tool" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600"; }}
                  />
                  <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="text-center">
                   <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">Free Tier</p>
                   <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Unlimited Usage</p>
                </div>
              </div>

              {/* Right Column (Details) */}
              <div className="md:col-span-3 p-10 md:p-14">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Free Exam Creator</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                  Perfect for classroom practice and revision. Access our AI question bank to generate curriculum-aligned assessments instantly.
                </p>

                <div className="grid grid-cols-1 gap-4 mb-10">
                  {[
                    { icon: Zap, text: "Instant MCQ & Short Answers", color: "text-amber-500" },
                    { icon: GraduationCap, text: "Supports Grade 9-12 & Remedial", color: "text-blue-500" },
                    { icon: Brain, text: "Adaptive Difficulty Selection", color: "text-violet-500" },
                  ].map((feat, i) => (
                    <motion.div 
                      key={i} custom={i} variants={itemVariants}
                      className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm"
                    >
                      <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${feat.color}`}>
                        <feat.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{feat.text}</span>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/h-s-teacher/free-exam")}
                  className="group/btn w-full flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform active:scale-95"
                >
                  Start Creating Now
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {[
            { label: "Efficiency Increase", val: "60% Faster", color: "text-indigo-600" },
            { label: "Smart Question Sourcing", val: "AI-Guided", color: "text-blue-600" }
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[240px] p-8 rounded-[2rem] bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white dark:border-gray-800 text-center shadow-sm">
               <div className={`${stat.color} font-black text-3xl mb-1`}>{stat.val}</div>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TeacherCreateExam;