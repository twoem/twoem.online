import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowDownTrayIcon, 
  PlusIcon, 
  TrashIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const DownloadsManagement = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file_type: 'public',
    file: null
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/downloads`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDownloads(response.data);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      setError('Failed to fetch downloads');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('file_type', uploadData.file_type);
      formData.append('file', uploadData.file);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/downloads`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('File uploaded successfully!');
      setShowUploadForm(false);
      setUploadData({
        title: '',
        description: '',
        file_type: 'public',
        file: null
      });
      
      // Refresh the list
      await fetchDownloads();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.detail || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const deleteDownload = async (downloadId) => {
    if (!window.confirm('Are you sure you want to delete this download?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/downloads/${downloadId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess('Download deleted successfully!');
      
      // Refresh the list
      await fetchDownloads();
    } catch (error) {
      console.error('Error deleting download:', error);
      setError('Failed to delete download');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadData(prev => ({ ...prev, file }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Downloads Management</h2>
          <p className="text-gray-600">Manage public and private downloadable files</p>
        </div>
        
        <button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Upload File
        </button>
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

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New File</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Type</label>
                  <select
                    value={uploadData.file_type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, file_type: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Downloads List */}
      {loading && downloads.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-12">
          <ArrowDownTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No downloads</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading your first file.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {downloads.map((download) => (
              <li key={download.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {download.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          download.file_type === 'public' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {download.file_type}
                        </span>
                      </div>
                    </div>
                    
                    {download.description && (
                      <p className="mt-1 text-sm text-gray-600">{download.description}</p>
                    )}
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:items-center sm:space-x-4">
                        <p className="text-sm text-gray-500 flex items-center">
                          <DocumentIcon className="h-4 w-4 mr-1" />
                          {download.filename}
                        </p>
                        <p className="text-sm text-gray-500">
                          {download.download_count} downloads
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {formatDate(download.uploaded_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => deleteDownload(download.id)}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
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

export default DownloadsManagement;