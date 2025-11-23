import React, { useState } from "react";
import HighSchoolDirectorSidebar from "@/components/highschool/director/HoghSchoolDirectorSidebar";
import HighSchoolDirectorHeader from "@/components/highschool/director/HighSchoolDirectorHeader";
import HighSchoolDirectorRoutes from "@/routes/HighSchoolDirectorRoutes";

const HighSchoolDirectorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <HighSchoolDirectorSidebar toggleSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-20">
          <HighSchoolDirectorHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Main Routes */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 transition-all duration-300">
          <HighSchoolDirectorRoutes />
        </main>
      </div>
    </div>
  );
};

export default HighSchoolDirectorLayout;
