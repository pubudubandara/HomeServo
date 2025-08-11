import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css'; // Import your CSS styles if any

const Cards = ({ 
  name, 
  description, 
  price, 
  image, 
  category, 
  rating, 
  jobsCompleted, 
  tasker, 
  serviceId 
}) => {
  const navigate = useNavigate(); // Correctly use useNavigate

  const handleClick = () => {
    navigate('/profilepage'); // Use navigate to redirect
  };

  // Format price to display correctly
  const formatPrice = (priceValue) => {
    if (typeof priceValue === 'number') {
      return `$${priceValue.toFixed(2)}`;
    }
    if (typeof priceValue === 'string' && !priceValue.startsWith('$')) {
      return `$${priceValue}`;
    }
    return priceValue;
  };

  // Generate star rating display
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
    <div className="card" onClick={handleClick}>
      <div className="card-image-container">
        <img 
          src={image || '/api/placeholder/300/200'} 
          alt={name} 
          className="card-image"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        {category && (
          <div className="card-category">
            {category}
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <p className="card-description">{description}</p>
        
        <div className="card-price">
          <span className="price-label">Starting at </span>
          <span className="price-value">{formatPrice(price)}</span>
        </div>
        
        {tasker && (
          <div className="card-tasker-info">
            <div className="tasker-name">
              <i className="fas fa-user"></i>
              <span>{tasker.firstName} {tasker.lastName}</span>
            </div>
            
            <div className="tasker-stats">
              {rating && (
                <div className="rating-section">
                  <div className="stars">
                    {renderStars(rating)}
                  </div>
                  <span className="rating-value">({rating})</span>
                </div>
              )}
              
              {jobsCompleted !== undefined && (
                <div className="jobs-completed">
                  <i className="fas fa-check-circle"></i>
                  <span>{jobsCompleted} jobs completed</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button className="card-button">
          View Details
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Cards;