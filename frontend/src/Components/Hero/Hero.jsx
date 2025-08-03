import React from 'react';
import './Hero.css';
import backgreen from '../../../public/Decore.png';
import charactor from '../../../public/girl-base.png';
import search from '../../../public/search.png';


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
          <img src={search} alt="" />
        </div>
      </div>
      <div className="Background">
        <img src={backgreen} alt="Background Decoration" />
      </div>
      <div className="Charactor">
        <img src={charactor} alt="Character Image" />
      </div>
    </div>
  );
}

export default Hero;


