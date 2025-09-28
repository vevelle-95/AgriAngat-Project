import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = (type) => {
    if (type === 'farmer') {
      navigate('/register/farmer');
    } else if (type === 'banker') {
      navigate('/register/banker');
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
            className="auth-nav-button active"
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="auth-nav-button"
          >
            Login
          </Link>
        </div>

        {/* Main Content */}
        <div className="auth-content">
          <h1 className="auth-title">Bank Representative Registration</h1>

          <div className="auth-form">
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
                Register as a bank representative to connect with farmers and provide 
                agricultural financial services through the AgriAngat platform.
              </p>
            </div>

            <button
              onClick={() => handleUserTypeSelection('banker')}
              className="account-type-button banker"
            >
              Register Bank Representative Account
            </button>

            <div className="auth-footer">
              <span>Already have an account? </span>
              <Link to="/login" className="link-text">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;