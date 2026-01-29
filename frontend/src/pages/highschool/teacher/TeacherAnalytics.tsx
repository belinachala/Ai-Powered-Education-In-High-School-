import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen, 
  Download,
  Filter
} from "lucide-react";
import { 
  Line, 
  Bar, 
  Doughnut 
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BACKEND_URL = "http://127.0.0.1:8000";

const TeacherAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [examStats, setExamStats] = useState({ total: 0, average: 0, passRate: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        // Fetching real exam counts and mock data for analytics
        const res = await axios.get(`${BACKEND_URL}/free-exams/`, { headers });
        const list = Array.isArray(res.data) ? res.data : res.data?.items || [];
        
        setExamStats({
          total: list.length,
          average: 76.5, // Mocked until Result API is ready
          passRate: 82,   // Mocked
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Chart Data Configurations ---

  const performanceTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [{
      label: "Average Score (%)",
      data: [65, 70, 68, 82, 75, 88],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
    }]
  };

  const gradeDistributionData = {
    labels: ["A (90-100)", "B (80-89)", "C (70-79)", "D (60-69)", "F (<60)"],
    datasets: [{
      data: [15, 30, 25, 20, 10],
      backgroundColor: ["#4f46e5", "#818cf8", "#a5b4fc", "#c7d2fe", "#e2e8f0"],
    }]
  };

  if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;

  return (
    <div className="space-y-8 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academic Analytics</h1>
          <p className="text-slate-500">Track student progress and exam performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-slate-50 transition shadow-sm">
            <Filter size={18} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Average Score" 
          value={`${examStats.average}%`} 
          change="+4.2%" 
          icon={<TrendingUp className="text-emerald-600" />} 
        />
        <MetricCard 
          title="Total Exams" 
          value={examStats.total} 
          change="Updated" 
          icon={<BookOpen className="text-indigo-600" />} 
        />
        <MetricCard 
          title="Pass Rate" 
          value={`${examStats.passRate}%`} 
          change="+2.1%" 
          icon={<Award className="text-amber-600" />} 
        />
        <MetricCard 
          title="Active Students" 
          value="124" 
          change="+12" 
          icon={<Users className="text-blue-600" />} 
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Trend</h3>
          <Line data={performanceTrendData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Grade Distribution</h3>
          <div className="max-h-[300px] flex justify-center">
            <Doughnut 
              data={gradeDistributionData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } } 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Detailed Subject Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Performance by Exam</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Exam Title</th>
                <th className="px-6 py-4">Participants</th>
                <th className="px-6 py-4">Avg. Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRows title="Midterm Biology" participants="42" avg="78%" status="Completed" />
              <TableRows title="Final Physics" participants="38" avg="82%" status="In Progress" />
              <TableRows title="Math Quiz 1" participants="45" avg="65%" status="Completed" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for cleaner code ---

const MetricCard = ({ title, value, change, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
        {change}
      </span>
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const TableRows = ({ title, participants, avg, status }: any) => (
  <tr className="hover:bg-slate-50 transition">
    <td className="px-6 py-4 font-medium text-slate-900">{title}</td>
    <td className="px-6 py-4 text-slate-600">{participants} Students</td>
    <td className="px-6 py-4 text-slate-600 font-semibold">{avg}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
        {status}
      </span>
    </td>
  </tr>
);

export default TeacherAnalytics;