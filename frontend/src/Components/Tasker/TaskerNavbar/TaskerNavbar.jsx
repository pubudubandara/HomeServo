import React, { useState } from 'react';
import './navbar.css';
import { useAuth } from '../../../contexts/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TaskerNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Force a page reload to ensure AuthContext is completely refreshed
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if logout fails, redirect to home
      window.location.href = '/';
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <span>Home</span>
        <span>Servo</span>
      </div>

      {/* Nav Links */}
      <ul
        className={isMobile ? 'nav-links-mobile' : 'nav-links'}
        onClick={() => setIsMobile(false)}
      >
        <li><a href="/tasker/profile">Profile</a></li>
        <li><a href="/tasker/service-cards">Service Cards</a></li>
        <li><a href="/tasker/bookings">Bookings</a></li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>

      {/* Hamburger menu button for mobile */}
      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
        aria-label="Toggle mobile menu"
      >
        {isMobile ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
      </button>
    </nav>
  );
};

export default TaskerNavbar;
