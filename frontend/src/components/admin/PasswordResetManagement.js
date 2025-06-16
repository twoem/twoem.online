import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ClockIcon, 
  CheckIcon, 
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PasswordResetManagement = () => {
  const [resetRequests, setResetRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchPasswordResetRequests();
  }, []);

  const fetchPasswordResetRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/password-resets`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResetRequests(response.data);
    } catch (error) {
      console.error('Error fetching password reset requests:', error);
      setError('Failed to fetch password reset requests');
    } finally {
      setLoading(false);
    }
  };

  const approveReset = async (resetId) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/password-resets/${resetId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Show the generated OTP
      setGeneratedOTP({
        resetId,
        otpCode: response.data.otp_code,
        message: response.data.message
      });
      
      // Refresh the list
      await fetchPasswordResetRequests();
    } catch (error) {
      console.error('Error approving reset request:', error);
      setError('Failed to approve reset request');
    } finally {
      setLoading(false);
    }
  };

  const rejectReset = async (resetId) => {
    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/password-resets/${resetId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh the list
      await fetchPasswordResetRequests();
    } catch (error) {
      console.error('Error rejecting reset request:', error);
      setError('Failed to reject reset request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && resetRequests.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Password Reset Requests</h2>
        <p className="text-gray-600">Manage student password reset requests</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {generatedOTP && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">OTP Generated!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p className="font-mono text-lg font-bold">6-Digit OTP: {generatedOTP.otpCode}</p>
                <p className="mt-1">Please provide this code to the student to reset their password.</p>
              </div>
              <button
                onClick={() => setGeneratedOTP(null)}
                className="mt-3 bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {resetRequests.length === 0 ? (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
          <p className="mt-1 text-sm text-gray-500">No password reset requests are currently pending.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {resetRequests.map((request) => (
              <li key={request.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {request.student_username}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {request.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">
                          Requested: {formatDate(request.requested_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex space-x-2">
                    <button
                      onClick={() => approveReset(request.id)}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Approve & Generate OTP
                    </button>
                    
                    <button
                      onClick={() => rejectReset(request.id)}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordResetManagement;