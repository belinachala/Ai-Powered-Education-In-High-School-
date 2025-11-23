import React from 'react';

const HighSchoolReportsAnalytics: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-2xl font-bold mb-4">Reports & Analytics</h4>
      <div className="mb-4">
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Generate Report
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">
          Export to CSV
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          <h5 className="font-bold mb-2">System Usage</h5>
          <p>Active Students: 500</p>
          <p>Active Teachers: 50</p>
          <p>Exams Created: 100</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h5 className="font-bold mb-2">Performance Summary</h5>
          <p>Average Score: 75%</p>
          <p>Top Student: John Doe (95%)</p>
          <p>Low Performing: Area X (45% average)</p>
        </div>
      </div>
      {/* Placeholder for charts */}
      <div className="mt-4">
        <h5 className="font-bold mb-2">Performance Chart</h5>
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
};

export default HighSchoolReportsAnalytics;