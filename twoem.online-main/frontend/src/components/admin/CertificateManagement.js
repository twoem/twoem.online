import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DocumentIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const CertificateManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  const handleUploadCertificate = (student) => {
    setSelectedStudent(student);
    setSelectedFile(null);
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(`${API_BASE}/admin/students/${selectedStudent.id}/certificate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedStudent(null);
      fetchStudents();
      alert('Certificate uploaded successfully!');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert(error.response?.data?.detail || 'Error uploading certificate');
    } finally {
      setUploading(false);
    }
  };

  const getEligibilityStatus = (student) => {
    const hasMinScore = student.average_score && student.average_score >= 60;
    const hasFeesCleared = student.finance_record?.is_cleared;
    const hasCertificate = student.has_certificate;

    if (hasCertificate && hasMinScore && hasFeesCleared) {
      return { status: 'eligible', text: 'Eligible for Download', color: 'bg-green-100 text-green-800' };
    } else if (hasCertificate && (!hasMinScore || !hasFeesCleared)) {
      return { status: 'restricted', text: 'Certificate Uploaded - Restricted', color: 'bg-yellow-100 text-yellow-800' };
    } else if (hasCertificate) {
      return { status: 'uploaded', text: 'Certificate Uploaded', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'none', text: 'No Certificate', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getEligibilityReasons = (student) => {
    const reasons = [];
    if (!student.average_score || student.average_score < 60) {
      reasons.push('Average score below 60%');
    }
    if (!student.finance_record?.is_cleared) {
      reasons.push('Fees not cleared');
    }
    return reasons;
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
          <h1 className="text-xl font-semibold text-gray-900">Certificate Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload and manage student certificates. Students can only download if they have ≥60% average and cleared fees.
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
                      Academic Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Download Eligibility
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const eligibility = getEligibilityStatus(student);
                    const reasons = getEligibilityReasons(student);
                    
                    return (
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.average_score && student.average_score >= 60 
                              ? 'bg-green-100 text-green-800'
                              : student.average_score 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.average_score ? `${student.average_score.toFixed(1)}%` : 'No scores'}
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
                          <div className="flex items-center">
                            {student.has_certificate ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                            )}
                            <span className="text-sm text-gray-900">
                              {student.has_certificate ? 'Uploaded' : 'None'}
                            </span>
                          </div>
                          {student.certificate && (
                            <div className="text-xs text-gray-500 mt-1">
                              {student.certificate.filename}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eligibility.color}`}>
                            {eligibility.text}
                          </span>
                          {reasons.length > 0 && (
                            <div className="text-xs text-red-600 mt-1">
                              {reasons.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleUploadCertificate(student)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                            title={student.has_certificate ? 'Replace Certificate' : 'Upload Certificate'}
                          >
                            <CloudArrowUpIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {students.length === 0 && (
        <div className="text-center mt-8">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-500 mt-2">No students found</div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      {showUploadModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedStudent.has_certificate ? 'Replace' : 'Upload'} Certificate - {selectedStudent.full_name}
              </h3>
              
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select PDF Certificate
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    PDF files only, max 5MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-xs text-blue-700">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Student Eligibility:</h4>
                  <div className="text-xs text-yellow-700">
                    <p>Average Score: {selectedStudent.average_score ? `${selectedStudent.average_score.toFixed(1)}%` : 'N/A'} 
                      {selectedStudent.average_score && selectedStudent.average_score >= 60 ? ' ✓' : ' ✗ (Need ≥60%)'}</p>
                    <p>Fees Status: {selectedStudent.finance_record?.is_cleared ? 'Cleared ✓' : 'Pending ✗'}</p>
                    <p className="mt-1 font-medium">
                      Download Status: {selectedStudent.can_download_certificate ? 'Will be available' : 'Will be restricted'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      selectedStudent.has_certificate ? 'Replace Certificate' : 'Upload Certificate'
                    )}
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

export default CertificateManagement;