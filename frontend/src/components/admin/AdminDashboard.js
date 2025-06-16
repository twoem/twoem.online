import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon,
  DocumentIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import AdminOverview from './AdminOverview';
import StudentManagement from './StudentManagement';
import AcademicManagement from './AcademicManagement';
import FinanceManagement from './FinanceManagement';
import CertificateManagement from './CertificateManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: HomeIcon, current: location.pathname === '/admin' },
    { name: 'Students', href: '/admin/students', icon: UserGroupIcon, current: location.pathname === '/admin/students' },
    { name: 'Academics', href: '/admin/academics', icon: AcademicCapIcon, current: location.pathname === '/admin/academics' },
    { name: 'Finance', href: '/admin/finance', icon: CurrencyDollarIcon, current: location.pathname === '/admin/finance' },
    { name: 'Certificates', href: '/admin/certificates', icon: DocumentIcon, current: location.pathname === '/admin/certificates' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
          <img 
            src="/images/twoem.jpg" 
            alt="TWOEM Logo" 
            className="h-8 w-8 rounded-full mr-3"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=32&h=32&fit=crop&crop=center';
            }}
          />
          <h2 className="text-white text-lg font-semibold">TWOEM Admin</h2>
        </div>

        <nav className="mt-8">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="px-2 mt-8">
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.current)?.name || 'Admin Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user?.username}</span>
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-8">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="academics" element={<AcademicManagement />} />
            <Route path="finance" element={<FinanceManagement />} />
            <Route path="certificates" element={<CertificateManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;