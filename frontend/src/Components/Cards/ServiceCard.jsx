import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return `$${price}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<i key={i} className="fas fa-star star-filled"></i>);
      } else if (i - 0.5 <= numRating) {
        stars.push(<i key={i} className="fas fa-star-half-alt star-half"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star star-empty"></i>);
      }
    }
    
    return stars;
  };

  return (
    <Link to={`/services/${service._id || service.id}`} className="service-card">
      <div className="service-card-image">
        <img 
          src={service.image || '/api/placeholder/300/200'} 
          alt={service.name || service.title} 
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        {service.category && (
          <div className="service-category-badge">
            {service.category}
          </div>
        )}
      </div>
      
      <div className="service-card-content">
        <h3 className="service-title">{service.name || service.title}</h3>
        <p className="service-description">{service.description}</p>
        
        <div className="service-pricing">
          <span className="price-label">Starting at</span>
          <span className="service-price">{formatPrice(service.price)}/hr</span>
        </div>

        {service.tasker && (
          <div className="service-tasker-info">
            <div className="tasker-name">
              <i className="fas fa-user-circle"></i>
              <span>{service.tasker.firstName} {service.tasker.lastName}</span>
            </div>
          </div>
        )}

        <div className="service-stats">
          <div className="service-rating">
            <div className="stars">
              {renderStars(service.rating || 0)}
            </div>
            <span className="rating-value">({(service.rating || 0).toFixed(1)})</span>
          </div>
          
          {service.jobsCompleted !== undefined && (
            <div className="jobs-completed">
              <i className="fas fa-check-circle"></i>
              <span>{service.jobsCompleted} jobs completed </span>
            </div>
          )}
        </div>

        <button className="service-view-btn">
          View Details
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </Link>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number,
    tasker: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string
    })
  }).isRequired
};

export default ServiceCard;
