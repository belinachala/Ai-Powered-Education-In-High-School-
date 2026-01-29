import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Divider,
  alpha,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

/* ================= TYPES ================= */
interface FreeExamListItem {
  id: number;
  title?: string;
  exam_type?: string;
  grade?: string;
  stream?: string;
  subject?: string;
  duration_minutes?: number;
  total_questions?: number;
  category?: string;
  status?: string;
  created_at?: string;
  created_by?: number;
}

interface Question {
  id: number;
  type: string;
  text?: string;
  answer?: string;
  position: number;
  mcq_options?: Array<{ key: string; text: string }>;
  matching_pairs?: Array<{ left_text: string; right_text: string }>;
}

interface ExamDetail extends FreeExamListItem {
  questions?: Question[];
  start_datetime?: string | null;
}

/* ================= CONFIG ================= */
const API_BASE = 'http://localhost:8000';

/* ================= FILTER TYPE ================= */
type FilterType =
  | 'all'
  | 'free'
  | 'paid'
  | 'g9'
  | 'g10'
  | 'g11_n'
  | 'g11_s'
  | 'g12_n'
  | 'g12_s'
  | 'ent_n'
  | 'ent_s'
  | 'rem_n'
  | 'rem_s';

/* ================= COMPONENT ================= */
const HighSchoolDirectorExamManagement: React.FC = () => {
  const [exams, setExams] = useState<FreeExamListItem[]>([]);
  const [expandedExamId, setExpandedExamId] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<number, ExamDetail>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [filter, setFilter] = useState<FilterType>('all');

  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [g11Anchor, setG11Anchor] = useState<null | HTMLElement>(null);
  const [g12Anchor, setG12Anchor] = useState<null | HTMLElement>(null);
  const [entAnchor, setEntAnchor] = useState<null | HTMLElement>(null);
  const [remAnchor, setRemAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/free-exams/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        setExams(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleAction = async (examId: number, action: 'approve' | 'reject') => {
    setActionLoading(examId);
    try {
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      await axios.post(
        `${API_BASE}/free-exams/${examId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
      );

      setExams((prev) =>
        prev.map((e) =>
          e.id === examId ? { ...e, status: action === 'approve' ? 'approved' : 'rejected' } : e
        )
      );

      setSnackbar({
        open: true,
        message: `Exam ${action}d successfully`,
        severity: 'success',
      });
    } catch (err: any) {
      const msg = err.response?.data?.detail || `Failed to ${action} exam`;
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleExpand = async (examId: number) => {
    if (expandedExamId === examId) {
      setExpandedExamId(null);
      return;
    }
    setExpandedExamId(examId);

    if (expandedDetails[examId]) return;

    try {
      const res = await axios.get(`${API_BASE}/free-exams/${examId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      setExpandedDetails((prev) => ({ ...prev, [examId]: res.data }));
    } catch (err) {
      console.error('Failed to load details', err);
    }
  };

  const getStatusChip = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return <Chip label="APPROVED" color="success" size="small" />;
    if (s === 'pending_approval') return <Chip label="PENDING" color="warning" size="small" />;
    if (s === 'rejected') return <Chip label="REJECTED" color="error" size="small" />;
    if (s === 'draft') return <Chip label="DRAFT" size="small" />;
    return <Chip label={s.toUpperCase() || 'UNKNOWN'} size="small" />;
  };

  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      const grade = (exam.grade || '').toLowerCase().trim();
      const stream = (exam.stream || '').toLowerCase().trim();
      const cat = (exam.category || 'free').toLowerCase().trim();

      switch (filter) {
        case 'free': return cat === 'free';
        case 'paid': return cat === 'paid';
        case 'g9': return grade === '9';
        case 'g10': return grade === '10';
        case 'g11_n': return grade === '11' && stream === 'natural';
        case 'g11_s': return grade === '11' && stream === 'social';
        case 'g12_n': return grade === '12' && stream === 'natural';
        case 'g12_s': return grade === '12' && stream === 'social';
        case 'ent_n': return grade === 'entrance' && stream === 'natural';
        case 'ent_s': return grade === 'entrance' && stream === 'social';
        case 'rem_n': return grade === 'remedial' && stream === 'natural';
        case 'rem_s': return grade === 'remedial' && stream === 'social';
        default: return true;
      }
    });
  }, [exams, filter]);

  const handleCategoryClick = (e: React.MouseEvent<HTMLElement>) => setCategoryAnchor(e.currentTarget);
  const handleCategoryClose = (newFilter?: FilterType) => {
    setCategoryAnchor(null);
    if (newFilter) setFilter(newFilter);
  };

  const handleGradeClick = (newFilter: FilterType) => setFilter(newFilter);

  const getButtonSx = (isActive: boolean) => ({
    mx: 0.25,
    px: 1.5,
    py: 0.5,
    minWidth: 'auto',
    fontSize: '0.85rem',
    borderRadius: 1.5,
    textTransform: 'none',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? 'primary.main' : 'text.primary',
    backgroundColor: isActive ? alpha('#1976d2', 0.08) : 'transparent',
    '&:hover': { backgroundColor: alpha('#1976d2', 0.12) },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  const activeCategory = filter === 'all' ? 'All' : filter === 'free' ? 'Free' : filter === 'paid' ? 'Paid' : 'Custom';

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Exam Management – Director
      </Typography>

      {/* Compact horizontal menu */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            flexWrap: 'wrap',
            gap: 0.75,
            bgcolor: 'background.paper',
          }}
        >
          <Button
            onClick={handleCategoryClick}
            endIcon={<ExpandMoreIcon fontSize="small" />}
            sx={getButtonSx(['all', 'free', 'paid'].includes(filter))}
          >
            {activeCategory}
          </Button>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.75, height: 24 }} />

          <Button onClick={() => handleGradeClick('g9')} sx={getButtonSx(filter === 'g9')}>G9</Button>
          <Button onClick={() => handleGradeClick('g10')} sx={getButtonSx(filter === 'g10')}>G10</Button>

          <Button
            onClick={(e) => setG11Anchor(e.currentTarget)}
            endIcon={<ExpandMoreIcon fontSize="small" />}
            sx={getButtonSx(filter.startsWith('g11_'))}
          >
            G11
          </Button>

          <Button
            onClick={(e) => setG12Anchor(e.currentTarget)}
            endIcon={<ExpandMoreIcon fontSize="small" />}
            sx={getButtonSx(filter.startsWith('g12_'))}
          >
            G12
          </Button>

          <Button
            onClick={(e) => setEntAnchor(e.currentTarget)}
            endIcon={<ExpandMoreIcon fontSize="small" />}
            sx={getButtonSx(filter.startsWith('ent_'))}
          >
            Ent
          </Button>

          <Button
            onClick={(e) => setRemAnchor(e.currentTarget)}
            endIcon={<ExpandMoreIcon fontSize="small" />}
            sx={getButtonSx(filter.startsWith('rem_'))}
          >
            Rem
          </Button>
        </Box>
      </Paper>

      {/* Dropdown menus */}
      <Menu anchorEl={categoryAnchor} open={Boolean(categoryAnchor)} onClose={() => setCategoryAnchor(null)}>
        <MenuItem onClick={() => handleCategoryClose('all')} selected={filter === 'all'}>All</MenuItem>
        <MenuItem onClick={() => handleCategoryClose('free')} selected={filter === 'free'}>Free</MenuItem>
        <MenuItem onClick={() => handleCategoryClose('paid')} selected={filter === 'paid'}>Paid</MenuItem>
      </Menu>

      <Menu anchorEl={g11Anchor} open={Boolean(g11Anchor)} onClose={() => setG11Anchor(null)}>
        <MenuItem onClick={() => { setG11Anchor(null); handleGradeClick('g11_n'); }}>Natural</MenuItem>
        <MenuItem onClick={() => { setG11Anchor(null); handleGradeClick('g11_s'); }}>Social</MenuItem>
      </Menu>

      <Menu anchorEl={g12Anchor} open={Boolean(g12Anchor)} onClose={() => setG12Anchor(null)}>
        <MenuItem onClick={() => { setG12Anchor(null); handleGradeClick('g12_n'); }}>Natural</MenuItem>
        <MenuItem onClick={() => { setG12Anchor(null); handleGradeClick('g12_s'); }}>Social</MenuItem>
      </Menu>

      <Menu anchorEl={entAnchor} open={Boolean(entAnchor)} onClose={() => setEntAnchor(null)}>
        <MenuItem onClick={() => { setEntAnchor(null); handleGradeClick('ent_n'); }}>Natural</MenuItem>
        <MenuItem onClick={() => { setEntAnchor(null); handleGradeClick('ent_s'); }}>Social</MenuItem>
      </Menu>

      <Menu anchorEl={remAnchor} open={Boolean(remAnchor)} onClose={() => setRemAnchor(null)}>
        <MenuItem onClick={() => { setRemAnchor(null); handleGradeClick('rem_n'); }}>Natural</MenuItem>
        <MenuItem onClick={() => { setRemAnchor(null); handleGradeClick('rem_s'); }}>Social</MenuItem>
      </Menu>

      {/* Compact table */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.dark' }}>
              <TableCell padding="checkbox" width={36} />
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Subj</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Grade</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Cat</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>#</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Action</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.82rem' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No exams found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredExams.map((exam) => {
                const isExpanded = expandedExamId === exam.id;
                const detail = expandedDetails[exam.id];
                const isPending = exam.status?.toLowerCase() === 'pending_approval';
                const isActionLoading = actionLoading === exam.id;

                return (
                  <React.Fragment key={exam.id}>
                    <TableRow hover sx={{ '& td': { py: 0.75 } }}>
                      <TableCell padding="checkbox">
                        <IconButton size="small" onClick={() => handleToggleExpand(exam.id)}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 160 }}>
                        <Tooltip title={exam.title || ''}>
                          <Typography
                            variant="body2"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.25,
                              fontSize: '0.84rem',
                            }}
                          >
                            {exam.title || '—'}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.84rem' }}>{exam.subject || '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.84rem' }}>
                        {exam.grade || '—'}
                        {exam.stream ? ` ${exam.stream[0]?.toUpperCase() || ''}` : ''}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={(exam.category || 'free').toUpperCase()}
                          size="small"
                          sx={{ fontSize: '0.68rem' }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.84rem' }}>
                        {exam.total_questions ?? 0}
                      </TableCell>
                      <TableCell>{getStatusChip(exam.status)}</TableCell>

                      <TableCell>
                        {isPending && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              sx={{ minWidth: 28, px: 1, py: 0.25, fontSize: '0.7rem' }}
                              startIcon={isActionLoading ? <CircularProgress size={14} /> : <CheckCircleIcon fontSize="small" />}
                              disabled={isActionLoading}
                              onClick={() => handleAction(exam.id, 'approve')}
                            >
                              OK
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{ minWidth: 28, px: 1, py: 0.25, fontSize: '0.7rem' }}
                              startIcon={isActionLoading ? <CircularProgress size={14} /> : <CancelIcon fontSize="small" />}
                              disabled={isActionLoading}
                              onClick={() => handleAction(exam.id, 'reject')}
                            >
                              No
                            </Button>
                          </Box>
                        )}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {exam.created_at
                          ? new Date(exam.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit',
                            })
                          : '—'}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={9} sx={{ p: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ m: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2, maxWidth: '100%' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Questions ({detail?.questions?.length || 0})
                            </Typography>
                            {detail?.questions?.length ? (
                              detail.questions.map((q) => (
                                <Paper key={q.id} variant="outlined" sx={{ p: 1.5, mb: 1.5, fontSize: '0.88rem' }}>
                                  <Typography variant="body2" fontWeight={500}>
                                    Q{q.position + 1}. {q.text || '(No text)'}
                                  </Typography>
                                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label={q.type} size="small" sx={{ fontSize: '0.7rem' }} />
                                    {q.answer && <Chip label={`Ans: ${q.answer}`} size="small" color="success" sx={{ fontSize: '0.7rem' }} />}
                                  </Box>
                                </Paper>
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                {expandedDetails[exam.id] ? 'No questions' : 'Loading...'}
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default HighSchoolDirectorExamManagement;