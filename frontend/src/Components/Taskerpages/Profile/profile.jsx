import React, { useState, useEffect } from 'react';
import './profile.css';
import TaskerNavbar from '../navbar/navbar';

const TaskerProfile = () => {
  const [taskerData, setTaskerData] = useState({
    // Account Information
    username: 'mikejohnson_handyman',
    // Personal Information
    fullName: 'Michael Johnson',
    email: 'mike.johnson@email.com',
    phoneNumber: '+1 (555) 123-4567',
    // Address Information
    addressLine1: '1234 Oak Street',
    addressLine2: 'Apartment 2B',
    city: 'San Francisco',
    stateProvince: 'California',
    postalCode: '94102',
    country: 'United States',
    // Professional Information
    category: 'Home Repairs',
    experience: 'Advanced',
    hourlyRate: '45',
    bio: 'Experienced handyman with over 5 years in home repairs and maintenance. I specialize in plumbing, electrical work, and general home improvements. Customer satisfaction is my top priority, and I always ensure quality workmanship. I have helped hundreds of homeowners with their repair needs and take pride in solving problems efficiently and affordably.',
    skills: 'Plumbing, Electrical work, Furniture assembly, Painting, Drywall repair, Tile installation, Carpet installation, Window repair, Door installation, Kitchen cabinet mounting',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch tasker data from API
    fetchTaskerData();
  }, []);

  const fetchTaskerData = async () => {
    try {
      // Replace with actual API call to get tasker data
      const response = await fetch('http://localhost:5001/api/taskers/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTaskerData(data);
      }
    } catch (error) {
      console.error('Error fetching tasker data:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/taskers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(taskerData)
      });
      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskerData({ ...taskerData, [name]: value });
  };

  return (
    <>
      <TaskerNavbar />
      <div className="tasker-profile">
        <div className="profile-header">
          <div className="profile-image-section">
            {taskerData.profileImage ? (
              <img 
                src={taskerData.profileImage} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <span>{taskerData.fullName?.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="profile-basic-info">
            <h1>{taskerData.fullName}</h1>
            <p className="username">@{taskerData.username}</p>
            <p className="category">{taskerData.category} Specialist</p>
            <p className="hourly-rate">${taskerData.hourlyRate}/hour</p>
            <div className="profile-actions">
              <button onClick={handleEdit} className="edit-btn">
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button onClick={handleSave} className="save-btn">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>About Me</h2>
            {isEditing ? (
              <textarea
                name="bio"
                value={taskerData.bio}
                onChange={handleChange}
                rows="4"
                className="edit-textarea"
              />
            ) : (
              <p>{taskerData.bio}</p>
            )}
          </div>

          <div className="profile-section">
            <h2>Skills</h2>
            {isEditing ? (
              <textarea
                name="skills"
                value={taskerData.skills}
                onChange={handleChange}
                rows="3"
                className="edit-textarea"
              />
            ) : (
              <div className="skills-list">
                {taskerData.skills?.split(',').map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>Professional Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Category:</label>
                {isEditing ? (
                  <select name="category" value={taskerData.category} onChange={handleChange}>
                    <option value="Assembly">Assembly</option>
                    <option value="Mounting">Mounting</option>
                    <option value="Moving">Moving</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Outdoor Help">Outdoor Help</option>
                    <option value="Home Repairs">Home Repairs</option>
                    <option value="Painting">Painting</option>
                  </select>
                ) : (
                  <span>{taskerData.category}</span>
                )}
              </div>
              <div className="info-item">
                <label>Experience Level:</label>
                {isEditing ? (
                  <select name="experience" value={taskerData.experience} onChange={handleChange}>
                    <option value="Beginner">Beginner (0-1 years)</option>
                    <option value="Intermediate">Intermediate (1-3 years)</option>
                    <option value="Advanced">Advanced (3-5 years)</option>
                    <option value="Expert">Expert (5+ years)</option>
                  </select>
                ) : (
                  <span>{taskerData.experience}</span>
                )}
              </div>
              <div className="info-item">
                <label>Hourly Rate:</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="hourlyRate"
                    value={taskerData.hourlyRate}
                    onChange={handleChange}
                    min="10"
                    max="200"
                  />
                ) : (
                  <span>${taskerData.hourlyRate}/hour</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Contact Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={taskerData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{taskerData.email}</span>
                )}
              </div>
              <div className="info-item">
                <label>Phone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={taskerData.phoneNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{taskerData.phoneNumber}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Address</h2>
            <div className="address-info">
              {isEditing ? (
                <div className="address-edit">
                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={taskerData.addressLine1}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Address Line 2"
                    value={taskerData.addressLine2}
                    onChange={handleChange}
                  />
                  <div className="address-row">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={taskerData.city}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="stateProvince"
                      placeholder="State/Province"
                      value={taskerData.stateProvince}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="address-row">
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={taskerData.postalCode}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={taskerData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="address-display">
                  <p>{taskerData.addressLine1}</p>
                  {taskerData.addressLine2 && <p>{taskerData.addressLine2}</p>}
                  <p>{taskerData.city}, {taskerData.stateProvince} {taskerData.postalCode}</p>
                  <p>{taskerData.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskerProfile;
