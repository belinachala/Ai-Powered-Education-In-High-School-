// src/pages/student/Notifications.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AnnouncementNotification {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_read?: boolean;          // we manage this locally for demo
  target_audience: string;
  target_grades_students?: string[];
  target_special_students?: string[];
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AnnouncementNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNotifications(token);
  }, [navigate]);

  const fetchNotifications = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      // Assuming backend has student-specific endpoint
      // It should filter based on student's grade & special program
      const res = await axios.get("http://127.0.0.1:8000/announcements/student", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort newest first
      const sorted = (res.data || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Add local is_read flag (later can come from backend)
      const withReadStatus = sorted.map((item: any) => ({
        ...item,
        is_read: false, // simulation — replace with real field when backend supports
      }));

      setNotifications(withReadStatus);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
      setError("Could not load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);

    // In real app → send PATCH /announcements/mark-all-read
    // For demo we just update local state
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    setTimeout(() => setMarkingAll(false), 800);
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    // In real app → send PATCH /announcements/{id}/read
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Bell size={32} className="text-purple-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
              Notifications
            </h1>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-purple-700 bg-purple-100 px-4 py-1.5 rounded-full">
                {unreadCount} unread
              </span>

              <button
                onClick={markAllAsRead}
                disabled={markingAll || unreadCount === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all ${
                  markingAll || unreadCount === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 hover:scale-[1.02] shadow-md"
                }`}
              >
                {markingAll ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Marking...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Mark All as Read
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading your notifications...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl flex items-start gap-4">
            <AlertCircle size={28} className="text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 text-lg">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-purple-100"
          >
            <Bell size={64} className="mx-auto text-purple-300 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No notifications yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Important school announcements, exam reminders, and updates will appear here.
            </p>
          </motion.div>
        )}

        {/* Notification List */}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border-l-4 transition-all hover:shadow-md ${
                  notif.is_read
                    ? "bg-white border-gray-300"
                    : "bg-purple-50 border-purple-500 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!notif.is_read && (
                        <span className="h-3 w-3 bg-purple-600 rounded-full"></span>
                      )}
                      <h3
                        className={`font-bold text-lg ${
                          notif.is_read ? "text-gray-800" : "text-purple-900"
                        }`}
                      >
                        {notif.title}
                      </h3>
                    </div>

                    <p className="text-gray-700 whitespace-pre-line mb-3">
                      {notif.content.length > 220
                        ? notif.content.substring(0, 220) + "..."
                        : notif.content}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {notif.target_grades_students &&
                        notif.target_grades_students.length > 0 && (
                          <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                            Grade {notif.target_grades_students.join(", ")}
                          </span>
                        )}

                      {notif.target_special_students &&
                        notif.target_special_students.length > 0 && (
                          <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">
                            {notif.target_special_students
                              .map((v) =>
                                v === "entrance"
                                  ? "Entrance Prep"
                                  : v === "remedial"
                                  ? "Remedial"
                                  : v
                              )
                              .join(", ")}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 sm:min-w-[140px]">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(notif.created_at)}
                    </span>

                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-sm text-purple-700 hover:text-purple-900 font-medium hover:underline transition"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;