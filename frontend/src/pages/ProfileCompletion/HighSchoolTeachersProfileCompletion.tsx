import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
    grade_level: [],
    profile_picture: null,
    profile_picture_preview: "",
  });

  const [profileProgress, setProfileProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Load token and fetch existing profile
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }
    setToken(storedToken);

    axios.get("http://127.0.0.1:8000/teachers/me/profile", {
      headers: { Authorization: `Bearer ${storedToken}` }
    }).then(res => {
      if (res.data) {
        setProfile({
          teacher_id: res.data.teacher_id || "",
          gender: res.data.gender || "",
          date_of_birth: res.data.date_of_birth || "",
          school_name: res.data.school_name || "",
          region: res.data.region || "",
          subcity: res.data.subcity || "",
          woreda: res.data.woreda || "",
          zone: res.data.zone || "",
          years_of_experience: res.data.years_of_experience || "",
          subjects_taught: res.data.subjects_taught || [],
          grade_level: res.data.grade_level || [],
          profile_picture: null,
          profile_picture_preview: res.data.profile_picture_url || "",
        });

        // ✅ Redirect if profile already completed
        if (res.data.profile_completed) {
          localStorage.setItem("highSchoolTeacherProfileCompleted", "true");
          navigate("/h-s-teacher/dashboard");
        }
      }
    }).catch(err => {
      if (err.response?.status !== 401) console.log(err);
    });
  }, [navigate]);

  // Background carousel
  useEffect(() => {
    const interval = setInterval(() => setCurrentBg(prev => (prev + 1) % bgImages.length), 7000);
    return () => clearInterval(interval);
  }, []);

  // Profile completion progress
  useEffect(() => {
    const fields = [
      "teacher_id", "gender", "date_of_birth", "school_name",
      "region", "subcity", "woreda", "zone", "years_of_experience",
      "subjects_taught", "grade_level"
    ];
    const filled = fields.filter(f => Array.isArray(profile[f]) ? profile[f].length > 0 : profile[f]).length;
    setProfileProgress(Math.round((filled / fields.length) * 100));
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, profile_picture: file, profile_picture_preview: preview }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg("Please log in first to complete your profile.");
      navigate("/login");
      return;
    }

    const requiredFields = [
      "teacher_id", "gender", "date_of_birth", "school_name",
      "region", "subcity", "woreda", "zone", "years_of_experience",
      "subjects_taught", "grade_level"
    ];

    for (const field of requiredFields) {
      if (!profile[field] || (Array.isArray(profile[field]) && profile[field].length === 0)) {
        setErrorMsg(`${field.replace("_"," ")} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (key === "profile_picture" && profile.profile_picture) {
          formData.append("profile_picture", profile.profile_picture);
        } else if (key !== "profile_picture" && key !== "profile_picture_preview") {
          if (Array.isArray(profile[key])) {
            formData.append(key, profile[key].join(","));
          } else {
            formData.append(key, profile[key]);
          }
        }
      });

      await axios.post(
        "http://127.0.0.1:8000/teachers/me/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMsg("Profile completed successfully!");
      localStorage.setItem("highSchoolTeacherProfile", JSON.stringify(profile));
      localStorage.setItem("highSchoolTeacherProfileCompleted", "true");

      setTimeout(() => navigate("/h-s-teacher/dashboard"), 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
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
          className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-4xl w-full overflow-auto"
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

            <div>
              <label className="form-label font-semibold">Teacher ID</label>
              <input type="text" name="teacher_id" value={profile.teacher_id} onChange={handleChange} className="form-control border-2 border-purple-400" />
            </div>

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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">Subcity</label>
                <input type="text" name="subcity" value={profile.subcity} onChange={handleChange} className="form-control border-2 border-blue-400" />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Woreda</label>
                <input type="text" name="woreda" value={profile.woreda} onChange={handleChange} className="form-control border-2 border-purple-400" />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Zone</label>
                <input type="text" name="zone" value={profile.zone} onChange={handleChange} className="form-control border-2 border-blue-400" />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Years of Experience</label>
                <input type="number" name="years_of_experience" value={profile.years_of_experience} onChange={handleChange} className="form-control border-2 border-purple-400" />
              </div>
            </div>

            <div className="row mt-4">
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
                  value={gradeOptions.filter(g => profile.grade_level.includes(g.value))}
                  onChange={(selected) => setProfile({ ...profile, grade_level: (selected as any).map((g: any) => g.value) })}
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
