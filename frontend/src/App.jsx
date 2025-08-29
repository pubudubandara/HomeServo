// src/App.jsx
// Main application component with routing setup

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar/Navbar';
import './App.css';

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
  
  // Check if current path is a tasker route
  const isTaskerRoute = location.pathname.startsWith('/tasker');

  return (
    <div className="app-container">
      {/* Only show regular navbar if not on tasker routes */}
      {!isTaskerRoute && <Navbar />}

      {/* Main application routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tasker-signup" element={<TaskerSignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/become-tasker" element={<TaskerSignupPage />} />
        
        {/* Profile Routes */}
        <Route path="/complete-tasker-profile" element={<TaskerProfileFormPage />} />
        <Route path="/profilepage" element={<ServiceProfile />} />
        <Route path="/profilepage/:serviceId" element={<ServiceProfile />} />
        
        {/* Tasker Dashboard Routes */}
        <Route path="/tasker/profile" element={<TaskerProfilePage />} />
        <Route path="/tasker/service-cards" element={<TaskerServicesPage />} />
        <Route path="/tasker/bookings" element={<TaskerBookingsPage />} />
        
        {/* Booking Routes */}
        <Route path="/book" element={<BookingPage />} />
        <Route path="/book/:serviceId" element={<BookingPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminPage />} />
        
        {/* Legacy/Utility Routes */}
        <Route path="/test-services" element={<TestPage />} />
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
