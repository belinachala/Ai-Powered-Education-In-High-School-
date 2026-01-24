import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '@/pages/highschool/student/Profile';
import Exams from '@/pages/highschool/student/Exams';
import ResultsFeedback from '@/pages/highschool/student/ResultsFeedback';
import LearningResources from '@/pages/highschool/student/LearningResources';
import Notifications from '@/pages/highschool/student/Notifications';
import StudentDashboard from '@/pages/highschool/student/StudentDashboard'; 
import ImagesGallery from '@/pages/highschool/student/ImagesGallery';
import AvailableExams from '@/pages/highschool/student/AvailableExams';
const HighSchoolStudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="available-exams" element={<AvailableExams />} /> 
      <Route path="re-take-exams" element={<Exams />} />
      <Route path="results" element={<ResultsFeedback />} />
      <Route path="resources" element={<LearningResources />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="images-gallery" element={<ImagesGallery />} /> 
    </Routes>
  );
};

export default HighSchoolStudentRoutes;