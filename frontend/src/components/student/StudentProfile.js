import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parentContacts, setParentContacts] = useState({
    father_name: '',
    father_phone: '',
    mother_name: '',
    mother_phone: '',
    guardian_name: '',
    guardian_phone: ''
  });

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/student/profile`);
      setStudent(response.data);
      
      // Set parent contacts if they exist
      if (response.data.parent_contacts) {
        setParentContacts(response.data.parent_contacts);
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContacts = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/student/parent-contacts`, parentContacts);
      setEditing(false);
      fetchStudentProfile();
    } catch (error) {
      console.error('Error saving parent contacts:', error);
      alert('Error saving parent contacts');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (student?.parent_contacts) {
      setParentContacts(student.parent_contacts);
    } else {
      setParentContacts({
        father_name: '',
        father_phone: '',
        mother_name: '',
        mother_phone: '',
        guardian_name: '',
        guardian_phone: ''
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No profile found</h3>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Student Profile
            </h3>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {student.full_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {student.username}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {student.id_number}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {student.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {student.phone || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Average Score</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {student.average_score ? `${student.average_score.toFixed(1)}%` : 'No scores yet'}
                </p>
              </div>
            </div>

            {/* Parent Contacts Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-md font-medium text-gray-900">Parent/Guardian Contacts</h4>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Contacts
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveContacts}
                      disabled={saving}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                  {editing ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={parentContacts.father_name || ''}
                      onChange={(e) => setParentContacts({...parentContacts, father_name: e.target.value})}
                      placeholder="Enter father's name"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {parentContacts.father_name || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Father's Phone</label>
                  {editing ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={parentContacts.father_phone || ''}
                      onChange={(e) => setParentContacts({...parentContacts, father_phone: e.target.value})}
                      placeholder="Enter father's phone number"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {parentContacts.father_phone || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                  {editing ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={parentContacts.mother_name || ''}
                      onChange={(e) => setParentContacts({...parentContacts, mother_name: e.target.value})}
                      placeholder="Enter mother's name"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {parentContacts.mother_name || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mother's Phone</label>
                  {editing ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={parentContacts.mother_phone || ''}
                      onChange={(e) => setParentContacts({...parentContacts, mother_phone: e.target.value})}
                      placeholder="Enter mother's phone number"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {parentContacts.mother_phone || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guardian's Name</label>
                  {editing ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={parentContacts.guardian_name || ''}
                      onChange={(e) => setParentContacts({...parentContacts, guardian_name: e.target.value})}
                      placeholder="Enter guardian's name (if applicable)"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {parentContacts.guardian_name || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guardian's Phone</label>
                  {editing ? (
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={parentContacts.guardian_phone || ''}
                      onChange={(e) => setParentContacts({...parentContacts, guardian_phone: e.target.value})}
                      placeholder="Enter guardian's phone number (if applicable)"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {parentContacts.guardian_phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> You can only edit parent/guardian contact information. 
                    All other details are managed by the administrator.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;