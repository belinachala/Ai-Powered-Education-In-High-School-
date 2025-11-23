import React from 'react';

const HighSchoolContentManagement: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Content & Resource Management</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Upload Document
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Document Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Uploaded By</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Exam Guidelines.pdf</td>
            <td className="border p-2">PDF</td>
            <td className="border p-2">Admin</td>
            <td className="border p-2">
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default HighSchoolContentManagement;