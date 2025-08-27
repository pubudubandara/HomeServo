import React from 'react';
import './Hero.css';

const Hero = () => {
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
          <input type="text" placeholder="Search..."/>
          <img src="/search.png" alt="" />
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


