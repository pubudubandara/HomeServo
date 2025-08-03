import React, { useState } from 'react';
import './SignUp.css'; // Import CSS
import cleaner from '../../images/cleaner-illustration.png'; // Import image
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      alert('You must agree to the terms and policy.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/users', {
        name,
        email,
        password,
      });
      console.log('User registered:', response.data);
      alert('You have signed up successfully!');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('There was an error registering the user!', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-section">
        <h2>Get Started Now</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="signup-button">Signup</button>
        </form>

        <div className="social-signup">
          <button className="google-signup">Sign in with Google</button>
          <button className="apple-signup">Sign in with Apple</button>
        </div>

        <p>Have an account? <a href="#">Sign In</a></p>
      </div>

      <div className="image-section">
        <img src={cleaner} alt="Cleaner" />
      </div>
    </div>
  );
};

export default SignUp;