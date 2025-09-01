import React, { useState } from 'react';
import './TaskerSignup.css';
import cleaner from '../../../images/cleaner-illustration.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskerSignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5001/api/users', {
        name,
        email,
        password,
        role: 'tasker',
      });
      console.log('Tasker registered:', response.data);
      alert('You have signed up as a tasker successfully! Please complete your profile.');
      navigate('/complete-tasker-profile');
    } catch (error) {
      console.error('Tasker signup error:', error);
      setError(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container"> {/* Changed from tasker-signup-container */}
      <div className="form-section">
        <h2>Join as a Tasker</h2>
        <p>Start earning by providing services!</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form"> {/* Changed from tasker-signup-form */}
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
          
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          
          <div className="terms">
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
          
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Join as Tasker'}
          </button>
        </form>
        
        <p>Already have an account? <a href="/login">Sign in here</a></p>
        <p>Want to join as a customer? <a href="/signup">Customer Signup</a></p>
      </div>
      
      <div className="image-section">
        <img src={cleaner} alt="Cleaner illustration" />
      </div>
    </div>
  );
};

export default TaskerSignupPage;
