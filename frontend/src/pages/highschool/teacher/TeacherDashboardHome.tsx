import React from "react";
import { Users, FileText, BookOpen, Award, CalendarCheck } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const TeacherDashboardHome: React.FC = () => {
  const stats = [
    { id: 1, title: "Total Students", value: 120, icon: <Users size={24} className="text-white" />, color: "from-purple-500 to-purple-700" },
    { id: 2, title: "Exams Created", value: 14, icon: <FileText size={24} className="text-white" />, color: "from-indigo-500 to-indigo-700" },
    { id: 3, title: "Courses Assigned", value: 5, icon: <BookOpen size={24} className="text-white" />, color: "from-pink-500 to-pink-700" },
    { id: 4, title: "Results Submitted", value: 110, icon: <Award size={24} className="text-white" />, color: "from-yellow-400 to-yellow-600" },
  ];

  const recentActivities = [
    { id: 1, text: "Created new Math Midterm Exam", date: "Oct 25, 2025" },
    { id: 2, text: "Added new student: Selam Amanuel", date: "Oct 24, 2025" },
    { id: 3, text: "Submitted results for Physics Final", date: "Oct 23, 2025" },
    { id: 4, text: "Updated course: English Literature", date: "Oct 22, 2025" },
  ];

  const progressStats = [
    { id: 1, title: "Student Completion", value: 85, color: "bg-purple-600" },
    { id: 2, title: "Exam Coverage", value: 60, color: "bg-indigo-600" },
    { id: 3, title: "Course Progress", value: 90, color: "bg-pink-600" },
  ];

  // Charts
  const barData = {
    labels: ["Math", "Physics", "Biology", "Chemistry", "English"],
    datasets: [
      {
        label: "Average Scores",
        data: [88, 72, 65, 80, 90],
        backgroundColor: ["#7F3FBF", "#4F46E5", "#EC4899", "#FBBF24", "#3B82F6"],
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "Grades Distribution",
        data: [12, 25, 8, 5],
        backgroundColor: ["#7F3FBF", "#4F46E5", "#EC4899", "#FBBF24"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between hover:scale-105 transform transition-transform duration-300">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back, Mr. Tesfaye 👋</h1>
          <p className="text-purple-200 mt-2">Here’s a colorful, interactive overview of your dashboard.</p>
        </div>
        <CalendarCheck size={48} className="mt-4 md:mt-0 animate-bounce" />
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`flex items-center gap-4 p-5 rounded-2xl shadow-lg text-white bg-gradient-to-br ${stat.color} hover:scale-105 transform transition-transform duration-300 cursor-pointer`}
          >
            <div className="p-3 bg-white/20 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-white/80">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="grid md:grid-cols-3 gap-6">
        {progressStats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-xl transition-shadow">
            <h3 className="text-purple-800 font-bold mb-2">{stat.title}</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${stat.color} h-4 rounded-full transition-all duration-1000`}
                style={{ width: `${stat.value}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600 font-medium">{stat.value}% completed</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Average Scores per Subject</h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Grades Distribution</h2>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>

      {/* Recent Activity with Badges */}
      <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-3 flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: activity.id % 2 === 0 ? "#4F46E5" : "#EC4899" }}
                >
                  {activity.id === 1 ? "New Exam" : activity.id === 2 ? "Student" : activity.id === 3 ? "Result" : "Course"}
                </span>
                {activity.text}
              </span>
              <span className="text-gray-400 text-sm">{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboardHome;
