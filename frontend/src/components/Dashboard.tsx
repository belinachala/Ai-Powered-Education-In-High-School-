import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, BarChart, Users, BookOpen, Settings } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const DashboardNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { to: '/TeacherRoutes', label: 'General' },
    { to: '/university-login', label: 'University Login' },
    { to: '/highschool-login', label: 'High School Login' },
    { to: '/student', label: 'Student Dashboard' },
    { to: '/teacher', label: 'Teacher Dashboard' },
    { to: '/admin', label: 'Head Dashboard' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <header className="bg-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
            EduPlatform
          </Link>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `text-sm lg:text-base transition-colors duration-200 hover:text-cyan-200 ${
                    isActive ? 'text-cyan-100 font-semibold' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            className="md:hidden p-2 rounded-md hover:bg-cyan-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `py-2 px-3 rounded-md transition-colors duration-200 hover:bg-cyan-700 ${
                      isActive ? 'bg-cyan-700 text-cyan-100' : ''
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const Sidebar: React.FC = () => {
  const sidebarItems: NavItem[] = [
    { to: '/dashboard-overview', label: 'Overview', icon: BarChart },
    { to: '/dashboard-users', label: 'Users', icon: Users },
    { to: '/dashboard-courses', label: 'Courses', icon: BookOpen },
    { to: '/dashboard-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4 hidden lg:block">
      <div className="flex flex-col space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            {item.icon && <item.icon className="w-5 h-5" />}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Dashboard Overview
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Total Students: <span className="font-bold">1,234</span>
                </p>
                <p className="text-gray-600">
                  Active Courses: <span className="font-bold">56</span>
                </p>
                <p className="text-gray-600">
                  Teachers: <span className="font-bold">78</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
              <ul className="space-y-2">
                <li className="text-gray-600">New student enrolled in Math 101</li>
                <li className="text-gray-600">Teacher updated course materials</li>
                <li className="text-gray-600">Admin approved new course</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Events</h2>
              <ul className="space-y-2">
                <li className="text-gray-600">Parent-Teacher Meeting: Sept 10</li>
                <li className="text-gray-600">Midterm Exams: Sept 15-20</li>
                <li className="text-gray-600">School Board Review: Sept 25</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;