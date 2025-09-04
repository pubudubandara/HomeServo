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
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 HomeServo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
