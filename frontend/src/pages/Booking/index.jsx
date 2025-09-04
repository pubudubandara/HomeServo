import React, { useState, useEffect } from 'react';
import { useParams, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Book.css';

// Custom navbar for booking page
const BookingNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Force a page reload to ensure AuthContext is completely refreshed
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if logout fails, redirect to home
      window.location.href = '/';
    }
  };

  const getDisplayName = (name) => {
    if (!name) return '';
    return name.length > 16 ? name.slice(0, 13) + '...' : name;
  };

  return (
    <nav className="navbar booking-navbar" role="navigation" aria-label="Booking Navigation">
      <NavLink to="/" className="logo" aria-label="Home">
        <span>Home</span>
        <span>Servo</span>
      </NavLink>

      <ul className="nav-links booking-nav-links">
        <li>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Explore Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active-link' : ''}>
            My Bookings
          </NavLink>
        </li>
        <div className="nav-user-actions">
          <li className="user-info">
            <span className="user-name">
              <i className="fas fa-user-circle"></i> {getDisplayName(user?.name)}
            </span>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
};

const BookingForm = () => {
  const { id } = useParams(); // Get service ID from URL (matches the route parameter)
  const location = useLocation();
  const { user, isLoading } = useAuth(); // Get current user from auth context
  const serviceData = location.state?.service; // Get service data passed via navigation

  // Debug URL parameters
  console.log('BookingForm - Full URL:', window.location.href);
  console.log('BookingForm - URL pathname:', window.location.pathname);
  console.log('BookingForm - useParams result:', { id });
  console.log('BookingForm - location state:', location.state);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div>
        <BookingNavbar />
        <div className="booking-container">
          <div className="booking-form">
            <h2>Loading...</h2>
            <p>Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have a service ID from URL
  if (!id) {
    return (
      <div>
        <BookingNavbar />
        <div className="booking-container">
          <div className="booking-form">
            <h2>Service Required</h2>
            <p>You need to select a service before booking. Please go back to the services page and choose a service.</p>
            <a href="/services" className="book-btn">Browse Services</a>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is logged in - more comprehensive check
  if (!user || !user._id) {
    // Try to get user from localStorage directly
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    console.log('BookingForm - Checking localStorage...');
    console.log('BookingForm - Stored user:', storedUser);
    console.log('BookingForm - Stored token:', storedToken ? 'exists' : 'null');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('BookingForm - Parsed user from localStorage:', parsedUser);
        if (parsedUser && (parsedUser._id || parsedUser.id)) {
          console.log('BookingForm - Valid user found in localStorage, but not in context');
          // Force a page reload to refresh the context
          window.location.reload();
          return (
            <div>
              <BookingNavbar />
              <div className="booking-container">
                <div className="booking-form">
                  <h2>Refreshing...</h2>
                  <p>Please wait...</p>
                </div>
              </div>
            </div>
          );
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    return (
      <div>
        <BookingNavbar />
        <div className="booking-container">
          <div className="booking-form">
            <h2>Login Required</h2>
            <p>You must be logged in to make a booking.</p>
            <div className="login-actions">
              <a href="/login" className="book-btn">Go to Login</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    phone: '',
    description: '',
    date: '',
    location: '',
    terms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedService, setSelectedService] = useState(serviceData || null);
  const [isLoadingService, setIsLoadingService] = useState(false);

  // If service ID is provided but no service data, fetch service details
  useEffect(() => {
    if (id && !selectedService) {
      console.log('useEffect triggered - fetching service for ID:', id);
      setIsLoadingService(true);
      // Fetch service details from backend
      const fetchServiceDetails = async () => {
        try {
          console.log('Fetching service details for ID:', id);
          const response = await fetch(`http://localhost:5001/api/services/profile/${id}`);
          console.log('Service fetch response status:', response.status);

          if (response.ok) {
            const serviceData = await response.json();
            console.log('Service data fetched successfully:', serviceData);
            setSelectedService(serviceData.data || serviceData);
          } else {
            console.log('Service fetch failed with status:', response.status);
            // Don't fail the booking, just log the error
          }
        } catch (error) {
          console.error('Error fetching service details:', error);
          // Don't fail the booking, just log the error
          console.log('Proceeding with service ID from URL despite fetch error');
        } finally {
          setIsLoadingService(false);
        }
      };

      fetchServiceDetails();
    } else {
      console.log('useEffect - no ID or service already selected:', { id, selectedService });
    }
  }, [id, selectedService]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Get user ID from auth context
      const currentUserId = user?._id || user?.id;
      let currentServiceId = id || selectedService?.id || selectedService?._id;

      // If we don't have a service ID but we have an ID from URL, use it directly
      if (!currentServiceId && id) {
        currentServiceId = id;
        console.log('Using service ID from URL parameter:', currentServiceId);
      }

      console.log('Current user:', user);
      console.log('Current userId:', currentUserId);
      console.log('Current serviceId:', currentServiceId);
      console.log('URL param id:', id);
      console.log('Selected service:', selectedService);
      console.log('Service data from location:', serviceData);

      // Validate required fields
      if (!currentUserId) {
        setSubmitMessage('Error: You must be logged in to make a booking');
        setIsSubmitting(false);
        return;
      }

      if (!currentServiceId) {
        console.error('Service ID validation failed:', { id, selectedService, serviceData });
        setSubmitMessage('Error: Service ID is missing. Please go back and select a service.');
        setIsSubmitting(false);
        return;
      }

      // Validate service ID format (should be a non-empty string)
      if (typeof currentServiceId !== 'string' || currentServiceId.trim().length === 0) {
        console.error('Invalid service ID format:', currentServiceId);
        setSubmitMessage('Error: Invalid service ID format. Please go back and select a service.');
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        customerPhone: formData.phone.trim(),
        serviceDescription: formData.description.trim(),
        serviceLocation: formData.location.trim(),
        preferredDate: new Date(formData.date).toISOString(), // Ensure proper date format
        customerNotes: '', // Optional field
        serviceId: currentServiceId,
        userId: currentUserId
      };

      console.log('Submitting booking data:', bookingData);

      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        setSubmitMessage('Booking submitted successfully! We will contact you soon.');
        setFormData({
          phone: '',
          description: '',
          date: '',
          location: '',
          terms: false
        });
      } else {
        setSubmitMessage(`Error: ${result.message || 'Failed to submit booking'}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitMessage('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <BookingNavbar />
      <section className="booking-section">
        <div className="booking-container">
          <div className="booking-header">
            <h1>Book Your <span>Service</span></h1>
            {isLoadingService && (
              <div className="service-loading">
                <p>Loading service details...</p>
              </div>
            )}
            {!isLoadingService && !selectedService && id && (
              <div className="service-warning">
                <p>⚠️ Service details could not be loaded, but booking will still work.</p>
              </div>
            )}
            <p>Get connected with skilled professionals for your needs</p>
          </div>

          <div className="form-container">
            <form id="bookingForm" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Service Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe what you need help with..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Service Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter the service address"
                    required
                  />
                </div>
              </div>

              <div className="terms-container">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="terms">
                  I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>

              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                  {submitMessage}
                </div>
              )}

              <button type="submit" className="book-btn" disabled={isSubmitting || isLoadingService}>
                <i className="fas fa-calendar-check"></i>
                {isSubmitting ? 'Submitting...' : isLoadingService ? 'Loading Service...' : 'Book Service Now'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingForm;
