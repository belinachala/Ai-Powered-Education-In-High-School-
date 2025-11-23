// HighSchoolDirectorTeachers.tsx
import React, { useState } from 'react';
import { FaTrash, FaCheck, FaPlus } from 'react-icons/fa';

interface Teacher {
  id: number;
  name: string;
  email: string;
  approved: boolean;
}

const HighSchoolDirectorTeachers: React.FC = () => {
  // Dummy teacher data
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', approved: true },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', approved: false },
    { id: 3, name: 'Samuel Lee', email: 'samuel.lee@example.com', approved: true },
  ]);

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');

  // Approve teacher
  const approveTeacher = (id: number) => {
    setTeachers(prev =>
      prev.map(t => (t.id === id ? { ...t, approved: true } : t))
    );
  };

  // Remove teacher
  const removeTeacher = (id: number) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Add new teacher
  const addTeacher = () => {
    if (!newTeacherName || !newTeacherEmail) return alert('Fill in all fields');
    const newTeacher: Teacher = {
      id: Math.max(...teachers.map(t => t.id)) + 1,
      name: newTeacherName,
      email: newTeacherEmail,
      approved: false,
    };
    setTeachers(prev => [...prev, newTeacher]);
    setNewTeacherName('');
    setNewTeacherEmail('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Manage Teachers</h3>

      {/* Add Teacher Form */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <FaPlus className="mr-2" /> Add New Teacher
        </h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newTeacherName}
            onChange={e => setNewTeacherName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={newTeacherEmail}
            onChange={e => setNewTeacherEmail(e.target.value)}
          />
          <button
            onClick={addTeacher}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Teachers List</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
                <tr key={teacher.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm text-gray-600">{teacher.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{teacher.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{teacher.email}</td>
                  <td className="px-4 py-2 text-sm">
                    {teacher.approved ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm flex gap-2">
                    {!teacher.approved && (
                      <button
                        onClick={() => approveTeacher(teacher.id)}
                        className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition flex items-center"
                      >
                        <FaCheck className="mr-1" /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => removeTeacher(teacher.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition flex items-center"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HighSchoolDirectorTeachers;
