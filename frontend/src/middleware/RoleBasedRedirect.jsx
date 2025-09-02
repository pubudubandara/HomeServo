import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RoleBasedRedirect component that automatically redirects users to their appropriate dashboard
 * This is useful for root routes or when you want to redirect users based on their role
 */
const RoleBasedRedirect = ({ 
  defaultRoute = '/', 
  loadingComponent = null 
}) => {
  const { user, isLoading } = useAuth();

  // Show loading component while checking authentication
  if (isLoading) {
    if (loadingComponent) {
      return loadingComponent;
    }
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

  // If user is not authenticated, redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect based on user role
  const getRoleBasedRoute = () => {
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'tasker':
        // Check if tasker has completed their profile
        // This could be enhanced to check profile completion status
        return '/tasker/profile';
      case 'user':
      default:
        return '/services';
    }
  };

  return <Navigate to={getRoleBasedRoute()} replace />;
};

export default RoleBasedRedirect;
