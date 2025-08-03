
import React, { useState } from 'react';
import Hero from '../Hero/Hero'
import ServiceCards from '../ServiseCards/ServiceCards'
import About from '../About/About'
import CardList from '../CardList'
import Footer from '../Footer/Footer'

const Home = () => {
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

export default Home;