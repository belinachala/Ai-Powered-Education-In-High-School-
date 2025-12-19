import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Ethiopian regions
const regions = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "Southern Nations, Nationalities, and Peoples' Region (SNNPR)",
  "Tigray",
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

// Helper to get CSRF token
function getCookie(name: string) {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        cookieValue = decodeURIComponent(value);
        break;
      }
    }
  }
  return cookieValue;
}

interface StudentProfile {
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  grade_level: string;
  student_id: string;
  profile_picture: File | null;
  profile_picture_preview: string;
}

const HighSchoolStudentsProfileCompletion: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentProfile>({
    gender: "",
    date_of_birth: "",
    school_name: "",
    region: "",
    zone: "",
    subcity: "",
    woreda: "",
    grade_level: "",
    student_id: "",
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

  // Profile completion progress
  useEffect(() => {
    const fields = [
      "gender",
      "date_of_birth",
      "school_name",
      "region",
      "zone",
      "subcity",
      "woreda",
      "grade_level",
      "student_id",
    ];
    let filled = fields.filter((f) => profile[f as keyof StudentProfile]).length;
    setProfileProgress(Math.round((filled / fields.length) * 100));
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const requiredFields = [
      "gender",
      "date_of_birth",
      "school_name",
      "region",
      "zone",
      "subcity",
      "woreda",
      "grade_level",
      "student_id",
    ];
    for (let field of requiredFields) {
      if (!profile[field as keyof StudentProfile]) {
        return `${field.replace("_", " ")} is required`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });

      const csrfToken = getCookie("csrftoken");

     await axios.post(
        "http://localhost:8001/api/users/profile-completion/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken
          },
          withCredentials: true // required for session auth
        }
      );


      setSuccessMsg("Profile completed successfully!");
      setTimeout(() => navigate("/h-s-student/dashboard"), 1000);
    } catch (err: any) {
      if (err.response?.data?.error) setErrorMsg(JSON.stringify(err.response.data.error));
      else if (err.response?.data?.detail) setErrorMsg(err.response.data.detail);
      else setErrorMsg("Failed to complete profile. Please try again.");
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
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 0.6, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.05 }}
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

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

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
                className="form-control mt-2"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="form-label font-semibold">Student ID</label>
              <input
                type="text"
                name="student_id"
                value={profile.student_id}
                onChange={handleChange}
                className="form-control border-2 border-purple-400"
              />
            </div>

            {/* Gender & DOB */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="form-select border-2 border-blue-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  onChange={handleChange}
                  className="form-control border-2 border-purple-300"
                />
              </div>
            </div>

            {/* School & Region */}
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
                    <option key={idx} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zone & Subcity & Woreda */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="form-label font-semibold">Zone</label>
                <input
                  type="text"
                  name="zone"
                  value={profile.zone}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Subcity</label>
                <input
                  type="text"
                  name="subcity"
                  value={profile.subcity}
                  onChange={handleChange}
                  className="form-control border-2 border-purple-400"
                />
              </div>
              <div className="flex-1">
                <label className="form-label font-semibold">Woreda</label>
                <input
                  type="text"
                  name="woreda"
                  value={profile.woreda}
                  onChange={handleChange}
                  className="form-control border-2 border-blue-400"
                />
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="form-label font-semibold">Grade Level</label>
              <select
                name="grade_level"
                value={profile.grade_level}
                onChange={handleChange}
                className="form-select border-2 border-blue-400"
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
              className="btn w-full mt-4 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform"
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
