import React, { useEffect, useState } from "react";
import axios from "axios";

interface StudentProfile {
  student_id: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  grade_levels: string;
  profile_picture_url: string;
}

const regions = [
  "Addis Ababa","Afar","Amhara","Benishangul-Gumuz","Dire Dawa",
  "Gambela","Harari","Oromia","Sidama","Somali",
  "SNNPR","Tigray"
];

const Profile: React.FC = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<StudentProfile>({
    student_id: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    region: "",
    zone: "",
    subcity: "",
    woreda: "",
    grade_levels: "",
    profile_picture_url: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // Fetch student profile
  // ===============================
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/students/me/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const data = res.data;

        // Fix profile picture URL
        let profile_picture_url = data.profile_picture_url;
        if (profile_picture_url) {
          profile_picture_url = `http://127.0.0.1:8000/${profile_picture_url.replaceAll("\\","/")}`;
        }

        setProfile({ ...data, profile_picture_url });
      })
      .catch(err => {
        console.log(err.response || err);
        setMessage("Failed to load profile");
      });
  }, [token]);

  // ===============================
  // Handle input change
  // ===============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // ===============================
  // Update profile
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (key !== "profile_picture_url") {
          formData.append(key, value);
        }
      });

      if (newImage) {
        formData.append("profile_picture", newImage);
      }

      await axios.put(
        "http://127.0.0.1:8000/students/me/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Profile updated successfully");

      // Update profile picture preview if a new one was uploaded
      if (newImage) {
        setProfile(prev => ({
          ...prev,
          profile_picture_url: URL.createObjectURL(newImage)
        }));
        setNewImage(null);
      }

    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Student Profile</h2>

      {message && (
        <p className="mb-4 font-semibold text-center text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture */}
        <div className="text-center">
          <img
            src={
              newImage
                ? URL.createObjectURL(newImage)
                : profile.profile_picture_url || "/assets/default-avatar.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-500"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm"
          />
        </div>

        {/* Student ID */}
        <input
          name="student_id"
          value={profile.student_id}
          onChange={handleChange}
          placeholder="Student ID"
          className="w-full p-3 border rounded"
        />

        {/* Gender & DOB */}
        <div className="grid grid-cols-2 gap-4">
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="p-3 border rounded"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="date"
            name="date_of_birth"
            value={profile.date_of_birth || ""}
            onChange={handleChange}
            className="p-3 border rounded"
          />
        </div>

        {/* School & Region */}
        <input
          name="school_name"
          value={profile.school_name}
          onChange={handleChange}
          placeholder="School Name"
          className="w-full p-3 border rounded"
        />

        <select
          name="region"
          value={profile.region}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Region</option>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Location */}
        <div className="grid grid-cols-3 gap-4">
          <input name="zone" value={profile.zone} onChange={handleChange} placeholder="Zone" className="p-3 border rounded" />
          <input name="subcity" value={profile.subcity} onChange={handleChange} placeholder="Subcity" className="p-3 border rounded" />
          <input name="woreda" value={profile.woreda} onChange={handleChange} placeholder="Woreda" className="p-3 border rounded" />
        </div>

        {/* Grade */}
        <select
          name="grade_levels"
          value={profile.grade_levels}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Grade</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>

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

export default Profile;
