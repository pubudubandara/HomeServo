import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getCustomerBookings, updateBookingStatus } from '../../../utils/bookingAPI';
import toast, { Toaster } from 'react-hot-toast';
import './MyBookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingValues, setRatingValues] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Use user._id if available, otherwise fall back to email
      const userIdentifier = user._id || user.email;
      if (!userIdentifier) {
        setLoading(false);
        return;
      }

      try {
        const result = await getCustomerBookings(userIdentifier);
        console.log('🔍 Bookings API result:', result);
        if (result.success) {
          console.log('📋 All fetched bookings:', result.data);
          console.log('✅ Completed bookings:', result.data.filter(b => b.status === 'completed'));
          setBookings(result.data);
        } else {
          setError(result.message);
          toast.error(`Failed to load bookings: ${result.message}`);
        }
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
        toast.error('Failed to fetch bookings. Please refresh the page.');
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

  const handleRatingClick = (bookingId, rating) => {
    setRatingValues(prev => ({
      ...prev,
      [bookingId]: rating
    }));
  };

  const handleRatingSubmit = async (bookingId) => {
    const rating = ratingValues[bookingId];
    if (!rating || rating === 0) {
      toast.error('Please select a rating before submitting');
      return;
    }

    try {
      const updateData = { rating: parseInt(rating) };
      const result = await updateBookingStatus(bookingId, updateData);
      
      console.log('Rating submission result:', result);
      
      if (result && result.success) {
        // Update the booking in state to reflect the new rating
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, rating: parseInt(rating) }
              : booking
          )
        );
        // Clear the rating value for this booking
        setRatingValues(prev => {
          const newValues = { ...prev };
          delete newValues[bookingId];
          return newValues;
        });
        toast.success(`Rating of ${rating} stars submitted successfully! 🌟`);
      } else {
        const errorMessage = result?.message || 'Failed to submit rating';
        console.error('Rating submission failed:', errorMessage);
        toast.error(`Failed to submit rating: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error('An error occurred while submitting rating. Please try again.');
    }
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

              { booking.status === 'completed' && (
                <div className="booking-rating">
                  {booking.rating ? (
                    <div className="rating-display">
                      <span className="rating-label">Your Rating:</span>
                      <div className="stars-display">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${star <= booking.rating ? 'active' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-value">({booking.rating}/5)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rating-container">
                      <div className="rating-stars">
                        <span className="rating-label">Rate this service:</span>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${(ratingValues[booking._id] || 0) >= star ? 'active' : ''}`}
                              onClick={() => handleRatingClick(booking._id, star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rating-actions">
                        <button 
                          className="submit-rating-btn"
                          onClick={() => handleRatingSubmit(booking._id)}
                          disabled={!ratingValues[booking._id] || ratingValues[booking._id] === 0}
                        >
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Toast Container for notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default MyBookings;
