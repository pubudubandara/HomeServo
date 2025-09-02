import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * PublicOnlyRoute component that allows unauthenticated users to access only specific public routes
 * Authenticated users are redirected to their role-based dashboard
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render
 * @param {Array<string>} props.allowedPublicPaths - Array of paths that unauthenticated users can access
 */
const PublicOnlyRoute = ({ 
  children, 
  allowedPublicPaths = ['/'] 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

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
    const roleBasedRedirect = getRoleBasedDefaultRoute(user.role);
    return <Navigate to={roleBasedRedirect} replace />;
  }

  // If user is not authenticated, check if current path is allowed
  const currentPath = location.pathname;
  const isAllowedPath = allowedPublicPaths.some(path => {
    // Exact match or starts with the path (for nested routes)
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  });

  // If current path is not in allowed public paths, redirect to landing page
  if (!isAllowedPath) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the component
  return children;
};

/**
 * RestrictedPublicRoute component that restricts unauthenticated users to only the landing page
 * and authentication pages
 */
export const RestrictedPublicRoute = ({ children }) => {
  const allowedPaths = [
    '/',           // Landing page
    '/login',      // Login page
    '/signup',     // Signup page
    '/tasker-signup', // Tasker signup page
    '/become-tasker'  // Become tasker page
  ];

  return (
    <PublicOnlyRoute allowedPublicPaths={allowedPaths}>
      {children}
    </PublicOnlyRoute>
  );
};

/**
 * Get the default route for a user based on their role
 * @param {string} role - User's role
 * @returns {string} Default route for the role
 */
const getRoleBasedDefaultRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'tasker':
      return '/tasker/profile';
    case 'user':
    default:
      return '/services';
  }
};

export default PublicOnlyRoute;
