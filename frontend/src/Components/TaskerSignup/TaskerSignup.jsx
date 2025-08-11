import React, { useState } from 'react';
import './TaskerSignup.css'; // We'll reuse the same CSS as regular signup
import cleaner from '../../images/cleaner-illustration.png'; // Import image
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskerSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!terms) {
      alert('You must agree to the terms and policy.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/users/tasker', {
        name,
        email,
        password,
      });
      
      console.log('Tasker user registered:', response.data);
      
      // Store the JWT token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      alert('Registration successful! Please complete your tasker profile.');
      
      // Redirect to tasker profile completion form
      navigate('/complete-tasker-profile');
      
    } catch (error) {
      console.error('There was an error registering the tasker!', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-section">
        <h2>Become a Tasker</h2>
        <p>Join our community of skilled professionals!</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="terms">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the <a href="#">terms & policy</a>
            </label>
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Tasker Account'}
          </button>
        </form>

        <div className="social-signup">
          <button className="google-signup">Sign in with Google</button>
          <button className="apple-signup">Sign in with Apple</button>
        </div>

        <p>Already have an account? <a href="/login">Sign In</a></p>
        <p>Want to sign up as a customer? <a href="/signup">Customer Signup</a></p>
      </div>

      <div className="image-section">
        <img src={cleaner} alt="Cleaner" />
      </div>
    </div>
  );
};

export default TaskerSignup;
