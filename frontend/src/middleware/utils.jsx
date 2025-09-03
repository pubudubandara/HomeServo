import React from 'react';

// Shared utilities for middleware components


 //Get the default route for a user based on their role

export const getRoleBasedRoute = (role) => {
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


// Shared loading component

export const LoadingSpinner = () => (
  <div className="loading-container">Loading...</div>
);


// Check if user has required role

export const hasRole = (user, role) => {
  return user && user.role === role;
};


 //Check if user has any of the required roles

export const hasAnyRole = (user, roles) => {
  return user && roles.includes(user.role);
};


 //Check if user is authenticated

export const isAuthenticated = (user) => {
  return user && user._id;
};
