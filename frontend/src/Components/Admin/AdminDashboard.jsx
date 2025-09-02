import React from 'react';
import { FaUsers, FaTasks, FaChartBar, FaCheck, FaDollarSign, FaArrowUp } from 'react-icons/fa';

const AdminDashboard = ({ stats }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
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

     
    </div>
  );
};

export default AdminDashboard;
