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
    <div className="tasker-form-container">
      <h2>Complete Your Tasker Profile</h2>
      <form onSubmit={handleSubmit} className="tasker-form">
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="List your skills and expertise"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Describe your relevant experience"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="availability">Availability</label>
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
          <label htmlFor="rate">Hourly Rate ($)</label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="Enter your hourly rate"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your service area"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="submit-button">
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default TaskerForm;
