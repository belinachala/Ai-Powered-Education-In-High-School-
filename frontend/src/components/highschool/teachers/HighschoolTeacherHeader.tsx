import React, { useState, useEffect } from "react";
import { Bell, Search, UserCircle, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const HighschoolTeacherHeader: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState("Teacher");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ============================
    // Get teacher profile
    // ============================
    axios.get(`${API_BASE_URL}/teachers/me/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const { teacher_id, profile_picture_url } = res.data;
        setFullName(teacher_id || "Teacher"); // You can adjust to first_name + last_name if available
        if (profile_picture_url) {
          setProfileImage(`${API_BASE_URL}/${profile_picture_url}`);
        }
      })
      .catch(err => {
        console.log("Failed to load teacher profile:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/h-s-teacher/profile");
  };

  const goToSettings = () => {
    setDropdownOpen(false);
    navigate("/h-s-teacher/setting");
  };

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 md:px-6 py-3 md:py-4 shadow-md sticky top-0 z-30 w-full">
      {/* Left Section */}
      <div className="flex items-center gap-4 md:gap-6">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-white text-2xl md:hidden focus:outline-none"
          >
            <Menu />
          </button>
        )}
        <h5 className="text-lg md:text-2xl font-bold tracking-wide whitespace-nowrap">
          High School Teacher Panel
        </h5>
      </div>

      {/* Search Bar */}
      <div className="hidden md:block w-64 lg:w-96 relative">
        <input
          type="text"
          placeholder="Search students, exams, or resources..."
          className="pl-10 pr-4 py-2 rounded-lg bg-blue-800 placeholder-blue-200 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" size={18} />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell className="text-2xl md:text-3xl hover:text-blue-300 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 py-0.5 rounded-full font-bold">
            4
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 md:space-x-3 hover:text-blue-300 transition"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border"
              />
            ) : (
              <UserCircle className="text-2xl md:text-3xl" />
            )}

            <span className="font-medium hidden sm:block">{fullName}</span>

            <ChevronDown
              className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg z-30">
              <ul className="py-2">
                <li
                  onClick={goToProfile}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  My Profile
                </li>
                <li
                  onClick={goToSettings}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  Settings
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-red-600"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HighschoolTeacherHeader;
