import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PublicNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile]);

  // Fade-out animation for mobile menu
  const [closing, setClosing] = useState(false);
  const closeMobileMenu = () => {
    if (isMobile) {
      setClosing(true);
      setTimeout(() => {
        setIsMobile(false);
        setClosing(false);
      }, 200);
    }
  };

  // Only close menu when a link is clicked
  const handleMenuClick = (e) => {
    if (e.target.tagName === 'A') {
      closeMobileMenu();
    }
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

      {/* Backdrop for mobile menu */}
      {isMobile && <div className="nav-backdrop" onClick={closeMobileMenu} aria-hidden="true"></div>}

      {/* Nav Links */}
      <ul
        id="main-navigation"
        ref={menuRef}
        className={isMobile ? `nav-links-mobile nav-overlay${closing ? ' closing' : ''}` : 'nav-links'}
        onClick={handleMenuClick}
      >
        {/* Navigation for non-logged users */}
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>
            About Us
          </NavLink>
        </li>

        {/* User actions group */}
        <div className="nav-user-actions">
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Signup
            </NavLink>
          </li>
        </div>

        {/* Become a Tasker CTA */}
        <li className="nav-cta-separator">
          <NavLink to="/become-tasker" className="tasker-btn">
            Become a Tasker
          </NavLink>
        </li>
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

export default PublicNavbar;
