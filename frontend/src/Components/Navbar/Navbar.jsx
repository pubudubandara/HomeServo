
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    navigate('/');
  };

  // Keyboard accessibility for mobile menu
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsMobile(!isMobile);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      {/* Logo (clickable) */}
      <NavLink to="/" className="logo" aria-label="Home">
        <span>Home</span>
        <span>Servo</span>
      </NavLink>

      {/* Nav Links */}
      <ul
        className={isMobile ? 'nav-links-mobile nav-overlay' : 'nav-links'}
        onClick={() => setIsMobile(false)}
      >
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : undefined} end>
            Explore Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : undefined}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/become-tasker" className="tasker-btn">
            Become a Tasker
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : undefined}>Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'active-link' : undefined}>Signup</NavLink>
            </li>
          </>
        )}
        {user && (
          <li className="user-dropdown">
            <NavLink to="/profile" className="user-name" aria-label="Profile">
              <i className="fas fa-user-circle"></i> {user.name}
            </NavLink>
            <button className="logout-btn" onClick={handleLogout} disabled={loggingOut} aria-label="Logout">
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </li>
        )}
      </ul>

      {/* Hamburger menu button for mobile */}
      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
        onKeyDown={handleKeyDown}
        aria-label={isMobile ? "Close menu" : "Open menu"}
        aria-expanded={isMobile}
        aria-controls="main-navigation"
        tabIndex={0}
      >
        {isMobile ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
      </button>
    </nav>
  );
};

export default Navbar;
