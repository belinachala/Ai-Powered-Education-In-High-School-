// HighSchoolDirectorStudents.tsx
import React, { useState } from 'react';
import { FaTrash, FaCheck, FaPlus } from 'react-icons/fa';

interface Student {
  id: number;
  name: string;
  email: string;
  approved: boolean;
  grade: string;
}

const HighSchoolDirectorStudents: React.FC = () => {
  // Sample student data
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', approved: true, grade: '10' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', approved: false, grade: '11' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', approved: true, grade: '12' },
  ]);

  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');

  // Approve student
  const approveStudent = (id: number) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, approved: true } : s))
    );
  };

  // Remove student
  const removeStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Add new student
  const addStudent = () => {
    if (!newStudentName || !newStudentEmail || !newStudentGrade) return alert('Fill in all fields');
    const newStudent: Student = {
      id: Math.max(0, ...students.map(s => s.id)) + 1,
      name: newStudentName,
      email: newStudentEmail,
      grade: newStudentGrade,
      approved: false,
    };
    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentGrade('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Manage Students</h3>

      {/* Add Student Form */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <FaPlus className="mr-2" /> Add New Student
        </h4>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newStudentName}
            onChange={e => setNewStudentName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newStudentEmail}
            onChange={e => setNewStudentEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Grade"
            className="border border-gray-300 rounded-md p-2 w-32"
            value={newStudentGrade}
            onChange={e => setNewStudentGrade(e.target.value)}
          />
          <button
            onClick={addStudent}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        <h4 className="text-xl font-semibold mb-4">Students List</h4>
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Grade</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-600">{student.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{student.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{student.email}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{student.grade}</td>
                <td className="px-4 py-2 text-sm">
                  {student.approved ? (
                    <span className="text-green-600 font-semibold">Approved</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm flex gap-2 flex-wrap">
                  {!student.approved && (
                    <button
                      onClick={() => approveStudent(student.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition flex items-center"
                    >
                      <FaCheck className="mr-1" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => removeStudent(student.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition flex items-center"
                  >
                    <FaTrash className="mr-1" /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighSchoolDirectorStudents;
