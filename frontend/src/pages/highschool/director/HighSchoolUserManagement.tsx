import React from 'react';

const HighSchoolUserManagement: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Add New User
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">
          Bulk Upload (CSV)
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Abebe Tefera</td>
            <td className="border p-2">abebe@example.com</td>
            <td className="border p-2">Teacher</td>
            <td className="border p-2">
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
          {/* More rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default HighSchoolUserManagement;