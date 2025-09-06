// src/App.jsx
// Main application component with routing setup

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar/Navbar';
import './App.css';

// Import middleware components
import { 
  AdminRoute, 
  TaskerRoute, 
  ServicesRoute,
  AuthenticatedRoute, 
  PublicRoute, 
  LandingOrRedirect
} from './middleware';

// Import all page components
import {
  Landing,
  HomePage,
  LoginPage,
  SignupPage,
  TaskerSignupPage,
  ServicesPage,
  AboutUs,
  BookingPage,
  ServiceProfile,
  TaskerProfileFormPage,
  TaskerProfilePage,
  TaskerBookingsPage,
  TaskerServicesPage,
  AdminPage,
  TestPage,
  MyBookings,
  Profile
} from './pages';

// Legacy components (to be refactored)
import { AuthProvider } from './contexts/AuthContext';

const AppContent = () => {
  const location = useLocation();
  
  // Check if current path is a tasker route or booking route
  const isTaskerRoute = location.pathname.startsWith('/tasker');
  const isBookingRoute = location.pathname.startsWith('/book');

  return (
    <div className="app-container">
      {/* Only show regular navbar if not on tasker routes or booking routes */}
      {!isTaskerRoute && !isBookingRoute && <Navbar />}

      {/* Main application routes */}
      <Routes>
        {/* Root Route - Landing page for unauthenticated, redirect for authenticated */}
        <Route path="/" element={<LandingOrRedirect />} />
        
        {/* Public Routes - Only accessible to non-authenticated users */}
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/tasker-signup" element={<PublicRoute><TaskerSignupPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/become-tasker" element={<PublicRoute><TaskerSignupPage /></PublicRoute>} />
        
        {/* Services Routes - Redirects admins to admin dashboard */}
        <Route path="/services" element={<ServicesRoute><HomePage /></ServicesRoute>} />
        <Route path="/services/:id" element={<ServicesRoute><ServiceProfile /></ServicesRoute>} />
         <Route path="/book/:id" element={<AuthenticatedRoute><BookingPage /></AuthenticatedRoute>} />
        <Route path="/about" element={<AboutUs />} />
        
        {/* Authenticated Routes - Require login but any role */}
        <Route path="/my-bookings" element={<AuthenticatedRoute><MyBookings /></AuthenticatedRoute>} />
        <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
        
        {/* Tasker-Specific Routes */}
        <Route path="/complete-tasker-profile" element={<TaskerRoute><TaskerProfileFormPage /></TaskerRoute>} />
        <Route path="/tasker/profile" element={<TaskerRoute><TaskerProfilePage /></TaskerRoute>} />
        <Route path="/tasker/service-cards" element={<TaskerRoute><TaskerServicesPage /></TaskerRoute>} />
        <Route path="/tasker/bookings" element={<TaskerRoute><TaskerBookingsPage /></TaskerRoute>} />
        
        {/* Admin-Specific Routes */}
        <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
        
        {/* Legacy/Development Routes - Protected */}
        <Route path="/profilepage" element={<AuthenticatedRoute><ServiceProfile /></AuthenticatedRoute>} />
        <Route path="/profilepage/:serviceId" element={<AuthenticatedRoute><ServiceProfile /></AuthenticatedRoute>} />
        <Route path="/test-services" element={<AuthenticatedRoute><TestPage /></AuthenticatedRoute>} />
        
        {/* Catch-all route - redirect to landing page */}
        <Route path="*" element={<LandingOrRedirect />} />
      </Routes>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              theme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
