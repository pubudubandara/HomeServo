# Middleware System Documentation

This documentation explains the comprehensive middleware system implemented for handling authentication, authorization, and role-based routing in the HomeServo application.

## Key Security Feature

**Restricted Public Access**: Unauthenticated users can ONLY access:
- `/` (Landing page)
- `/login` (Login page)
- `/signup` (User signup page)
- `/tasker-signup` (Tasker signup page)
- `/become-tasker` (Become tasker page)

All other routes require authentication and will redirect unauthenticated users back to the landing page.

## Components Overview

### 1. RouteGuard
A flexible component for protecting routes with customizable access control.

```jsx
import { RouteGuard } from '../middleware';

// Basic authentication required
<RouteGuard>
  <ProtectedComponent />
</RouteGuard>

// Role-based access
<RouteGuard allowedRoles={['admin', 'tasker']}>
  <AdminOrTaskerComponent />
</RouteGuard>

// Public route (no auth required)
<RouteGuard requireAuth={false}>
  <PublicComponent />
</RouteGuard>
```

### 2. Specific Route Components
Pre-configured route guards for specific roles.

```jsx
import { AdminRoute, TaskerRoute, UserRoute, AuthenticatedRoute, PublicRoute } from '../middleware';

// Admin only
<AdminRoute>
  <AdminDashboard />
</AdminRoute>

// Tasker only
<TaskerRoute>
  <TaskerProfile />
</TaskerRoute>

// User only
<UserRoute>
  <BookingPage />
</UserRoute>

// Any authenticated user
<AuthenticatedRoute>
  <ProfilePage />
</AuthenticatedRoute>

// Only for non-authenticated users
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### 3. RoleBasedRedirect
Automatically redirects users to their appropriate dashboard.

```jsx
import { RoleBasedRedirect } from '../middleware';

// Will redirect to:
// - Admin: /admin/dashboard
// - Tasker: /tasker/profile
// - User: /services
// - Unauthenticated: /services (or custom default)
<Route path="/" element={<RoleBasedRedirect />} />
```

### 4. Role-Based Content Components
For conditional rendering within components.

```jsx
import { HasRole, HasAnyRole, AuthenticatedContent, UnauthenticatedContent } from '../middleware';

// Show content only to admins
<HasRole role="admin">
  <AdminSettings />
</HasRole>

// Show content to multiple roles
<HasAnyRole roles={['admin', 'tasker']}>
  <ManagementFeatures />
</HasAnyRole>

// Show content only to authenticated users
<AuthenticatedContent>
  <UserProfile />
</AuthenticatedContent>

// Show content only to unauthenticated users
<UnauthenticatedContent>
  <LoginPrompt />
</UnauthenticatedContent>
```

### 8. LandingOrRedirect
Handles the root route behavior - shows landing page to unauthenticated users, redirects authenticated users to their dashboard.

```jsx
import { LandingOrRedirect } from '../middleware';

// Use for root route
<Route path="/" element={<LandingOrRedirect />} />
```

### 9. PublicOnlyRoute & RestrictedPublicRoute
Restricts unauthenticated users to only specific public routes.

```jsx
import { RestrictedPublicRoute } from '../middleware';

// Restricts unauthenticated users to landing and auth pages only
<Route path="*" element={<RestrictedPublicRoute><Landing /></RestrictedPublicRoute>} />
```

## Implementation in App.jsx

```jsx
import { 
  AdminRoute, 
  TaskerRoute, 
  UserRoute, 
  AuthenticatedRoute, 
  PublicRoute, 
  LandingOrRedirect
} from './middleware';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Root route - Landing for unauthenticated, dashboard for authenticated */}
          <Route path="/" element={<LandingOrRedirect />} />
          
          {/* Public routes (auth pages only) */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          
          {/* All other routes require authentication */}
          <Route path="/services" element={<AuthenticatedRoute><HomePage /></AuthenticatedRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/tasker/*" element={<TaskerRoute><TaskerDashboard /></TaskerRoute>} />
          <Route path="/book/*" element={<UserRoute><BookingPage /></UserRoute>} />
          
          {/* Catch-all redirect to landing */}
          <Route path="*" element={<LandingOrRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
```

## Utility Functions

```jsx
import { getDefaultRouteForRole, hasRole, hasAnyRole, isAuthenticated } from '../middleware';

// Get default route for a role
const defaultRoute = getDefaultRouteForRole('admin'); // '/admin/dashboard'

// Check if user has specific role
if (hasRole(user, 'admin')) {
  // User is admin
}

// Check if user has any of the roles
if (hasAnyRole(user, ['admin', 'tasker'])) {
  // User is admin or tasker
}

// Check if user is authenticated
if (isAuthenticated(user)) {
  // User is logged in
}
```

## Key Features

### 1. Automatic Redirections
- **Login Redirect**: After login, users are automatically redirected to their role-appropriate dashboard
- **Route Protection**: Unauthorized access attempts redirect to appropriate pages
- **Auth State Changes**: Real-time redirection when authentication state changes

### 2. Role-Based Access Control
- **Admin Routes**: Full system access
- **Tasker Routes**: Service provider features
- **User Routes**: Customer features
- **Mixed Routes**: Content accessible to multiple roles

### 3. Loading States
All middleware components handle loading states gracefully while authentication is being verified.

### 4. Fallback Handling
- **Unauthenticated Users**: Redirected to login with return URL
- **Unauthorized Roles**: Redirected to appropriate dashboard
- **Invalid Routes**: Handled with graceful fallbacks

## Security Features

### 1. Restricted Public Access
Unauthenticated users are limited to accessing only:
- Landing page (`/`)
- Authentication pages (`/login`, `/signup`, `/tasker-signup`, `/become-tasker`)

Any attempt to access other routes will redirect to the landing page.

### 2. Automatic Role-Based Redirection
Upon successful login, users are automatically redirected to their appropriate dashboard:
- **Admin**: `/admin/dashboard`
- **Tasker**: `/tasker/profile`
- **User**: `/services`

### 3. Route Protection
All application routes (except landing and auth pages) are protected and require authentication.

### 4. Unauthorized Access Prevention
Users attempting to access routes outside their role permissions are redirected to their appropriate dashboard.

## Security Considerations

1. **Client-Side Only**: This middleware handles UI routing and display logic only
2. **Server Validation**: All API calls must validate permissions server-side
3. **Token Validation**: Tokens should be validated on the backend for each protected API call
4. **Role Verification**: User roles should be verified server-side, not just client-side

## Best Practices

1. **Use Specific Components**: Prefer `AdminRoute` over `RouteGuard` for clarity
2. **Consistent Patterns**: Use the same middleware pattern throughout the app
3. **Conditional Content**: Use role-based content components for UI elements
4. **Error Boundaries**: Implement error boundaries around protected routes
5. **Loading States**: Always handle loading states in protected components

## Migration Guide

To implement this middleware system in existing routes:

### Before:
```jsx
<Route path="/admin" element={<AdminPage />} />
```

### After:
```jsx
<Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
```

This ensures that only authenticated admin users can access the admin routes, with automatic redirection for unauthorized access attempts.
