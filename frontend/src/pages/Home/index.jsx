import React, { useState, useEffect } from 'react';
import Hero from '../../Components/Hero/Hero';
import ServiceCards from '../../Components/ServiseCards/ServiceCards';
import ServiceCardList from '../../Components/Cards/ServiceCardList';
import Footer from '../../Components/Footer/Footer';
import { serviceAPI } from '../../utils/serviceAPI';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Assembly');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        if (selectedCategory && selectedCategory !== 'all') {
          queryParams.category = selectedCategory;
        }
        const response = await serviceAPI.getPublicServices(queryParams);
        setServices(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Hero />
      <ServiceCards onCategoryChange={handleCategoryChange} />
      <ServiceCardList 
        services={services} 
        title={`${selectedCategory} Services`}
        loading={loading}
        error={error}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
