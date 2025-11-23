import React from 'react';

const HighSchoolSecurityAccess: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Security & Access Control</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Enable 2FA:</label>
          <input type="checkbox" className="mr-2" />
          Yes
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Role Permissions:</label>
          <select className="w-full p-2 rounded border">
            <option>Teacher - Create Exams</option>
            <option>Student - Take Exams</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Session Timeout (minutes):</label>
          <input type="number" placeholder="30" className="w-full p-2 rounded border" />
        </div>
        <div>
          <h3 className="font-bold mb-2">Audit Logs</h3>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            View Logs
          </button>
        </div>
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Save Security Settings
        </button>
      </form>
    </div>
  );
};

export default HighSchoolSecurityAccess;