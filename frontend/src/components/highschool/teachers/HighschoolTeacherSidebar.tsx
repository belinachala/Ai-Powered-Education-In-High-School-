import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  User, 
  Award,
} from "lucide-react";

const HighschoolTeacherSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/#");
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/h-s-teacher/dashboard" },
    { name: "Students", icon: <Users size={20} />, path: "/h-s-teacher/students" },
    { name: "Create Exam", icon: <FilePlus2 size={20} />, path: "/h-s-teacher/create-exam" },
    { name: "My Exam", icon: <FileText size={20} />, path: "/h-s-teacher/my-exam" },
    { name: "Courses", icon: <BookOpen size={20} />, path: "/h-s-teacher/courses" },
    { name: "Result", icon: <Award size={20} />, path: "/h-s-teacher/result" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/h-s-teacher/analytics" },
    { name: "Settings", icon: <Settings size={20} />, path: "/h-s-teacher/setting" },
    { name: "Profile", icon: <User size={20} />, path: "/h-s-teacher/profile" },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-blue-900 text-white flex flex-col shadow-2xl">
      {/* Logo / Header */}
      <div className="p-3 flex flex-col items-center border-b border-blue-700">
        <img
          src="/assets/rvu-logoo.png"
          alt="Logo"
          className="w-20 h-20 object-contain rounded-full bg-white shadow-md mb-2"
        /> 
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-800 text-white shadow-md"
                      : "text-white hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HighschoolTeacherSidebar;
