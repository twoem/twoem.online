import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const AcademicManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [academicData, setAcademicData] = useState({
    ms_word: '',
    ms_excel: '',
    ms_powerpoint: '',
    ms_access: '',
    computer_intro: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditScores = (student) => {
    setSelectedStudent(student);
    setAcademicData({
      ms_word: student.academic_record?.ms_word || '',
      ms_excel: student.academic_record?.ms_excel || '',
      ms_powerpoint: student.academic_record?.ms_powerpoint || '',
      ms_access: student.academic_record?.ms_access || '',
      computer_intro: student.academic_record?.computer_intro || ''
    });
    setShowEditModal(true);
  };

  const handleSaveScores = async (e) => {
    e.preventDefault();
    try {
      // Convert empty strings to null and ensure valid range
      const scoreData = {};
      Object.keys(academicData).forEach(key => {
        const value = academicData[key];
        if (value === '' || value === null) {
          scoreData[key] = null;
        } else {
          const numValue = parseInt(value);
          if (numValue >= 0 && numValue <= 100) {
            scoreData[key] = numValue;
          }
        }
      });

      await axios.put(`${API_BASE}/admin/students/${selectedStudent.id}/academic`, scoreData);
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error updating academic record:', error);
      alert('Error updating academic record');
    }
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Academic Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage student academic records and scores
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MS Word
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MS Excel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MS PowerPoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MS Access
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Computer Intro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{student.username}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(student.academic_record?.ms_word)}`}>
                          {student.academic_record?.ms_word ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(student.academic_record?.ms_excel)}`}>
                          {student.academic_record?.ms_excel ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(student.academic_record?.ms_powerpoint)}`}>
                          {student.academic_record?.ms_powerpoint ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(student.academic_record?.ms_access)}`}>
                          {student.academic_record?.ms_access ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(student.academic_record?.computer_intro)}`}>
                          {student.academic_record?.computer_intro ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(student.average_score)}`}>
                          {student.average_score ? `${student.average_score.toFixed(1)}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditScores(student)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {students.length === 0 && (
        <div className="text-center mt-8">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-500 mt-2">No students found</div>
        </div>
      )}

      {/* Edit Scores Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Academic Scores - {selectedStudent.full_name}
              </h3>
              <form onSubmit={handleSaveScores} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">MS Word (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={academicData.ms_word}
                    onChange={(e) => setAcademicData({...academicData, ms_word: e.target.value})}
                    placeholder="Enter score (0-100)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MS Excel (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={academicData.ms_excel}
                    onChange={(e) => setAcademicData({...academicData, ms_excel: e.target.value})}
                    placeholder="Enter score (0-100)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MS PowerPoint (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={academicData.ms_powerpoint}
                    onChange={(e) => setAcademicData({...academicData, ms_powerpoint: e.target.value})}
                    placeholder="Enter score (0-100)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MS Access (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={academicData.ms_access}
                    onChange={(e) => setAcademicData({...academicData, ms_access: e.target.value})}
                    placeholder="Enter score (0-100)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Computer Introduction (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={academicData.computer_intro}
                    onChange={(e) => setAcademicData({...academicData, computer_intro: e.target.value})}
                    placeholder="Enter score (0-100)"
                  />
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Note:</strong> Leave fields empty to remove scores. Scores must be between 0-100.
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Save Scores
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicManagement;