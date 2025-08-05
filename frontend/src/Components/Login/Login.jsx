import React, { useState } from 'react';
import './Login.css'; // Import CSS
import cleaner from '../../images/cleaner-illustration.png'; // Import image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      } else {
        // Save token or user info as needed
        localStorage.setItem("token", data.token);
        // Redirect or update UI as needed
        window.location.href = "/";
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <h2>Welcome Back!</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="social-login">
          <button className="google-login" type="button">Sign in with Google</button>
          <button className="apple-login" type="button">Sign in with Apple</button>
        </div>

        <p>Don't have an account? <a href="#">Sign Up</a></p>
      </div>

      <div className="image-section">
        <img src={cleaner} alt="Cleaner" />
      </div>
    </div>
  );
};

export default Login;
