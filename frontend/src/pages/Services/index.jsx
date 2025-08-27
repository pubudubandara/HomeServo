import React from 'react';
import ServiceCards from '../../Components/ServiseCards/ServiceCards';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Browse through our wide range of home services</p>
      </div>
      <ServiceCards />
    </div>
  );
};

export default ServicesPage;
