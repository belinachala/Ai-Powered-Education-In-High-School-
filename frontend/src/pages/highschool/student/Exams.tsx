import React from 'react';

const Exams: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Exams</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          View Upcoming Exams
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Exam Title</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Midterm Exam</td>
            <td className="border p-2">Computer Science</td>
            <td className="border p-2">2025-10-15</td>
            <td className="border p-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Start Exam
              </button>
            </td>
          </tr>
          {/* More rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default Exams;