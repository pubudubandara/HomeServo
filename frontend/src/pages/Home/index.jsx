import React, { useState, useEffect } from 'react';
import Hero from '../../Components/Hero/Hero';
import ServiceCards from '../../Components/ServiseCards/ServiceCards';
import ServiceCardList from '../../Components/Cards/ServiceCardList';
import Footer from '../../Components/Footer/Footer';
import { serviceAPI } from '../../utils/serviceAPI';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Assembly');
  const [searchTerm, setSearchTerm] = useState('');
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
        if (searchTerm.trim()) {
          queryParams.search = searchTerm.trim();
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
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getTitle = () => {
    if (searchTerm.trim()) {
      return `Search Results for "${searchTerm}"`;
    }
    return `${selectedCategory} Services`;
  };

  return (
    <div>
      <Hero onSearch={handleSearch} />
      {searchTerm.trim() && (
        <ServiceCardList
          services={services}
          title={getTitle()}
          loading={loading}
          error={error}
        />
      )}
      <ServiceCards onCategoryChange={handleCategoryChange} />
      {!searchTerm.trim() && (
        <ServiceCardList
          services={services}
          title={getTitle()}
          loading={loading}
          error={error}
        />
      )}
      <Footer />
    </div>
  );
};

export default ServicesPage;
