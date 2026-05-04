import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Navigation/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import UploadCenter from './pages/user/UploadCenter';
import UserDashboard from './pages/user/UserDashboard';
import ImportHistory from './pages/user/ImportHistory';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import GlobalImports from './pages/admin/GlobalImports';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes Wrapper */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Shared / User Routes */}
            <Route path="upload" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UploadCenter /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboard /></ProtectedRoute>} />
            <Route path="history" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ImportHistory /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/imports" element={<ProtectedRoute allowedRoles={['admin']}><GlobalImports /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
