import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const RegistrationSuccess = () => {
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
          <h1 className="auth-title">Bank Registration Successful! 🎉</h1>

          <div className="info-message" style={{ marginBottom: '30px' }}>
            <strong>Thank you for registering your bank branch with AgriAngat!</strong>
            <br /><br />
            Your bank representative registration has been received and is currently under review by our administrators. 
            You will receive an email confirmation once your account has been verified and activated.
          </div>

          <div className="auth-form">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                In the meantime, feel free to explore our platform or contact our support team if you have any questions.
              </p>
            </div>

            <Link 
              to="/login" 
              className="auth-button primary"
              style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
            >
              Go to Login
            </Link>

            <div className="auth-footer">
              <span>Need help? </span>
              <a href="mailto:support@agriangat.com" className="link-text">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;