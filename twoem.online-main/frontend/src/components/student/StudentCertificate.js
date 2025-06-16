import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DocumentIcon, 
  CloudArrowDownIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const StudentCertificate = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadCertificate = async () => {
    if (!student.can_download_certificate) {
      alert('You are not eligible to download the certificate yet.');
      return;
    }

    setDownloading(true);
    try {
      const response = await axios.get(`${API_BASE}/student/certificate`, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'certificate.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert(error.response?.data?.detail || 'Error downloading certificate');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No certificate information found</h3>
      </div>
    );
  }

  const getEligibilityStatus = () => {
    const academicEligible = student.average_score && student.average_score >= 60;
    const financialEligible = student.finance_record?.is_cleared;
    const hasCertificate = student.has_certificate;

    return {
      academic: academicEligible,
      financial: financialEligible,
      certificate: hasCertificate,
      canDownload: student.can_download_certificate
    };
  };

  const eligibility = getEligibilityStatus();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Certificate Management</h2>
          <p className="text-gray-600 mt-2">Download your computer skills certificate</p>
        </div>

        {/* Certificate Status Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-white mr-3" />
              <h3 className="text-xl font-semibold text-white">Computer Skills Certificate</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              {eligibility.certificate ? (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                  <DocumentIcon className="h-10 w-10 text-blue-600" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <DocumentIcon className="h-10 w-10 text-gray-400" />
                </div>
              )}
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                TWOEM Online Productions Certificate
              </h4>
              <p className="text-gray-600 mb-4">
                Computer Skills Proficiency Certificate
              </p>

              {eligibility.canDownload ? (
                <button
                  onClick={handleDownloadCertificate}
                  disabled={downloading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <CloudArrowDownIcon className="h-5 w-5 mr-2" />
                      Download Certificate
                    </>
                  )}
                </button>
              ) : eligibility.certificate ? (
                <div className="inline-flex items-center px-6 py-3 border-2 border-yellow-300 text-base font-medium rounded-md text-yellow-800 bg-yellow-50">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  Certificate Available - Requirements Not Met
                </div>
              ) : (
                <div className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-md text-gray-600 bg-gray-50">
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Certificate Not Available
                </div>
              )}
            </div>

            {/* Eligibility Checklist */}
            <div className="border-t border-gray-200 pt-6">
              <h5 className="text-md font-semibold text-gray-900 mb-4">Eligibility Requirements</h5>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  {eligibility.academic ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span className="text-sm">
                    <strong>Academic Performance:</strong> Average score ≥ 60%
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      eligibility.academic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.average_score ? `${student.average_score.toFixed(1)}%` : 'No scores'}
                    </span>
                  </span>
                </div>

                <div className="flex items-center">
                  {eligibility.financial ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span className="text-sm">
                    <strong>Fee Payment:</strong> All fees must be cleared
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      eligibility.financial ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {eligibility.financial ? 'Cleared' : 'Pending'}
                    </span>
                  </span>
                </div>

                <div className="flex items-center">
                  {eligibility.certificate ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span className="text-sm">
                    <strong>Certificate Upload:</strong> Administrator must upload your certificate
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      eligibility.certificate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {eligibility.certificate ? 'Available' : 'Not uploaded'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="mt-6">
              {eligibility.canDownload ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-800 font-medium">
                      🎉 Congratulations! You can now download your certificate.
                    </span>
                  </div>
                </div>
              ) : eligibility.certificate ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      Your certificate is ready, but you need to meet all requirements to download it.
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-yellow-700">
                    {!eligibility.academic && "• Improve your average score to 60% or above"}
                    {!eligibility.financial && "• Clear all outstanding fees"}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-blue-800 font-medium">
                      Your certificate has not been uploaded yet. Contact the administrator if you believe this is an error.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Certificate Covers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Microsoft Word
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Microsoft Excel
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Microsoft PowerPoint
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Microsoft Access
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Computer Introduction
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Contact TWOEM Online Productions for assistance:</p>
            <p>📞 Phone: 0707 330 204 / 0769 720 002</p>
            <p>📧 Email: twoemcyber@gmail.com</p>
            <p>📍 Location: Plaza Building, Kagwe Town (opposite Total Petrol Station)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificate;