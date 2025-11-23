import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '@/pages/highschool/student/Profile';
import Exams from '@/pages/highschool/student/Exams';
import ResultsFeedback from '@/pages/highschool/student/ResultsFeedback';
import LearningResources from '@/pages/highschool/student/LearningResources';
import Notifications from '@/pages/highschool/student/Notifications';
import StudentDashboard from '@/pages/highschool/student/StudentDashboard';
import PaidExam from '@/pages/highschool/student/PaidExam';
import FreeExam from '@/pages/highschool/student/FreeExam';
const HighSchoolStudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="exams" element={<Exams />} />
      <Route path="results" element={<ResultsFeedback />} />
      <Route path="resources" element={<LearningResources />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="free-exam" element={<FreeExam />} />
      <Route path="paid-exam" element={<PaidExam />} />
    </Routes>
  );
};

export default HighSchoolStudentRoutes;