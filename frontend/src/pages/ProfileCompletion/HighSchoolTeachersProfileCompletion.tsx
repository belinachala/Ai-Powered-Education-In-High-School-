import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

// Regions list
const regions = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
  "Gambela", "Harari", "Oromia", "Sidama", "Somali",
  "Southern Nations, Nationalities, and Peoples' Region (SNNPR)", "Tigray"
];

// Background images
const bgImages = [
  "/assets/gallery-teachers.png", "/assets/gallery-students.png",
  "/assets/gallery-hero.png", "/assets/features-hero.png",
  "/assets/brihanunega.png", "/assets/rvu-logoo.png"
];

// Subjects & Grades options
const subjectOptions = [
  { value: "math", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "english", label: "English" },
  { value: "amharic", label: "Amharic" },
  { value: "geography", label: "Geography" },
  { value: "history", label: "History" },
  { value: "civics", label: "Civics" },
  { value: "economics", label: "Economics" },
  { value: "agriculture", label: "Agriculture" },
  { value: "ict", label: "ICT" },
  { value: "afaan-oromoo", label: "Afaan Oromoo" }
];

const gradeOptions = [
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

const HighSchoolTeachersProfileCompletion: React.FC = () => {
  const [profile, setProfile] = useState<any>({
    teacher_id: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    region: "",
    subcity: "",
    woreda: "",
    zone: "",
    years_of_experience: "",
    subjects_taught: [],
    grade_levels: [],
    profile_picture: null,
    profile_picture_preview: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Background carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Calculate profile completion progress
  useEffect(() => {
    const fields = [
      "teacher_id", "gender", "date_of_birth", "school_name",
      "region", "subcity", "woreda", "zone", "years_of_experience",
      "subjects_taught", "grade_levels"
    ];
    let filled = fields.filter(f => {
      if (Array.isArray(profile[f])) return profile[f].length > 0;
      return profile[f];
    }).length;
    setProfileProgress(Math.round((filled / fields.length) * 100));
  }, [profile]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setProfile({ ...profile, profile_picture: file, profile_picture_preview: preview });
    }
  };

  // Frontend-only form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const requiredFields = [
      "teacher_id", "gender", "date_of_birth", "school_name",
      "region", "subcity", "woreda", "zone", "years_of_experience",
      "subjects_taught", "grade_levels"
    ];

    for (let field of requiredFields) {
      if (!profile[field] || (Array.isArray(profile[field]) && profile[field].length === 0)) {
        setErrorMsg(`${field.replace("_", " ")} is required`);
        return;
      }
    }

    setLoading(true);
    // Simulate saving profile
    setTimeout(() => {
      setSuccessMsg("Profile completed successfully!");
      localStorage.setItem("highSchoolTeacherProfile", JSON.stringify(profile));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-100">
      <AnimatePresence>
        <motion.img
          key={currentBg}
          src={bgImages[currentBg]}
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 7 }}
        />
      </AnimatePresence>

      {!showForm && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 px-10 py-5 text-2xl font-bold text-white rounded-full border-4 border-transparent 
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          hover:from-pink-500 hover:to-blue-500
          transition-all duration-1000 animate-gradient-border"
          onClick={() => setShowForm(true)}
        >
          Complete Your Profile
        </motion.button>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">🏫 High School Teacher Profile</h2>

          <div className="mb-4">
            <div className="h-4 w-full bg-gray-200 rounded-full">
              <motion.div
                className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-700 mt-1">{profileProgress}% completed</p>
          </div>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="text-center mb-4">
              {profile.profile_picture_preview ? (
                <img src={profile.profile_picture_preview} alt="profile preview" className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-500" />
              ) : (
                <div className="w-28 h-28 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mt-2" />
            </div>

            {/* Teacher ID */}
            <div>
              <label className="form-label font-semibold">Teacher ID</label>
              <input type="text" name="teacher_id" value={profile.teacher_id} onChange={handleChange} className="form-control border-2 border-purple-400" />
            </div>

            {/* Gender & DOB */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange} className="form-select border-2 border-blue-400">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Date of Birth</label>
                <input type="date" name="date_of_birth" value={profile.date_of_birth} onChange={handleChange} className="form-control border-2 border-purple-300" />
              </div>
            </div>

            {/* School Name & Region */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">School Name</label>
                <input type="text" name="school_name" value={profile.school_name} onChange={handleChange} className="form-control border-2 border-purple-400" />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Region</label>
                <select name="region" value={profile.region} onChange={handleChange} className="form-select border-2 border-pink-400">
                  <option value="">Select Region</option>
                  {regions.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subcity & Woreda */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">Subcity</label>
                <input type="text" name="subcity" value={profile.subcity} onChange={handleChange} className="form-control border-2 border-blue-400" />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Woreda</label>
                <input type="text" name="woreda" value={profile.woreda} onChange={handleChange} className="form-control border-2 border-purple-400" />
              </div>
            </div>

            {/* Zone & Experience */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">Zone where the school is found</label>
                <input type="text" name="zone" value={profile.zone} onChange={handleChange} className="form-control border-2 border-blue-400" />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Years of Experience</label>
                <input type="number" min={0} name="years_of_experience" value={profile.years_of_experience} onChange={handleChange} className="form-control border-2 border-purple-400" />
              </div>
            </div>

            {/* Multi-select Subjects & Grades */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Subjects Taught</label>
                <Select
                  isMulti
                  options={subjectOptions}
                  value={subjectOptions.filter(sub => profile.subjects_taught.includes(sub.value))}
                  onChange={(selected) => setProfile({ ...profile, subjects_taught: (selected as any).map((s: any) => s.value) })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Grade Levels</label>
                <Select
                  isMulti
                  options={gradeOptions}
                  value={gradeOptions.filter(g => profile.grade_levels.includes(g.value))}
                  onChange={(selected) => setProfile({ ...profile, grade_levels: (selected as any).map((g: any) => g.value) })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn w-full mt-4 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform">
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default HighSchoolTeachersProfileCompletion;
