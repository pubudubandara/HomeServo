import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaBan, FaCheckCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const UserManagement = ({ users, pagination, onLoadUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Debounce the search
    setTimeout(() => {
      onLoadUsers && onLoadUsers(1, e.target.value);
    }, 500);
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-stats">
          <span className="stat-item">
            Total Users: <strong>{pagination?.totalUsers || users.length}</strong>
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
        </div>

        {/* Removed bulk actions section */}
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Contact</th>
              <th>Join Date</th>
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
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><FaEnvelope /> {user.email || 'N/A'}</div>
                    <div><FaPhone /> {user.phone || 'N/A'}</div>
                  </div>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
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
            onClick={() => onLoadUsers && onLoadUsers(pagination.currentPage - 1, searchTerm)}
          >
            Previous
          </button>
          <span className="page-info">
            {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            className="page-btn"
            disabled={!pagination.hasNextPage}
            onClick={() => onLoadUsers && onLoadUsers(pagination.currentPage + 1, searchTerm)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
