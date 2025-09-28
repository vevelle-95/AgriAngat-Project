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
import notificationIcon from '../components/notification (1).png';
import avatar117 from '../components/117.png';
// Using a generic gear/user icon - we'll create a CSS-based icon for the blue gear
const gearIcon = '../components/117.png'; // Placeholder, we'll style it as blue gear

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('overview');

  // Sample data for the dashboard
  const overviewStats = [
    {
      title: 'Total Farmers Onboarded',
      value: '100',
      change: '+15%',
      positive: true,
      icon: peopleIcon,
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
      icon: healthIcon,
      action: 'View More'
    },
    {
      title: 'Repayment Frequency',
      value: 'Quarterly',
      change: '+10%',
      positive: true,
      icon: papperIcon,
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
      useBlueGear: true
    },
    {
      name: 'Cordell Edwards',
      amount: '₱ 1567.80',
      products: '95 Products',
      risk: 'Medium Risk',
      badge: '+Silver',
      useBlueGear: true
    },
    {
      name: 'Derrick Spencer',
      amount: '₱ 1640.26',
      products: '120 Products',
      risk: 'Medium Risk',
      badge: '+Silver',
      useBlueGear: true
    },
    {
      name: 'Larissa Burton',
      amount: '₱ 2340.58',
      products: '120 Products',
      risk: 'Low Risk',
      badge: '+Gold',
      useBlueGear: true
    }
  ];

  const menuItems = [
    { id: 'overview', label: 'Portfolio Analytics', icon: statsIcon, active: true },
    { id: 'profile', label: 'Farmer Profile', icon: peopleIcon },
    { id: 'loan', label: 'Loan Application', icon: papperIcon },
    { id: 'esg', label: 'ESG Breakdown', icon: healthIcon },
    { id: 'credit', label: 'Creditworthiness', icon: staressIcon }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/agriangat-logo.png" alt="AgriAngat" className="sidebar-logo" />
            <span className="sidebar-logo-text">AGRIANGAT</span>
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
          <div className="bpi-crown">👑</div>
          <span className="bpi-text">BPI</span>
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
              />
              <img src={searchIcon} alt="Search" className="search-icon" />
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
                <div className="legend-item">
                  <div className="legend-dot approved"></div>
                  <span>Approved</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot submitted"></div>
                  <span>Submitted</span>
                </div>
              </div>
            </div>
            <div className="chart-placeholder">
              {/* Placeholder for loan application chart */}
              <div className="chart-visual">Chart visualization would go here</div>
            </div>
          </div>

          {/* ESG Adoption Trend */}
          <div className="chart-card esg-chart">
            <div className="chart-header">
              <h3>ESG Adoption Trend</h3>
            </div>
            <div className="chart-placeholder">
              {/* Placeholder for ESG trend chart */}
              <div className="chart-visual">ESG trend visualization would go here</div>
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
              <thead>
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
                      <div className="blue-gear-avatar">⚙</div>
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