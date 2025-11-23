import React from 'react';

const ResultsFeedback: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Results & Feedback</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Download Results
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Exam Title</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Feedback</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Midterm Computer Science</td>
            <td className="border p-2">85%</td>
            <td className="border p-2">Good job, improve on algorithms.</td>
            <td className="border p-2">
              <button className="text-blue-600">View Details</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsFeedback;