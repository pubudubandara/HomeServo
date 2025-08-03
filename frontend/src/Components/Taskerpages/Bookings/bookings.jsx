import React from 'react';
import './bookings.css';
import TaskerNavbar from '../navbar/navbar';

const TaskerBookings = () => {
  // Mock booking data
  const bookings = [
    {
      id: 1,
      customerName: 'Alice Johnson',
      service: 'Home Repairs',
      date: '2025-08-05',
      time: '10:00 AM',
      status: 'Confirmed',
      address: '123 Oak Street, New York, NY',
      price: '$120',
      description: 'Fix leaky faucet and replace door handle'
    },
    {
      id: 2,
      customerName: 'Bob Smith',
      service: 'Painting',
      date: '2025-08-07',
      time: '2:00 PM',
      status: 'Pending',
      address: '456 Pine Avenue, New York, NY',
      price: '$200',
      description: 'Paint living room walls'
    },
    {
      id: 3,
      customerName: 'Carol Davis',
      service: 'Assembly',
      date: '2025-08-10',
      time: '9:00 AM',
      status: 'Completed',
      address: '789 Maple Drive, New York, NY',
      price: '$80',
      description: 'Assemble IKEA furniture set'
    }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  return (
    <div>
      <TaskerNavbar />
      <div className="tasker-bookings">
        <div className="bookings-container">
          <div className="bookings-header">
            <h1>My Bookings</h1>
            <p>Manage your upcoming and completed jobs</p>
          </div>

          <div className="bookings-stats">
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">This Month</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">127</div>
              <div className="stat-label">Total Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$2,450</div>
              <div className="stat-label">This Month Earnings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>

          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-customer">
                    <h3>{booking.customerName}</h3>
                    <span className="booking-service">{booking.service}</span>
                  </div>
                  <div className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="booking-info">
                    <div className="info-item">
                      <i className="fas fa-calendar"></i>
                      <span>{booking.date}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-clock"></i>
                      <span>{booking.time}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{booking.address}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-dollar-sign"></i>
                      <span>{booking.price}</span>
                    </div>
                  </div>

                  <div className="booking-description">
                    <p>{booking.description}</p>
                  </div>

                  <div className="booking-actions">
                    {booking.status === 'Pending' && (
                      <>
                        <button className="accept-btn">Accept</button>
                        <button className="decline-btn">Decline</button>
                      </>
                    )}
                    {booking.status === 'Confirmed' && (
                      <>
                        <button className="complete-btn">Mark Complete</button>
                        <button className="contact-btn">Contact Customer</button>
                      </>
                    )}
                    {booking.status === 'Completed' && (
                      <button className="view-btn">View Details</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskerBookings;
