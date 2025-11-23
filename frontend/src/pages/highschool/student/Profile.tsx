import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input type="text" placeholder="Abebe Tefera" className="w-full p-2 rounded border" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input type="email" placeholder="abebe@example.com" className="w-full p-2 rounded border" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
          <input type="text" placeholder="Computer Science" className="w-full p-2 rounded border" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Year:</label>
          <select className="w-full p-2 rounded border">
            <option>1st Year</option>
            <option>2nd Year</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input type="password" placeholder="********" className="w-full p-2 rounded border" />
        </div>
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;