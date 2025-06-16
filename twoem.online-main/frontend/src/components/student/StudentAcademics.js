import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const StudentAcademics = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/student/profile`);
      setStudent(response.data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'bg-gray-200 text-gray-700';
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getGrade = (score) => {
    if (score === null || score === undefined) return 'N/A';
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const subjects = [
    { key: 'ms_word', name: 'Microsoft Word', icon: '📝' },
    { key: 'ms_excel', name: 'Microsoft Excel', icon: '📊' },
    { key: 'ms_powerpoint', name: 'Microsoft PowerPoint', icon: '📽️' },
    { key: 'ms_access', name: 'Microsoft Access', icon: '🗄️' },
    { key: 'computer_intro', name: 'Computer Introduction', icon: '💻' }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No academic records found</h3>
      </div>
    );
  }

  const academicRecord = student.academic_record || {};

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Academic Performance</h2>
          <p className="text-gray-600 mt-2">Track your progress in Microsoft Office applications and computer fundamentals</p>
        </div>

        {/* Overall Performance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg text-white p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
              <div className="text-3xl font-bold">
                {student.average_score ? `${student.average_score.toFixed(1)}%` : 'No scores yet'}
              </div>
              <div className="text-sm opacity-90 mt-1">
                Grade: {student.average_score ? getGrade(student.average_score) : 'N/A'}
              </div>
            </div>
            <div className="text-right">
              <TrophyIcon className="h-16 w-16 opacity-80" />
              <div className="text-sm mt-2">
                {student.average_score && student.average_score >= 60 ? 'Certificate Eligible' : 'Keep improving!'}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const score = academicRecord[subject.key];
            const hasScore = score !== null && score !== undefined;
            
            return (
              <div key={subject.key} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`border-l-4 p-6 ${getScoreColor(score).replace('bg-', 'border-').split(' ')[0]}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl">{subject.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(score)}`}>
                      {hasScore ? `${score}%` : 'No Score'}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium">{hasScore ? `${score}/100` : 'Not graded'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium">{getGrade(score)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            score >= 80 ? 'bg-green-500' : 
                            score >= 60 ? 'bg-yellow-500' : 
                            hasScore ? 'bg-red-500' : 'bg-gray-400'
                          }`}
                          style={{ width: hasScore ? `${score}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Additional Summary Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-l-4 border-blue-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">📋</div>
                <AcademicCapIcon className="h-8 w-8 text-blue-500" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-4">Academic Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subjects Completed:</span>
                  <span className="font-medium">
                    {subjects.filter(s => academicRecord[s.key] !== null && academicRecord[s.key] !== undefined).length} / {subjects.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest Score:</span>
                  <span className="font-medium">
                    {Math.max(...subjects.map(s => academicRecord[s.key] || 0))}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate Status:</span>
                  <span className={`font-medium ${
                    student.average_score && student.average_score >= 60 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {student.average_score && student.average_score >= 60 ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Certificate Requirements</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Maintain an average score of 60% or above across all subjects</p>
            <p>• Clear all outstanding fees</p>
            <p>• Complete all required coursework</p>
          </div>
          
          {student.average_score && student.average_score >= 60 ? (
            <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded text-green-800">
              🎉 Congratulations! You meet the academic requirements for certification.
            </div>
          ) : (
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded text-yellow-800">
              📚 Keep studying! You need an average of 60% to qualify for your certificate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAcademics;