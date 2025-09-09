import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Landing } from '../pages';
import { getRoleBasedRoute } from './utils.jsx';

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
    return <Navigate to={getRoleBasedRoute(user.role)} replace />;
  }

  // If user is not authenticated, show the landing page
  return <Landing />;
};

export default LandingOrRedirect;
