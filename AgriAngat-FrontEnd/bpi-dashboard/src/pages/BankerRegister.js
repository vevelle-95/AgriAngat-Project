import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import onboardingImage from '../components/onboarding.png';

const BankerRegister = () => {
  const navigate = useNavigate();

  // Bank Representative Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [position, setPosition] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  // Bank Branch Information  
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchCity, setBranchCity] = useState('');
  const [branchProvince, setBranchProvince] = useState('');
  const [branchPostalCode, setBranchPostalCode] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchEmail, setBranchEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  
  // Operating Details
  const [operatingHours, setOperatingHours] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [territoryServed, setTerritoryServed] = useState('');
  const [agriBankingExperience, setAgriBankingExperience] = useState('');
  
  // Auth info
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+63|0)[2-9]\d{8,9}$/;
    if (!phone.trim()) return 'Phone number is required';
    if (!phoneRegex.test(phone.replace(/[\s-()]/g, ''))) {
      return 'Please enter a valid Philippine phone number';
    }
    return '';
  };

  const validateRequired = (value, fieldName) => {
    if (!value?.trim()) return `${fieldName} is required`;
    return '';
  };

  const validatePassword = (password) => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const validateAllFields = () => {
    return {
      firstName: validateRequired(firstName, 'First name'),
      lastName: validateRequired(lastName, 'Last name'),
      email: validateEmail(email),
      contactNumber: validatePhoneNumber(contactNumber),
      position: validateRequired(position, 'Position'),
      employeeId: validateRequired(employeeId, 'Employee ID'),

      branchName: validateRequired(branchName, 'Branch name'),
      branchCode: validateRequired(branchCode, 'Branch code'),
      branchAddress: validateRequired(branchAddress, 'Branch address'),
      branchCity: validateRequired(branchCity, 'Branch city'),
      branchProvince: validateRequired(branchProvince, 'Branch province'),
      branchPostalCode: validateRequired(branchPostalCode, 'Postal code'),
      branchPhone: validatePhoneNumber(branchPhone),
      branchEmail: validateEmail(branchEmail),
      managerName: validateRequired(managerName, 'Branch manager name'),
      managerEmail: validateEmail(managerEmail),
      operatingHours: validateRequired(operatingHours, 'Operating hours'),
      servicesOffered: validateRequired(servicesOffered, 'Services offered'),
      territoryServed: validateRequired(territoryServed, 'Territory served'),
      password: validatePassword(password),
      confirmPassword: password !== confirmPassword ? 'Passwords do not match' : '',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateAllFields();
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasErrors) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Banker registration data:', {
        personalInfo: { firstName, lastName, email, contactNumber, position, employeeId },
        branchInfo: { 
          bankName: 'Bank of the Philippine Islands', branchName, branchCode, branchAddress, branchCity, 
          branchProvince, branchPostalCode, branchPhone, branchEmail, 
          managerName, managerEmail 
        },
        operatingInfo: { operatingHours, servicesOffered, territoryServed, agriBankingExperience }
      });
      
      navigate('/register/success');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container banker-form-split">
      <div className="auth-split-container">
        {/* Left Side - Form */}
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="banker-top-header">
              <button 
                type="button" 
                onClick={() => navigate('/register')}
                className="header-back-button"
              >
                ← Back
              </button>
              <div className="header-logo-container">
                <img src="/agriangat-logo.png" alt="AgriAngat" className="header-logo" />
                <div className="header-text">
                  <span className="header-logo-text">AgriAngat</span>
                  <span className="header-subtitle">For Banks</span>
                </div>
              </div>
            </div>

            <div className="auth-content">
          <h1 className="auth-title">Bank Representative Registration</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h2 className="section-title">Representative Information</h2>
              
              <div className="form-grid">
                <div className="input-group">
                  <div className={`input-wrapper ${errors.firstName ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                
                <div className="input-group">
                  <div className={`input-wrapper ${errors.lastName ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                    <input
                      type="email"
                      placeholder="Personal Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.contactNumber ? 'error' : ''}`}>
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.position ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Position/Title"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.position && <span className="error-text">{errors.position}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.employeeId ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Employee ID"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.employeeId && <span className="error-text">{errors.employeeId}</span>}
                </div>
              </div>
            </div>

            {/* Bank Branch Information Section */}
            <div className="form-section">
              <h2 className="section-title">BPI Bank Branch Details</h2>

              <div className="form-grid">

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchName ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Branch Name"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchName && <span className="error-text">{errors.branchName}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchCode ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Branch Code"
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchCode && <span className="error-text">{errors.branchCode}</span>}
                </div>

                <div className="input-group form-grid-full">
                  <div className={`input-wrapper ${errors.branchAddress ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Branch Complete Address"
                      value={branchAddress}
                      onChange={(e) => setBranchAddress(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchAddress && <span className="error-text">{errors.branchAddress}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchCity ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="City"
                      value={branchCity}
                      onChange={(e) => setBranchCity(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchCity && <span className="error-text">{errors.branchCity}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchProvince ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Province"
                      value={branchProvince}
                      onChange={(e) => setBranchProvince(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchProvince && <span className="error-text">{errors.branchProvince}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchPostalCode ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={branchPostalCode}
                      onChange={(e) => setBranchPostalCode(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchPostalCode && <span className="error-text">{errors.branchPostalCode}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchPhone ? 'error' : ''}`}>
                    <input
                      type="tel"
                      placeholder="Branch Phone Number"
                      value={branchPhone}
                      onChange={(e) => setBranchPhone(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchPhone && <span className="error-text">{errors.branchPhone}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.branchEmail ? 'error' : ''}`}>
                    <input
                      type="email"
                      placeholder="Branch Email"
                      value={branchEmail}
                      onChange={(e) => setBranchEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.branchEmail && <span className="error-text">{errors.branchEmail}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.managerName ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Branch Manager Name"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.managerName && <span className="error-text">{errors.managerName}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.managerEmail ? 'error' : ''}`}>
                    <input
                      type="email"
                      placeholder="Manager Email"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.managerEmail && <span className="error-text">{errors.managerEmail}</span>}
                </div>
              </div>
            </div>

            {/* Operating Information Section */}
            <div className="form-section">
              <h2 className="section-title">Branch Operations</h2>

              <div className="form-grid">
                <div className="input-group">
                  <div className={`input-wrapper ${errors.operatingHours ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Operating Hours (e.g., Mon-Fri 9AM-4PM)"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.operatingHours && <span className="error-text">{errors.operatingHours}</span>}
                </div>

                <div className="input-group">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Years in Agricultural Banking (optional)"
                      value={agriBankingExperience}
                      onChange={(e) => setAgriBankingExperience(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="input-group form-grid-full">
                  <div className={`input-wrapper ${errors.servicesOffered ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Services Offered (e.g., Agricultural Loans, Crop Insurance, Equipment Financing)"
                      value={servicesOffered}
                      onChange={(e) => setServicesOffered(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.servicesOffered && <span className="error-text">{errors.servicesOffered}</span>}
                </div>

                <div className="input-group form-grid-full">
                  <div className={`input-wrapper ${errors.territoryServed ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="Territory/Areas Served (Cities, Municipalities)"
                      value={territoryServed}
                      onChange={(e) => setTerritoryServed(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.territoryServed && <span className="error-text">{errors.territoryServed}</span>}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="form-section">
              <h2 className="section-title">Account Security</h2>

              <div className="form-grid">
                <div className="input-group">
                  <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="input-group">
                  <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>

            <div className="info-message">
              <strong>Note:</strong> This registration will be reviewed by AgriAngat administrators. 
              You will receive an email confirmation once your account is approved and activated.
            </div>

            <div className="disclaimer">
              By submitting this registration, you confirm that you are an authorized representative 
              of the specified bank branch and that all information provided is accurate and up-to-date.
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/register')}
                className="auth-button secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`auth-button primary form-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            <div className="auth-footer">
              <span>Already have an account? </span>
              <Link to="/login" className="link-text">Login</Link>
            </div>
          </form>
            </div>
          </div>
        </div>

        {/* Right Side - Onboarding Image */}
        <div className="auth-image-side">
          <img src={onboardingImage} alt="AgriAngat Onboarding" className="onboarding-image" />
        </div>
      </div>
    </div>
  );
};

export default BankerRegister;