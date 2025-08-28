import React from 'react';
import PropTypes from 'prop-types';
import ServiceCard from './ServiceCard';
import './ServiceCardList.css';

const ServiceCardList = ({ services, title, loading, error }) => {
  if (loading) {
    return (
      <div className="service-card-list-container">
        <div className="loading-message">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-card-list-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="service-card-list-container">
        <div className="no-services-message">
          <i className="fas fa-search"></i>
          <h3>No services found</h3>
          <p>No active services available in this category. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-card-list-container">
      {title && <h2 className="service-section-title">{title}</h2>}
      <div className="service-card-list">
        {services.map((service) => (
          <div key={service._id || service.id} className="service-card-wrapper">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};

ServiceCardList.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      rating: PropTypes.number
    })
  ).isRequired,
  title: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string
};

ServiceCardList.defaultProps = {
  services: [],
  loading: false,
  error: null
};

export default ServiceCardList;