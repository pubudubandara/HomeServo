// src/App.jsx
// Main application component with routing setup

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import './App.css';

// Import all page components
import {
  HomePage,
  LoginPage,
  SignupPage,
  TaskerSignupPage,
  ServicesPage,
  AboutUs,
  BookingPage,
  CustomerProfilePage,
  TaskerProfileFormPage,
  TaskerProfilePage,
  TaskerBookingsPage,
  TaskerServicesPage,
  AdminPage,
  TestPage
} from './pages';

// Legacy components (to be refactored)
import Seller from './Components/Seller/seller';
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
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutUs />} />
        
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tasker-signup" element={<TaskerSignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/become-tasker" element={<TaskerSignupPage />} />
        
        {/* Profile Routes */}
        <Route path="/complete-tasker-profile" element={<TaskerProfileFormPage />} />
        <Route path="/profilepage" element={<CustomerProfilePage />} />
        <Route path="/profilepage/:serviceId" element={<CustomerProfilePage />} />
        
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
        <Route path="/seller" element={<Seller />} />
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
      </AuthProvider>
    </Router>
  );
};

export default App;
