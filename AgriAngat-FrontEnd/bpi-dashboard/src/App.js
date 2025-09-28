import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './App.css';

// Import authentication pages
import Login from './pages/Login';
import Register from './pages/Register';
import BankerRegister from './pages/BankerRegister';
import RegistrationSuccess from './pages/RegistrationSuccess';
import ForgotPassword from './pages/ForgotPassword';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  useEffect(() => {
    let loanChart, esgChart;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Initialize Loan Application Chart
      const loanCtx = document.getElementById('loanChart');
      if (loanCtx) {
        try {
          loanChart = new ChartJS(loanCtx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Approved',
              data: [30, 25, 40, 35, 45, 42],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Submitted',
              data: [20, 15, 30, 25, 35, 30],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              fill: true,
              tension: 0.4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
        } catch (error) {
          console.error('Error initializing loan chart:', error);
        }
      }

      // Initialize ESG Chart
      const esgCtx = document.getElementById('esgChart');
      if (esgCtx) {
        try {
          esgChart = new ChartJS(esgCtx, {
        type: 'line',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'ESG Adoption',
              data: [65, 70, 75, 80],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
        } catch (error) {
          console.error('Error initializing ESG chart:', error);
        }
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (loanChart) {
        loanChart.destroy();
      }
      if (esgChart) {
        esgChart.destroy();
      }
    };
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">A</span>
            </div>
            <span className="brand-name">AGRIANGAT</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">📊</span>{' '}
            Portfolio Analytics
          </div>
          <div className="nav-item">
            <span className="nav-icon">👤</span>{' '}
            Farmer Profile
          </div>
          <div className="nav-item">
            <span className="nav-icon">💰</span>{' '}
            Loan Application
          </div>
          <div className="nav-item">
            <span className="nav-icon">⭐</span>{' '}
            ESG Breakdown
          </div>
          <div className="nav-item">
            <span className="nav-icon">❤️</span>{' '}
            Creditworthiness
          </div>
        </nav>

        <div className="upgrade-section">
          <div className="upgrade-card">
            <div className="upgrade-icon">🚀</div>
            <p>Want to upgrade</p>
            <button className="upgrade-btn">Upgrade now</button>
          </div>
        </div>

        <div className="bpi-logo">
          <span>👑 BPI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Overview</h1>
          <div className="header-actions">
            <div className="search-container">
              <input type="text" placeholder="Search" className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
            <div className="notification-icon">🔔</div>
            <div className="user-profile">
              <img src="/logo192.png" alt="User" className="user-avatar" />
              <span>Danielle Campbell</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="card-header">
              <h3>Total Farmers Onboarded</h3>
              <span className="card-icon">👥</span>
            </div>
            <div className="card-value">100</div>
            <div className="card-change positive">
              <span className="change-indicator">▲</span>
              +15%
            </div>
            <button className="view-report-btn">View Report</button>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Total Profit</h3>
              <span className="card-icon">📈</span>
            </div>
            <div className="card-value">₱50,435</div>
            <div className="card-change negative">
              <span className="change-indicator">▼</span>
              -3.5%
            </div>
            <button className="view-report-btn">View Report</button>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Most Sustainable Practices</h3>
              <span className="card-icon">📋</span>
            </div>
            <div className="card-value">Environmental</div>
            <div className="card-change positive">
              <span className="change-indicator">▲</span>
              +15%
            </div>
            <button className="view-report-btn">View More</button>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Repayment Frequency</h3>
              <span className="card-icon">👥</span>
            </div>
            <div className="card-value">Quarterly</div>
            <div className="card-change positive">
              <span className="change-indicator">▲</span>
              +10%
            </div>
            <button className="view-report-btn">View More</button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <div className="chart-container loan-chart">
            <div className="chart-header">
              <h3>Loan Application Over Time</h3>
              <div className="chart-legend">
                <span className="legend-item approved">
                  <span className="legend-color"></span>
                  Approved
                </span>
                <span className="legend-item submitted">
                  <span className="legend-color"></span>
                  Submitted
                </span>
              </div>
            </div>
            <div className="chart-content">
              <canvas id="loanChart" width="400" height="200"></canvas>
            </div>
          </div>

          <div className="chart-container esg-chart">
            <div className="chart-header">
              <h3>ESG Adoption Trend</h3>
              <button className="export-btn">Export to CSV</button>
            </div>
            <div className="chart-content">
              <canvas id="esgChart" width="300" height="200"></canvas>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="sales-section">
          <h3>Top Sales in MarketPlace</h3>
          <div className="sales-table">
            <div className="table-row header">
              <div className="col-farmer">Farmer</div>
              <div className="col-amount">Amount</div>
              <div className="col-products">Products</div>
              <div className="col-risk">Risk Level</div>
              <div className="col-badge">Badge</div>
              <div className="col-actions">Actions</div>
            </div>
            
            <div className="table-row">
              <div className="col-farmer">
                <img src="/logo192.png" alt="Nicholas" className="farmer-avatar" />
                Nicholas Patrick
              </div>
              <div className="col-amount">₱ 2540.58</div>
              <div className="col-products">150 Products</div>
              <div className="col-risk">Low Risk</div>
              <div className="col-badge">
                <span className="badge gold">+Gold</span>
              </div>
              <div className="col-actions">
                <button className="action-btn">⋮</button>
              </div>
            </div>

            <div className="table-row">
              <div className="col-farmer">
                <img src="/logo192.png" alt="Cordell" className="farmer-avatar" />
                Cordell Edwards
              </div>
              <div className="col-amount">₱ 1567.80</div>
              <div className="col-products">95 Products</div>
              <div className="col-risk">Medium Risk</div>
              <div className="col-badge">
                <span className="badge silver">+Silver</span>
              </div>
              <div className="col-actions">
                <button className="action-btn">⋮</button>
              </div>
            </div>

            <div className="table-row">
              <div className="col-farmer">
                <img src="/logo192.png" alt="Derrick" className="farmer-avatar" />
                Derrick Spencer
              </div>
              <div className="col-amount">₱ 1640.26</div>
              <div className="col-products">120 Products</div>
              <div className="col-risk">Medium Risk</div>
              <div className="col-badge">
                <span className="badge silver">+Silver</span>
              </div>
              <div className="col-actions">
                <button className="action-btn">⋮</button>
              </div>
            </div>

            <div className="table-row">
              <div className="col-farmer">
                <img src="/logo192.png" alt="Larissa" className="farmer-avatar" />
                Larissa Burton
              </div>
              <div className="col-amount">₱ 2340.58</div>
              <div className="col-products">120 Products</div>
              <div className="col-risk">Low Risk</div>
              <div className="col-badge">
                <span className="badge gold">+Gold</span>
              </div>
              <div className="col-actions">
                <button className="action-btn">⋮</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/banker" element={<BankerRegister />} />
          <Route path="/register/success" element={<RegistrationSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
