import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const FinanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [financeData, setFinanceData] = useState({
    total_fees: '',
    paid_amount: '',
    payment_reference: ''
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

  const handleEditFinance = (student) => {
    setSelectedStudent(student);
    setFinanceData({
      total_fees: student.finance_record?.total_fees || '',
      paid_amount: student.finance_record?.paid_amount || '',
      payment_reference: student.finance_record?.payment_reference || ''
    });
    setShowEditModal(true);
  };

  const handleSaveFinance = async (e) => {
    e.preventDefault();
    try {
      const updateData = {};
      
      if (financeData.total_fees !== '') {
        updateData.total_fees = parseFloat(financeData.total_fees);
      }
      if (financeData.paid_amount !== '') {
        updateData.paid_amount = parseFloat(financeData.paid_amount);
      }
      if (financeData.payment_reference !== '') {
        updateData.payment_reference = financeData.payment_reference;
      }

      await axios.put(`${API_BASE}/admin/students/${selectedStudent.id}/finance`, updateData);
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error updating finance record:', error);
      alert('Error updating finance record');
    }
  };

  const getTotalStats = () => {
    const totalRevenue = students.reduce((sum, s) => sum + (s.finance_record?.paid_amount || 0), 0);
    const totalPending = students.reduce((sum, s) => sum + (s.finance_record?.balance || 0), 0);
    const clearedCount = students.filter(s => s.finance_record?.is_cleared).length;
    
    return { totalRevenue, totalPending, clearedCount };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
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
          <h1 className="text-xl font-semibold text-gray-900">Finance Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage student fee payments and financial records
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    KSh {stats.totalRevenue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Payments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    KSh {stats.totalPending.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cleared Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.clearedCount} / {students.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
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
                      Total Fees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                        <div className="text-sm text-gray-900">
                          KSh {(student.finance_record?.total_fees || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          KSh {(student.finance_record?.paid_amount || 0).toLocaleString()}
                        </div>
                        {student.finance_record?.last_payment_date && (
                          <div className="text-xs text-gray-500">
                            Last: {new Date(student.finance_record.last_payment_date).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          (student.finance_record?.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          KSh {(student.finance_record?.balance || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.finance_record?.payment_reference || 'N/A'}
                        </div>
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
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditFinance(student)}
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
          <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-500 mt-2">No students found</div>
        </div>
      )}

      {/* Edit Finance Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Finance Record - {selectedStudent.full_name}
              </h3>
              <form onSubmit={handleSaveFinance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Fees (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={financeData.total_fees}
                    onChange={(e) => setFinanceData({...financeData, total_fees: e.target.value})}
                    placeholder="Enter total fees"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paid Amount (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={financeData.paid_amount}
                    onChange={(e) => setFinanceData({...financeData, paid_amount: e.target.value})}
                    placeholder="Enter paid amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={financeData.payment_reference}
                    onChange={(e) => setFinanceData({...financeData, payment_reference: e.target.value})}
                    placeholder="Enter payment reference/receipt number"
                  />
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Current Status:</strong>
                  <br />
                  Balance: KSh {(selectedStudent.finance_record?.balance || 0).toLocaleString()}
                  <br />
                  Status: {selectedStudent.finance_record?.is_cleared ? 'Cleared' : 'Pending'}
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
                    Save Changes
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

export default FinanceManagement;