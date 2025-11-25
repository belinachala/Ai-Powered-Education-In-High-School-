import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const bgImages = [
  "/assets/gallery-teachers.png",
  "/assets/gallery-students.png",
  "/assets/gallery-hero.png",
  "/assets/features-hero.png",
  "/assets/brihanunega.png",
  "/assets/rvu-logoo.png",
];

interface TeacherProfile {
  teacher_id: string; // Added teacher ID
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  subjects_taught: string[];
  grade_levels: string[];
  zone: string;
  woreda: string;
  subcity: string;
  region: string;
  years_of_experience: string;
  profile_picture: File | null;
  profile_picture_preview: string;
}

const regions = [
  "Addis Ababa",
  "Oromia",
  "Amhara",
  "Tigray",
  "Southern Nations, Nationalities, and Peoples' Region",
  "Afar",
  "Somali",
  "Benishangul-Gumuz",
  "Gambela",
  "Harari",
];

const gradeOptions = [
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

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
  { value: "Civic", label: "Civic" },
  { value: "afaan-oromoo", label: "Afaan Oromoo" },
];

const HighSchoolTeachersProfileCompletion: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<TeacherProfile>({
    teacher_id: "", // Added teacher ID
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    subjects_taught: [],
    grade_levels: [],
    zone: "",
    woreda: "",
    subcity: "",
    region: "",
    years_of_experience: "",
    profile_picture: null,
    profile_picture_preview: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filled = 0;
    Object.entries(profile).forEach(([key, value]) => {
      if (Array.isArray(value) ? value.length > 0 : value) filled += 1;
    });
    setProfileProgress(Math.round((filled / 13) * 100)); // 13 fields now including teacher_id
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setProfile({ ...profile, profile_picture: file, profile_picture_preview: preview });
    }
  };

  const validateForm = () => {
    for (let key in profile) {
      if (
        (Array.isArray(profile[key as keyof TeacherProfile])
          ? (profile[key as keyof TeacherProfile] as any[]).length === 0
          : !profile[key as keyof TeacherProfile]) &&
        key !== "profile_picture" &&
        key !== "profile_picture_preview"
      ) {
        return `${key.replace("_", " ")} is required`;
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Profile completed successfully!");
      setTimeout(() => navigate("/h-s-teacher/dashboard"), 1000);
    }, 1500);
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
          <span className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-white opacity-20 animate-pulse"></span>
        </motion.button>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full"
        >
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            🏫 High School Teacher Profile
          </h2>

          <div className="mb-4">
            <div className="h-4 w-full bg-gray-200 rounded-full">
              <motion.div
                className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-700 mt-1">
              {profileProgress}% completed
            </p>
          </div>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="text-center mb-4">
              {profile.profile_picture_preview ? (
                <img
                  src={profile.profile_picture_preview}
                  alt="profile preview"
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-purple-500"
                />
              ) : (
                <div className="w-28 h-28 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-purple-500">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control mt-2"
              />
            </div>

            {/* Teacher ID, First Name & Last Name */}
            <div className="row">
             
              <div className="col-md-4 mb-3">
                <label className="form-label font-semibold">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label font-semibold">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="form-control border-2 border-pink-400"
                />
              </div>
               <div className="col-md-4 mb-3">
                <label className="form-label font-semibold">Teacher ID</label>
                <input
                  type="text"
                  name="teacher_id"
                  value={profile.teacher_id}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>
            </div>

            {/* Remaining fields (Gender, DOB, School, Subjects, Grades, Zone, Woreda, Subcity, Region, Experience) remain the same */}

            {/* Gender & DOB */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="form-select border-2 border-purple-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>
            </div>

           {/* School Name & Region */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">School Name</label>
                <input
                  type="text"
                  name="school_name"
                  value={profile.school_name}
                  onChange={handleChange}
                  className="form-control border-2 border-purple-400"
                />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Region</label>
                <select
                  name="region"
                  value={profile.region}
                  onChange={handleChange}
                  className="form-select border-2 border-pink-400"
                >
                  <option value="">Select Region</option>
                  {regions.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Multi-select Grade & Subject */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Subject(s) Taught</label>
                <Select
                  isMulti
                  options={subjectOptions}
                  value={subjectOptions.filter(sub => profile.subjects_taught.includes(sub.value))}
                  onChange={(selected) => setProfile({
                    ...profile,
                    subjects_taught: (selected as any).map((s: any) => s.value)
                  })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Grade Level(s)</label>
                <Select
                  isMulti
                  options={gradeOptions}
                  value={gradeOptions.filter(g => profile.grade_levels.includes(g.value))}
                  onChange={(selected) => setProfile({
                    ...profile,
                    grade_levels: (selected as any).map((g: any) => g.value)
                  })}
                />
              </div>
            </div>

            {/* Zone, Woreda, Subcity, Region, Experience */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Zone where the school is found</label>
                <input
                  type="text"
                  name="zone"
                  value={profile.zone}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Woreda</label>
                <input
                  type="text"
                  name="woreda"
                  value={profile.woreda}
                  onChange={handleChange}
                  className="form-control border-2 border-purple-400"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Subcity</label>
                <input
                  type="text"
                  name="subcity"
                  value={profile.subcity}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>

             <div className="col-md-6 mb-3">
                <label className="form-label font-semibold">Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  name="years_of_experience"
                  value={profile.years_of_experience}
                  onChange={handleChange}
                  className="form-control border-2 border-purple-400"
                />
              </div>
          </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full mt-3 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default HighSchoolTeachersProfileCompletion;
