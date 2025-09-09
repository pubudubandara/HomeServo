import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskerForm.css';

const TaskerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    category: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    skills: '',
    profileImage: null
  });

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      alert('Please login to create a tasker profile');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'tasker') {
        alert('Access denied. Tasker role required.');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

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
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create a tasker profile');
        navigate('/login');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('addressLine1', formData.addressLine1);
      submitData.append('addressLine2', formData.addressLine2);
      submitData.append('city', formData.city);
      submitData.append('stateProvince', formData.stateProvince);
      submitData.append('postalCode', formData.postalCode);
      submitData.append('country', formData.country);
      submitData.append('category', formData.category);
      submitData.append('experience', formData.experience);
      submitData.append('hourlyRate', formData.hourlyRate);
      submitData.append('bio', formData.bio);
      submitData.append('skills', formData.skills);
      
      // Append profile image if selected
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
      }

      const response = await fetch('http://localhost:5001/api/taskers/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Tasker profile created successfully!');
        navigate('/tasker/profile');
      } else {
        const errorData = await response.json();
        alert(`Error creating profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tasker-form">
      <h1>Complete Your Tasker Profile</h1>
      <p>Join our community of skilled professionals and start offering your services to customers in your area.</p>
      <form onSubmit={handleSubmit}>
        <h2>Personal Information</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <h2>Address Information</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="addressLine1">Address Line 1</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Enter your street address"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="addressLine2">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stateProvince">State/Province</label>
            <input
              type="text"
              id="stateProvince"
              name="stateProvince"
              value={formData.stateProvince}
              onChange={handleChange}
              placeholder="Enter your state or province"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Enter your postal code"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              required
            />
          </div>
        </div>

        <h2>Professional Information</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="category">Service Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Assembly">Assembly</option>
            <option value="Mounting">Mounting</option>
            <option value="Moving">Moving</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Outdoor Help">Outdoor Help</option>
            <option value="Home Repairs">Home Repairs</option>
            <option value="Painting">Painting</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select experience level</option>
            <option value="Beginner">Beginner (0-1 years)</option>
            <option value="Intermediate">Intermediate (1-3 years)</option>
            <option value="Advanced">Advanced (3-5 years)</option>
            <option value="Expert">Expert (5+ years)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="hourlyRate">Hourly Rate ($)</label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            placeholder="Enter your hourly rate"
            min="10"
            max="200"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself, your experience, and why customers should choose you"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="List your skills separated by commas (e.g., plumbing, electrical work, tile installation)"
            rows="3"
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

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>
        
        <p>
          By creating your profile, you agree to our terms of service and privacy policy.
        </p>
      </form>
    </div>
  );
};

export default TaskerForm;
