import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCustomerBookings } from '../../utils/bookingAPI';
import './MyBookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const result = await getCustomerBookings(user.email);
        if (result.success) {
          setBookings(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'completed': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="my-bookings">
        <div className="bookings-header">
          <h1>My Bookings</h1>
        </div>
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings">
        <div className="bookings-header">
          <h1>My Bookings</h1>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>View and manage your service bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet. Browse our services to get started!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.serviceId?.title || 'Service'}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Service:</span>
                  <span className="value">{booking.serviceDescription}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{booking.serviceLocation}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Preferred Date:</span>
                  <span className="value">{formatDate(booking.preferredDate)}</span>
                </div>

                {booking.estimatedCost && (
                  <div className="detail-row">
                    <span className="label">Estimated Cost:</span>
                    <span className="value">${booking.estimatedCost}</span>
                  </div>
                )}

                {booking.customerNotes && (
                  <div className="detail-row">
                    <span className="label">Notes:</span>
                    <span className="value">{booking.customerNotes}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="label">Booked on:</span>
                  <span className="value">{formatDate(booking.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
