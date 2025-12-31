import React, { useState } from "react";
import { BookOpen, ArrowLeft, FileText, Download } from "lucide-react";

interface Course {
  id: number;
  name: string;
  pdf: string;
  image: string;
}

interface Field {
  name: string;
  courses: Course[];
  image?: string;
  recommendation?: string;
}

interface GradeCategory {
  id: number;
  title: string;
  image: string;
  description: string;
  fields?: Field[];
  courses?: Course[];
}

const TeacherCourses: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeCategory | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const gradeCategories: GradeCategory[] = [
    // ====== Grade 9 ======
    {
      id: 9,
      title: "Grade 9 all subjects based on Ethiopia New Curriculum",
      image: "/assets/grade9.png",
      description: "subjects for Grade 9 based on Ethiopian Curriculum.",
      courses: [
        { id: 1, name: "English", pdf: "/pdfs/grade9/english.pdf", image: "/assets/courses/english9.png" },
        { id: 2, name: "Grade 9 Mathmathics", pdf: "/pdfs/grade9/math.pdf", image: "/assets/courses/math9.png" },
        { id: 3, name: "Grade 9 Biology", pdf: "/pdfs/grade9/biology.pdf", image: "/assets/courses/biology9.png" },
        { id: 4, name: "Grade 9 Physics", pdf: "/pdfs/grade9/physics.pdf", image: "/assets/courses/physics9.png" },
        { id: 5, name: "Grade 9 Chemistry", pdf: "/pdfs/grade9/chemistry.pdf", image: "/assets/courses/chemistry9.png" },
        { id: 6, name: "Grade 9 History", pdf: "/pdfs/grade9/history.pdf", image: "/assets/courses/history9.png" },
        { id: 7, name: "Grade 9 Geography", pdf: "/pdfs/grade9/geography.pdf", image: "/assets/courses/geography9.png" },
        { id: 8, name: "Grade 9 Civics", pdf: "/pdfs/grade9/civics.pdf", image: "/assets/courses/civics9.png" },
        { id: 9, name: "Grade 9 Amharic", pdf: "/pdfs/grade9/amharic.pdf", image: "/assets/courses/amharic9.png" },
        { id: 10, name: "Grade 9 Afaan Oromo", pdf: "/pdfs/grade9/afaanoromo.pdf", image: "/assets/courses/afaan-oromo9.png" },
        { id: 11, name: "Grade 9 ICT", pdf: "/pdfs/grade9/ict.pdf", image: "/assets/courses/ict9.png" },
      ],
    },
    // ====== Grade 10 ======
    {
      id: 10,
      title: "Grade 10 all subjects based on Ethiopia New Curriculum",
      image: "/assets/grade10.png",
      description: "Subjects for Grade 10 based on Ethiopian Curriculum.",
      courses: [
        { id: 1, name: "Grade 10 English", pdf: "/pdfs/grade10/english.pdf", image: "/assets/courses/english10.png" },
        { id: 2, name: "Grade 10 Mathmathics", pdf: "/pdfs/grade10/math.pdf", image: "/assets/courses/math10.png" },
        { id: 3, name: "Grade 10 Biology", pdf: "/pdfs/grade10/biology.pdf", image: "/assets/courses/biology10.png" },
        { id: 4, name: "Grade 10 Physics", pdf: "/pdfs/grade10/physics.pdf", image: "/assets/courses/physics10.png" },
        { id: 5, name: "Grade 10 Chemistry", pdf: "/pdfs/grade10/chemistry.pdf", image: "/assets/courses/chemistry10.png" },
        { id: 6, name: "Grade 10 History", pdf: "/pdfs/grade10/history.pdf", image: "/assets/courses/history10.png" },
        { id: 7, name: "Grade 10 Geography", pdf: "/pdfs/grade10/geography.pdf", image: "/assets/courses/geography10.png" },
        { id: 8, name: "Grade 10 Civics", pdf: "/pdfs/grade10/civics.pdf", image: "/assets/courses/civics10.png" },
        { id: 9, name: "Grade 10 Amharic", pdf: "/pdfs/grade10/amharic.pdf", image: "/assets/courses/amharic10.png" },
        { id: 10, name: "Grade 10 Afaan Oromo", pdf: "/pdfs/grade10/afaanoromo.pdf", image: "/assets/courses/afaanoromo10.png" },
      ],
    },
    // ====== Grade 11 ======
    {
      id: 11,
      title: "Grade 11 all subjects based on Ethiopia New Curriculum",
      image: "/assets/grade11.png",
      description: "Advanced Subjects divided into Natural and Social Science streams.",
      fields: [
        {
          name: "Natural Science Stream",
          image: "/assets/natural.png",
          recommendation: "Recommended for students interested in science careers.",
          courses: [
            { id: 1, name: "Grade 11 English", pdf: "/pdfs/grade11/natural/english11.pdf", image: "/assets/courses/english11.png" },
            { id: 2, name: "Grade 11 Mathmathics", pdf: "/pdfs/grade11/natural/mathmathics11.pdf", image: "/assets/courses/math11.png" },
            { id: 3, name: "Grade 11 Physics", pdf: "/pdfs/grade11/natural/physics11.pdf", image: "/assets/courses/physics11.png" },
            { id: 4, name: "Grade 11 Chemistry", pdf: "/pdfs/grade11/natural/chemistry11.pdf", image: "/assets/courses/chemistry11.png" },
            { id: 5, name: "Grade 11 Biology", pdf: "/pdfs/grade11/natural/biology11.pdf", image: "/assets/courses/biology11.png" },
            { id: 6, name: "Grade 11 Civics", pdf: "/pdfs/grade11/natural/civics11.pdf", image: "/assets/courses/civics11.png" },
            { id: 7, name: "Grade 11 Agriculture", pdf: "/pdfs/grade11/natural/agriculture11.pdf", image: "/assets/courses/agriculture11.png" },
           
          ],
        },
        {
          name: "Social Science Stream",
          image: "/assets/social.png",
          recommendation: "Recommended for students interested in social studies.",
          courses: [
            { id: 1, name: "Grade 11 English", pdf: "/pdfs/grade11/social/english11.pdf", image: "/assets/courses/english11.png" },
            { id: 2, name: "Grade 11 Mathmathics", pdf: "/pdfs/grade11/social/mathmathics11.pdf", image: "/assets/courses/math11.png" },
            { id: 3, name: "Grade 11 History", pdf: "/pdfs/grade11/social/history.pdf", image: "/assets/courses/history11.png" },
            { id: 4, name: "Grade 11 Geography", pdf: "/pdfs/grade11/social/geography11.pdf", image: "/assets/courses/geography11.png" },
            { id: 5, name: "Grade 11 Economics", pdf: "/pdfs/grade11/social/economics11.pdf", image: "/assets/courses/economics11.png" },
            { id: 6, name: "Grade 11 Civics", pdf: "/pdfs/grade11/social/civics11.pdf", image: "/assets/courses/civics11.png" },
          ],
        },
      ],
    },
    // ====== Grade 12 ======
    {
      id: 12,
      title: "Grade 12 all subjects based on Ethiopia New Curriculum",
      image: "/assets/grade12.png",
      description: "Subjects divided into Natural and Social Science streams.",
      fields: [
        {
          name: "Natural Science Stream",
          image: "/assets/natural.png",
          recommendation: "Ideal for students planning careers in science and technology.",
          courses: [
            { id: 1, name: "Grade 12 English", pdf: "/pdfs/grade12/natural/english12.pdf", image: "/assets/courses/english12.png" },
            { id: 2, name: "Grade 12 Mathmathics", pdf: "/pdfs/grade12/natural/mathmathics.pdf", image: "/assets/courses/math12.png" },
            { id: 3, name: "Grade 12 Physics", pdf: "/pdfs/grade12/natural/physics12.pdf", image: "/assets/courses/physics12.png" },
            { id: 4, name: "Grade 12 Chemistry", pdf: "/pdfs/grade12/natural/chemistry12.pdf", image: "/assets/courses/chemistry12.png" },
            { id: 5, name: "Grade 12 Biology", pdf: "/pdfs/grade12/natural/biology12.pdf", image: "/assets/courses/biology12.png" },
            { id: 6, name: "Grade 12 Civics", pdf: "/pdfs/grade12/natural/civics12.pdf", image: "/assets/courses/civics12.png" },
            { id: 7, name: "Grade 12 Agriculture", pdf: "/pdfs/grade12/natural/Agriculture12.pdf", image: "/assets/courses/Agriculture12.png" },

          ],
        },
        {
          name: "Social Science Stream",
          image: "/assets/social.png",
          recommendation: "Perfect for students interested in business, law, and social sciences.",
          courses: [
            { id: 1, name: "Grade 12 English", pdf: "/pdfs/grade12/social/english12.pdf", image: "/assets/courses/english12.png" },
            { id: 2, name: "Grade 12 Mathmathics", pdf: "/pdfs/grade12/social/mathmathics12.pdf", image: "/assets/courses/math12.png" },
            { id: 3, name: "Grade 12 History", pdf: "/pdfs/grade12/social/history12.pdf", image: "/assets/courses/history12.png" },
            { id: 4, name: "Grade 12 Geography", pdf: "/pdfs/grade12/social/geography12.pdf", image: "/assets/courses/geography12.png" },
            { id: 5, name: "Grade 12 Economics", pdf: "/pdfs/grade12/social/economics12.pdf", image: "/assets/courses/economics12.png" },
            { id: 6, name: "Grade 12 Civics", pdf: "/pdfs/grade12/social/civics12.pdf", image: "/assets/courses/civics12.png" },
          ],
        },
      ],
    },
    // ====== Entrance Courses ======
    {
      id: 13,
      title: "Entrance all subjects based on Ethiopia New Curriculum",
      image: "/assets/entrance.png",
      description: "Subjects to prepare students for university entrance exams.",
      fields: [
        {
          name: "Natural Science Stream",
          image: "/assets/natural.png",
          recommendation: "For students aiming at medicine, engineering, and science faculties.",
          courses: [
            { id: 1, name: "English", pdf: "/pdfs/entrance/natural/english.pdf", image: "/assets/courses/english.png" },
            { id: 2, name: "Mathmathics", pdf: "/pdfs/entrance/natural/math.pdf", image: "/assets/courses/math.png" },
            { id: 3, name: "Physics", pdf: "/pdfs/entrance/natural/physics.pdf", image: "/assets/courses/physics.png" },
            { id: 4, name: "Chemistry", pdf: "/pdfs/entrance/natural/chemistry.pdf", image: "/assets/courses/chemistry.png" },
            { id: 5, name: "Biology", pdf: "/pdfs/entrance/natural/biology.pdf", image: "/assets/courses/biology.png" },
            { id: 6, name: "Civics", pdf: "/pdfs/entrance/natural/civics.pdf", image: "/assets/courses/civics.png" },
            { id: 7, name: "Aptitude", pdf: "/pdfs/entrance/natural/aptitude.pdf", image: "/assets/courses/aptitude.png" },
          ],
        },
        {
          name: "Social Science Stream",
          image: "/assets/social.png",
          recommendation: "For students aiming at law, social sciences, and economics faculties.",
          courses: [
            { id: 1, name: "English", pdf: "/pdfs/entrance/social/english.pdf", image: "/assets/courses/english.png" },
            { id: 2, name: "Mathmathics", pdf: "/pdfs/entrance/social/math.pdf", image: "/assets/courses/math.png" },
            { id: 3, name: "History", pdf: "/pdfs/entrance/social/history.pdf", image: "/assets/courses/history.png" },
            { id: 4, name: "Geography", pdf: "/pdfs/entrance/social/geography.pdf", image: "/assets/courses/geography.png" },
            { id: 5, name: "Economics", pdf: "/pdfs/entrance/social/economics.pdf", image: "/assets/courses/economics.png" },
            { id: 6, name: "Civics", pdf: "/pdfs/entrance/social/civics.pdf", image: "/assets/courses/civics.png" },
            { id: 7, name: "Aptitude", pdf: "/pdfs/entrance/social/aptitude.pdf", image: "/assets/courses/aptitude.png" },
          ],
        },
      ],
    },
    // ====== NEW: Remedial Courses ======
    {
      id: 14,
      title: "Remedial all subjects based on Ethiopia New Curriculum",
      image: "/assets/remedial.jpg", // You can change this to your actual image path
      description: "Remedial materials to strengthen foundational knowledge for university preparation.",
      fields: [
        {
          name: "Natural Science Stream",
          image: "/assets/natural.png",
          recommendation: "Designed for students retaking or strengthening science subjects for better performance.",
          courses: [
            { id: 1, name: "English", pdf: "/pdfs/remedial/natural/english.pdf", image: "/assets/courses/english.png" },
            { id: 2, name: "Mathmathics", pdf: "/pdfs/remedial/natural/math.pdf", image: "/assets/courses/math.png" },
            { id: 3, name: "Physics", pdf: "/pdfs/remedial/natural/physics.pdf", image: "/assets/courses/physics.png" },
            { id: 4, name: "Chemistry", pdf: "/pdfs/remedial/natural/chemistry.pdf", image: "/assets/courses/chemistry.png" },
            { id: 5, name: "Biology", pdf: "/pdfs/remedial/natural/biology.pdf", image: "/assets/courses/biology.png" },
            { id: 6, name: "Civics", pdf: "/pdfs/remedial/natural/civics.pdf", image: "/assets/courses/civics.png" },
            { id: 7, name: "Aptitude", pdf: "/pdfs/remedial/natural/aptitude.pdf", image: "/assets/courses/aptitude.png" },
          ],
        },
        {
          name: "Social Science Stream",
          image: "/assets/social.png",
          recommendation: "For students improving their foundation in social sciences and general aptitude.",
          courses: [
            { id: 1, name: "English", pdf: "/pdfs/remedial/social/english.pdf", image: "/assets/courses/english.png" },
            { id: 2, name: "Mathmathics", pdf: "/pdfs/remedial/social/math.pdf", image: "/assets/courses/math.png" },
            { id: 3, name: "History", pdf: "/pdfs/remedial/social/history.pdf", image: "/assets/courses/history.png" },
            { id: 4, name: "Geography", pdf: "/pdfs/remedial/social/geography.pdf", image: "/assets/courses/geography.png" },
            { id: 5, name: "Economics", pdf: "/pdfs/remedial/social/economics.pdf", image: "/assets/courses/economics.png" },
            { id: 6, name: "Civics", pdf: "/pdfs/remedial/social/civics.pdf", image: "/assets/courses/civics.png" },
            { id: 7, name: "Aptitude", pdf: "/pdfs/remedial/social/aptitude.pdf", image: "/assets/courses/aptitude.png" },
          ],
        },
      ],
    },
  ];

  // ===== UI Rendering Logic ======

  // Render field courses
  if (selectedField) {
    return (
      <div className="bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 min-h-screen p-6 animate-fade-in">
        <button
          onClick={() => setSelectedField(null)}
          className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-blue-700 mb-6 transition-all"
        >
          <ArrowLeft size={18} className="inline-block mr-2" />
          Back
        </button>
        <h2 className="text-3xl font-extrabold text-purple-800 mb-6 animate-pulse">
          {selectedGrade?.title} — {selectedField.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {selectedField.courses.map((course) => (
            <div
              key={course.id}
              className="border border-purple-300 rounded-2xl p-4 bg-gradient-to-br from-purple-100 to-purple-50 hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center"
            >
              <img src={course.image} alt={course.name} className="w-24 h-24 object-cover mb-3 rounded-xl shadow-md" />
              <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2 text-lg bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
                <FileText size={18} /> {course.name}
              </h3>
              <div className="flex gap-2">
                <a
                  href={course.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-sm transition-all"
                >
                  Read
                </a>
                <a
                  href={course.pdf}
                  download
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm flex items-center gap-1 transition-all"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render grade courses or fields
  if (selectedGrade) {
    return (
      <div className="bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 min-h-screen p-6 animate-fade-in">
        <button
          onClick={() => setSelectedGrade(null)}
          className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-blue-700 mb-6 transition-all"
        >
          <ArrowLeft size={18} className="inline-block mr-2" />
          Back
        </button>
        <h2 className="text-3xl font-extrabold text-purple-800 mb-6 animate-pulse">{selectedGrade.title}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {selectedGrade.fields ? (
            selectedGrade.fields.map((f) => (
              <div
                key={f.name}
                onClick={() => setSelectedField(f)}
                className="cursor-pointer border border-purple-300 rounded-2xl p-5 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl hover:scale-105 transition-all flex gap-4"
              >
                {f.image && (
                  <img src={f.image} alt={f.name} className="w-28 h-28 object-cover rounded-xl shadow-lg" />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-2 underline decoration-pink-500">{f.name}</h3>
                  <p className="text-gray-600 italic">{f.recommendation}</p>
                  <p className="text-gray-500 mt-2 font-semibold">
                    Includes {f.courses.length} subjects.
                  </p>
                </div>
              </div>
            ))
          ) : (
            selectedGrade.courses?.map((course) => (
              <div
                key={course.id}
                className="border border-purple-300 rounded-2xl p-4 bg-gradient-to-br from-purple-100 to-purple-50 hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center"
              >
                <img src={course.image} alt={course.name} className="w-24 h-24 object-cover mb-3 rounded-xl shadow-md" />
                <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2 text-lg bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
                  <FileText size={18} /> {course.name}
                </h3>
                <div className="flex gap-2">
                  <a
                    href={course.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-sm transition-all"
                  >
                    Read
                  </a>
                  <a
                    href={course.pdf}
                    download
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm flex items-center gap-1 transition-all"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Main grade selection view
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={28} className="text-purple-700 animate-bounce" />
        <h2 className="text-3xl font-extrabold text-purple-800 animate-pulse">
          All Subjectes by Grade
        </h2>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {gradeCategories.map((grade) => (
          <div
            key={grade.id}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-purple-200 overflow-hidden"
          >
            <img src={grade.image} alt={grade.title} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-2xl font-bold text-purple-800 mb-2 bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
                {grade.title}
              </h3>
              <p className="text-gray-600 mb-4">{grade.description}</p>
              <button
                onClick={() => setSelectedGrade(grade)}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 font-semibold transition-all animate-bounce"
              >
                View Courses
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;