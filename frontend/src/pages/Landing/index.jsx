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
            <p className="hero-description">
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
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Verified Professionals</h3>
              <p>All our service providers are background-checked and verified for quality service.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Flexible Scheduling</h3>
              <p>Book services at your convenience with our easy-to-use scheduling system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Quality Guarantee</h3>
              <p>100% satisfaction guarantee on all services or your money back.</p>
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