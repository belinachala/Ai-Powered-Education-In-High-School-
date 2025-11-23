// HighSchoolDirectorResults.tsx
import React, { useState } from 'react';
import { FaSearch, FaFileExport, FaTrash } from 'react-icons/fa';

interface Result {
  id: number;
  studentName: string;
  examTitle: string;
  score: number;
  grade: string;
  date: string;
}

const HighSchoolDirectorResults: React.FC = () => {
  const [results, setResults] = useState<Result[]>([
    { id: 1, studentName: 'Alice Johnson', examTitle: 'Math Midterm', score: 95, grade: 'A', date: '2025-11-15' },
    { id: 2, studentName: 'Bob Smith', examTitle: 'Physics Quiz', score: 78, grade: 'B', date: '2025-11-20' },
    { id: 3, studentName: 'Charlie Brown', examTitle: 'Chemistry Final', score: 88, grade: 'B+', date: '2025-12-05' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Remove result
  const removeResult = (id: number) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  // Filter results based on search
  const filteredResults = results.filter(r =>
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.examTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dummy export function
  const exportResults = () => {
    alert('Exporting results... (integrate backend for real export)');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Student Results</h3>

      {/* Search and Export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by student or exam"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setSearchTerm('')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Clear
          </button>
        </div>
        <button
          onClick={exportResults}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center"
        >
          <FaFileExport className="mr-2" /> Export
        </button>
      </div>

      {/* Results Table */}
      <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Exam</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Score</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Grade</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map(result => (
              <tr key={result.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-600">{result.id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{result.studentName}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.examTitle}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.score}</td>
                <td className="px-4 py-2 text-sm font-semibold
                  {result.grade === 'A' ? ' text-green-600' :
                   result.grade === 'B+' ? ' text-blue-600' :
                   result.grade === 'B' ? ' text-yellow-600' :
                   result.grade === 'C' ? ' text-orange-600' : ' text-red-600'}"
                >
                  {result.grade}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{result.date}</td>
                <td className="px-4 py-2 text-sm flex gap-2 flex-wrap">
                  <button
                    onClick={() => removeResult(result.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition flex items-center"
                  >
                    <FaTrash className="mr-1" /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {filteredResults.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighSchoolDirectorResults;
