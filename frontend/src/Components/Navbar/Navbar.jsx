import React, { useState, useEffect } from 'react';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get user info from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
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
        <li><a href="/">Explore Services</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/become-tasker" className="tasker-btn">Become a Tasker</a></li>
        {!user && <><li><a href="/login">Login</a></li><li><a href="/signup">Signup</a></li></>}
        {user && (
          <li className="user-dropdown">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        )}
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

export default Navbar;
