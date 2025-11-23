import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HighschoolTeacherSidebar from "../../../components/highschool/teachers/HighschoolTeacherSidebar";
import HighschoolTeacherHeader from "../../../components/highschool/teachers/HighschoolTeacherHeader";

// Pages
import TeacherDashboardHome from "./TeacherDashboardHome";
import TeacherStudents from "./TeacherStudents";
import TeacherCreateExam from "./TeacherCreateExam";
import TeacherMyExam from "./TeacherMyExam";
import TeacherCourses from "./TeacherCourses";
import TeacherResult from "./TeacherResult";
import TeacherAnalytics from "./TeacherAnalytics";
import TeacherSetting from "./TeacherSetting";
import TeacherProfile from "./TeacherProfile";

const HighschoolTeacherDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <HighschoolTeacherSidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <HighschoolTeacherHeader />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/teacher/dashboard" />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboardHome />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/create-exam" element={<TeacherCreateExam />} />
            <Route path="/teacher/my-exam" element={<TeacherMyExam />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/result" element={<TeacherResult />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
            <Route path="/teacher/setting" element={<TeacherSetting />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HighschoolTeacherDashboard;
