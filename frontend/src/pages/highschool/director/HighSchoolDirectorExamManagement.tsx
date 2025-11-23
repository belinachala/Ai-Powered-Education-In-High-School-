// HighSchoolDirectorExamManagement.tsx
import React, { useState } from 'react';
import { FaTrash, FaEdit, FaPlus, FaCheck } from 'react-icons/fa';

interface Exam {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: string;
  active: boolean;
}

const HighSchoolDirectorExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([
    { id: 1, title: 'Math Midterm', subject: 'Mathematics', date: '2025-11-15', duration: '60 min', active: true },
    { id: 2, title: 'Physics Quiz', subject: 'Physics', date: '2025-11-20', duration: '30 min', active: false },
    { id: 3, title: 'Chemistry Final', subject: 'Chemistry', date: '2025-12-05', duration: '90 min', active: true },
  ]);

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamDuration, setNewExamDuration] = useState('');

  // Add new exam
  const addExam = () => {
    if (!newExamTitle || !newExamSubject || !newExamDate || !newExamDuration) {
      return alert('Fill in all fields');
    }
    const newExam: Exam = {
      id: Math.max(0, ...exams.map(e => e.id)) + 1,
      title: newExamTitle,
      subject: newExamSubject,
      date: newExamDate,
      duration: newExamDuration,
      active: false,
    };
    setExams(prev => [...prev, newExam]);
    setNewExamTitle('');
    setNewExamSubject('');
    setNewExamDate('');
    setNewExamDuration('');
  };

  // Delete exam
  const deleteExam = (id: number) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Toggle active status
  const toggleActive = (id: number) => {
    setExams(prev =>
      prev.map(e => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Manage Exams</h3>

      {/* Add Exam Form */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <FaPlus className="mr-2" /> Add New Exam
        </h4>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Exam Title"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newExamTitle}
            onChange={e => setNewExamTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newExamSubject}
            onChange={e => setNewExamSubject(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-md p-2"
            value={newExamDate}
            onChange={e => setNewExamDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration (e.g., 60 min)"
            className="border border-gray-300 rounded-md p-2 w-40"
            value={newExamDuration}
            onChange={e => setNewExamDuration(e.target.value)}
          />
          <button
            onClick={addExam}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* Exams Table */}
      <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Exams List</h3>
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subject</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <tr key={exam.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-600">{exam.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{exam.title}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{exam.subject}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{exam.date}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{exam.duration}</td>
                <td className="px-4 py-2 text-sm">
                  {exam.active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleActive(exam.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition flex items-center"
                  >
                    <FaCheck className="mr-1" /> Toggle
                  </button>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                  {/* Edit functionality can open a modal or inline editing later */}
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighSchoolDirectorExamManagement;
