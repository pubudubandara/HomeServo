import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaBan, FaCheckCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const UserManagement = ({ users, onSuspendUser, onEditUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action) => {
    selectedUsers.forEach(userId => {
      if (action === 'suspend') {
        onSuspendUser(userId);
      } else if (action === 'delete') {
        onDeleteUser(userId);
      }
    });
    setSelectedUsers([]);
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-stats">
          <span className="stat-item">
            Total: <strong>{users.length}</strong>
          </span>
          <span className="stat-item">
            Active: <strong>{users.filter(u => u.status === 'Active').length}</strong>
          </span>
          <span className="stat-item">
            Suspended: <strong>{users.filter(u => u.status === 'Suspended').length}</strong>
          </span>
        </div>
      </div>

      <div className="management-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-box">
            <FaFilter />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedUsers.length} user(s) selected</span>
            <button 
              className="bulk-btn suspend"
              onClick={() => handleBulkAction('suspend')}
            >
              <FaBan /> Bulk Suspend
            </button>
            <button 
              className="bulk-btn delete"
              onClick={() => handleBulkAction('delete')}
            >
              <FaTrash /> Bulk Delete
            </button>
          </div>
        )}
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>User Info</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Last Active</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-id">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><FaEnvelope /> {user.email}</div>
                    <div><FaPhone /> {user.phone || '+94 77 123 4567'}</div>
                    <div><FaMapMarkerAlt /> {user.location || 'Colombo, LK'}</div>
                  </div>
                </td>
                <td>
                  <span className={`status ${user.status.toLowerCase()}`}>
                    {user.status === 'Active' ? <FaCheckCircle /> : <FaBan />}
                    {user.status}
                  </span>
                </td>
                <td>{user.joinedDate}</td>
                <td>{user.lastActive || '2 hours ago'}</td>
                <td>
                  <span className="orders-count">{user.orders || 5} orders</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => onEditUser(user.id)}
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={`btn-suspend ${user.status === 'Active' ? 'suspend' : 'activate'}`}
                      onClick={() => onSuspendUser(user.id)}
                      title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                    >
                      {user.status === 'Active' ? <FaBan /> : <FaCheckCircle />}
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => onDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <FaSearch size={48} />
          <h3>No Users Found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}

      <div className="pagination">
        <button className="page-btn">Previous</button>
        <span className="page-info">1 of 5</span>
        <button className="page-btn">Next</button>
      </div>
    </div>
  );
};

export default UserManagement;
