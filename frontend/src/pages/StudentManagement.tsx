import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type Student = {
  id: string;
  name: string;
  email: string;
  class: string;
  status: 'active' | 'inactive';
  enrolledDate: string;
  lastActivity: string;
  examResults: ExamResult[];
};

type ExamResult = {
  examId: string;
  examName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'passed' | 'failed' | 'pending';
  takenDate: string;
  timeSpent: string;
};

type StudentForm = {
  name: string;
  email: string;
  class: string;
};

const StudentManagement: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentForm>();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Sample data for demonstration
  const sampleStudents: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@student.edu',
      class: '10A',
      status: 'active',
      enrolledDate: '2023-09-01',
      lastActivity: '2023-12-10',
      examResults: [
        {
          examId: '101',
          examName: 'Mathematics Mid-term',
          score: 85,
          totalMarks: 100,
          percentage: 85,
          status: 'passed',
          takenDate: '2023-11-15',
          timeSpent: '45 minutes'
        },
        {
          examId: '102',
          examName: 'Science Quiz',
          score: 72,
          totalMarks: 100,
          percentage: 72,
          status: 'passed',
          takenDate: '2023-12-05',
          timeSpent: '30 minutes'
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      class: '10B',
      status: 'active',
      enrolledDate: '2023-09-01',
      lastActivity: '2023-12-08',
      examResults: [
        {
          examId: '101',
          examName: 'Mathematics Mid-term',
          score: 92,
          totalMarks: 100,
          percentage: 92,
          status: 'passed',
          takenDate: '2023-11-15',
          timeSpent: '55 minutes'
        }
      ]
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      class: '10A',
      status: 'inactive',
      enrolledDate: '2023-09-01',
      lastActivity: '2023-10-20',
      examResults: []
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch students
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        // In a real app: await axios.get('/api/teacher/students')
        await new Promise(resolve => setTimeout(resolve, 800));
        setStudents(sampleStudents);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesClass && matchesStatus && matchesSearch;
  });

  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  const onSubmit = async (data: StudentForm) => {
    setIsAdding(true);
    
    try {
      if (editingStudent) {
        // Update existing student
        const updatedStudent: Student = {
          ...editingStudent,
          name: data.name,
          email: data.email,
          class: data.class
        };
        setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
      } else {
        // Add new student
        const newStudent: Student = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          class: data.class,
          status: 'active',
          enrolledDate: new Date().toISOString().split('T')[0],
          lastActivity: new Date().toISOString().split('T')[0],
          examResults: []
        };
        setStudents([...students, newStudent]);
      }

      reset();
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      console.error('Error saving student:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
    
    // Prepopulate form with student data
    reset({
      name: student.name,
      email: student.email,
      class: student.class
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDeleteStudent'))) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const toggleStatus = (student: Student) => {
    setStudents(students.map(s => 
      s.id === student.id 
        ? {...s, status: s.status === 'active' ? 'inactive' : 'active'} 
        : s
    ));
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    reset();
  };

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('details');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">{t('studentManagement')}</h1>
            <p className="text-indigo-200 mt-2">{t('manageStudentsExams')}</p>
          </div>

          <div className="px-6 py-8">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'students'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('allStudents')}
                </button>
                <button
                  onClick={() => setActiveTab('examResults')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'examResults'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('examResults')}
                </button>
                {selectedStudent && (
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-1 text-sm font-medium border-b-2 ${
                      activeTab === 'details'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t('studentDetails')}
                  </button>
                )}
              </nav>
            </div>

            {/* Student Details View */}
            {activeTab === 'details' && selectedStudent && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">{selectedStudent.name}</h2>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-arrow-left mr-1"></i> {t('backToStudents')}
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('studentInformation')}</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">{t('email')}:</span>
                          <p className="text-gray-900">{selectedStudent.email}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">{t('class')}:</span>
                          <p className="text-gray-900">{selectedStudent.class}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">{t('status')}:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedStudent.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedStudent.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">{t('enrolledDate')}:</span>
                          <p className="text-gray-900">{selectedStudent.enrolledDate}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">{t('lastActivity')}:</span>
                          <p className="text-gray-900">{selectedStudent.lastActivity}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('performanceSummary')}</h3>
                      {selectedStudent.examResults.length > 0 ? (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-900">{t('averageScore')}</h4>
                            <p className="text-2xl font-bold text-indigo-600">
                              {Math.round(selectedStudent.examResults.reduce((sum, result) => sum + result.percentage, 0) / selectedStudent.examResults.length)}%
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-900">{t('examsTaken')}</h4>
                            <p className="text-2xl font-bold text-indigo-600">{selectedStudent.examResults.length}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-900">{t('passRate')}</h4>
                            <p className="text-2xl font-bold text-indigo-600">
                              {Math.round((selectedStudent.examResults.filter(r => r.status === 'passed').length / selectedStudent.examResults.length) * 100)}%
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">{t('noExamsTaken')}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('examResults')}</h3>
                  {selectedStudent.examResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('exam')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('date')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('score')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('timeSpent')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedStudent.examResults.map((result, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {result.examName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.takenDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.score}/{result.totalMarks} ({result.percentage}%)
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  result.status === 'passed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {result.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.timeSpent}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">{t('noExamResults')}</p>
                  )}
                </div>
              </div>
            )}

            {/* All Students View */}
            {activeTab === 'students' && (
              <>
                {/* Filters and Search */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('class')}
                      </label>
                      <select
                        id="class-filter"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="all">{t('allClasses')}</option>
                        {classes.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('status')}
                      </label>
                      <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="all">{t('allStatus')}</option>
                        <option value="active">{t('active')}</option>
                        <option value="inactive">{t('inactive')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('searchStudents')}
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('searchStudentsPlaceholder')}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Add Student Button */}
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mb-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    {t('addStudent')}
                  </button>
                )}

                {/* Student Form */}
                {showForm && (
                  <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingStudent ? t('editStudent') : t('addNewStudent')}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('fullName')} *
                          </label>
                          <input
                            id="name"
                            {...register('name', { required: t('nameRequired') })}
                            className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('enterStudentName')}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('email')} *
                          </label>
                          <input
                            id="email"
                            type="email"
                            {...register('email', { 
                              required: t('emailRequired'),
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t('invalidEmailAddress')
                              }
                            })}
                            className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('enterStudentEmail')}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('class')} *
                        </label>
                        <input
                          id="class"
                          {...register('class', { required: t('classRequired') })}
                          className={`block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.class ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('enterClass')}
                        />
                        {errors.class && (
                          <p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={cancelForm}
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {t('cancel')}
                        </button>
                        <button
                          type="submit"
                          disabled={isAdding}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {isAdding ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              {editingStudent ? t('updating') : t('adding')}
                            </>
                          ) : (
                            editingStudent ? t('updateStudent') : t('addStudent')
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Students List */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t('students')} ({filteredStudents.length})</h2>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <i className="fas fa-users text-gray-400 text-4xl mb-3"></i>
                      <p className="text-gray-500">{t('noStudentsFound')}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('name')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('email')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('class')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('lastActivity')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('actions')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <span className="text-indigo-800 font-medium">
                                        {student.name.charAt(0)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
                                         onClick={() => viewStudentDetails(student)}>
                                      {student.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.class}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  student.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.lastActivity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => viewStudentDetails(student)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    aria-label={t('viewDetails')}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    onClick={() => handleEdit(student)}
                                    className="text-blue-600 hover:text-blue-900"
                                    aria-label={t('edit')}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() => toggleStatus(student)}
                                    className={student.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                                    aria-label={student.status === 'active' ? t('deactivate') : t('activate')}
                                  >
                                    <i className={student.status === 'active' ? 'fas fa-user-slash' : 'fas fa-user-check'}></i>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(student.id)}
                                    className="text-red-600 hover:text-red-900"
                                    aria-label={t('delete')}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Exam Results View */}
            {activeTab === 'examResults' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">{t('examResults')}</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-500">{t('examResultsDescription')}</p>
                  {/* Exam results summary and charts would go here */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;