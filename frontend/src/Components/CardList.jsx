import React, { useState, useEffect } from 'react';
import Cards from './Cards/Cards'; // Import the Cards component

const CardList = ({ selectedCategory }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      // Dynamically fetch the JSON file based on the category
      fetch(`/${selectedCategory.toLowerCase()}.json`) // Assuming category names match file names
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => setServices(data))
        .catch((error) => console.error('Error fetching services:', error));
    }
  }, [selectedCategory]); // Re-fetch whenever the category changes

  return (
    <div className="card-list">
      {services.map((service) => (
        <Cards
          key={service.id}
          name={service.name}
          description={service.description}
          price={service.price}
          image={service.image} // Pass the image prop here
        />
      ))}
    </div>
  );
};

export default CardList;
