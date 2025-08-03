import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaUsers, FaTasks, FaChartBar, FaCog, FaCheck, FaTimes, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import AdminDashboard from './AdminDashboard';
import TaskApproval from './TaskApproval';
import UserManagement from './UserManagement';

const Admin = () => {
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

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate API calls
    setUsers([
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '+94 77 111 2222',
        location: 'Colombo, LK',
        status: 'Active', 
        joinedDate: '2024-01-15',
        lastActive: '2 hours ago',
        orders: 12
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        phone: '+94 77 333 4444',
        location: 'Kandy, LK',
        status: 'Active', 
        joinedDate: '2024-02-20',
        lastActive: '1 day ago',
        orders: 8
      },
      { 
        id: 3, 
        name: 'Bob Wilson', 
        email: 'bob@example.com', 
        phone: '+94 77 555 6666',
        location: 'Galle, LK',
        status: 'Suspended', 
        joinedDate: '2024-03-10',
        lastActive: '1 week ago',
        orders: 3
      }
    ]);

    setTaskers([
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', category: 'Cleaning', status: 'Approved', rating: 4.8 },
      { id: 2, name: 'Mike Brown', email: 'mike@example.com', category: 'Plumbing', status: 'Pending', rating: 0 },
      { id: 3, name: 'Sarah Davis', email: 'sarah@example.com', category: 'Painting', status: 'Approved', rating: 4.9 }
    ]);

    setPendingTasks([
      { 
        id: 1, 
        taskerId: 2, 
        taskerName: 'Mike Brown', 
        email: 'mike@example.com',
        category: 'Plumbing', 
        submittedDate: '2024-12-01', 
        documents: ['ID Copy', 'Certificate'],
        priority: 'high',
        experience: '5+ years',
        location: 'Kandy, Sri Lanka',
        phone: '+94 77 123 4567',
        skills: ['Pipe Installation', 'Leak Repair', 'Bathroom Fitting']
      },
      { 
        id: 2, 
        taskerId: 4, 
        taskerName: 'Emma Wilson', 
        email: 'emma@example.com',
        category: 'Gardening', 
        submittedDate: '2024-12-02', 
        documents: ['ID Copy', 'Experience Letter'],
        priority: 'normal',
        experience: '3+ years',
        location: 'Colombo, Sri Lanka',
        phone: '+94 77 987 6543',
        skills: ['Lawn Care', 'Plant Maintenance', 'Landscaping']
      }
    ]);

    setStats({
      totalUsers: 156,
      totalTaskers: 89,
      pendingTasks: 12,
      completedTasks: 234,
      revenue: 15420
    });
  }, []);

  const handleApproveTasker = (taskerId) => {
    setTaskers(prev => prev.map(tasker => 
      tasker.id === taskerId ? { ...tasker, status: 'Approved' } : tasker
    ));
    setPendingTasks(prev => prev.filter(task => task.taskerId !== taskerId));
  };

  const handleRejectTasker = (taskerId) => {
    setTaskers(prev => prev.map(tasker => 
      tasker.id === taskerId ? { ...tasker, status: 'Rejected' } : tasker
    ));
    setPendingTasks(prev => prev.filter(task => task.taskerId !== taskerId));
  };

  const handleEditUser = (userId) => {
    // Implement edit user functionality
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleSuspendUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user
    ));
  };

  const renderDashboard = () => (
    <AdminDashboard stats={stats} />
  );

  const renderTaskApprovals = () => (
    <TaskApproval 
      pendingTasks={pendingTasks}
      onApprove={handleApproveTasker}
      onReject={handleRejectTasker}
    />
  );

  const renderUserManagement = () => (
    <UserManagement 
      users={users}
      onSuspendUser={handleSuspendUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
    />
  );

  const renderTaskerManagement = () => (
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
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskers.map(tasker => (
              <tr key={tasker.id}>
                <td>{tasker.name}</td>
                <td>{tasker.email}</td>
                <td>{tasker.category}</td>
                <td>
                  <span className={`status ${tasker.status.toLowerCase()}`}>
                    {tasker.status}
                  </span>
                </td>
                <td>
                  {tasker.rating > 0 ? `${tasker.rating} ⭐` : 'N/A'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      title="Edit Tasker"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-view" 
                      title="View Profile"
                    >
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h1>Admin Panel</h1>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartBar /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <FaTasks /> Task Approvals
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> User Management
          </button>
          <button 
            className={`nav-item ${activeTab === 'taskers' ? 'active' : ''}`}
            onClick={() => setActiveTab('taskers')}
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