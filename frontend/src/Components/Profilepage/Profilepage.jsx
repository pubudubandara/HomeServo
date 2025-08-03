import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

// Assuming cleaning.json is located in the public folder
const ProfilePage = () => {
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  // Fetch data from cleaning.json
  useEffect(() => {
    fetch('/cleaning.json')
      .then((response) => response.json())
      .then((data) => {
        // Find the service with id 3 (Window Cleaning)
        const windowCleaning = data.find(item => item.id === 3);
        setService(windowCleaning);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleBookNow = () => {
    navigate('/book');
  };

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-left">
        {/* Profile Info */}
        <div className="profile-header">
          <img
            className="profile-image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQncB8EF7S7xGCyvdoA_Rpwyt7-pLE4P7gmJQ&s"
            alt={service.name}
          />
          <div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <p>Location: <span className="location">Kandy</span></p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="profile-rating">
          <h2>4.5 <span>⭐</span></h2>
          <div className="rating-bars">
            <div className="rating-bar"><span>5</span> <div className="bar"><div className="fill" style={{ width: '80%' }}></div></div></div>
            <div className="rating-bar"><span>4</span> <div className="bar"></div></div>
            <div className="rating-bar"><span>3</span> <div className="bar"></div></div>
            <div className="rating-bar"><span>2</span> <div className="bar"></div></div>
            <div className="rating-bar"><span>1</span> <div className="bar"></div></div>
          </div>
          <p><a href="#">All Reviews (12)</a> | <a href="#">+ Add Review</a></p>
        </div>

        {/* Projects Section */}
        <h2 className="section-title">My Projects</h2>
        <div className="projects">
          <div className="project-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdHYgIjaWTBvMtZSPlMrjm2Sj3cYcyJy9J2Q&s" alt="Window Cleaning " />
            <p>Residential Window Cleaning - Cleaned 20 large glass windows for a client in Colombo, ensuring streak-free and polished windows inside and out.</p>
          </div>
          <div className="project-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqW25iwdlI7VWG1Gb1Mo8nSg2-pFPzvYcGXw&s" alt="Window Cleaning " />
            <p>Commercial Office Window Cleaning - Provided window cleaning for a 10-floor commercial building using eco-friendly cleaning solutions.</p>
          </div>
          <div className="project-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4uDK648waZG6RNbNHg0lRzFN0vE1YSd8C3A&s" alt="Window Cleaning " />
            <p>Luxury Villa Cleaning - Completed detailed window cleaning for a luxury villa in Kandy, restoring the glass panels to their original shine.</p>
          </div>
        </div>
        <button className="see-more">see more</button>
        <br/>

        {/* Description Section */}
        <h2 className="section-title">Description</h2>
        <div className="description">
          <h3>Top skills</h3>
          <p>Window cleaning, glass polishing, exterior wash.</p>

          <h3>Requirements</h3>
          <p>Access to all windows, water supply, electricity.</p>

          <h3>Why choose this service?</h3>
          <ul>
            <li>High-Quality Work</li>
            <li>Eco-Friendly Products</li>
            <li>On-time Delivery</li>
            <li>100% Satisfaction Guarantee</li>
          </ul>
        </div>
      </div>

      {/* Right Section: Booking */}
      <div className="profile-right">
        <div className="price-box">
          <h3>BASIC PACKAGE</h3>
          <div className="price">{service.price} <span>per job</span></div>
          <ul>
            <li>Crystal clear windows inside and out</li>
            <li>Cleaning of window sills and frames</li>
            <li>Removal of dust and grime</li>
            <li>Eco-friendly cleaning products</li>
          </ul>
          <button className="book-now" onClick={handleBookNow}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
