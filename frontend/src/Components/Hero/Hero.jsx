import React, { useState } from 'react';
import './Hero.css';

const Hero = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div>
      <div className="Conatiner">
        <div className="Title">
          <p>Book <span>trusted</span></p>
          <p>help for your tasks</p>
        </div>
        <div className="SearchTag">
          <p>Hire a <span>Pro</span></p>
          <p>|</p>
          <p>Find <span>Customers</span></p>
        </div>
        <div className="SearchBar">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search services, taskers, or locations..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      <div className="Background">
        <img src="/Decore.png" alt="Background Decoration" />
      </div>
      <div className="Charactor">
        <img src="/girl-base.png" alt="Character Image" />
      </div>
    </div>
  );
}

export default Hero;


