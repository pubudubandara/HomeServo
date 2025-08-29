import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskerForm.css';

const TaskerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    availability: '',
    rate: '',
    location: '',
    profileImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      profileImage: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic here
    try {
      // Add your API call here to submit the tasker profile
      console.log('Form submitted:', formData);
      navigate('/tasker/profile'); // Navigate to tasker profile page after submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div id="tasker-form">
      <h1>Complete Your Tasker Profile</h1>
      <p>Join our community of skilled professionals and start offering your services to customers in your area.</p>
      <form onSubmit={handleSubmit}>
        <h2>Professional Information</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="List your skills and expertise (e.g., plumbing, electrical, cleaning, etc.)"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="experience">Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Describe your relevant experience and qualifications"
            required
          />
        </div>

        <h2>Availability & Location</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="availability">Availability</label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g., Weekdays 9AM-5PM"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rate">Hourly Rate ($)</label>
            <input
              type="number"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              placeholder="Enter your hourly rate"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="location">Service Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your service area (city, state)"
            required
          />
        </div>

        <h2>Profile Image</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="profileImage">Upload Profile Picture</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit">Create Profile</button>
        
        <p>
          By creating your profile, you agree to our terms of service and privacy policy.
        </p>
      </form>
    </div>
  );
};

export default TaskerForm;
