import React from 'react';
import { FaUsers, FaTasks, FaChartBar, FaCheck, FaDollarSign, FaArrowUp } from 'react-icons/fa';

const AdminDashboard = ({ stats }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    users: [20, 35, 45, 60, 78, 95],
    revenue: [1200, 1800, 2400, 3200, 4100, 4800]
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="dashboard-actions">
          <button className="btn-export">Export Report</button>
          <button className="btn-refresh">Refresh Data</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            <span className="stat-trend positive">+12% this month</span>
          </div>
        </div>
        
        <div className="stat-card taskers">
          <div className="stat-icon">
            <FaTasks />
          </div>
          <div className="stat-info">
            <h3>{stats.totalTaskers}</h3>
            <p>Active Taskers</p>
            <span className="stat-trend positive">+8% this month</span>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending Approvals</p>
            <span className="stat-trend neutral">No change</span>
          </div>
        </div>
        
        <div className="stat-card completed">
          <div className="stat-icon">
            <FaCheck />
          </div>
          <div className="stat-info">
            <h3>{stats.completedTasks}</h3>
            <p>Completed Tasks</p>
            <span className="stat-trend positive">+25% this month</span>
          </div>
        </div>
        
        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>${stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-trend positive">+18% this month</span>
          </div>
        </div>
        
        <div className="stat-card growth">
          <div className="stat-icon">
            <FaArrowUp />
          </div>
          <div className="stat-info">
            <h3>94.2%</h3>
            <p>User Satisfaction</p>
            <span className="stat-trend positive">+2.1% this month</span>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>User Growth</h3>
          <div className="simple-chart">
            {chartData.labels.map((month, index) => (
              <div key={month} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${(chartData.users[index] / 100) * 100}%` }}
                ></div>
                <span className="bar-label">{month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Revenue Trend</h3>
          <div className="simple-chart">
            {chartData.labels.map((month, index) => (
              <div key={month} className="chart-bar">
                <div 
                  className="bar revenue-bar" 
                  style={{ height: `${(chartData.revenue[index] / 5000) * 100}%` }}
                ></div>
                <span className="bar-label">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon new-user">
              <FaUsers />
            </div>
            <div className="activity-content">
              <span className="activity-type">New User Registration</span>
              <span className="activity-details">John Doe registered as a new user</span>
            </div>
            <span className="activity-time">2 hours ago</span>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon new-tasker">
              <FaTasks />
            </div>
            <div className="activity-content">
              <span className="activity-type">Tasker Application</span>
              <span className="activity-details">Sarah Wilson applied for cleaning services</span>
            </div>
            <span className="activity-time">4 hours ago</span>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon completed">
              <FaCheck />
            </div>
            <div className="activity-content">
              <span className="activity-type">Task Completed</span>
              <span className="activity-details">Window cleaning task completed successfully</span>
            </div>
            <span className="activity-time">6 hours ago</span>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon revenue">
              <FaDollarSign />
            </div>
            <div className="activity-content">
              <span className="activity-type">Payment Received</span>
              <span className="activity-details">$250 payment processed for plumbing service</span>
            </div>
            <span className="activity-time">8 hours ago</span>
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <div className="quick-stat-item">
          <h4>Today's Bookings</h4>
          <span className="quick-stat-number">23</span>
        </div>
        <div className="quick-stat-item">
          <h4>Active Sessions</h4>
          <span className="quick-stat-number">156</span>
        </div>
        <div className="quick-stat-item">
          <h4>Avg. Rating</h4>
          <span className="quick-stat-number">4.8</span>
        </div>
        <div className="quick-stat-item">
          <h4>Response Time</h4>
          <span className="quick-stat-number">2.3h</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
