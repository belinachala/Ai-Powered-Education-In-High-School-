import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Ethiopian regions
const regions = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
  "Gambela", "Harari", "Oromia", "Sidama", "Somali",
  "Southern Nations, Nationalities, and Peoples' Region (SNNPR)", "Tigray",
];

// Background images
const bgImages = [
  "/assets/gallery-teachers.png",
  "/assets/gallery-students.png",
  "/assets/gallery-hero.png",
  "/assets/features-hero.png",
  "/assets/brihanunega.png",
  "/assets/rvu-logoo.png",
];

interface StudentProfile {
  student_id: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  grade_level: string;
  profile_picture: File | null;
  profile_picture_preview: string;
}

const HighSchoolStudentsProfileCompletion: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentProfile>({
    student_id: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    region: "",
    zone: "",
    subcity: "",
    woreda: "",
    grade_level: "",
    profile_picture: null,
    profile_picture_preview: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Load token and verify user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login"); // Redirect if no token
      return;
    }
    setToken(storedToken);

    // Optional: fetch existing profile
    axios.get("http://127.0.0.1:8000/students/me/profile", {
      headers: { Authorization: `Bearer ${storedToken}` }
    }).then(res => {
      if (res.data?.student_id) {
        setProfile({
          student_id: res.data.student_id || "",
          gender: res.data.gender || "",
          date_of_birth: res.data.date_of_birth || "",
          school_name: res.data.school_name || "",
          region: res.data.region || "",
          zone: res.data.zone || "",
          subcity: res.data.subcity || "",
          woreda: res.data.woreda || "",
          grade_level: res.data.grade_level || "",
          profile_picture: null,
          profile_picture_preview: res.data.profile_picture_url || "",
        });
        navigate("/student"); // already completed → redirect
      }
    }).catch(err => {
      if (err.response?.status !== 401) console.log(err);
    });
  }, [navigate]);

  // Background carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Profile completion progress
  useEffect(() => {
    const fields: (keyof StudentProfile)[] = [
      "student_id","gender","date_of_birth","school_name","region",
      "zone","subcity","woreda","grade_level"
    ];
    const filled = fields.filter(f => profile[f]).length;
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

    // Required fields validation
    const requiredFields: (keyof StudentProfile)[] = [
      "student_id","gender","date_of_birth","school_name","region",
      "zone","subcity","woreda","grade_level"
    ];
    for (const field of requiredFields) {
      if (!profile[field]) {
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
          formData.append(key, profile[key as keyof StudentProfile].toString());
        }
      });

      await axios.post(
        "http://127.0.0.1:8000/students/me/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMsg("Profile completed successfully!");
      localStorage.setItem("highSchoolStudentProfile", JSON.stringify(profile));
      setTimeout(() => navigate("/h-s-student/dashboard"), 1500);

    } catch (err: any) {
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
          transition-all duration-1000"
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
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            🏫 High School Student Profile
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

          {errorMsg && <p className="text-red-600 text-center font-semibold mb-4">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 text-center font-semibold mb-4">{successMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="text-center mb-4">
              {profile.profile_picture_preview ? (
                <img
                  src={profile.profile_picture_preview}
                  alt="profile preview"
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-28 h-28 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
              <input
                type="text"
                name="student_id"
                value={profile.student_id}
                onChange={handleChange}
                className="w-full p-3 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* School Name & Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">School Name</label>
                <input
                  type="text"
                  name="school_name"
                  value={profile.school_name}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Region</label>
                <select
                  name="region"
                  value={profile.region}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-pink-400 rounded-lg focus:outline-none focus:border-pink-600"
                >
                  <option value="">Select Region</option>
                  {regions.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zone, Subcity, Woreda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Zone</label>
                <input
                  type="text"
                  name="zone"
                  value={profile.zone}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subcity</label>
                <input
                  type="text"
                  name="subcity"
                  value={profile.subcity}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Woreda</label>
                <input
                  type="text"
                  name="woreda"
                  value={profile.woreda}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Grade Level</label>
              <select
                name="grade_level"
                value={profile.grade_level}
                onChange={handleChange}
                className="w-full p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 text-white font-bold rounded-lg transition-all transform hover:scale-105 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              }`}
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default HighSchoolStudentsProfileCompletion;
