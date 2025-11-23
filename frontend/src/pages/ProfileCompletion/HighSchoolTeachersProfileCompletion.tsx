import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  subjects_taught: string;
  grade_levels: string;
  employee_id: string;
  years_of_experience: string;
  profile_picture: File | null;
  profile_picture_preview: string;
}

const HighSchoolTeachersProfileCompletion: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<TeacherProfile>({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    subjects_taught: "",
    grade_levels: "",
    employee_id: "",
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

  const [verificationSent, setVerificationSent] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [verified, setVerified] = useState(false);

  // Background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Redirect after verification
  useEffect(() => {
    if (verified) {
      setTimeout(() => navigate("/h-s-teacher/dashboard"), 800);
    }
  }, [verified, navigate]);

  // Profile progress tracking
  useEffect(() => {
    let filled = 0;
    Object.entries(profile).forEach(([key, value]) => {
      if (value && key !== "profile_picture" && key !== "profile_picture_preview") filled += 1;
    });
    setProfileProgress(Math.round((filled / 9) * 100));
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
        !profile[key as keyof TeacherProfile] &&
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
      setVerificationSent(true);
      setSuccessMsg("Verification email sent! Enter the code to continue.");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Animation */}
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

      {/* Center Button */}
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

      {/* Form Section */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full"
        >
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            👩🏫 High School Teacher Profile
          </h2>

          {/* Progress Bar */}
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

          {/* Verification Step */}
          {verificationSent && !verified ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 border-2 border-purple-400 rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-bold mb-2 text-center text-blue-700">
                Email Verification
              </h3>
              <p className="text-center mb-4 text-gray-700">
                Enter the 6-digit code sent to your email.
              </p>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter code"
                className="form-control mb-3 border-2 border-purple-400 rounded"
              />
              <button
                type="button"
                className="btn w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                onClick={() => {
                  if (inputCode === "123456") {
                    setVerified(true);
                    setSuccessMsg("Email verified! Redirecting to your dashboard...");
                    setErrorMsg("");
                  } else {
                    setErrorMsg("Invalid code, try again.");
                  }
                }}
              >
                Verify Email
              </button>
            </motion.div>
          ) : !verificationSent ? (
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

              {/* Name Fields */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label font-semibold">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    className="form-control border-2 border-blue-400"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label font-semibold">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    className="form-control border-2 border-pink-400"
                  />
                </div>
              </div>

              {/* Gender and DOB */}
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

              {/* School Name */}
              <div className="mb-3">
                <label className="form-label font-semibold">School Name</label>
                <input
                  type="text"
                  name="school_name"
                  value={profile.school_name}
                  onChange={handleChange}
                  className="form-control border-2 border-purple-400"
                />
              </div>

              {/* Subject(s) and Grade Level(s) */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label font-semibold">Subject(s) Taught</label>
                  <input
                    type="text"
                    name="subjects_taught"
                    value={profile.subjects_taught}
                    onChange={handleChange}
                    className="form-control border-2 border-blue-400"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label font-semibold">Grade Level(s)</label>
                  <input
                    type="text"
                    name="grade_levels"
                    value={profile.grade_levels}
                    onChange={handleChange}
                    placeholder="e.g., 9–12 or Entrance"
                    className="form-control border-2 border-pink-400"
                  />
                </div>
              </div>

              {/* Employee ID and Experience */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label font-semibold">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={profile.employee_id}
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
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default HighSchoolTeachersProfileCompletion;
