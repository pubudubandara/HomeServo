import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBasedRoute, LoadingSpinner } from './utils.jsx';

// Generic route protection hook
const useRouteProtection = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  return {
    user,
    isLoading,
    location,
    LoadingComponent: LoadingSpinner,
    loginRedirect: <Navigate to="/login" state={{ from: location }} replace />,
    getRoleBasedRoute: () => getRoleBasedRoute(user?.role)
  };
};

/**
 * AdminRoute component specifically for protecting admin routes
 */
export const AdminRoute = ({ children }) => {
  const { user, isLoading, LoadingComponent, loginRedirect } = useRouteProtection();

  if (isLoading) return <LoadingComponent />;
  if (!user) return loginRedirect;
  if (user.role !== 'admin') return <Navigate to="/services" replace />;

  return children;
};

/**
 * TaskerRoute component specifically for protecting tasker routes
 */
export const TaskerRoute = ({ children }) => {
  const { user, isLoading, LoadingComponent, loginRedirect } = useRouteProtection();

  if (isLoading) return <LoadingComponent />;
  if (!user) return loginRedirect;
  if (user.role !== 'tasker') return <Navigate to="/services" replace />;

  return children;
};

/**
 * ServicesRoute component that redirects admins to admin dashboard
 * but allows other users to access services
 */
export const ServicesRoute = ({ children }) => {
  const { user, isLoading, LoadingComponent } = useRouteProtection();

  if (isLoading) return <LoadingComponent />;

  // If user is admin, redirect to admin dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};


 //AuthenticatedRoute component for routes that require any authenticated user

export const AuthenticatedRoute = ({ children }) => {
  const { user, isLoading, LoadingComponent, loginRedirect } = useRouteProtection();

  if (isLoading) return <LoadingComponent />;
  if (!user) return loginRedirect;

  return children;
};

/*PublicRoute component for routes that should only be accessible to non-authenticated users
  (like login, signup pages)
 */
export const PublicRoute = ({ children }) => {
  const { user, isLoading, LoadingComponent, getRoleBasedRoute } = useRouteProtection();

  if (isLoading) return <LoadingComponent />;
  if (user) return <Navigate to={getRoleBasedRoute()} replace />;

  return children;
};
