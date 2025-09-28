import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    setEmailError(error);
    
    if (error) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <img 
                src="/agriangat-logo.png" 
                alt="AgriAngat" 
                className="logo"
              />
              <span className="logo-text">AgriAngat</span>
            </div>
          </div>

          <div className="auth-content">
            <h1 className="auth-title">Check Your Email</h1>

            <div className="info-message" style={{ marginBottom: '30px' }}>
              We've sent a password reset link to <strong>{email}</strong>
              <br /><br />
              Please check your email and follow the instructions to reset your password.
            </div>

            <div className="auth-form">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ color: '#666' }}>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <button 
                onClick={() => setEmailSent(false)}
                className="auth-button primary"
              >
                Try Again
              </button>

              <div className="auth-footer">
                <Link to="/login" className="link-text">Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <img 
              src="/agriangat-logo.png" 
              alt="AgriAngat" 
              className="logo"
            />
            <span className="logo-text">AgriAngat</span>
          </div>
        </div>

        <div className="auth-content">
          <h1 className="auth-title">Reset Password</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="input-group">
              <div className={`input-wrapper ${emailError ? 'error' : ''}`}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value));
                  }}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
              {emailError && (
                <span className="error-text">{emailError}</span>
              )}
            </div>

            <button 
              type="submit" 
              className={`auth-button primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="auth-footer">
              <Link to="/login" className="link-text">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;