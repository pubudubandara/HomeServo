import React from 'react';
import { FaUsers, FaTasks, FaChartBar, FaCalendarCheck, FaClock, FaCheckCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = ({ stats }) => {
  // Process monthly stats for chart
  const processMonthlyData = () => {
    if (!stats.monthlyStats || !Array.isArray(stats.monthlyStats)) {
      return [];
    }

    return stats.monthlyStats.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      bookings: item.bookings || 0,
      revenue: item.revenue || 0
    })).slice(-6); // Show last 6 months
  };

  const monthlyData = processMonthlyData();

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
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card taskers">
          <div className="stat-icon">
            <FaTasks />
          </div>
          <div className="stat-info">
            <h3>{stats.totalTaskers || 0}</h3>
            <p>Total Taskers</p>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingTasks || 0}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        
        <div className="stat-card bookings">
          <div className="stat-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-info">
            <h3>{stats.totalBookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        
        <div className="stat-card completed-bookings">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.completedBookings || 0}</h3>
            <p>Completed Bookings</p>
          </div>
        </div>
        
        <div className="stat-card in-progress">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{stats.inProgressBookings || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card pending-bookings">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingBookings || 0}</h3>
            <p>Pending Bookings</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-info">
            <h3>${stats.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
