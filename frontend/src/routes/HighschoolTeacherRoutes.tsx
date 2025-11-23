import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import TeacherDashboardHome from "../pages/highschool/teacher/TeacherDashboardHome";
import TeacherStudents from "../pages/highschool/teacher/TeacherStudents";
import TeacherCreateExam from "../pages/highschool/teacher/TeacherCreateExam";
import TeacherMyExam from "../pages/highschool/teacher/TeacherMyExam";
import TeacherCourses from "../pages/highschool/teacher/TeacherCourses";
import TeacherResult from "../pages/highschool/teacher/TeacherResult";
import TeacherAnalytics from "../pages/highschool/teacher/TeacherAnalytics";
import TeacherSetting from "../pages/highschool/teacher/TeacherSetting";
import TeacherProfile from "../pages/highschool/teacher/TeacherProfile";

const HighschoolTeacherRoutes: React.FC = () => {
  return (
    <Routes> 
      <Route path="dashboard" element={<TeacherDashboardHome/>} />
      <Route path="students" element={<TeacherStudents />} />
      <Route path="create-exam" element={<TeacherCreateExam />} />
      <Route path="my-exam" element={<TeacherMyExam />} />
      <Route path="courses" element={<TeacherCourses />} />
      <Route path="result" element={<TeacherResult />} />
      <Route path="analytics" element={<TeacherAnalytics />} />
      <Route path="setting" element={<TeacherSetting />} />
      <Route path="profile" element={<TeacherProfile />} />
    </Routes>
  );
};

export default HighschoolTeacherRoutes;
