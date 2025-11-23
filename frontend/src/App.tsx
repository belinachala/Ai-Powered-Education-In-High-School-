import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';

// Landing pages
import Home from './pages/landingpage/Home';
import About from './pages/landingpage/About';
import Features from './pages/landingpage/Features';
import Exams from './pages/Exams';
import Gallery from './pages/landingpage/Gallery';
import Contact from './pages/landingpage/Contacts';
import Login from './pages/Login';
import Register from './pages/Register';

// Layouts
import DashboardLayout from './layouts/DashboardLayout'; 

// High School Components
import HighschoolTeacherSidebar from './components/highschool/teachers/HighschoolTeacherSidebar';
import HighschoolTeacherHeader from './components/highschool/teachers/HighschoolTeacherHeader';
import HighSchoolDirectorSidebar from './components/highschool/director/HoghSchoolDirectorSidebar';
import SchoolDirectorHeader from './components/highschool/director/HighSchoolDirectorHeader';
import HighSchoolStudentSidebar from './components/highschool/students/HighSchoolStudentSidebar';
import HighSchoolStudentHeader from './components/highschool/students/HighSchoolStudentHeader';

// Routes
 
import HighschoolTeacherRoutes from './routes/HighschoolTeacherRoutes';
import HighSchoolStudentRoutes from './routes/HighSchoolStudentRoutes';
import HighSchoolDirectorRoutes from './routes/HighSchoolDirectorRoutes';

// Example Dashboard (for preview)
import TeacherDashboardHome from './pages/highschool/teacher/TeacherDashboardHome';

// profile completion

import HighSchoolDirectorProfileCompletion from './pages/ProfileCompletion/HighSchoolDirectorProfileCompletion';
import HighSchoolTeachersProfileCompletion from './pages/ProfileCompletion/HighSchoolTeachersProfileCompletion';
import HighSchoolStudentsProfileCompletion from './pages/ProfileCompletion/HighSchoolStudentsProfileCompletion';

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Router>
      <Routes>
        {/* Public Landing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        <Route path="/directorprofile" element={<HighSchoolDirectorProfileCompletion />} />
        <Route path="/h-s-t-profile" element={<HighSchoolTeachersProfileCompletion />} />
        <Route path="/h-s-s-profile" element={<HighSchoolStudentsProfileCompletion />} />
 

        {/* High School Director Layout */}
        <Route
          path="/director/*"
          element={
            <DashboardLayout Sidebar={HighSchoolDirectorSidebar} Header={SchoolDirectorHeader}>
              <HighSchoolDirectorRoutes />
            </DashboardLayout>
          }
        />

        {/* High School Teacher Layout */}
        <Route
          path="/h-s-teacher/*"
          element={
            <DashboardLayout Sidebar={HighschoolTeacherSidebar} Header={HighschoolTeacherHeader}>
              <HighschoolTeacherRoutes />
            </DashboardLayout>
          }
        />

        {/* High School Student Layout */}
        <Route
          path="/h-s-student/*"
          element={
            <DashboardLayout Sidebar={HighSchoolStudentSidebar} Header={HighSchoolStudentHeader}>
              <HighSchoolStudentRoutes />
            </DashboardLayout>
          }
        />

        {/* Example fallback routes */}
        <Route path="/dashboard" element={<TeacherDashboardHome />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
