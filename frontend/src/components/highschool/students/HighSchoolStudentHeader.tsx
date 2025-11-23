import React, { useState } from "react";
import { FaBell, FaUserCircle, FaSearch, FaChevronDown, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const HighSchoolStudentHeader: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/#");
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/h-s-student/profile");
  };

  const goToSettings = () => {
    setDropdownOpen(false);
    navigate("/h-s-student/settings");
  };

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 md:px-6 py-3 md:py-4 shadow-md sticky top-0 z-30 w-full">
      {/* Left Section: Hamburger + Title */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Hamburger (for mobile only) */}
        <button
          onClick={onToggleSidebar}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          <FaBars />
        </button>

        <h5 className="text-lg md:text-2xl font-bold tracking-wide whitespace-nowrap">
          Student Dashboard
        </h5>
      </div>

      {/* Search Bar (hidden on small screens) */}
      <div className="hidden md:block w-64 lg:w-96 relative">
        <input
          type="text"
          placeholder="Search exams, notes, or announcements..."
          className="pl-10 pr-4 py-2 rounded-lg bg-blue-700 placeholder-blue-200 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
      </div>

      {/* Right Section: Notifications + Profile Dropdown */}
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <FaBell className="text-2xl md:text-3xl hover:text-blue-300 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 py-0.5 rounded-full font-bold">
            2
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 md:space-x-3 hover:text-blue-300 transition"
          >
            <FaUserCircle className="text-2xl md:text-3xl" />
            <span className="font-medium hidden sm:block">Student Yonas</span>
            <FaChevronDown
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
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

export default HighSchoolStudentHeader;
