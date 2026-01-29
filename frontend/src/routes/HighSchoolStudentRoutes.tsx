import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '@/pages/highschool/student/Profile';
import ReTakeExams from '@/pages/highschool/student/ReTakeExams';
import LearningResources from '@/pages/highschool/student/LearningResources';
import Notifications from '@/pages/highschool/student/Notifications';
import StudentDashboard from '@/pages/highschool/student/StudentDashboard'; 
import ImagesGallery from '@/pages/highschool/student/ImagesGallery';
import AvailableExams from '@/pages/highschool/student/AvailableExams';
import TakeExamPage from '@/pages/highschool/student/TakeExamPage';
import ResultPage from '@/pages/highschool/student/ResultPage';

const HighSchoolStudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="available-exams" element={<AvailableExams />} /> 
      {/* Note: Ensure the navigation in TakeExamPage matches this structure */}
      <Route path="take_exam/:examId" element={<TakeExamPage />} />
      <Route path="re-take-exams" element={<ReTakeExams />} />
      
      {/* UPDATED THIS LINE BELOW */}
      <Route path="exam-result/:attemptId" element={<ResultPage />} />
      
      <Route path="resources" element={<LearningResources />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="images-gallery" element={<ImagesGallery />} /> 
    </Routes>
  );
};

export default HighSchoolStudentRoutes;