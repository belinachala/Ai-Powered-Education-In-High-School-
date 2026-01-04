import React, { useState, useEffect } from "react";
import { FaBell, FaSearch, FaChevronDown, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface HeaderProps {
  toggleSidebar: () => void;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const HighSchoolDirectorHeader: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState("Director");
  const [profileImage, setProfileImage] = useState<string>("/assets/default-avatar.png");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ==========================
  // Fetch director profile
  // ==========================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/directors/me/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { first_name, last_name, profile_picture_url } = res.data;

        // Set full name
        setFullName(
          `${first_name || ""} ${last_name || ""}`.trim() || "Director"
        );

        // Set profile picture
        if (profile_picture_url) {
          const imgPath = profile_picture_url.replaceAll("\\", "/");
          setProfileImage(`${API_BASE_URL}/${imgPath}?t=${Date.now()}`);
        }
      })
      .catch(() => {
        setFullName("Director");
        setProfileImage("/assets/default-avatar.png");
      });
  }, [token]);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("token");
    navigate("/#");
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/director/profile");
  };

  const goToSettings = () => {
    setDropdownOpen(false);
    navigate("/director/settings");
  };

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 md:px-6 py-4 shadow-md sticky top-0 z-20">
      {/* Left Section */}
      <div className="flex items-center space-x-4 md:space-x-8 w-full md:w-auto">
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          <FaBars />
        </button>

        <h5 className="text-lg md:text-2xl font-bold tracking-wide whitespace-nowrap">
          Director Dashboard
        </h5>

        <div className="relative hidden md:block w-full md:w-96">
          <input
            type="text"
            placeholder="Search students, teachers, exams..."
            className="pl-12 pr-4 py-2 md:py-3 rounded-lg bg-blue-700 placeholder-blue-200 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <FaBell className="text-2xl md:text-3xl hover:text-blue-300 transition" />
          <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-xs md:text-sm px-1.5 md:px-2 py-0.5 rounded-full font-bold">
            3
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 md:space-x-3 hover:text-blue-300 transition"
          >
            <img
              src={profileImage}
              alt="Director"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/default-avatar.png";
              }}
            />

            <span className="font-medium text-sm md:text-lg hidden sm:block">
              {fullName}
            </span>

            <FaChevronDown
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 md:w-56 bg-white text-gray-800 rounded-lg shadow-lg z-30">
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

export default HighSchoolDirectorHeader;
