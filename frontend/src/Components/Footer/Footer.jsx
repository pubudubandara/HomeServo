import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-section">
            <div className="footer-logo">
              <span>Home</span>
              <span>Servo</span>
            </div>
            <p className="footer-description">
              Connect with skilled professionals for all your home service needs. 
              From cleaning to repairs, we've got you covered.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="/services/cleaning">Cleaning</a></li>
              <li><a href="/services/assembly">Assembly</a></li>
              <li><a href="/services/mounting">Mounting</a></li>
              <li><a href="/services/moving">Moving</a></li>
              <li><a href="/services/repairs">Home Repairs</a></li>
              <li><a href="/services/painting">Painting</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/help">Help Center</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Get Started</h3>
            <ul>
              <li><a href="/become-tasker">Become a Tasker</a></li>
              <li><a href="/signup">Sign Up</a></li>
              <li><a href="/login">Log In</a></li>
              <li><a href="/mobile-app">Mobile App</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/safety">Safety</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 HomeServo. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
