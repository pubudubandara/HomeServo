import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './TaskerLogin.css';
import cleaner from '../../images/cleaner-illustration.png';

const TaskerLogin = () => {
  const [username, setUsername] = useState("");
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
      console.log('Attempting tasker login with:', { username, password: '***' }); // Debug log
      
      const response = await fetch("http://localhost:5001/api/taskers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', { status: response.status, data }); // Debug log
      
      if (!response.ok) {
        setError(data.message || "Login failed");
        console.log("Tasker login failed:", data);
      } else {
        console.log("Tasker login successful:", data);
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        login(data.user); // Set user in context
        
        // Navigate to tasker profile
        navigate("/tasker/profile");
      }
    } catch (err) {
      console.error("Tasker login error:", err);
      setError(`Network error: ${err.message}. Please check if the server is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegularLogin = () => {
    navigate('/login');
  };

  return (
    <div className="tasker-login-container">
      <div className="form-section">
        <h2>Tasker Login</h2>
        <p className="login-subtitle">Welcome back! Sign in to your tasker account</p>
        
        <form className="tasker-login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="tasker-login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login as Tasker"}
          </button>
        </form>

        <div className="login-links">
          <button 
            type="button" 
            className="back-to-login-btn"
            onClick={handleBackToRegularLogin}
          >
            Back to Regular Login
          </button>
          <p>Don't have a tasker account? <a href="/tasker-register">Sign Up as Tasker</a></p>
        </div>
      </div>

      <div className="image-section">
        <img src={cleaner} alt="Tasker Login" />
      </div>
    </div>
  );
};

export default TaskerLogin;
