import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedContent = ({
  children,
  allowedRoles = [],
  fallback = null,
  unauthenticatedFallback = null
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  if (!user) {
    return unauthenticatedFallback;
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return children;
  }

  return fallback;
};


  // Component to check if user has specific role

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


 //Component to show content only to authenticated users

export const AuthenticatedContent = ({ children, fallback = null }) => (
  <RoleBasedContent allowedRoles={['admin', 'tasker', 'user']} fallback={fallback}>
    {children}
  </RoleBasedContent>
);

// //Component to show content only to unauthenticated users
export const UnauthenticatedContent = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? null : children;
};

export default RoleBasedContent;
