import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RouteGuard component that handles authentication and role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {Array<string>} props.allowedRoles - Array of roles that can access this route
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.redirectTo - Where to redirect if access is denied
 */
const RouteGuard = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true, 
  redirectTo = null 
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

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but authentication is not required (e.g., login page)
  if (!requireAuth && user) {
    // Redirect authenticated users away from auth pages
    const roleBasedRedirect = getRoleBasedDefaultRoute(user.role);
    return <Navigate to={roleBasedRedirect} replace />;
  }

  // If roles are specified and user doesn't have the required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    const defaultRoute = getRoleBasedDefaultRoute(user.role);
    const redirect = redirectTo || defaultRoute;
    return <Navigate to={redirect} replace />;
  }

  // If all checks pass, render the protected component
  return children;
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

export default RouteGuard;
