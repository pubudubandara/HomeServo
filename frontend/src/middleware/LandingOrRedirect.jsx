import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Landing } from '../pages';

/**
 * LandingOrRedirect component that shows the landing page to unauthenticated users
 * and redirects authenticated users to their role-based dashboard
 */
const LandingOrRedirect = () => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If user is authenticated, redirect to their role-based dashboard
  if (user) {
    const getRoleBasedRoute = () => {
      switch (user.role) {
        case 'admin':
          return '/admin/dashboard';
        case 'tasker':
          return '/tasker/profile';
        case 'user':
        default:
          return '/services';
      }
    };

    return <Navigate to={getRoleBasedRoute()} replace />;
  }

  // If user is not authenticated, show the landing page
  return <Landing />;
};

export default LandingOrRedirect;
