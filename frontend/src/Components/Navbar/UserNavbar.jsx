import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from '../../contexts/AuthContext';

const UserNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
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

  // Handle logout with error feedback
  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setLogoutError("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  // Truncate long user names
  const getDisplayName = (name) => {
    if (!name) return '';
    return name.length > 16 ? name.slice(0, 13) + '...' : name;
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
        {/* Show Home link only when NOT on services, my-bookings, or profile page */}
        {location.pathname !== '/services' && location.pathname !== '/my-bookings' && location.pathname !== '/profile' && (
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} end>
              Home
            </NavLink>
          </li>
        )}
        
        {/* Show Explore Services when on services, my-bookings, or profile page */}
        {(location.pathname === '/services' || location.pathname === '/my-bookings' || location.pathname === '/profile') && (
          <li>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Explore Services
            </NavLink>
          </li>
        )}
        
        {/* Show Services link only when NOT on services, my-bookings, or profile page */}
        {location.pathname !== '/services' && location.pathname !== '/my-bookings' && location.pathname !== '/profile' && (
          <li>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Services
            </NavLink>
          </li>
        )}
        
        {/* Show About Us link only when NOT on services, my-bookings, or profile page */}
        {location.pathname !== '/services' && location.pathname !== '/my-bookings' && location.pathname !== '/profile' && (
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>
              About Us
            </NavLink>
          </li>
        )}
        
        {/* Show My Bookings when on services, my-bookings, or profile page */}
        {(location.pathname === '/services' || location.pathname === '/my-bookings' || location.pathname === '/profile') && (
          <li>
            <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active-link' : ''}>
              My Bookings
            </NavLink>
          </li>
        )}

        {/* User actions group */}
        <div className="nav-user-actions">
          <li className="user-dropdown">
            <NavLink to="/profile" className="user-name" aria-label="Profile" title={user.name}>
              <i className="fas fa-user-circle"></i> {getDisplayName(user.name)}
            </NavLink>
            <button className="logout-btn" onClick={handleLogout} disabled={loggingOut} aria-label="Logout">
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </li>
        </div>

        {/* Hide CTA on services, my-bookings, and profile page when user is logged in */}
        {location.pathname !== '/services' && location.pathname !== '/my-bookings' && location.pathname !== '/profile' && (
          <li className="nav-cta-separator">
            <NavLink to="/become-tasker" className="tasker-btn">
              Become a Tasker
            </NavLink>
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

      {/* Logout error alert */}
      {logoutError && <div className="logout-error">{logoutError}</div>}
    </nav>
  );
};

export default UserNavbar;
