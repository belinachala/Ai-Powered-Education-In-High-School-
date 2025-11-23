import React from 'react';
import { Outlet } from 'react-router-dom';
import HighSchoolDirectorSidebar from '@/components/highschool/director/HoghSchoolDirectorSidebar';
import HighSchoolDirectorHeader from '@/components/highschool/director/HighSchoolDirectorHeader';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaDollarSign,
  FaMoneyBill,
  FaMoneyCheck,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const HighSchoolDirectorDashboard: React.FC = () => {
  // Placeholder stats
  const stats = [
    { title: 'Total Students', value: 1200, icon: <FaUserGraduate className="text-3xl text-white" /> },
    { title: 'Total Teachers', value: 75, icon: <FaChalkboardTeacher className="text-3xl text-white" /> },
    { title: 'Exams Scheduled', value: 35, icon: <FaClipboardList className="text-3xl text-white" /> },
    { title: 'Revenue', value: 15000, icon: <FaMoneyCheck className="text-3xl text-white" /> },
  ];

  // Sample chart data
  const examsData = [
    { month: 'Jan', exams: 3 },
    { month: 'Feb', exams: 5 },
    { month: 'Mar', exams: 4 },
    { month: 'Apr', exams: 6 },
    { month: 'May', exams: 7 },
    { month: 'Jun', exams: 5 },
    { month: 'Jul', exams: 4 },
    { month: 'Aug', exams: 6 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2000 },
    { month: 'Feb', revenue: 2500 },
    { month: 'Mar', revenue: 1800 },
    { month: 'Apr', revenue: 3000 },
    { month: 'May', revenue: 3500 },
    { month: 'Jun', revenue: 2800 },
    { month: 'Jul', revenue: 3200 },
    { month: 'Aug', revenue: 4000 },
  ];

  // Sample announcements data
  const announcements = [
    { date: '2025-11-01', title: 'Midterm exams scheduled', type: 'Exam' },
    { date: '2025-10-28', title: 'New teacher joined Science Department', type: 'Staff' },
    { date: '2025-10-25', title: 'Monthly revenue report published', type: 'Finance' },
    { date: '2025-10-20', title: 'Parent-teacher meeting announced', type: 'Event' },
  ];

  return (
    <div className="space-y-6"> 
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center p-6 bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition"
          > 
            <div className="p-4 bg-purple-800 rounded-full">{stat.icon}</div>
            <div className="ml-4">
              <p className="text-gray-200 text-sm">{stat.title}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exams Bar Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4">Exams Scheduled per Month</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={examsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="exams" fill="#6b46c1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Line Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4">Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6b46c1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Latest Announcements</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((item, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{item.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HighSchoolDirectorDashboard;
