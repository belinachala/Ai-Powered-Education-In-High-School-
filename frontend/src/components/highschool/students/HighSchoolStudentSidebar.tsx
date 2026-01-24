import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBook,
  FaChartLine,
  FaFileAlt,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

const HighSchoolStudentSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { to: "/h-s-student/dashboard", icon: <FaUser />, label: "Dashboard" }, 
    { to: "/h-s-student/available-exams", icon: <FaBook />, label: "Available Exams" },
    { to: "/h-s-student/re-take-exams", icon: <FaBook />, label: "Re Take Exams" },
    { to: "/h-s-student/results", icon: <FaChartLine />, label: "My Results" },
    { to: "/h-s-student/resources", icon: <FaFileAlt />, label: "Learning pdf" },
    { to: "/h-s-student/images-gallery", icon: <FaFileAlt />, label: "Gallery" },
    { to: "/h-s-student/notifications", icon: <FaBell />, label: "Notifications" },
  ];

  return (
    <>
      {/* Hamburger Button (only for mobile) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-800 text-white rounded-md shadow-md lg:hidden"
        onClick={toggleSidebar}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-800 text-white flex flex-col shadow-2xl transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:w-64`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-600 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/rvu-logoo.png"
              alt="School Logo"
              className="w-14 h-14 rounded-full object-contain bg-white shadow-md"
            />
            <h4 className="text-lg font-bold tracking-wide text-white hidden lg:block">
              Student
            </h4>
          </div>

          {/* Close button (only for mobile) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2 text-white">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg ${
                      isActive ? "bg-blue-700" : ""
                    }`
                  }
                >
                  <span className="text-lg text-white">{item.icon}</span>
                  <span className="ml-3 text-sm font-medium text-white">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay (for mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default HighSchoolStudentSidebar;
