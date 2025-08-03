import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css'; // Import your CSS styles if any

const Cards = ({ name, description, price, image }) => {
  const navigate = useNavigate(); // Correctly use useNavigate

  const handleClick = () => {
    navigate('/profilepage'); // Use navigate to redirect
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={image} alt={name} className="card-image" /> {/* Add image */}
      <div className="card-content">
        <h2>{name}</h2>
        <p>{description}</p>
        <p>{price}</p>
      </div>
    </div>
  );
};

export default Cards;