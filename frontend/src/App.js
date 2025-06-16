import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import PublicWebsite from './components/PublicWebsite';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import ChangePassword from './components/ChangePassword';
import './App.css';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;