import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[1-9]\d{0,15}$/;

    if (!email.trim()) {
      return 'Email or username is required';
    }

    // Check if it's a phone number (invalid for email field)
    if (phoneRegex.test(email.replace(/[\s-()]/g, ''))) {
      return 'Please enter an email address, not a phone number';
    }

    // If it contains @ symbol, validate as email
    if (email.includes('@')) {
      if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
      }
    }
    // Otherwise, treat as username (allow alphanumeric and some special chars)
    else {
      const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
      if (!usernameRegex.test(email)) {
        return 'Username must be 3-20 characters (letters, numbers, symbols)';
      }
    }

    return '';
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Real-time validation handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const error = validateEmail(value);
    setEmailError(error);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Logging in with:', email, password);
      
      // Navigate to dashboard (you can replace this with your dashboard route)
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="logo-container">
            <img 
              src="/agriangat-logo.png" 
              alt="AgriAngat" 
              className="logo"
            />
            <span className="logo-text">AgriAngat</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>Banking Portal</span>
          </div>
        </div>

        {/* Navigation Toggle */}
        <div className="auth-nav">
          <Link 
            to="/register" 
            className="auth-nav-button"
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="auth-nav-button active"
          >
            Login
          </Link>
        </div>

        {/* Main Content */}
        <div className="auth-content">
          <h1 className="auth-title">Bank Representative Login</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <div className={`input-wrapper ${emailError ? 'error' : ''}`}>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={handleEmailChange}
                  className="auth-input"
                  autoComplete="username"
                />
              </div>
              {emailError && (
                <span className="error-text">{emailError}</span>
              )}
            </div>

            <div className="input-group">
              <div className={`input-wrapper password-wrapper ${passwordError ? 'error' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="auth-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordError && (
                <span className="error-text">{passwordError}</span>
              )}
            </div>

            <button 
              type="submit" 
              className={`auth-button primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-links">
              <Link to="/forgot-password" className="forgot-password">
                Forgot password? <span className="link-text">Reset</span>
              </Link>
            </div>

            <div className="auth-footer">
              <span>Don't have an account? </span>
              <Link to="/register" className="link-text">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;