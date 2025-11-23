import React from 'react';
import Navbar from '@/components/NavBar';

const Exams: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500">Exams</h1>
        <p className="mt-4 text-gray-700">Exam details coming soon...</p>
      </div>
    </div>
  );
};

export default Exams;