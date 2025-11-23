import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Static data for frontend development
  const staticData = { 
    exams: 5, 
    questions: 42, 
    students: 28, 
    accounts: 3,
    recentActivity: [
      { id: 1, icon: 'fas fa-file-alt', color: 'blue', title: 'New Exam Created', description: 'Mid-term Mathematics exam', time: '2 hours ago' },
      { id: 2, icon: 'fas fa-user-check', color: 'green', title: 'Student Submitted', description: 'John Doe submitted assignment', time: '5 hours ago' },
      { id: 3, icon: 'fas fa-question-circle', color: 'yellow', title: 'New Questions Added', description: '10 questions added to bank', time: '1 day ago' },
      { id: 4, icon: 'fas fa-chart-line', color: 'purple', title: 'Results Published', description: 'Class 10A results published', time: '2 days ago' }
    ],
    upcomingExams: [
      { id: 1, title: 'Mathematics Final', class: 'Class 10A', date: 'Dec 15, 2023', status: 'published' },
      { id: 2, title: 'Science Quiz', class: 'Class 9B', date: 'Dec 18, 2023', status: 'draft' },
      { id: 3, title: 'History Mid-term', class: 'Class 11C', date: 'Dec 20, 2023', status: 'published' }
    ]
  };

  const handleAddExam = () => console.log('Navigate to exam creation');
  const handleAddQuestion = () => console.log('Navigate to question bank');
  const handleViewReports = () => console.log('Navigate to reports');
  const handleSettings = () => console.log('Navigate to settings');

  // Navigation tabs
  const tabs = [
    { id: 'overview', label: 'overview', icon: 'fas fa-tachometer-alt' },
    { id: 'exams', label: 'exams', icon: 'fas fa-file-alt' },
    { id: 'students', label: 'students', icon: 'fas fa-users' },
    { id: 'analytics', label: 'analytics', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'settings', icon: 'fas fa-cog' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('teacherDashboard')}</h1>
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <i className="fas fa-bell text-gray-600 text-xl"></i>
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="h-10 w-10 rounded-full"
              />
              <span className="ml-2 text-gray-700">Dr. Smith</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 border-b-2'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {t(tab.label)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('overview')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardTile title="allExaminee" count={staticData.students} color="blue" icon="fas fa-users" />
            <DashboardTile title="exams" count={staticData.exams} color="green" icon="fas fa-file-alt" onAdd={handleAddExam} />
            <DashboardTile title="questions" count={staticData.questions} color="yellow" icon="fas fa-question-circle" onAdd={handleAddQuestion} />
            <DashboardTile title="totalAccounts" count={staticData.accounts} color="red" icon="fas fa-user-graduate" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t('recentActivity')}</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  {t('viewAll')} <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {staticData.recentActivity.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-${activity.color}-100`}>
                            <i className={`${activity.icon} text-${activity.color}-500`}></i>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                          {activity.time}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Exams and Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t('upcomingExams')}</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  {t('viewAll')} <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {staticData.upcomingExams.map((exam) => (
                    <li key={exam.id} className="py-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100">
                            <i className="fas fa-file-alt text-blue-500"></i>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {exam.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {exam.class} • {exam.date}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            exam.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {exam.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('quickActions')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleAddExam}
                  className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  aria-label="Create Exam"
                >
                  <i className="fas fa-plus-circle text-indigo-600 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-indigo-700">{t('createExam')}</span>
                </button>
                <button 
                  onClick={handleAddQuestion}
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  aria-label="Add Question"
                >
                  <i className="fas fa-question-circle text-green-600 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-green-700">{t('addQuestion')}</span>
                </button>
                <button 
                  onClick={handleViewReports}
                  className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  aria-label="View Reports"
                >
                  <i className="fas fa-chart-bar text-yellow-600 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-yellow-700">{t('viewReports')}</span>
                </button>
                <button 
                  onClick={handleSettings}
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  aria-label="Settings"
                >
                  <i className="fas fa-cog text-purple-600 text-2xl mb-2"></i>
                  <span className="text-sm font-medium text-purple-700">{t('settings')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardTile: React.FC<{
  title: string;
  count: number;
  color: string;
  icon: string;
  onAdd?: () => void;
}> = ({ title, count, color, icon, onAdd }) => {
  const { t } = useTranslation();
  
  // Map color to Tailwind classes
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  const bgColor = colorClasses[color as keyof typeof colorClasses] || 'bg-gray-500';
  
  return (
    <div className={`${bgColor} text-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-48 hover:shadow-xl transition duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-bold">{count}</div>
          <div className="text-xl font-semibold mt-2">{t(title)}</div>
        </div>
        <div className="text-4xl opacity-80">
          <i className={icon}></i>
        </div>
      </div>
      {onAdd && (
        <button 
          onClick={onAdd} 
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg mt-4 transition duration-200 flex items-center justify-center"
          aria-label={`Add ${title}`}
        >
          <i className="fas fa-plus mr-2"></i>
          {t('add')}
        </button>
      )}
    </div>
  );
};

export default TeacherDashboard;