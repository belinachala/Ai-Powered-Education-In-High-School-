import React from 'react';

const HighSchoolExamApproval: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Exam Approval</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Refresh Exam List
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Exam Title</th>
            <th className="border p-2">Created By</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Midterm Computer Science</td>
            <td className="border p-2">Teacher Abebe</td>
            <td className="border p-2">Pending</td>
            <td className="border p-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2">
                Approve
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                Reject
              </button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default HighSchoolExamApproval;