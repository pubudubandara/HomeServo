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
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card taskers">
          <div className="stat-icon">
            <FaTasks />
          </div>
          <div className="stat-info">
            <h3>{stats.totalTaskers}</h3>
            <p>Active Taskers</p>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingTasks}</h3>
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
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Monthly Booking Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Month: ${label}`}
                formatter={(value, name) => [value, name === 'bookings' ? 'Bookings' : 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#218838" 
                strokeWidth={3}
                dot={{ fill: '#218838', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#218838', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
