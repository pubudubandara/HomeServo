import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminRoute component specifically for protecting admin routes
 */
export const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/services" replace />;
  }

  return children;
};

/**
 * TaskerRoute component specifically for protecting tasker routes
 */
export const TaskerRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'tasker') {
    return <Navigate to="/services" replace />;
  }

  return children;
};

/**
 * UserRoute component specifically for protecting user routes
 */
export const UserRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'user') {
    const roleBasedRedirect = user.role === 'admin' ? '/admin/dashboard' : '/tasker/profile';
    return <Navigate to={roleBasedRedirect} replace />;
  }

  return children;
};

/**
 * AuthenticatedRoute component for routes that require any authenticated user
 */
export const AuthenticatedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * PublicRoute component for routes that should only be accessible to non-authenticated users
 * (like login, signup pages)
 */
export const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (user) {
    // Redirect authenticated users to their appropriate dashboard
    const roleBasedRedirect = (() => {
      switch (user.role) {
        case 'admin':
          return '/admin/dashboard';
        case 'tasker':
          return '/tasker/profile';
        case 'user':
        default:
          return '/services';
      }
    })();
    
    return <Navigate to={roleBasedRedirect} replace />;
  }

  return children;
};
