import React, { useEffect, useState } from "react";
import axios from "axios";

interface DirectorProfile {
  director_id: string;
  gender: string;
  date_of_birth: string;
  school_name: string;
  region: string;
  zone: string;
  subcity: string;
  woreda: string;
  years_of_experience: number;
  profile_picture_url: string;
}

const regions = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
  "Gambela", "Harari", "Oromia", "Sidama", "Somali",
  "SNNPR", "Tigray"
];

const HighSchoolDirectorProfile: React.FC = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<DirectorProfile>({
    director_id: "",
    gender: "",
    date_of_birth: "",
    school_name: "",
    region: "",
    zone: "",
    subcity: "",
    woreda: "",
    years_of_experience: 0,
    profile_picture_url: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // Fetch director profile
  // ===============================
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/directors/me/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const data = res.data;

        // Fix profile picture URL
        let profile_picture_url = data.profile_picture_url;
        if (profile_picture_url) {
          profile_picture_url = `http://127.0.0.1:8000/${profile_picture_url.replaceAll("\\", "/")}`;
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
    setProfile(prev => ({ 
      ...prev, 
      [name]: name === "years_of_experience" ? parseInt(value) || 0 : value 
    }));
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
          formData.append(key, String(value));
        }
      });

      if (newImage) {
        formData.append("profile_picture", newImage);
      }

      await axios.put(
        "http://127.0.0.1:8000/directors/me/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Profile updated successfully");

      // Update preview if new image
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
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">School Director Profile</h2>

      {message && (
        <p className={`mb-4 font-semibold text-center p-3 rounded ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture */}
        <div className="text-center mb-8">
          <img
            src={
              newImage
                ? URL.createObjectURL(newImage)
                : profile.profile_picture_url || "/assets/default-avatar.png"
            }
            alt="Director"
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-600 shadow-xl"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
        </div>

        {/* Director ID */}
        <input
          name="director_id"
          value={profile.director_id}
          onChange={handleChange}
          placeholder="Director ID"
          className="w-full p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
          required
        />

        {/* Gender & DOB */}
        <div className="grid grid-cols-2 gap-6">
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="date"
            name="date_of_birth"
            value={profile.date_of_birth || ""}
            onChange={handleChange}
            className="p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
            required
          />
        </div>

        {/* School Name */}
        <input
          name="school_name"
          value={profile.school_name}
          onChange={handleChange}
          placeholder="School Name"
          className="w-full p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
          required
        />

        {/* Region */}
        <select
          name="region"
          value={profile.region}
          onChange={handleChange}
          className="w-full p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
          required
        >
          <option value="">Select Region</option>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Location Details */}
        <div className="grid grid-cols-3 gap-6">
          <input
            name="zone"
            value={profile.zone}
            onChange={handleChange}
            placeholder="Zone"
            className="p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
            required
          />
          <input
            name="subcity"
            value={profile.subcity}
            onChange={handleChange}
            placeholder="Subcity"
            className="p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
            required
          />
          <input
            name="woreda"
            value={profile.woreda}
            onChange={handleChange}
            placeholder="Woreda"
            className="p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
            required
          />
        </div>

        {/* Years of Experience */}
        <input
          type="number"
          name="years_of_experience"
          value={profile.years_of_experience || ""}
          onChange={handleChange}
          placeholder="Years of Experience"
          min="0"
          className="w-full p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-xl disabled:opacity-70"
        >
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default HighSchoolDirectorProfile;