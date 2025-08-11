import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import TaskerNavbar from '../navbar/navbar';

const TaskerProfile = () => {
  const navigate = useNavigate();
  const [taskerData, setTaskerData] = useState({
    // Account Information
    name: '',
    // Personal Information
    email: '',
    phoneNumber: '',
    // Address Information
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    // Professional Information
    category: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    skills: '',
    profileImageUrl: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to access this page');
      navigate('/login');
      return;
    }
    
    // Fetch tasker data from API
    fetchTaskerData();
  }, [navigate]);

  const fetchTaskerData = async () => {
    try {
      setLoading(true);
      // Replace with actual API call to get tasker data
      const response = await fetch('http://localhost:5001/api/taskers/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Convert skills array to comma-separated string for display/editing
        if (Array.isArray(data.skills)) {
          data.skills = data.skills.join(', ');
        }
        setTaskerData(data);
      } else {
        console.error('Failed to fetch tasker data:', response.statusText);
        // Check if it's an auth error
        if (response.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching tasker data:', error);
      alert('Error loading profile data. Please try again.');
    } finally {
      setLoading(false);
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
        const result = await response.json();
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Refresh the data to get the latest from the database
        fetchTaskerData();
      } else {
        const errorData = await response.json();
        alert(`Error updating profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle hourlyRate as a number
    if (name === 'hourlyRate') {
      setTaskerData({ ...taskerData, [name]: Number(value) || 0 });
    } else {
      setTaskerData({ ...taskerData, [name]: value });
    }
  };

  return (
    <>
      <TaskerNavbar />
      {loading ? (
        <div className="tasker-profile">
          <div className="loading-container">
            <p>Loading profile...</p>
          </div>
        </div>
      ) : (
        <div className="tasker-profile">
        <div className="profile-header">
          <div className="profile-image-section">
            {taskerData.profileImageUrl ? (
              <img 
                src={taskerData.profileImageUrl} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <span>{taskerData.name?.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="profile-basic-info">
            <h1>{taskerData.name}</h1>
            <p className="username">@{taskerData.email}</p>
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
      )}
    </>
  );
};

export default TaskerProfile;
