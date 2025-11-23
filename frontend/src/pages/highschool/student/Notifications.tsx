import React from 'react';

const Notifications: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Mark All as Read
        </button>
      </div>
      <ul className="space-y-2">
        <li className="bg-gray-100 p-3 rounded flex justify-between">
          <div>
            <h3 className="font-bold">Upcoming Exam</h3>
            <p>Midterm starts in 2 days.</p>
          </div>
          <span className="text-gray-500">2h ago</span>
        </li>
        <li className="bg-gray-100 p-3 rounded flex justify-between">
          <div>
            <h3 className="font-bold">Results Published</h3>
            <p>Check your quiz results.</p>
          </div>
          <span className="text-gray-500">1d ago</span>
        </li>
        {/* Add more items as needed */}
      </ul>
    </div>
  );
};

export default Notifications;