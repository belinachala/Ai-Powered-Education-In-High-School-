import React from 'react';

const LearningResources: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Learning Resources</h2>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Search Resources
        </button>
      </div>
      <ul className="space-y-2">
        <li className="bg-gray-100 p-3 rounded">
          <h3 className="font-bold">Algorithms Guide.pdf</h3>
          <p>Uploaded by Teacher Abebe</p>
          <button className="text-blue-600">Download</button>
        </li>
        <li className="bg-gray-100 p-3 rounded">
          <h3 className="font-bold">Practice Quiz</h3>
          <p>Interactive quiz for preparation</p>
          <button className="text-blue-600">Start</button>
        </li>
        {/* Add more items as needed */}
      </ul>
    </div>
  );
};

export default LearningResources;