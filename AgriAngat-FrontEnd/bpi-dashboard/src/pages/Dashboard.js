import React, { useState } from 'react';
import './Dashboard.css';

// Import images from components folder
import peopleIcon from '../components/peoplee.png';
import statsIcon from '../components/stats.png';
import healthIcon from '../components/Health.png';
import papperIcon from '../components/papper.png';
import staressIcon from '../components/staress.png';
import upgradeIcon from '../components/2625766.png';
import searchIcon from '../components/mglass.png';
import thedots from '../components/green-dots.png';
import greenpaper from '../components/green-paper.png';
import greensave from '../components/green-save.png';
import notificationIcon from '../components/notification (1).png';
import shoppingcar from '../components/shopping-car.png';
import bpiLogo from '../components/image 1.png';
import avatar117 from '../components/117.png';
import avatar113 from '../components/113.png';
import avatar114 from '../components/114.png';
import avatar115 from '../components/115.png';
import avatar116 from '../components/116.jpg';
import agriAngatText from '../components/agriangat-text.png';

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('overview');
  const [searchValue, setSearchValue] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [hoveredSeries, setHoveredSeries] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState({ approved: true, submitted: true });

  // Chart data with more detailed information
  const loanChartData = [
    { month: 'Jan', approved: 35, submitted: 25, date: 'January 2024' },
    { month: 'Feb', approved: 28, submitted: 38, date: 'February 2024' },
    { month: 'Mar', approved: 42, submitted: 35, date: 'March 2024' },
    { month: 'Apr', approved: 38, submitted: 45, date: 'April 2024' },
    { month: 'May', approved: 48, submitted: 40, date: 'May 2024' },
    { month: 'Jun', approved: 42, submitted: 35, date: 'June 2024' }
  ];

  const handleSeriesToggle = (series) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  };

  const handleDataPointHover = (e, data, series) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + window.scrollX + 10,
      y: rect.top + window.scrollY - 30,
      content: `${data.date} • ${series === 'approved' ? 'Approved' : 'Submitted'}: ${data[series]}`
    });
  };

  const handleDataPointLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' });
  };


  const overviewStats = [
    {
      title: 'Total Farmers Onboarded',
      value: '100',
      change: '+15%',
      positive: true,
      icon: shoppingcar,
      action: 'View Report'
    },
    {
      title: 'Total Profit',
      value: '₱50,435',
      change: '-3.5%',
      positive: false,
      icon: statsIcon,
      action: 'View Report'
    },
    {
      title: 'Most Sustainable Practices',
      value: 'Environmental',
      change: '+15%',
      positive: true,
      icon: papperIcon,
      action: 'View More'
    },
    {
      title: 'Repayment Frequency',
      value: 'Quarterly',
      change: '+10%',
      positive: true,
      icon: peopleIcon,
      action: 'View More'
    }
  ];

  const topSales = [
    {
      name: 'Nicholas Patrick',
      amount: '₱ 2540.58',
      products: '150 Products',
      risk: 'Low Risk',
      badge: '+Gold',
      avatarPath: avatar113
    },
    {
      name: 'Cordell Edwards',
      amount: '₱ 1567.80',
      products: '95 Products',
      risk: 'Medium Risk',
      badge: '+Silver',
      avatarPath: avatar114
    },
    {
      name: 'Derrick Spencer',
      amount: '₱ 1640.26',
      products: '120 Products',
      risk: 'Medium Risk',
      badge: '+Silver',
      avatarPath: avatar115
    },
    {
      name: 'Larissa Burton',
      amount: '₱ 2340.58',
      products: '120 Products',
      risk: 'Low Risk',
      badge: '+Gold',
      avatarPath: avatar116
    }
  ];

  const menuItems = [
    { id: 'overview', label: 'Portfolio Analytics', icon: thedots, active: true },
    { id: 'profile', label: 'Farmer Profile', icon: greenpaper },
    { id: 'loan', label: 'Loan Application', icon: greensave },
    { id: 'esg', label: 'ESG Breakdown', icon: staressIcon },
    { id: 'credit', label: 'Creditworthiness', icon: healthIcon }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-container-vertical">
            <div className="logo-circle">
              <img src="/agriangat-logo.png" alt="AgriAngat" className="sidebar-logo" />
            </div>
            <img src={agriAngatText} alt="AGRIANGAT" className="sidebar-logo-image" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenuItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenuItem(item.id)}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Upgrade Section */}
        <div className="upgrade-section">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <img src={upgradeIcon} alt="Upgrade" className="upgrade-img" />
            </div>
            <p className="upgrade-text">Want to upgrade</p>
            <button className="upgrade-button">Upgrade now</button>
          </div>
        </div>

        {/* BPI Logo */}
        <div className="bpi-logo">
          <img src={bpiLogo} alt="BPI" className="bpi-logo-image" />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Overview</h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <img src={searchIcon} alt="Search" className="search-icon" />
              <button 
                className={`clear-button ${searchValue ? 'show' : ''}`}
                onClick={() => setSearchValue('')}
              >
                ×
              </button>
            </div>
            <div className="notification-icon">
              <img src={notificationIcon} alt="Notifications" />
            </div>
            <div className="user-profile">
              <img src={avatar117} alt="User" className="profile-avatar" />
              <span className="profile-name">Danielle Campbell</span>
              <span className="profile-dropdown">▼</span>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="overview-stats">
          {overviewStats.map((stat) => (
            <div key={stat.title} className="stat-card">
              <div className="stat-header">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                    <span className="change-indicator">{stat.positive ? '↗' : '↘'}</span>
                    <span className="change-value">{stat.change}</span>
                  </div>
                </div>
                <div className="stat-icon">
                  <img src={stat.icon} alt={stat.title} />
                </div>
              </div>
              <button className="stat-action">{stat.action}</button>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Loan Application Chart */}
          <div className="chart-card loan-chart">
            <div className="chart-header">
              <h3>Loan Application Over Time</h3>
              <div className="chart-legend">
                <button 
                  className={`legend-item ${!visibleSeries.approved ? 'inactive' : ''}`}
                  onClick={() => handleSeriesToggle('approved')}
                  aria-label="Toggle approved series visibility"
                >
                  <div className="legend-dot approved"></div>
                  <span>Approved</span>
                </button>
                <button 
                  className={`legend-item ${!visibleSeries.submitted ? 'inactive' : ''}`}
                  onClick={() => handleSeriesToggle('submitted')}
                  aria-label="Toggle submitted series visibility"
                >
                  <div className="legend-dot submitted"></div>
                  <span>Submitted</span>
                </button>
              </div>
            </div>
            <div className="chart-placeholder">
              <div className="loan-chart-visual">
                <svg viewBox="0 0 480 220" className="chart-svg">
                  <defs>
                    {/* Gradients for area fills */}
                    <linearGradient id="approvedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#ff8a95', stopOpacity:0.8}} />
                      <stop offset="100%" style={{stopColor:'#ff8a95', stopOpacity:0.1}} />
                    </linearGradient>
                    <linearGradient id="submittedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#8b8b8b', stopOpacity:0.8}} />
                      <stop offset="100%" style={{stopColor:'#8b8b8b', stopOpacity:0.1}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Y-Axis Labels */}
                  <text x="25" y="40" textAnchor="middle" fontSize="10" fill="#9ca3af">50</text>
                  <text x="25" y="70" textAnchor="middle" fontSize="10" fill="#9ca3af">40</text>
                  <text x="25" y="100" textAnchor="middle" fontSize="10" fill="#9ca3af">30</text>
                  <text x="25" y="130" textAnchor="middle" fontSize="10" fill="#9ca3af">20</text>
                  <text x="25" y="160" textAnchor="middle" fontSize="10" fill="#9ca3af">10</text>
                  <text x="25" y="190" textAnchor="middle" fontSize="10" fill="#9ca3af">0</text>
                  
                  {/* X-Axis Labels */}
                  <text x="80" y="210" textAnchor="middle" fontSize="10" fill="#9ca3af">Jan</text>
                  <text x="150" y="210" textAnchor="middle" fontSize="10" fill="#9ca3af">Feb</text>
                  <text x="220" y="210" textAnchor="middle" fontSize="10" fill="#9ca3af">Mar</text>
                  <text x="290" y="210" textAnchor="middle" fontSize="10" fill="#9ca3af">Apr</text>
                  <text x="360" y="210" textAnchor="middle" fontSize="10" fill="#9ca3af">May</text>
                  <text x="430" y="210" textAnchor="middle" fontSize="10" fill="#9ca3af">Jun</text>
                  
                  {/* Submitted Applications Area */}
                  {visibleSeries.submitted && (
                    <>
                      <path
                        d="M 50 160 C 80 150, 120 125, 150 120 C 180 115, 220 135, 290 105 C 320 95, 360 120, 430 105 L 430 190 L 50 190 Z"
                        fill="url(#submittedGradient)"
                        className="chart-area submitted-area"
                      />
                      <path
                        d="M 50 160 C 80 150, 120 125, 150 120 C 180 115, 220 135, 290 105 C 320 95, 360 120, 430 105"
                        stroke="#6b7280"
                        strokeWidth={hoveredSeries === 'submitted' ? "4" : "2.5"}
                        fill="none"
                        strokeLinecap="round"
                        className="chart-line submitted-line"
                        onMouseEnter={() => setHoveredSeries('submitted')}
                        onMouseLeave={() => setHoveredSeries(null)}
                      />
                    </>
                  )}
                  
                  {/* Approved Applications Area */}
                  {visibleSeries.approved && (
                    <>
                      <path
                        d="M 50 170 C 80 150, 120 125, 150 85 C 180 45, 220 65, 290 75 C 320 85, 360 85, 430 70 L 430 190 L 50 190 Z"
                        fill="url(#approvedGradient)"
                        className="chart-area approved-area"
                      />
                      <path
                        d="M 50 170 C 80 150, 120 125, 150 85 C 180 45, 220 65, 290 75 C 320 85, 360 85, 430 70"
                        stroke="#ff6b81"
                        strokeWidth={hoveredSeries === 'approved' ? "4" : "2.5"}
                        fill="none"
                        strokeLinecap="round"
                        className="chart-line approved-line"
                        onMouseEnter={() => setHoveredSeries('approved')}
                        onMouseLeave={() => setHoveredSeries(null)}
                      />
                    </>
                  )}
                  
                  {/* Interactive Data Points - Approved Series */}
                  {visibleSeries.approved && (
                    <>
                      {/* Jan - Starting point of curve */}
                      <circle cx="80" cy="150" r="6" fill="#ff6b81" stroke="white" strokeWidth="2" className="interactive-point approved-point" 
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[0], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      {/* Invisible larger circle for better hit detection */}
                      <circle cx="80" cy="150" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[0], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Feb */}
                      <circle cx="150" cy="85" r="6" fill="#ff6b81" stroke="white" strokeWidth="2" className="interactive-point approved-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[1], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="150" cy="85" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[1], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Mar */}
                      <circle cx="220" cy="65" r="6" fill="#ff6b81" stroke="white" strokeWidth="2" className="interactive-point approved-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[2], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="220" cy="65" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[2], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Apr */}
                      <circle cx="290" cy="75" r="6" fill="#ff6b81" stroke="white" strokeWidth="2" className="interactive-point approved-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[3], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="290" cy="75" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[3], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* May */}
                      <circle cx="360" cy="85" r="6" fill="#ff6b81" stroke="white" strokeWidth="2" className="interactive-point approved-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[4], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="360" cy="85" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[4], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Jun */}
                      <circle cx="430" cy="70" r="6" fill="#ff6b81" stroke="white" strokeWidth="2" className="interactive-point approved-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[5], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="430" cy="70" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[5], 'approved')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                    </>
                  )}
                  
                  {/* Interactive Data Points - Submitted Series */}
                  {visibleSeries.submitted && (
                    <>
                      {/* Jan */}
                      <circle cx="80" cy="150" r="6" fill="#6b7280" stroke="white" strokeWidth="2" className="interactive-point submitted-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[0], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="80" cy="150" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[0], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Feb */}
                      <circle cx="150" cy="120" r="6" fill="#6b7280" stroke="white" strokeWidth="2" className="interactive-point submitted-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[1], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="150" cy="120" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[1], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Mar */}
                      <circle cx="220" cy="135" r="6" fill="#6b7280" stroke="white" strokeWidth="2" className="interactive-point submitted-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[2], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="220" cy="135" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[2], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Apr */}
                      <circle cx="290" cy="105" r="6" fill="#6b7280" stroke="white" strokeWidth="2" className="interactive-point submitted-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[3], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="290" cy="105" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[3], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* May */}
                      <circle cx="360" cy="120" r="6" fill="#6b7280" stroke="white" strokeWidth="2" className="interactive-point submitted-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[4], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="360" cy="120" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[4], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      
                      {/* Jun */}
                      <circle cx="430" cy="105" r="6" fill="#6b7280" stroke="white" strokeWidth="2" className="interactive-point submitted-point"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[5], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                      <circle cx="430" cy="105" r="12" fill="transparent" className="interactive-point-hit-area"
                        onMouseEnter={(e) => handleDataPointHover(e, loanChartData[5], 'submitted')} onMouseLeave={handleDataPointLeave} style={{ cursor: 'pointer' }} />
                    </>
                  )}
                </svg>
                
                {/* Tooltip */}
                {tooltip.visible && (
                  <div 
                    className="chart-tooltip"
                    style={{
                      position: 'fixed',
                      left: tooltip.x,
                      top: tooltip.y,
                      background: '#1f2937',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      zIndex: 1000,
                      pointerEvents: 'none'
                    }}
                  >
                    {tooltip.content}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ESG Adoption Trend */}
          <div className="chart-card esg-chart">
            <div className="chart-header">
              <h3>ESG Adoption Trend</h3>
            </div>
            <div className="chart-placeholder">
              <div className="esg-chart-visual">
                <svg viewBox="0 0 480 220" className="chart-svg">
                  <defs>
                    {/* Multiple gradient layers for stacked area effect */}
                    <linearGradient id="blueLayer" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#93c5fd', stopOpacity:0.8}} />
                      <stop offset="100%" style={{stopColor:'#93c5fd', stopOpacity:0.3}} />
                    </linearGradient>
                    <linearGradient id="greenLayer" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#86efac', stopOpacity:0.8}} />
                      <stop offset="100%" style={{stopColor:'#86efac', stopOpacity:0.3}} />
                    </linearGradient>
                    <linearGradient id="yellowLayer" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#fde047', stopOpacity:0.8}} />
                      <stop offset="100%" style={{stopColor:'#fde047', stopOpacity:0.3}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Y-Axis Values */}
                  <text x="15" y="35" textAnchor="middle" fontSize="10" fill="#9ca3af">1000</text>
                  <text x="15" y="70" textAnchor="middle" fontSize="10" fill="#9ca3af">800</text>
                  <text x="15" y="105" textAnchor="middle" fontSize="10" fill="#9ca3af">600</text>
                  <text x="15" y="140" textAnchor="middle" fontSize="10" fill="#9ca3af">400</text>
                  <text x="15" y="175" textAnchor="middle" fontSize="10" fill="#9ca3af">0</text>
                  
                  {/* X-Axis Numbers */}
                  <text x="60" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">1</text>
                  <text x="110" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">2</text>
                  <text x="160" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">3</text>
                  <text x="210" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">4</text>
                  <text x="260" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">5</text>
                  <text x="310" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">6</text>
                  <text x="360" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">7</text>
                  <text x="410" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">8</text>
                  <text x="460" y="200" textAnchor="middle" fontSize="10" fill="#9ca3af">9</text>
                  
                  {/* Bottom Yellow Layer */}
                  <path
                    d="M 60 165 C 90 160, 130 155, 160 150 C 190 145, 230 140, 260 135 C 290 130, 330 125, 360 120 C 390 115, 430 110, 460 105 L 460 175 L 60 175 Z"
                    fill="url(#yellowLayer)"
                  />
                  
                  {/* Middle Green Layer */}
                  <path
                    d="M 60 145 C 90 140, 130 130, 160 125 C 190 120, 230 110, 260 105 C 290 100, 330 90, 360 85 C 390 80, 430 70, 460 65 L 460 175 L 60 175 Z"
                    fill="url(#greenLayer)"
                  />
                  
                  {/* Top Blue Layer */}
                  <path
                    d="M 60 125 C 90 120, 130 110, 160 105 C 190 100, 230 90, 260 85 C 290 80, 330 70, 360 65 C 390 60, 430 50, 460 45 L 460 175 L 60 175 Z"
                    fill="url(#blueLayer)"
                  />
                  
                  {/* Border lines for each layer */}
                  <path
                    d="M 60 125 C 90 120, 130 110, 160 105 C 190 100, 230 90, 260 85 C 290 80, 330 70, 360 65 C 390 60, 430 50, 460 45"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    className="chart-line esg-line-blue"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.target.style.strokeWidth = "3";
                      e.target.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.strokeWidth = "1.5";
                      e.target.style.opacity = "0.7";
                    }}
                  />
                  
                  <path
                    d="M 60 145 C 90 140, 130 130, 160 125 C 190 120, 230 110, 260 105 C 290 100, 330 90, 360 85 C 390 80, 430 70, 460 65"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    className="chart-line esg-line-green"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.target.style.strokeWidth = "3";
                      e.target.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.strokeWidth = "1.5";
                      e.target.style.opacity = "0.7";
                    }}
                  />
                  
                  <path
                    d="M 60 165 C 90 160, 130 155, 160 150 C 190 145, 230 140, 260 135 C 290 130, 330 125, 360 120 C 390 115, 430 110, 460 105"
                    stroke="#eab308"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    className="chart-line esg-line-yellow"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.target.style.strokeWidth = "3";
                      e.target.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.strokeWidth = "1.5";
                      e.target.style.opacity = "0.7";
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Sales Table */}
        <div className="sales-section">
          <div className="sales-header">
            <h3>Top Sales in MarketPlace</h3>
            <button className="export-btn">Export to CSV</button>
          </div>
          <div className="sales-table">
            <table>
              <thead style={{ display: 'none' }}>
                <tr>
                  <th>FARMER</th>
                  <th>AMOUNT</th>
                  <th>PRODUCTS</th>
                  <th>RISK LEVEL</th>
                  <th>BADGE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {topSales.map((sale) => (
                  <tr key={sale.name}>
                    <td className="name-cell">
                      <img src={sale.avatarPath} alt={sale.name} className="avatar" />
                      <span>{sale.name}</span>
                    </td>
                    <td className="amount">{sale.amount}</td>
                    <td className="products">{sale.products}</td>
                    <td className={`risk ${sale.risk.toLowerCase().replace(' ', '-')}`}>
                      {sale.risk}
                    </td>
                    <td className={`badge ${sale.badge.includes('Gold') ? 'gold' : 'silver'}`}>
                      {sale.badge}
                    </td>
                    <td className="actions">
                      <button className="action-btn">⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;