import React, { useState } from 'react';
import './ServiceCards.css';
import { FaTools, FaTruckMoving, FaHome, FaScrewdriver, FaBroom, FaTree, FaPaintRoller, FaFire } from 'react-icons/fa';

const ServiceCards = ({ onCategoryChange }) => {
  const [activeCard, setActiveCard] = useState(null);

  const categories = [
    { id: 0, name: 'Assembly', icon: <FaTools /> },
    { id: 1, name: 'Mounting', icon: <FaScrewdriver /> },
    { id: 2, name: 'Moving', icon: <FaTruckMoving /> },
    { id: 3, name: 'Cleaning', icon: <FaBroom /> },
    { id: 4, name: 'Outdoor Help', icon: <FaTree /> },
    { id: 5, name: 'Home Repairs', icon: <FaHome /> },
    { id: 6, name: 'Painting', icon: <FaPaintRoller /> },
    { id: 7, name: 'Trending', icon: <FaFire /> },
  ];

  const handleCardClick = (category) => {
    setActiveCard(category.id);
    onCategoryChange(category.name); // Call the parent function to change category
  };

  return (
    <nav className="service-cards">
      <ul className="service-links">
        {categories.map((category) => (
          <li
            key={category.id}
            className={`service-item ${activeCard === category.id ? 'active' : ''}`}
            onClick={() => handleCardClick(category)}
          >
            {category.icon}
            <p>{category.name}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ServiceCards;
