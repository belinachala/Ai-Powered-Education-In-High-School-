import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter
} from 'recharts';

// Define TypeScript interfaces for our data
interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  className: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  timeSpent: number; // in minutes
  submittedAt: string;
  status: 'pass' | 'fail';
}

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
}

interface ClassStats {
  className: string;
  totalStudents: number;
  averageScore: number;
  passRate: number;
  topPerformer: string;
  topScore: number;
}

interface AnalyticsData {
  examResults: ExamResult[];
  students: Student[];
  classStats: ClassStats[];
  overallStats: {
    totalExams: number;
    averageScore: number;
    passRate: number;
    totalStudents: number;
  };
}

const ResultsAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'exams'>('overview');

  // Sample data for demonstration (would come from API in real app)
  const sampleData: AnalyticsData = {
    examResults: [
      { id: '1', examId: '101', examName: 'Mathematics Mid-term', studentId: 's1', studentName: 'John Doe', className: '10A', score: 85, totalMarks: 100, percentage: 85, grade: 'A', timeSpent: 45, submittedAt: '2023-11-15', status: 'pass' },
      { id: '2', examId: '101', examName: 'Mathematics Mid-term', studentId: 's2', studentName: 'Jane Smith', className: '10A', score: 92, totalMarks: 100, percentage: 92, grade: 'A+', timeSpent: 55, submittedAt: '2023-11-15', status: 'pass' },
      { id: '3', examId: '101', examName: 'Mathematics Mid-term', studentId: 's3', studentName: 'Mike Johnson', className: '10A', score: 68, totalMarks: 100, percentage: 68, grade: 'C', timeSpent: 40, submittedAt: '2023-11-15', status: 'pass' },
      { id: '4', examId: '101', examName: 'Mathematics Mid-term', studentId: 's4', studentName: 'Sarah Wilson', className: '10A', score: 42, totalMarks: 100, percentage: 42, grade: 'F', timeSpent: 35, submittedAt: '2023-11-15', status: 'fail' },
      { id: '5', examId: '102', examName: 'Science Quiz', studentId: 's1', studentName: 'John Doe', className: '10A', score: 78, totalMarks: 100, percentage: 78, grade: 'B', timeSpent: 30, submittedAt: '2023-12-05', status: 'pass' },
      { id: '6', examId: '102', examName: 'Science Quiz', studentId: 's2', studentName: 'Jane Smith', className: '10A', score: 88, totalMarks: 100, percentage: 88, grade: 'A', timeSpent: 35, submittedAt: '2023-12-05', status: 'pass' },
      { id: '7', examId: '103', examName: 'History Final', studentId: 's1', studentName: 'John Doe', className: '10A', score: 91, totalMarks: 100, percentage: 91, grade: 'A+', timeSpent: 50, submittedAt: '2023-12-12', status: 'pass' },
      { id: '8', examId: '103', examName: 'History Final', studentId: 's2', studentName: 'Jane Smith', className: '10A', score: 84, totalMarks: 100, percentage: 84, grade: 'A', timeSpent: 48, submittedAt: '2023-12-12', status: 'pass' },
      { id: '9', examId: '103', examName: 'History Final', studentId: 's3', studentName: 'Mike Johnson', className: '10A', score: 72, totalMarks: 100, percentage: 72, grade: 'B', timeSpent: 42, submittedAt: '2023-12-12', status: 'pass' },
    ],
    students: [
      { id: 's1', name: 'John Doe', email: 'john@example.com', className: '10A' },
      { id: 's2', name: 'Jane Smith', email: 'jane@example.com', className: '10A' },
      { id: 's3', name: 'Mike Johnson', email: 'mike@example.com', className: '10A' },
      { id: 's4', name: 'Sarah Wilson', email: 'sarah@example.com', className: '10A' },
    ],
    classStats: [
      { className: '10A', totalStudents: 4, averageScore: 77.4, passRate: 87.5, topPerformer: 'Jane Smith', topScore: 92 },
      { className: '10B', totalStudents: 5, averageScore: 72.1, passRate: 80.0, topPerformer: 'David Brown', topScore: 89 },
      { className: '11A', totalStudents: 6, averageScore: 81.6, passRate: 91.7, topPerformer: 'Emily Chen', topScore: 95 },
    ],
    overallStats: {
      totalExams: 9,
      averageScore: 77.4,
      passRate: 88.9,
      totalStudents: 15
    }
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const STATUS_COLORS = { pass: '#00C49F', fail: '#FF8042' };

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // In a real app: await axios.get('/api/teacher/analytics', { params: { timeRange } })
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(sampleData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Prepare data for charts
  const classPerformanceData = data?.classStats.map(cls => ({
    name: cls.className,
    average: cls.averageScore,
    passRate: cls.passRate,
    students: cls.totalStudents
  })) || [];

  const examPerformanceData = data?.examResults.reduce((acc: any[], result) => {
    const existingExam = acc.find(item => item.name === result.examName);
    if (existingExam) {
      existingExam.scores.push(result.percentage);
      existingExam.avg = (existingExam.avg * (existingExam.count) + result.percentage) / (existingExam.count + 1);
      existingExam.count += 1;
    } else {
      acc.push({
        name: result.examName,
        scores: [result.percentage],
        avg: result.percentage,
        count: 1
      });
    }
    return acc;
  }, []) || [];

  const studentPerformanceData = data?.students.map(student => {
    const studentResults = data.examResults.filter(r => r.studentId === student.id);
    const avgScore = studentResults.length > 0 
      ? studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length 
      : 0;
    
    return {
      name: student.name,
      score: avgScore,
      exams: studentResults.length,
      bestScore: studentResults.length > 0 ? Math.max(...studentResults.map(r => r.percentage)) : 0
    };
  }) || [];

  const passFailData = [
    { name: 'Pass', value: data?.examResults.filter(r => r.status === 'pass').length || 0 },
    { name: 'Fail', value: data?.examResults.filter(r => r.status === 'fail').length || 0 }
  ];

  const timeSpentData = data?.examResults.map(result => ({
    name: result.studentName,
    time: result.timeSpent,
    score: result.percentage
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">{t('resultsAnalytics')}</h1>
            <p className="text-indigo-200 mt-2">{t('analyzeStudentPerformance')}</p>
          </div>

          <div className="px-6 py-8">
            {/* Filters and Controls */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('timeRange')}
                  </label>
                  <select
                    id="timeRange"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="week">{t('lastWeek')}</option>
                    <option value="month">{t('lastMonth')}</option>
                    <option value="semester">{t('thisSemester')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('class')}
                  </label>
                  <select
                    id="classFilter"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">{t('allClasses')}</option>
                    {data?.classStats.map(cls => (
                      <option key={cls.className} value={cls.className}>{cls.className}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="viewType" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('view')}
                  </label>
                  <select
                    id="viewType"
                    value={selectedView}
                    onChange={(e) => setSelectedView(e.target.value as any)}
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="overview">{t('overview')}</option>
                    <option value="students">{t('byStudent')}</option>
                    <option value="exams">{t('byExam')}</option>
                  </select>
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-chart-line text-indigo-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-900">
                      {t('overallAverage')}: <span className="font-bold">{data?.overallStats.averageScore.toFixed(1)}%</span>
                    </p>
                    <p className="text-xs text-indigo-700">
                      {t('passRate')}: {data?.overallStats.passRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Dashboard */}
            {selectedView === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                        <i className="fas fa-user-graduate text-blue-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{t('totalStudents')}</p>
                        <p className="text-2xl font-bold text-gray-900">{data?.overallStats.totalStudents}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                        <i className="fas fa-check-circle text-green-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{t('passRate')}</p>
                        <p className="text-2xl font-bold text-gray-900">{data?.overallStats.passRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                        <i className="fas fa-chart-bar text-purple-600 text-xl"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{t('averageScore')}</p>
                        <p className="text-2xl font-bold text-gray-900">{data?.overallStats.averageScore.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Class Performance Comparison */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('classPerformance')}</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, t('averageScore')]} />
                          <Legend />
                          <Bar dataKey="average" name={t('averageScore')} fill="#8884d8" />
                          <Bar dataKey="passRate" name={t('passRate')} fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pass/Fail Distribution */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('passFailDistribution')}</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={passFailData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {passFailData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name === 'Pass' ? STATUS_COLORS.pass : STATUS_COLORS.fail} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Exam Performance Trends */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('examPerformance')}</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={examPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, t('averageScore')]} />
                          <Legend />
                          <Line type="monotone" dataKey="avg" name={t('averageScore')} stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Time Spent vs Score Correlation */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('timeVsScore')}</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={timeSpentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'score') return [`${value}%`, t('score')];
                            return [`${value} min`, t('timeSpent')];
                          }} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="time" name={t('timeSpent')} fill="#413ea0" />
                          <Line yAxisId="right" type="monotone" dataKey="score" name={t('score')} stroke="#ff7300" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student Performance View */}
            {selectedView === 'students' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('studentPerformance')}</h2>
                
                {/* Student Performance Radar Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('studentComparison')}</h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={studentPerformanceData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis />
                        <Radar name={t('performance')} dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip formatter={(value) => [`${value}%`, t('averageScore')]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Student Performance Table */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('detailedPerformance')}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('student')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('examsTaken')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('averageScore')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('bestScore')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('performance')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentPerformanceData.map((student) => (
                          <tr key={student.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.exams}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.score.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.bestScore.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-indigo-600 h-2.5 rounded-full" 
                                  style={{ width: `${student.score}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Exam Performance View */}
            {selectedView === 'exams' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('examPerformance')}</h2>
                
                {/* Exam Performance Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('examScoreDistribution')}</h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={examPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, t('averageScore')]} />
                        <Legend />
                        <Bar dataKey="avg" name={t('averageScore')} fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Exam Results Table */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('examResults')}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('exam')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('participants')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('averageScore')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('highestScore')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('lowestScore')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {examPerformanceData.map((exam) => (
                          <tr key={exam.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {exam.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exam.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exam.avg.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.max(...exam.scores).toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.min(...exam.scores).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Export Options */}
            <div className="mt-8 flex justify-end">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                {t('exportReport')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalytics;