import React, { useEffect, useState } from "react";
import axios from "axios";

interface TeacherProfileType {
  teacher_id: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  years_of_experience: string;
  subjects_taught: string[];
  grade_levels: string[];
  profile_picture_url: string;
}

const regions = [
  "Addis Ababa","Afar","Amhara","Benishangul-Gumuz","Dire Dawa",
  "Gambela","Harari","Oromia","Sidama","Somali",
  "SNNPR","Tigray"
];

const subjects = [
  "Math", "Physics", "Chemistry", "Biology",
  "English", "Amharic", "Geography", "History",
  "Civics", "Economics", "Agriculture", "ICT", "Afaan Oromoo"
];

const grades = ["9", "10", "11", "12"];

const TeacherProfile: React.FC = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<TeacherProfileType>({
    teacher_id: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    region: "",
    zone: "",
    subcity: "",
    woreda: "",
    years_of_experience: "",
    subjects_taught: [],
    grade_levels: [],
    profile_picture_url: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/teachers/me/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setProfile({
          teacher_id: data.teacher_id || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          school_name: data.school_name || "",
          region: data.region || "",
          zone: data.zone || "",
          subcity: data.subcity || "",
          woreda: data.woreda || "",
          years_of_experience: data.years_of_experience || "",
          subjects_taught: data.subjects_taught || [],
          grade_levels: data.grade_levels || [],
          profile_picture_url: data.profile_picture_url ? `http://127.0.0.1:8000/${data.profile_picture_url}` : "",
        });
      })
      .catch(() => setMessage("Failed to load profile"));
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: "subjects_taught" | "grade_levels"
  ) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setProfile((prev) => ({ ...prev, [field]: options }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (key === "profile_picture_url") return;
        if (Array.isArray(value)) {
          formData.append(key, value.join(","));
        } else {
          formData.append(key, value);
        }
      });

      if (newImage) {
        formData.append("profile_picture", newImage);
      }

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

      setMessage("✅ Profile updated successfully");

      if (newImage) {
        setProfile((prev) => ({
          ...prev,
          profile_picture_url: URL.createObjectURL(newImage),
        }));
      }
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Teacher Profile
      </h2>

      {/* Profile Picture */}
      <div className="text-center mb-6">
        <img
          src={
            newImage
              ? URL.createObjectURL(newImage)
              : profile.profile_picture_url || "/assets/default-avatar.png"
          }
          alt="Profile Icon"
          className="w-28 h-28 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mx-auto"
        />
      </div>

      {message && (
        <p className="mb-4 font-semibold text-center text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Teacher ID */}
        <div>
          <label className="block text-sm font-bold text-purple-600 mb-1">ID</label>
          <input
            name="teacher_id"
            value={profile.teacher_id}
            onChange={handleChange}
            placeholder="Teacher ID"
            className="w-full p-3 border rounded border-purple-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-pink-600 mb-1">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded border-pink-400 focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-green-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded border-green-400 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* School Name */}
        <div>
          <label className="block text-sm font-bold text-blue-600 mb-1">School Name</label>
          <input
            name="school_name"
            value={profile.school_name}
            onChange={handleChange}
            placeholder="School Name"
            className="w-full p-3 border rounded border-blue-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-bold text-red-600 mb-1">Region</label>
          <select
            name="region"
            value={profile.region}
            onChange={handleChange}
            className="w-full p-3 border rounded border-red-400 focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-purple-500 mb-1">Zone</label>
            <input name="zone" value={profile.zone} onChange={handleChange} placeholder="Zone" className="w-full p-3 border rounded border-purple-300 focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-pink-500 mb-1">Subcity</label>
            <input name="subcity" value={profile.subcity} onChange={handleChange} placeholder="Subcity" className="w-full p-3 border rounded border-pink-300 focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-green-500 mb-1">Woreda</label>
            <input name="woreda" value={profile.woreda} onChange={handleChange} placeholder="Woreda" className="w-full p-3 border rounded border-green-300 focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-bold text-yellow-600 mb-1">Years of Experience</label>
          <input
            type="number"
            name="years_of_experience"
            value={profile.years_of_experience}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="w-full p-3 border rounded border-yellow-400 focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Subjects Taught */}
        <div>
          <label className="block text-sm font-bold text-indigo-600 mb-1">Subjects Taught</label>
          <select
            multiple
            value={profile.subjects_taught}
            onChange={(e) => handleMultiSelectChange(e, "subjects_taught")}
            className="w-full p-3 border rounded border-indigo-400 focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Grade Levels */}
        <div>
          <label className="block text-sm font-bold text-pink-600 mb-1">Grade Levels</label>
          <select
            multiple
            value={profile.grade_levels}
            onChange={(e) => handleMultiSelectChange(e, "grade_levels")}
            className="w-full p-3 border rounded border-pink-400 focus:ring-2 focus:ring-pink-500"
          >
            {grades.map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>

        {/* Profile Picture Upload */}
        <div className="text-center">
          <label className="block text-sm font-bold text-blue-600 mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:scale-105 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default TeacherProfile;
