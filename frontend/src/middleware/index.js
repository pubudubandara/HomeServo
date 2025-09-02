// Export all middleware components for easy importing
export { default as RouteGuard } from './RouteGuard';
export { default as RoleBasedRedirect } from './RoleBasedRedirect';
export { default as RoleBasedContent, HasRole, HasAnyRole, AuthenticatedContent, UnauthenticatedContent } from './RoleBasedContent';
export { AdminRoute, TaskerRoute, UserRoute, AuthenticatedRoute, PublicRoute } from './SpecificRoutes';
export { default as PublicOnlyRoute, RestrictedPublicRoute } from './PublicOnlyRoute';
export { default as LandingOrRedirect } from './LandingOrRedirect';

/**
 * Utility function to get default route for a role
 */
export const getDefaultRouteForRole = (role) => {
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

/**
 * Utility function to check if user has required role
 */
export const hasRole = (user, role) => {
  return user && user.role === role;
};

/**
 * Utility function to check if user has any of the required roles
 */
export const hasAnyRole = (user, roles) => {
  return user && roles.includes(user.role);
};

/**
 * Utility function to check if user is authenticated
 */
export const isAuthenticated = (user) => {
  return user && user._id;
};
