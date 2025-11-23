import React from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

const TeacherAnalytics: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={26} className="text-purple-700" />
        <h2 className="text-2xl font-bold text-purple-800">Analytics Dashboard</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-100 text-purple-800 rounded-2xl p-4 text-center">
          <TrendingUp size={22} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Average Score</h3>
          <p className="text-xl">78%</p>
        </div>
        <div className="bg-indigo-100 text-indigo-800 rounded-2xl p-4 text-center">
          <PieChart size={22} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Participation Rate</h3>
          <p className="text-xl">92%</p>
        </div>
        <div className="bg-pink-100 text-pink-800 rounded-2xl p-4 text-center">
          <BarChart3 size={22} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Exams Conducted</h3>
          <p className="text-xl">14</p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-2xl p-4">
        <h3 className="font-semibold text-purple-800 mb-4">Recent Trends</h3>
        <p className="text-gray-700">Student performance is steadily improving over the last semester. Participation rate has increased by 5% in quizzes and homework submission.</p>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
