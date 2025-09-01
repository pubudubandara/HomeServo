import React, { useState, useEffect } from 'react';
import './bookings.css';
import TaskerNavbar from '../../../Components/Tasker/TaskerNavbar/TaskerNavbar';
import { getTaskerBookings, updateBookingStatus } from '../../../utils/bookingAPI';
import { getCurrentTasker } from '../../../utils/taskerAPI';
import { useAuth } from '../../../contexts/AuthContext';

const TaskerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    monthlyEarnings: 0,
    averageRating: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch bookings data
  useEffect(() => {
    fetchBookings();
  }, [statusFilter, currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current tasker info
      const taskerResult = await getCurrentTasker();
      if (!taskerResult.success) {
        setError('Unable to identify current tasker');
        return;
      }

      const taskerId = taskerResult.data.id || taskerResult.data._id;
      if (!taskerId) {
        setError('Tasker ID not found');
        return;
      }

      // Fetch bookings for this tasker
      const params = {
        page: currentPage,
        limit: 10
      };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const result = await getTaskerBookings(taskerId, params);
      if (result.success) {
        setBookings(result.data.bookings || []);
        setStats(result.data.stats || stats);
        setPagination(result.data.pagination || pagination);
        
        // Calculate monthly earnings (this is a basic calculation)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyBookings = result.data.bookings?.filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear &&
                 booking.status === 'completed';
        }) || [];
        
        const monthlyEarnings = monthlyBookings.reduce((total, booking) => {
          return total + (booking.actualCost || booking.estimatedCost || 0);
        }, 0);
        
        setStats(prev => ({
          ...prev,
          monthlyEarnings,
          averageRating: 4.8 // This should come from actual ratings in the future
        }));
      } else {
        setError(result.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const result = await updateBookingStatus(bookingId, { status: newStatus });
      if (result.success) {
        // Refresh bookings after status update
        fetchBookings();
      } else {
        alert('Failed to update booking status: ' + result.message);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('An error occurred while updating booking status');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return (
      <div>
        <TaskerNavbar />
        <div className="tasker-bookings">
          <div className="bookings-container">
            <div className="loading-message">Loading your bookings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TaskerNavbar />
        <div className="tasker-bookings">
          <div className="bookings-container">
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={fetchBookings} className="retry-btn">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskerNavbar />
      <div className="tasker-bookings">
        <div className="bookings-container">
          <div className="bookings-header">
            <h1>My Bookings</h1>
            <p>Manage your upcoming and completed jobs</p>
          </div>

          <div className="bookings-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="status-filter"
            >
              <option value="">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="bookings-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.total || 0}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.completed || 0}</div>
              <div className="stat-label">Completed Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">${stats.monthlyEarnings || 0}</div>
              <div className="stat-label">This Month Earnings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.averageRating || 0}★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>

          <div className="bookings-list">
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <p>No bookings found.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-customer">
                      <h3>{booking.customerName}</h3>
                      <span className="booking-service">
                        {booking.serviceId?.title || 'Service'}
                      </span>
                    </div>
                    <div className={`booking-status ${getStatusClass(booking.status)}`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="booking-info">
                      <div className="info-item">
                        <i className="fas fa-calendar"></i>
                        <span>{formatDate(booking.preferredDate)}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-clock"></i>
                        <span>{formatTime(booking.preferredDate)}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{booking.serviceLocation}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-dollar-sign"></i>
                        <span>
                          ${booking.actualCost || booking.estimatedCost || 
                            booking.serviceId?.price || 'TBD'}
                        </span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-user"></i>
                        <span>{booking.customerEmail}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <span>{booking.customerPhone}</span>
                      </div>
                    </div>

                    <div className="booking-description">
                      <p>{booking.serviceDescription}</p>
                      {booking.customerNotes && (
                        <p><strong>Customer Notes:</strong> {booking.customerNotes}</p>
                      )}
                    </div>

                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="accept-btn"
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          >
                            Accept
                          </button>
                          <button 
                            className="decline-btn"
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <button 
                            className="complete-btn"
                            onClick={() => handleStatusUpdate(booking._id, 'in-progress')}
                          >
                            Start Job
                          </button>
                          <button className="contact-btn">
                            <a href={`tel:${booking.customerPhone}`}>Contact Customer</a>
                          </button>
                        </>
                      )}
                      {booking.status === 'in-progress' && (
                        <button 
                          className="complete-btn"
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        >
                          Mark Complete
                        </button>
                      )}
                      {booking.status === 'completed' && (
                        <button className="view-btn">View Details</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button 
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskerBookings;
