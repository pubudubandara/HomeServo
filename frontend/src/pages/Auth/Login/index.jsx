import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS
import cleaner from '../../../images/cleaner-illustration.png'; // Import image

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        console.log("Login failed:", data);
      } else {
        console.log("Login successful:", data);
        console.log("User data received:", data.user);
        console.log("User ID:", data.user?._id);
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set user in context
        login(data.user, data.token);
        
        console.log("User stored in localStorage:", localStorage.getItem('user'));
        
        // Navigate to root, middleware will handle role-based redirection
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <div className="form-wrapper">
          <h2>Welcome back!</h2>
          <p className="subtitle">Please sign in to your account</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
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
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Don't have an account? <a href="/signup">Sign up here</a></p>
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

export default LoginPage;
