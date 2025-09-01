import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceAPI } from '../../../utils/serviceAPI';
import './ServiceProfile.css';

const ServiceProfile = () => {
  const navigate = useNavigate();
  const { id: serviceId } = useParams(); // Extract 'id' parameter and rename to serviceId
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Service ID from URL:', serviceId); // Debug log

        if (!serviceId) {
          setError('Service ID is missing.');
          setLoading(false);
          return;
        }

        const response = await serviceAPI.getServiceProfile(serviceId);
        console.log('API Response:', response); // Debug

        if (response.success && response.data) {
          setService(response.data);
        } else {
          setError(response.message || 'Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProfile();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading service...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-back">Back</button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="profile-container">
        <div className="error">
          <i className="fas fa-info-circle"></i>
          <p>No service data available.</p>
          <button onClick={() => navigate('/services')} className="btn-back">Browse Services</button>
        </div>
      </div>
    );
  }

  // Safely access optional fields
  const tasker = service.tasker || null; // Only if included in API response

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < numRating ? '#ffc107' : '#e4e5e9' }}>★</span>
    ));
  };

  return (
    <div className="service-profile">
      {/* Hero Section */}
      <section className="hero">
        <img
          src={service.image || "https://via.placeholder.com/1200x400?text=Service+Image"}
          alt={service.title}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <div className="hero-meta">
            <span className="badge">{service.category}</span>
            <span>⭐ {service.rating || 'N/A'} ({service.jobsCompleted || 0} jobs)</span>
          </div>
        </div>
      </section>

      <div className="main-content">
        {/* Top Booking Section */}
        <aside className="sidebar">
          <div className="booking-card">
            <div>
              <h3>Book This Service</h3>
              <ul className="features">
                <li><i className="fas fa-check"></i> Professional {service.category} service</li>
                <li><i className="fas fa-check"></i> Quality guaranteed</li>
                <li><i className="fas fa-check"></i> On-time delivery</li>
                {tasker?.skills?.[0] && (
                  <li><i className="fas fa-check"></i> Specialized in {tasker.skills[0]}</li>
                )}
              </ul>
            </div>
            
            <div className="price">${service.price}/hr</div>
            
            <div className="booking-actions">
              <button className="btn-book" onClick={() => navigate(`/book/${service.id}`)}>
                <i className="fas fa-calendar-check"></i> Book Now
              </button>
            </div>
          </div>
        </aside>

        {/* Content Column */}
        <div className="left-column">
          {/* About Service */}
          <section className="card description">
            <h3>
              <i className="fas fa-info-circle"></i> About This Service
            </h3>
            <p>{service.description}</p>

            {service.tags && service.tags.length > 0 && (
              <div className="tags">
                {service.tags.map((tag, i) => (
                  <span className="tag" key={i}>{tag}</span>
                ))}
              </div>
            )}
          </section>

          {/* Tasker Info (if available) */}
          {tasker && (
            <section className="card tasker-info">
              <h3>
                <i className="fas fa-user"></i> About the Tasker
              </h3>
              <div className="tasker-details">
                {tasker.profileImage ? (
                  <img src={tasker.profileImage} alt={tasker.firstName} className="tasker-img" />
                ) : (
                  <div className="tasker-img placeholder">?</div>
                )}
                <div>
                  <h4>{tasker.firstName} {tasker.lastName}</h4>
                  <p>{formatLocation(tasker.location)}</p>
                  <p>{tasker.bio}</p>
                  {tasker.experience && <p><strong>Experience:</strong> {tasker.experience}</p>}
                </div>
              </div>

              {tasker.skills && tasker.skills.length > 0 && (
                <div className="skills">
                  <h4>Skills</h4>
                  {tasker.skills.map((skill, i) => (
                    <span className="skill-tag" key={i}>{skill}</span>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Utility function to format location
const formatLocation = (location) => {
  if (!location) return 'Location not specified';
  if (typeof location === 'string') return location;
  return [location.city, location.country].filter(Boolean).join(', ') || 'Not specified';
};

export default ServiceProfile;