import React from 'react';
import './Login.css'; // Import CSS
import cleaner from '../../images/cleaner-illustration.png'; // Import image

const Login = () => {
  return (
    <div className="login-container">
      <div className="form-section">
        <h2>Welcome Back!</h2>
        <form className="login-form">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="social-login">
          <button className="google-login">Sign in with Google</button>
          <button className="apple-login">Sign in with Apple</button>
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
