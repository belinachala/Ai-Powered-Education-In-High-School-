import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaChalkboardTeacher, FaFileAlt, FaDollarSign, FaStar } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

const BACKEND_URL = "http://127.0.0.1:8000";
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#ec4899'];

const HighSchoolDirectorAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalExams: 0,
    totalRevenue: 0,
  });

  const [studentDistribution, setStudentDistribution] = useState<any[]>([]);
  const [teacherDistribution, setTeacherDistribution] = useState<any[]>([]);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [examPerformance, setExamPerformance] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      try {
        setLoading(true);

        // 1. Fetch Students & Distribution
        const studentsRes = await axios.get(`${BACKEND_URL}/directors/students`, { headers });
        const students = studentsRes.data.students || studentsRes.data || [];
        const sCounts: Record<string, number> = {};
        students.forEach((s: any) => {
          const grade = s.grade_levels ? `Grade ${s.grade_levels}` : 'Unassigned';
          sCounts[grade] = (sCounts[grade] || 0) + 1;
        });

        // 2. Fetch Teachers & Distribution (Handling Grade Arrays)
        const teachersRes = await axios.get(`${BACKEND_URL}/directors/teachers`, { headers });
        const teachers = teachersRes.data.teachers || teachersRes.data || [];
        const tCounts: Record<string, number> = {};
        
        teachers.forEach((t: any) => {
          // Since teacher.grade_levels is an array like ["9", "10"]
          if (Array.isArray(t.grade_levels)) {
            t.grade_levels.forEach((g: string) => {
              const label = `Grade ${g}`;
              tCounts[label] = (tCounts[label] || 0) + 1;
            });
          }
        });

        // 3. Fetch Exams
        const examsRes = await axios.get(`${BACKEND_URL}/free-exams/all`, { headers });
        const examCount = (examsRes.data || []).length;

        // Formatting Data for Recharts
        const formatData = (counts: Record<string, number>) => 
          Object.keys(counts).map(key => ({ name: key, value: counts[key] }))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        setStudentDistribution(formatData(sCounts));
        setTeacherDistribution(formatData(tCounts));

        setStats({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalExams: examCount,
          totalRevenue: 0, 
        });

        // Placeholder Performance Data
        setExamPerformance([
          { name: 'Math', average: 85 },
          { name: 'Physics', average: 78 },
          { name: 'Chemistry', average: 82 },
          { name: 'English', average: 90 },
        ]);

        setRevenueTrend([
          { month: 'Jan', revenue: 5000 },
          { month: 'Feb', revenue: 7000 },
          { month: 'Mar', revenue: 6000 },
        ]);

        setTopStudents([
          { id: 1, name: 'Alice Johnson', grade: 'A+', score: 98 },
          { id: 2, name: 'Charlie Brown', grade: 'A', score: 95 },
        ]);

      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">Gathering School Statistics...</div>;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold text-gray-800">School Director Dashboard</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaUsers className="text-4xl" />
          <div>
            <p className="text-sm opacity-80">Total Students</p>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </div>
        </div>
        
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaChalkboardTeacher className="text-4xl" />
          <div>
            <p className="text-sm opacity-80">Total Teachers</p>
            <p className="text-2xl font-bold">{stats.totalTeachers}</p>
          </div>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaFileAlt className="text-4xl" />
          <div>
            <p className="text-sm opacity-80">Active Exams</p>
            <p className="text-2xl font-bold">{stats.totalExams}</p>
          </div>
        </div>

        <div className="bg-yellow-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaDollarSign className="text-4xl" />
          <div>
            <p className="text-sm opacity-80">Revenue</p>
            <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ETB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Student Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Student Enrollment by Grade</h4>
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

        {/* Teacher Distribution - NEW */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Teachers Assigned per Grade</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teacherDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Exam Performance</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={examPerformance}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="average" stroke="#6366f1" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <FaStar className="mr-2 text-yellow-500" /> Top Students
          </h4>
          <ul className="space-y-4">
            {topStudents.map((student, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{student.name}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  {student.grade} ({student.score}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HighSchoolDirectorAnalytics;