// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import ServiceCards from './Components/ServiseCards/ServiceCards';
import './App.css';
import Home from './Components/Home/Home';
import SignUp from './Components/Signup/Signup'; 
import Login from './Components/Login/Login';
import TaskerForm from './Components/TaskerForm/TaskerForm';
import ProfilePage from './Components/Profilepage/Profilepage';
import TaskerProfile from './Components/Taskerpages/Profile/profile';
import TaskerBookings from './Components/Taskerpages/Bookings/bookings';
import TaskerServiceCards from './Components/Taskerpages/ServiceCards/service';
import Seller from './Components/Seller/seller';
import BookingForm from './Components/Book/Book';
import AboutUs from './Components/AboutUs/AboutUs';
import Admin from './Components/Admin/Admin';

const AppContent = () => {
  const location = useLocation();
  
  // Check if current path is a tasker route
  const isTaskerRoute = location.pathname.startsWith('/tasker');

  return (
    <div className="app-container">
      {/* Only show regular navbar if not on tasker routes */}
      {!isTaskerRoute && <Navbar />}

      {/* Set up routing */}
      <Routes>
        <Route path="/" element={<Home />} />  {/* Home or landing page */}
        <Route path="/services" element={<ServiceCards />} />  {/* Services page */}
        <Route path="/about" element={<AboutUs />} />  {/* About page */}
        <Route path="/signup" element={<SignUp />} />  {/* Signup page */}
        <Route path="/login" element={<Login />} />  {/* Login page */}
        <Route path="/become-tasker" element={<TaskerForm />} />  {/* TaskerForm page */}
        <Route path="/profilepage" element={<ProfilePage />} />  {/* Profile page */}
        <Route path="/tasker/profile" element={<TaskerProfile />} />  {/* Tasker Profile page */}
        <Route path="/tasker/service-cards" element={<TaskerServiceCards />} />  {/* Tasker Service Cards page */}
        <Route path="/tasker/bookings" element={<TaskerBookings />} />  {/* Tasker Bookings page */}
        <Route path="/seller" element={<Seller />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/admin/*" element={<Admin />} />  {/* Admin panel */}
        {/* Add more routes as needed */}
      </Routes>

      {/* Footer will be placed at the bottom */}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
