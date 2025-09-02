import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaBan, FaCheckCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const UserManagement = ({ users, pagination, onLoadUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Debounce the search
    setTimeout(() => {
      onLoadUsers && onLoadUsers(1, e.target.value, filterStatus);
    }, 500);
  };

  const handleFilterChange = (e) => {
    const newStatus = e.target.value;
    setFilterStatus(newStatus);
    onLoadUsers && onLoadUsers(1, searchTerm, newStatus);
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-stats">
          <span className="stat-item">
            Total: <strong>{pagination?.totalUsers || users.length}</strong>
          </span>
          <span className="stat-item">
            Active: <strong>{users.filter(u => u.status === 'active').length}</strong>
          </span>
          <span className="stat-item">
            Suspended: <strong>{users.filter(u => u.status === 'suspended').length}</strong>
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
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-box">
            <FaFilter />
            <select value={filterStatus} onChange={handleFilterChange}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Removed bulk actions section */}
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="user-name">{user.name || 'N/A'}</div>
                      <div className="user-id">ID: {user._id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><FaEnvelope /> {user.email || 'N/A'}</div>
                    <div><FaPhone /> {user.phone || 'N/A'}</div>
                  </div>
                </td>
                <td>
                  <span className={`status ${user.status?.toLowerCase() || 'unknown'}`}>
                    {user.status === 'active' ? <FaCheckCircle /> : <FaBan />}
                    {user.status || 'Unknown'}
                  </span>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className={`role ${user.role}`}>{user.role || 'user'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <FaSearch size={48} />
          <h3>No Users Found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            disabled={!pagination.hasPrevPage}
            onClick={() => onLoadUsers && onLoadUsers(pagination.currentPage - 1, searchTerm, filterStatus)}
          >
            Previous
          </button>
          <span className="page-info">
            {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            className="page-btn"
            disabled={!pagination.hasNextPage}
            onClick={() => onLoadUsers && onLoadUsers(pagination.currentPage + 1, searchTerm, filterStatus)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
