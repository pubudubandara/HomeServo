import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';
import { FaUsers, FaTasks, FaChartBar, FaCog, FaCheck, FaTimes, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import AdminDashboard from '../../Components/Admin/AdminDashboard';
import TaskApproval from '../../Components/Admin/TaskApproval';
import UserManagement from '../../Components/Admin/UserManagement';
import { adminAPI } from '../../utils/adminAPI';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [taskers, setTaskers] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTaskers: 0,
    pendingTasks: 0,
    completedTasks: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    users: { currentPage: 1, totalPages: 1 },
    taskers: { currentPage: 1, totalPages: 1 },
    approvals: { currentPage: 1, totalPages: 1 }
  });

  // Handle URL-based routing for admin pages
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      setActiveTab('dashboard');
    } else if (path.includes('/users')) {
      setActiveTab('users');
    } else if (path.includes('/taskers')) {
      setActiveTab('taskers');
    } else if (path.includes('/approvals')) {
      setActiveTab('approvals');
    } else {
      // Default to dashboard
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Load initial data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'dashboard') {
        await loadDashboardData();
      } else if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'taskers') {
        await loadTaskers();
      } else if (activeTab === 'approvals') {
        await loadApprovals();
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const dashboardData = await adminAPI.dashboard.getStats();
      setStats({
        totalUsers: dashboardData.totalUsers || 0,
        totalTaskers: dashboardData.totalTaskers || 0,
        pendingTasks: dashboardData.pendingApprovals || 0,
        completedTasks: dashboardData.completedBookings || 0,
        revenue: dashboardData.totalRevenue || 0
      });
    } catch (err) {
      throw new Error('Failed to load dashboard data: ' + err.message);
    }
  };

  const loadUsers = async (page = 1, search = '') => {
    try {
      const response = await adminAPI.users.getAll({ page, search });
      setUsers(response.users || []);
      setPagination(prev => ({
        ...prev,
        users: response.pagination || { currentPage: 1, totalPages: 1 }
      }));
    } catch (err) {
      throw new Error('Failed to load users: ' + err.message);
    }
  };

  const loadTaskers = async (page = 1, search = '', status = '', category = '') => {
    try {
      const response = await adminAPI.taskers.getAll({ page, search, status, category });
      setTaskers(response.taskers || []);
      setPagination(prev => ({
        ...prev,
        taskers: response.pagination || { currentPage: 1, totalPages: 1 }
      }));
    } catch (err) {
      throw new Error('Failed to load taskers: ' + err.message);
    }
  };

  const loadApprovals = async (page = 1) => {
    try {
      const response = await adminAPI.approvals.getAll({ page });
      // Transform the data to match the expected format
      const transformedTasks = response.pendingTaskers?.map(tasker => ({
        id: tasker._id,
        taskerId: tasker._id,
        taskerName: tasker.user?.name || 'N/A',
        email: tasker.user?.email || 'N/A',
        category: tasker.serviceCategories?.join(', ') || 'N/A',
        submittedDate: new Date(tasker.createdAt).toLocaleDateString(),
        documents: tasker.documents || [],
        priority: 'normal',
        experience: tasker.experience || 'N/A',
        location: tasker.location || 'N/A',
        phone: tasker.user?.phone || 'N/A',
        skills: tasker.skills || []
      })) || [];
      
      setPendingTasks(transformedTasks);
      setPagination(prev => ({
        ...prev,
        approvals: response.pagination || { currentPage: 1, totalPages: 1 }
      }));
    } catch (err) {
      throw new Error('Failed to load pending approvals: ' + err.message);
    }
  };

  const handleApproveTasker = async (taskerId) => {
    try {
      await adminAPI.approvals.approve(taskerId);
      // Refresh the pending tasks list
      await loadApprovals();
      // Also refresh taskers list if on that tab
      if (activeTab === 'taskers') {
        await loadTaskers();
      }
    } catch (err) {
      console.error('Error approving tasker:', err);
      setError('Failed to approve tasker: ' + err.message);
    }
  };

  const handleRejectTasker = async (taskerId) => {
    try {
      await adminAPI.approvals.reject(taskerId);
      // Refresh the pending tasks list
      await loadApprovals();
      // Also refresh taskers list if on that tab
      if (activeTab === 'taskers') {
        await loadTaskers();
      }
    } catch (err) {
      console.error('Error rejecting tasker:', err);
      setError('Failed to reject tasker: ' + err.message);
    }
  };

  const renderDashboard = () => {
    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    return <AdminDashboard stats={stats} />;
  };

  const renderTaskApprovals = () => {
    if (loading) return <div className="loading">Loading approvals...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    return (
      <TaskApproval 
        pendingTasks={pendingTasks}
        onApprove={handleApproveTasker}
        onReject={handleRejectTasker}
      />
    );
  };

  const renderUserManagement = () => {
    if (loading) return <div className="loading">Loading users...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    return (
      <UserManagement 
        users={users}
        pagination={pagination.users}
        onLoadUsers={loadUsers}
      />
    );
  };

  const renderTaskerManagement = () => {
    if (loading) return <div className="loading">Loading taskers...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    
    return (
      <div className="tasker-management">
        <h2>Tasker Management</h2>
        <div className="taskers-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {taskers.map(tasker => (
                <tr key={tasker._id}>
                  <td>{tasker.user?.name || 'N/A'}</td>
                  <td>{tasker.user?.email || 'N/A'}</td>
                  <td>{tasker.category || 'N/A'}</td>
                  <td>
                    <span className={`status ${tasker.status?.toLowerCase()}`}>
                      {tasker.status}
                    </span>
                  </td>
                  <td>{tasker.experience || 'N/A'}</td>
                  <td>${tasker.hourlyRate || 0}/hr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.taskers.totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={!pagination.taskers.hasPrevPage}
              onClick={() => loadTaskers(pagination.taskers.currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {pagination.taskers.currentPage} of {pagination.taskers.totalPages}</span>
            <button 
              disabled={!pagination.taskers.hasNextPage}
              onClick={() => loadTaskers(pagination.taskers.currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h1>Admin Panel</h1>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/admin/dashboard')}
          >
            <FaChartBar /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => navigate('/admin/approvals')}
          >
            <FaTasks /> Task Approvals
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => navigate('/admin/users')}
          >
            <FaUsers /> User Management
          </button>
          <button 
            className={`nav-item ${activeTab === 'taskers' ? 'active' : ''}`}
            onClick={() => navigate('/admin/taskers')}
          >
            <FaCog /> Tasker Management
          </button>
        </nav>
      </div>

      <div className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'approvals' && renderTaskApprovals()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'taskers' && renderTaskerManagement()}
      </div>
    </div>
  );
};

export default Admin;