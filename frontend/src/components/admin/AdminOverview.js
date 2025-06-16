import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon,
  DocumentIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    averageScore: 0,
    certificatesIssued: 0
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/students`);
      const studentsData = response.data;
      setStudents(studentsData);

      // Calculate statistics
      const totalStudents = studentsData.length;
      const activeStudents = studentsData.filter(s => s.finance_record?.is_cleared).length;
      const totalRevenue = studentsData.reduce((sum, s) => sum + (s.finance_record?.paid_amount || 0), 0);
      const pendingPayments = studentsData.reduce((sum, s) => sum + (s.finance_record?.balance || 0), 0);
      const certificatesIssued = studentsData.filter(s => s.has_certificate && s.can_download_certificate).length;
      
      const scoresArray = studentsData
        .map(s => s.average_score)
        .filter(score => score !== null && score !== undefined);
      const averageScore = scoresArray.length > 0 ? 
        scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length : 0;

      setStats({
        totalStudents,
        activeStudents,
        totalRevenue,
        pendingPayments,
        averageScore,
        certificatesIssued
      });
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Students', 
      value: stats.activeStudents,
      icon: AcademicCapIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Pending Payments',
      value: `KSh ${stats.pendingPayments.toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'bg-red-500'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore.toFixed(1)}%`,
      icon: TrophyIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Certificates Issued',
      value: stats.certificatesIssued,
      icon: DocumentIcon,
      color: 'bg-indigo-500'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Welcome to TWOEM Admin Dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Students */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Students
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.slice(0, 5).map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.average_score && student.average_score >= 60 
                          ? 'bg-green-100 text-green-800'
                          : student.average_score 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.average_score ? `${student.average_score.toFixed(1)}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.finance_record?.is_cleared
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.finance_record?.is_cleared ? 'Cleared' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.can_download_certificate
                          ? 'bg-green-100 text-green-800'
                          : student.has_certificate
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.can_download_certificate 
                          ? 'Available' 
                          : student.has_certificate 
                            ? 'Pending' 
                            : 'None'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {students.length === 0 && (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No students found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;