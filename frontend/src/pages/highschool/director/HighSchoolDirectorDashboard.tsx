import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Collapse, CircularProgress,
  Chip, Button, Menu, MenuItem, Snackbar, Alert as MuiAlert, Grid, Avatar
} from '@mui/material';
import {
  FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaMoneyCheck,
  FaHistory, FaAward
} from 'react-icons/fa';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/* ================= TYPES & OVERRIDES ================= */
interface ExamListItem {
  id: number;
  title?: string;
  grade?: string;
  stream?: string;
  subject?: string;
  total_questions?: number;
  category?: string;
  status?: string;
  created_at?: string;
  start_datetime?: string | null;
}

interface ExamDetail extends ExamListItem {
  questions?: any[];
}

// Bypassing strict type checking for components causing "Property does not exist" errors
const TCell = TableCell as any;
const TRow = TableRow as any;
const TCollapse = Collapse as any;
const TAlert = MuiAlert as any;

const BACKEND_URL = "http://127.0.0.1:8000";

const HighSchoolDirectorDashboard: React.FC = () => {
  const [stats, setStats] = useState([
    { title: 'Total Students', value: 0, icon: <FaUserGraduate /> },
    { title: 'Total Teachers', value: 0, icon: <FaChalkboardTeacher /> },
    { title: 'Scheduled Exams', value: 0, icon: <FaClipboardList /> },
    { title: 'Revenue', value: 0, icon: <FaMoneyCheck /> },
  ]);

  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [expandedExamId, setExpandedExamId] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<number, ExamDetail>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);

  const mockTopTeachers = [
    { name: 'Abebe Bikila', subject: 'Physics', rating: 98, img: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Dawit Kebede', subject: 'Maths', rating: 95, img: 'https://i.pravatar.cc/150?u=2' },
    { name: 'John Daniel', subject: 'English', rating: 92, img: 'https://i.pravatar.cc/150?u=3' },
  ];

  const mockActivities = [
    { text: "Teacher 'Abebe' uploaded Mid-Exam", time: "10 mins ago" },
    { text: "Director approved Revenue Report", time: "1 hour ago" },
    { text: "15 New Students registered", time: "2 hours ago" },
    { text: "New Grade 12 Mock Exam scheduled", time: "5 hours ago" },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const [stdRes, teaRes, examRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/directors/students`, { headers }),
        axios.get(`${BACKEND_URL}/directors/teachers`, { headers }),
        axios.get(`${BACKEND_URL}/free-exams/all`, { headers })
      ]);

      const studentCount = (stdRes.data.students || stdRes.data || []).length;
      const teacherCount = (teaRes.data.teachers || teaRes.data || []).length;
      const examList = examRes.data || [];

      setExams(examList);
      const pendingCount = examList.filter((e: any) => 
        e.status === 'pending_approval' || e.start_datetime
      ).length;

      setStats([
        { title: 'Total Students', value: studentCount, icon: <FaUserGraduate /> },
        { title: 'Total Teachers', value: teacherCount, icon: <FaChalkboardTeacher /> },
        { title: 'Scheduled Exams', value: pendingCount, icon: <FaClipboardList /> },
        { title: 'Revenue', value: 45200, icon: <FaMoneyCheck /> },
      ]);
    } catch (err) {
      console.error("Dashboard Load Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (examId: number, action: 'approve' | 'reject') => {
    setActionLoading(examId);
    try {
      setExams(prev => prev.map(e => e.id === examId ? { ...e, status: action === 'approve' ? 'approved' : 'rejected' } : e));
      setSnackbar({ open: true, message: `Exam ${action}d successfully`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `Failed to ${action} exam`, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleExpand = async (examId: number) => {
    if (expandedExamId === examId) return setExpandedExamId(null);
    setExpandedExamId(examId);
    if (!expandedDetails[examId]) {
      try {
        const res = await axios.get(`${BACKEND_URL}/free-exams/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setExpandedDetails(prev => ({ ...prev, [examId]: res.data }));
      } catch (err) { console.error(err); }
    }
  };

  const filteredExams = useMemo(() => {
    if (filter === 'all') return exams;
    if (filter === 'pending') return exams.filter(e => e.status === 'pending_approval' || e.start_datetime);
    return exams.filter(e => e.category === filter);
  }, [exams, filter]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <CircularProgress color="secondary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* 1. Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Director Overview</h1>
        <p className="text-slate-500 font-medium">Real-time statistics and administrative controls.</p>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl shadow-sm border border-white transition-transform hover:scale-105 ${
            i % 2 === 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-800'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`text-3xl ${i % 2 === 0 ? 'text-indigo-200' : 'text-indigo-600'}`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${i % 2 === 0 ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {stat.title}
                </p>
                <p className="text-2xl font-black">
                  {i === 3 ? `${stat.value.toLocaleString()} ETB` : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* 3. Top Teachers */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <FaAward className="text-amber-500 text-2xl" />
            <h2 className="text-xl font-extrabold text-slate-800">Top Performing Faculty</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockTopTeachers.map((teacher, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-indigo-200 transition-all">
                <Avatar src={teacher.img} sx={{ width: 56, height: 56, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                <div>
                  <p className="font-bold text-slate-900">{teacher.name}</p>
                  <p className="text-xs font-semibold text-indigo-600 uppercase">{teacher.subject}</p>
                  <div className="mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md inline-block">
                    {teacher.rating}% SCORE
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Activity Log */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <FaHistory className="text-indigo-600 text-2xl" />
            <h2 className="text-xl font-extrabold text-slate-800">Log</h2>
          </div>
          <div className="space-y-6">
            {mockActivities.map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 h-10 bg-indigo-100 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-slate-700">{act.text}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Exam Table */}
      <Paper elevation={0} sx={{ borderRadius: '2.5rem', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }}>
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <h2 className="text-2xl font-black text-slate-800">Exam Queue</h2>
          <Button 
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => setCategoryAnchor(e.currentTarget)} 
            endIcon={<ExpandMoreIcon />}
            sx={{ borderRadius: '1rem', px: 3, py: 1.5, bgcolor: '#f8fafc', color: '#64748b', fontWeight: 800, '&:hover': { bgcolor: '#f1f5f9' } }}
          >
            {filter.toUpperCase()}
          </Button>
          <Menu anchorEl={categoryAnchor} open={Boolean(categoryAnchor)} onClose={() => setCategoryAnchor(null)}>
            <MenuItem onClick={() => { setFilter('all'); setCategoryAnchor(null); }}>All Exams</MenuItem>
            <MenuItem onClick={() => { setFilter('pending'); setCategoryAnchor(null); }}>Pending Only</MenuItem>
          </Menu>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TRow sx={{ bgcolor: '#f8fafc' }}>
                <TCell />
                <TCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '12px' }}>EXAM INFO</TCell>
                <TCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '12px' }}>SUBJECT</TCell>
                <TCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '12px' }}>STATUS</TCell>
                <TCell sx={{ fontWeight: 800, color: '#64748b', fontSize: '12px' }}>ACTIONS</TCell>
              </TRow>
            </TableHead>
            <TableBody>
              {filteredExams.map((exam) => {
                const isExpanded = expandedExamId === exam.id;
                const isScheduled = !!exam.start_datetime;
                const isApproved = exam.status === 'approved';

                return (
                  <React.Fragment key={exam.id}>
                    <TRow hover sx={{ '& > *': { borderBottom: '1px solid #f1f5f9 !important' } }}>
                      <TCell>
                        <IconButton size="small" onClick={() => handleToggleExpand(exam.id)}>
                          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TCell>
                      <TCell>
                        <p className="font-extrabold text-slate-800">{exam.title}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exam.grade} • {exam.stream}</p>
                      </TCell>
                      <TCell>
                        <Chip label={exam.subject} size="small" sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: '#eef2ff', color: '#4f46e5' }} />
                      </TCell>
                      <TCell>
                        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black ${
                          isScheduled ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {isScheduled ? "SCHEDULED" : (exam.status || 'DRAFT').toUpperCase()}
                        </div>
                      </TCell>
                      <TCell>
                        {!isApproved && (
                          <div className="flex gap-2">
                            <IconButton color="success" onClick={() => handleAction(exam.id, 'approve')} size="small" sx={{ bgcolor: '#f0fdf4' }}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleAction(exam.id, 'reject')} size="small" sx={{ bgcolor: '#fef2f2' }}>
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </div>
                        )}
                      </TCell>
                    </TRow>
                    <TRow>
                      <TCell colSpan={5} sx={{ p: 0, border: 'none' }}>
                        <TCollapse in={isExpanded} timeout="auto" unmountOnExit>
                          <div className="m-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Details</p>
                              <p className="text-sm font-bold text-slate-600">Total Questions: {exam.total_questions}</p>
                              <p className="text-sm font-bold text-slate-600">Category: {exam.category}</p>
                            </div>
                            {isScheduled && (
                              <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Schedule</p>
                                <p className="text-sm font-bold text-slate-600 italic">
                                  {new Date(exam.start_datetime!).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </TCollapse>
                      </TCell>
                    </TRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
      >
        <TAlert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '1rem', fontWeight: 700 }}>
          {snackbar.message}
        </TAlert>
      </Snackbar>
    </div>
  );
};

export default HighSchoolDirectorDashboard;