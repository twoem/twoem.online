import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const StudentFinance = () => {
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No financial records found</h3>
      </div>
    );
  }

  const finance = student.finance_record || {
    total_fees: 0,
    paid_amount: 0,
    balance: 0,
    payment_reference: null,
    last_payment_date: null,
    is_cleared: false
  };

  const paymentProgress = finance.total_fees > 0 ? (finance.paid_amount / finance.total_fees) * 100 : 0;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
          <p className="text-gray-600 mt-2">Track your fee payments and financial status</p>
        </div>

        {/* Payment Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Fees */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-l-4 border-blue-500 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Fees</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    KSh {finance.total_fees.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paid Amount */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-l-4 border-green-500 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Amount Paid</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    KSh {finance.paid_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`border-l-4 ${finance.balance > 0 ? 'border-red-500' : 'border-green-500'} p-6`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {finance.balance > 0 ? (
                    <XCircleIcon className="h-8 w-8 text-red-500" />
                  ) : (
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                  <p className={`text-2xl font-bold ${finance.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    KSh {finance.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{paymentProgress.toFixed(1)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  finance.is_cleared ? 'bg-green-500' : paymentProgress >= 75 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(paymentProgress, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment Status</h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                finance.is_cleared 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {finance.is_cleared ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Fees Cleared
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Payment Pending
                  </>
                )}
              </div>
            </div>

            {finance.last_payment_date && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Last Payment</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(finance.last_payment_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Reference</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {finance.payment_reference || 'No reference provided'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-900">
                  Contact admin for payment options
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Eligibility Notice */}
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Certificate Eligibility</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                {student.average_score && student.average_score >= 60 ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span>Academic requirement: {student.average_score ? `${student.average_score.toFixed(1)}%` : 'No scores'} (≥60% required)</span>
              </div>
              <div className="flex items-center">
                {finance.is_cleared ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span>Financial requirement: {finance.is_cleared ? 'Fees cleared' : 'Payment pending'}</span>
              </div>
            </div>
            
            {student.can_download_certificate ? (
              <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded text-green-800">
                🎉 You are eligible to download your certificate!
              </div>
            ) : (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded text-yellow-800">
                ⏳ Complete the requirements above to access your certificate.
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Support</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>For payment assistance or inquiries, contact:</p>
            <p>📞 Phone: 0707 330 204 / 0769 720 002</p>
            <p>📧 Email: twoemcyber@gmail.com</p>
            <p>📍 Location: Plaza Building, Kagwe Town (opposite Total Petrol Station)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFinance;