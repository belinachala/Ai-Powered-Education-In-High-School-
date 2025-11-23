import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import all page components
import HighSchoolDirectorDashboard from "@/pages/highschool/director/HighSchoolDirectorDashboard";
import HighSchoolDirectorTeachers from "@/pages/highschool/director/HighSchoolDirectorTeachers";
import HighSchoolDirectorStudents from "@/pages/highschool/director/HighSchoolDirectorStudents";
import HighSchoolDirectorExamManagement from "@/pages/highschool/director/HighSchoolDirectorExamManagement";
import HighSchoolDirectorPayments from "@/pages/highschool/director/HighSchoolDirectorPayments";
import HighSchoolDirectorResults from "@/pages/highschool/director/HighSchoolDirectorResults";
import HighSchoolDirectorAnalytics from "@/pages/highschool/director/HighSchoolDirectorAnalytics";
import HighSchoolDirectorAnnouncements from "@/pages/highschool/director/HighSchoolDirectorAnnouncements";
import HighSchoolDirectorSettings from "@/pages/highschool/director/HighSchoolDirectorSettings";
import HighSchoolDirectorProfile from "@/pages/highschool/director/HighSchoolDirectorProfile";

const HighSchoolDirectorRoutes: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-y-auto">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />

        {/* Director main pages */}
        <Route path="dashboard" element={<HighSchoolDirectorDashboard />} />
        <Route path="teachers" element={<HighSchoolDirectorTeachers />} />
        <Route path="students" element={<HighSchoolDirectorStudents />} />
        <Route path="exams" element={<HighSchoolDirectorExamManagement />} />
        <Route path="payments" element={<HighSchoolDirectorPayments />} />
        <Route path="results" element={<HighSchoolDirectorResults />} />
        <Route path="analytics" element={<HighSchoolDirectorAnalytics />} />
        <Route path="announcements" element={<HighSchoolDirectorAnnouncements />} />
        <Route path="settings" element={<HighSchoolDirectorSettings />} />
        <Route path="profile" element={<HighSchoolDirectorProfile />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default HighSchoolDirectorRoutes;
