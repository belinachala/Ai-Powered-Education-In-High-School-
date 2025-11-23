// HighSchoolDirectorAnalytics.tsx
import React from 'react';
import { FaUsers, FaChalkboardTeacher, FaFileAlt, FaDollarSign, FaStar } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Sample data
const studentDistribution = [
  { name: 'Grade 10', value: 120 },
  { name: 'Grade 11', value: 80 },
  { name: 'Grade 12', value: 100 },
];

const revenueTrend = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 7000 },
  { month: 'Mar', revenue: 6000 },
  { month: 'Apr', revenue: 8000 },
  { month: 'May', revenue: 9000 },
];

const examPerformance = [
  { name: 'Math', average: 85 },
  { name: 'Physics', average: 78 },
  { name: 'Chemistry', average: 82 },
  { name: 'English', average: 90 },
];

const topStudents = [
  { id: 1, name: 'Alice Johnson', grade: 'A+', score: 98 },
  { id: 2, name: 'Charlie Brown', grade: 'A', score: 95 },
  { id: 3, name: 'Bob Smith', grade: 'A', score: 92 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const HighSchoolDirectorAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h3 className="text-3xl font-bold text-gray-800">School Analytics</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaUsers className="text-4xl" />
          <div>
            <p className="text-lg font-semibold">Total Students</p>
            <p className="text-2xl font-bold">300</p>
          </div>
        </div>
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaChalkboardTeacher className="text-4xl" />
          <div>
            <p className="text-lg font-semibold">Total Teachers</p>
            <p className="text-2xl font-bold">25</p>
          </div>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaFileAlt className="text-4xl" />
          <div>
            <p className="text-lg font-semibold">Total Exams</p>
            <p className="text-2xl font-bold">15</p>
          </div>
        </div>
        <div className="bg-yellow-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaDollarSign className="text-4xl" />
          <div>
            <p className="text-lg font-semibold">Revenue</p>
            <p className="text-2xl font-bold">45,000 ETB</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Performance Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4">Average Exam Performance</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={examPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4">Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Distribution Pie */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4">Student Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studentDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {studentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4 flex items-center">
            <FaStar className="mr-2 text-yellow-500" /> Top Performing Students
          </h4>
          <ul className="divide-y divide-gray-200">
            {topStudents.map(student => (
              <li key={student.id} className="py-2 flex justify-between items-center">
                <span>{student.name}</span>
                <span className="font-semibold text-green-600">{student.grade} ({student.score})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Upcoming Exams</h4>
        <ul className="divide-y divide-gray-200">
          {examPerformance.map((exam, index) => (
            <li key={index} className="py-2 flex justify-between items-center">
              <span>{exam.name}</span>
              <span className="text-gray-600">Average Score: {exam.average}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HighSchoolDirectorAnalytics;
