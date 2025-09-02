import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Higher-order component that provides role-based conditional rendering
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if user has required role
 * @param {Array<string>} props.allowedRoles - Array of roles that can see this content
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have required role
 * @param {React.ReactNode} props.unauthenticatedFallback - Content to render if user is not logged in
 */
const RoleBasedContent = ({ 
  children, 
  allowedRoles = [], 
  fallback = null, 
  unauthenticatedFallback = null 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Don't render anything while loading
  }

  if (!user) {
    return unauthenticatedFallback;
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return children;
  }

  return fallback;
};

/**
 * Component to check if user has specific role
 */
export const HasRole = ({ role, children, fallback = null }) => (
  <RoleBasedContent allowedRoles={[role]} fallback={fallback}>
    {children}
  </RoleBasedContent>
);

/**
 * Component to check if user has any of the specified roles
 */
export const HasAnyRole = ({ roles, children, fallback = null }) => (
  <RoleBasedContent allowedRoles={roles} fallback={fallback}>
    {children}
  </RoleBasedContent>
);

/**
 * Component to show content only to authenticated users
 */
export const AuthenticatedContent = ({ children, fallback = null }) => (
  <RoleBasedContent allowedRoles={['admin', 'tasker', 'user']} fallback={fallback}>
    {children}
  </RoleBasedContent>
);

/**
 * Component to show content only to unauthenticated users
 */
export const UnauthenticatedContent = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? null : children;
};

export default RoleBasedContent;
