import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DriverDashboard from './pages/DriverDashboard';
import LiveTracking from './pages/LiveTracking';
import AuthForms from './components/AuthForms';

// Protected route component
const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  allowedRoles?: string[];
}> = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{element}</>;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <AuthForms defaultTab="login" />
              </div>
            )
          } 
        />
        
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <AuthForms defaultTab="register" />
              </div>
            )
          } 
        />
        
        <Route 
  path="/" 
  element={
    <Layout>
      <HomePage />
    </Layout>
  }
/>

<Route 
  path="/dashboard" 
  element={
    <Layout>
      <DriverDashboard />
    </Layout>
  }
/>

<Route 
  path="/tracking/:bookingId" 
  element={
    <Layout>
      <LiveTracking />
    </Layout>
  }
/>

{/* Redirect to login if not authenticated */}
<Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />

      </Routes>
    </Router>
  );
}

export default App;