import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceAPI } from '../../../utils/serviceAPI';
import './ServiceProfile.css';

const ServiceProfile = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (serviceId) {
          // Fetch specific service profile
          const response = await serviceAPI.getServiceProfile(serviceId);
          
          if (response.success) {
            setService(response.data);
          } else {
            setError(response.message || 'Service not found');
          }
        } else {
          // Fallback to static data for backward compatibility
          const response = await fetch('/cleaning.json');
          const data = await response.json();
          const windowCleaning = data.find(item => item.id === 3);
          setService({
            title: windowCleaning?.name || 'Window Cleaning',
            description: windowCleaning?.description || 'Professional window cleaning service',
            price: windowCleaning?.price || '$50',
            image: windowCleaning?.image || '',
            category: 'Cleaning',
            rating: 4.5,
            jobsCompleted: 12,
            tasker: {
              firstName: 'John',
              lastName: 'Doe',
              profileImage: '',
              location: { city: 'Kandy', country: 'Sri Lanka' },
              bio: 'Professional cleaner with years of experience',
              skills: ['Window cleaning', 'Glass polishing', 'Exterior wash'],
              experience: '5+ years'
            },
            otherServices: []
          });
        }
      } catch (err) {
        console.error('Error fetching service profile:', err);
        setError('Error loading service profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProfile();
  }, [serviceId]);

  const handleBookNow = () => {
    // Navigate to booking form with service ID and service data
    navigate(`/book/${serviceId || service.id}`, { 
      state: { 
        service: service
      }
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<span key={i}>⭐</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ddd' }}>⭐</span>);
      }
    }
    
    return stars;
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') return location;
    if (location && typeof location === 'object') {
      return `${location.city || ''}, ${location.country || ''}`.trim().replace(/^,\s*|,\s*$/g, '');
    }
    return 'Location not specified';
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-message">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading service profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => navigate('/services')}>Back to Services</button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <i className="fas fa-search"></i>
          <p>Service not found</p>
          <button onClick={() => navigate('/services')}>Back to Services</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-background">
          <img
            src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop"}
            alt="Service background"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                className="profile-image"
                src={service.tasker?.profileImage || service.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQncB8EF7S7xGCyvdoA_Rpwyt7-pLE4P7gmJQ&s"}
                alt={service.title}
                onError={(e) => {
                  e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQncB8EF7S7xGCyvdoA_Rpwyt7-pLE4P7gmJQ&s";
                }}
              />
              <div className="profile-badge">
                <i className="fas fa-check-circle"></i>
                <span>Verified</span>
              </div>
            </div>
            
            <div className="profile-info">
              <h1 className="service-title">{service.title}</h1>
              <p className="service-description">{service.description}</p>
              
              <div className="profile-meta">
                <div className="meta-item">
                  <i className="fas fa-user"></i>
                  <span>{service.tasker?.firstName || ''} {service.tasker?.lastName || ''}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{formatLocation(service.tasker?.location)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-tag"></i>
                  <span className="category-badge">{service.category}</span>
                </div>
                {service.tasker?.experience && (
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{service.tasker.experience}</span>
                  </div>
                )}
              </div>
              
              {/* Rating in hero */}
              <div className="hero-rating">
                <div className="rating-display">
                  <span className="rating-number">{service.rating || 4.5}</span>
                  <div className="rating-stars">
                    {renderStars(service.rating || 4.5)}
                  </div>
                  <span className="rating-count">({service.jobsCompleted || 12} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="content-left">
          {/* Detailed Rating Section */}
          <div className="rating-section card">
            <h3 className="section-title">
              <i className="fas fa-star"></i>
              Customer Reviews
            </h3>
            <div className="rating-breakdown">
              <div className="rating-summary">
                <span className="big-rating">{service.rating || 4.5}</span>
                <div className="rating-details">
                  <div className="stars-large">
                    {renderStars(service.rating || 4.5)}
                  </div>
                  <p>{service.jobsCompleted || 12} total reviews</p>
                </div>
              </div>
              
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar">
                    <span className="star-label">{star} ⭐</span>
                    <div className="bar">
                      <div 
                        className="fill" 
                        style={{ 
                          width: star === 5 ? '80%' : star === 4 ? '15%' : star === 3 ? '3%' : '1%' 
                        }}
                      ></div>
                    </div>
                    <span className="percentage">
                      {star === 5 ? '80%' : star === 4 ? '15%' : star === 3 ? '3%' : '1%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="review-actions">
              <button className="btn-secondary">
                <i className="fas fa-eye"></i>
                View All Reviews
              </button>
              <button className="btn-primary">
                <i className="fas fa-plus"></i>
                Add Review
              </button>
            </div>
          </div>

          {/* Other Services Section */}
          {service.otherServices && service.otherServices.length > 0 && (
            <div className="other-services card">
              <h3 className="section-title">
                <i className="fas fa-briefcase"></i>
                Other Services by {service.tasker?.firstName}
              </h3>
              <div className="services-grid">
                {service.otherServices.map((otherService) => (
                  <div key={otherService.id} className="service-card">
                    <img 
                      src={otherService.image || service.image} 
                      alt={otherService.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x120?text=Service";
                      }}
                    />
                    <div className="service-card-content">
                      <h4>{otherService.title}</h4>
                      <p className="service-category">{otherService.category}</p>
                      <p className="service-price">{otherService.price}</p>
                      <button className="btn-outline">View Service</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Description */}
          <div className="service-description card">
            <h3 className="section-title">
              <i className="fas fa-info-circle"></i>
              Service Details
            </h3>
            <div className="description-content">
              <div className="description-item">
                <h4>About this service</h4>
                <p>{service.description}</p>
              </div>
              
              {service.tasker?.bio && (
                <div className="description-item">
                  <h4>About the tasker</h4>
                  <p>{service.tasker.bio}</p>
                </div>
              )}

              {service.tasker?.skills && service.tasker.skills.length > 0 && (
                <div className="description-item">
                  <h4>Professional Skills</h4>
                  <div className="skills-tags">
                    {service.tasker.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        <i className="fas fa-check"></i>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {service.tags && service.tags.length > 0 && (
                <div className="description-item">
                  <h4>Service Features</h4>
                  <div className="feature-tags">
                    {service.tags.map((tag, index) => (
                      <span key={index} className="feature-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="description-item">
                <h4>Why choose this service?</h4>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <i className="fas fa-award"></i>
                    <span>High-Quality Work</span>
                  </div>
                  <div className="benefit-item">
                    <i className="fas fa-user-tie"></i>
                    <span>Professional Service</span>
                  </div>
                  <div className="benefit-item">
                    <i className="fas fa-clock"></i>
                    <span>On-time Delivery</span>
                  </div>
                  <div className="benefit-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>100% Satisfaction Guarantee</span>
                  </div>
                  {service.tasker?.experience && (
                    <div className="benefit-item">
                      <i className="fas fa-star"></i>
                      <span>Experienced Professional ({service.tasker.experience})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Booking */}
        <div className="content-right">
          <div className="booking-card">
            <div className="booking-header">
              <h3>
                <i className="fas fa-shopping-cart"></i>
                Book This Service
              </h3>
              <div className="price-display">
                <span className="price-amount">{service.price}</span>
                <span className="price-unit">per job</span>
              </div>
            </div>

            <div className="package-features">
              <h4>What's included:</h4>
              <ul>
                <li>
                  <i className="fas fa-check"></i>
                  Professional {service.category.toLowerCase()} service
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Quality guaranteed work
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Experienced tasker
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Reliable and on-time service
                </li>
                {service.tasker?.skills && service.tasker.skills.length > 0 && (
                  <li>
                    <i className="fas fa-check"></i>
                    Specialized in: {service.tasker.skills.slice(0, 2).join(', ')}
                  </li>
                )}
              </ul>
            </div>
            
            {service.tasker?.hourlyRate && (
              <div className="hourly-rate-info">
                <i className="fas fa-clock"></i>
                <span>Alternative: ${service.tasker.hourlyRate}/hour</span>
              </div>
            )}
            
            <button className="book-now-btn" onClick={handleBookNow}>
              <i className="fas fa-calendar-check"></i>
              Book Now
            </button>
            
            <div className="contact-section">
              <h4>Contact Tasker</h4>
              <div className="contact-methods">
                {service.tasker?.phoneNumber && (
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>{service.tasker.phoneNumber}</span>
                    <button className="contact-btn">Call</button>
                  </div>
                )}
                {service.tasker?.email && (
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{service.tasker.email}</span>
                    <button className="contact-btn">Email</button>
                  </div>
                )}
              </div>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <i className="fas fa-shield-check"></i>
                <span>Verified Tasker</span>
              </div>
              <div className="trust-item">
                <i className="fas fa-medal"></i>
                <span>Top Rated</span>
              </div>
              <div className="trust-item">
                <i className="fas fa-handshake"></i>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProfile;
