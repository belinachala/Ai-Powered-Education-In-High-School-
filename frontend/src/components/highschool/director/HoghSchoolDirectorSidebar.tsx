import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUsers,
  FaFileAlt,
  FaMoneyBillWave,
  FaChartBar,
  FaBullhorn,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const HighSchoolDirectorSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { to: "/director/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/director/teachers", icon: <FaChalkboardTeacher />, label: "Teachers" },
    { to: "/director/students", icon: <FaUsers />, label: "Students" },
    { to: "/director/exams", icon: <FaFileAlt />, label: "Exam Management" },
    { to: "/director/payments", icon: <FaMoneyBillWave />, label: "Payments" },
    { to: "/director/results", icon: <FaChartBar />, label: "Results" },
    { to: "/director/analytics", icon: <FaChartBar />, label: "Analytics" },
    { to: "/director/announcements", icon: <FaBullhorn />, label: "Announcements" }, 
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button className="fixed top-4 left-4 z-50 p-2 bg-blue-800 text-white rounded-md shadow-md hover:bg-blue-700 transition-all duration-200 lg:hidden"  onClick={toggleSidebar}>
  <FaBars size={20} />
</button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white flex flex-col shadow-2xl transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:w-64`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/rvu-logoo.png"
              alt="School Logo"
              className="w-14 h-14 rounded-full object-contain bg-white shadow-md"
            />
            <h4 className="text-lg font-bold tracking-wide hidden lg:block">Director</h4>
          </div>
          {/* Close button (for mobile) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:text-yellow-300 transition"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-800 text-white shadow-md"
                        : "text-white hover:bg-blue-700 hover:text-white"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
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

export default HighSchoolDirectorSidebar;
