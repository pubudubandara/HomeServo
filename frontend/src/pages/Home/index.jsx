import React, { useState } from 'react';
import Hero from '../../Components/Hero/Hero';
import ServiceCards from '../../Components/ServiseCards/ServiceCards';
import CardList from '../../Components/CardList';
import Footer from '../../Components/Footer/Footer';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Assembly'); // Default category

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update the selected category
  };

  return (
    <div>
      <Hero />
      <ServiceCards onCategoryChange={handleCategoryChange} /> {/* Pass the function */}
      <CardList selectedCategory={selectedCategory} /> {/* Pass the selected category */}
      <Footer />
    </div>
  );
};

export default HomePage;
