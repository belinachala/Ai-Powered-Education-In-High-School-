import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Trophy,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Bell,
  Calendar,
} from "lucide-react";

// Interfaces based on your provided code structures
interface StudentProfile {
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
}

interface Material {
  id: number;
  subject: string;
  file_type: string;
  created_at: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recentMaterials, setRecentMaterials] = useState<Material[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/#"); // Redirect if no token
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Profile
        const profileRes = await axios.get(`${API_BASE_URL}/students/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // 2. Fetch Notifications Count
        const notifyRes = await axios.get(`${API_BASE_URL}/announcements/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unread = (notifyRes.data || []).filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);

        // 3. Fetch Recent Materials (Preview)
        const materialsRes = await axios.get(`${API_BASE_URL}/subject-upload/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Take top 3 most recent
        setRecentMaterials(materialsRes.data.materials.slice(0, 3));

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : "Student";
  const profileImg = profile?.profile_picture_url 
    ? `${API_BASE_URL}/${profile.profile_picture_url.replaceAll("\\", "/")}` 
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-blue-600">{profile?.first_name || "Student"}!</span>
          </h1>
          <p className="text-gray-500 mt-1">Ready to ace your exams today?</p>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={() => navigate("/h-s-student/notifications")}
             className="relative p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>
          <button 
            onClick={() => navigate("/h-s-student/profile")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            View Profile <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Pending Exams", val: "4", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Completed", val: "12", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg. Score", val: "85%", icon: Trophy, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Rank", val: "Top 10%", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. MAIN SECTION: QUICK NAV & EXAMS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => navigate("/h-s-student/available-exams")}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white cursor-pointer hover:scale-[1.02] transition transform shadow-xl"
            >
              <Calendar className="mb-4 opacity-80" size={32} />
              <h3 className="text-xl font-bold">Available Exams</h3>
              <p className="text-blue-100 text-sm mt-1">Check for new scheduled assessments</p>
            </div>
            <div 
              onClick={() => navigate("/h-s-student/results")}
              className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl text-white cursor-pointer hover:scale-[1.02] transition transform shadow-xl"
            >
              <Trophy className="mb-4 opacity-80" size={32} />
              <h3 className="text-xl font-bold">Results & Feedback</h3>
              <p className="text-purple-100 text-sm mt-1">View your grades and performance analysis</p>
            </div>
          </div>

          {/* Recent Resources (Synced with your LearningResources logic) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Recent Learning Materials</h2>
              <button 
                onClick={() => navigate("/h-s-student/resources")}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Browse All
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentMaterials.length > 0 ? recentMaterials.map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate("/h-s-student/resources")}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{m.subject}</h4>
                      <p className="text-xs text-gray-400 capitalize">{m.file_type.replace('.', '')} Document • {new Date(m.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-300" />
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500 italic">No resources found.</div>
              )}
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR: QUICK LINKS & GALLERY PREVIEW */}
        <div className="space-y-8">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mb-4">
              {profileImg ? (
                <img src={profileImg} className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover" alt="Profile" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                   <span className="text-3xl font-bold">{profile?.first_name?.[0]}</span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{fullName}</h3>
            <p className="text-sm text-gray-500">High School Student</p>
            <hr className="my-4 border-gray-100" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="font-bold text-blue-600">Grade</p>
                <p className="text-gray-600">12th</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="font-bold text-blue-600">Stream</p>
                <p className="text-gray-600">Natural</p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Shortcuts</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate("/h-s-student/images-gallery")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition font-medium"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} /> Images Gallery
                </div>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => navigate("/h-s-student/re-take-exams")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition font-medium"
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} /> Re-take Exams
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;