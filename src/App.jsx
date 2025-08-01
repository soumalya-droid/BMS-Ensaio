import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import { PWAProvider } from '@/components/PWA/PWAProvider.jsx';
import InstallPrompt from '@/components/PWA/InstallPrompt.jsx';
import OfflineIndicator from '@/components/PWA/OfflineIndicator.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import UserDashboard from '@/pages/UserDashboard.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import BatteryDetails from '@/pages/BatteryDetails.jsx';
import HomePage from '@/pages/HomePage.jsx';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/battery/:id" 
        element={
          <ProtectedRoute>
            <BatteryDetails />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Helmet>
              <title>Battery Management System - Advanced BMS Platform</title>
              <meta name="description" content="Professional battery management system with real-time monitoring, GPS tracking, and predictive analytics for optimal battery performance." />
            </Helmet>
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;