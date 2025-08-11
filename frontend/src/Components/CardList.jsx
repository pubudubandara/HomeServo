import React, { useState, useEffect } from 'react';
import Cards from './Cards/Cards'; // Import the Cards component
import { serviceAPI } from '../utils/serviceAPI'; // Import the service API

const CardList = ({ selectedCategory }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare query parameters
        const queryParams = {};
        if (selectedCategory && selectedCategory !== 'all') {
          queryParams.category = selectedCategory;
        }

        // Fetch services from backend
        const response = await serviceAPI.getPublicServices(queryParams);
        
        if (response.success) {
          setServices(response.data);
        } else {
          setError(response.message || 'Failed to fetch services');
        }
      } catch (err) {
        setError('Error loading services. Please try again.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory]); // Re-fetch whenever the category changes

  if (loading) {
    return (
      <div className="card-list">
        <div className="loading-message">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-list">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="card-list">
        <div className="no-services-message">
          <i className="fas fa-search"></i>
          <h3>No services found</h3>
          <p>No active services available in this category. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-list">
      {services.map((service) => (
        <Cards
          key={service.id}
          name={service.name}
          description={service.description}
          price={service.price}
          image={service.image}
          category={service.category}
          rating={service.rating}
          jobsCompleted={service.jobsCompleted}
          tasker={service.tasker}
          serviceId={service.id}
        />
      ))}
    </div>
  );
};

export default CardList;
