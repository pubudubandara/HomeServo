import React, { useState } from 'react';
import './Signup.css'; // Import CSS
import cleaner from '../../../images/cleaner-illustration.png'; // Import image
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      setError('You must agree to the terms and policy.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5001/api/users', {
        name,
        email,
        password,
        role: 'user',
      });
      console.log('User registered:', response.data);
      alert('You have signed up successfully!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-section">
        <div className="form-wrapper">
          <h2>Create your account</h2>
          <p className="subtitle">Join HomeServo and get started!</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
              />
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
            
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Already have an account? <a href="/login">Sign in here</a></p>
            <p>Want to become a tasker? <a href="/tasker-signup">Join as a Tasker</a></p>
          </div>
        </div>
      </div>
      
      <div className="image-section">
        <img src={cleaner} alt="Cleaner illustration" />
      </div>
    </div>
  );
};

export default SignupPage;
