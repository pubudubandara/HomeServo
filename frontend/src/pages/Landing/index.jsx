import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Professional Home Services
              <span className="hero-highlight">Made Easy</span>
            </h1>
            <p className="hero-description" style={{ color: '#2c3e50' }}>
              Connect with trusted professionals for all your home service needs.
              From cleaning to repairs, we've got you covered.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/services')}>
                Explore Services
                <i className="fas fa-arrow-right"></i>
              </button>
              <button className="btn-secondary" onClick={() => navigate('/tasker-signup')}>
                Become a Tasker
              </button>
            </div>
          </div>

          <div className="hero-images">
            <div className="hero-image-main">
              <img
                src="/girl-base.png"
                alt="Professional Service Provider"
                className="hero-main-image"
              />
            </div>
            <div className="hero-image-decoration">
              <img
                src="/Decore.png"
                alt="Decorative Element"
                className="hero-decoration-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose HomeServo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-th-large"></i>
              </div>
              <h3>Wide Range of Services</h3>
              <p>From cleaning to repairs — everything in one place.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <h3>Trusted & Verified Professionals</h3>
              <p>Every service provider is background-checked and verified.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Customer Support</h3>
              <p>Always here to assist you when needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers who trust HomeServo for their home service needs.</p>
            <div className="cta-buttons">
              <button className="btn-outline" onClick={() => navigate('/services')}>
                Browse Services
              </button>
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                Sign Up Today
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;