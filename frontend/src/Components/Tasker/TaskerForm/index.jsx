import React, { useState, useEffect } from 'react';
import './TaskerForm.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const TaskerForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
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
    profileImage: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is logged in and has tasker role
    if (!user || user.role !== 'tasker') {
      alert('Please login as a tasker to access this page.');
      navigate('/login');
      return;
    }

    // Check if tasker profile already exists
    const checkExistingProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/taskers/profile/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (response.ok && result.hasProfile) {
          alert('You already have a tasker profile. Redirecting to your dashboard.');
          navigate('/tasker/profile');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkExistingProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields (removed signup fields)
    const requiredFields = ['addressLine1', 'city', 'postalCode', 'country', 'category', 'experience', 'hourlyRate', 'bio'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      // Convert skills to array if not empty
      const processedFormData = {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
          : []
      };
      
      console.log('Sending profile data:', processedFormData); // Debug log
      
      Object.entries(processedFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // For FormData, arrays need to be stringified
          if (Array.isArray(value)) {
            data.append(key, JSON.stringify(value));
          } else {
            data.append(key, value);
          }
        }
      });

      console.log('FormData entries:'); // Debug log
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/taskers/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      
      const result = await response.json();
      console.log('Server response:', result); // Debug log
      
      if (response.ok) {
        alert('Tasker profile created successfully! Welcome to the platform.');
        navigate('/tasker/profile');
      } else {
        alert(result.message || 'Error creating profile');
        console.error('Server error details:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="tasker-form">
      <h1>Complete Your Tasker Profile</h1>
      <p>Add your professional details to start accepting tasks!</p>
      <form onSubmit={handleSubmit}>
        <h2>Profile Image</h2>
        <input 
          type="file" 
          name="profileImage" 
          accept="image/*"
          onChange={handleChange} 
        />

        <h2>Contact Information</h2>
        <input 
          type="text" 
          name="phoneNumber" 
          placeholder="Phone Number" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
        />

        <h2>Address Information</h2>
        <input 
          type="text" 
          name="addressLine1" 
          placeholder="Address Line 1" 
          value={formData.addressLine1} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="addressLine2" 
          placeholder="Address Line 2" 
          value={formData.addressLine2} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="city" 
          placeholder="City" 
          value={formData.city} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="stateProvince" 
          placeholder="State/Province" 
          value={formData.stateProvince} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="postalCode" 
          placeholder="Postal Code" 
          value={formData.postalCode} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="country" 
          placeholder="Country" 
          value={formData.country} 
          onChange={handleChange} 
          required 
        />
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          required
        >
          <option value="">Select Category</option>
          <option value="Assembly">Assembly</option>
          <option value="Mounting">Mounting</option>
          <option value="Moving">Moving</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Outdoor Help">Outdoor Help</option>
          <option value="Home Repairs">Home Repairs</option>
          <option value="Painting">Painting</option>
        </select>

        <h2>Professional Information</h2>
        <select 
          name="experience" 
          value={formData.experience} 
          onChange={handleChange} 
          required
        >
          <option value="">Select Experience Level</option>
          <option value="Beginner">Beginner (0-1 years)</option>
          <option value="Intermediate">Intermediate (1-3 years)</option>
          <option value="Advanced">Advanced (3-5 years)</option>
          <option value="Expert">Expert (5+ years)</option>
        </select>
        
        <input 
          type="number" 
          name="hourlyRate" 
          placeholder="Hourly Rate ($)" 
          value={formData.hourlyRate} 
          onChange={handleChange} 
          min="10"
          max="200"
          required 
        />
        
        <textarea 
          name="bio" 
          placeholder="Tell us about yourself and your experience..." 
          value={formData.bio} 
          onChange={handleChange} 
          rows="4"
          required
        />
        
        <textarea 
          name="skills" 
          placeholder="List your key skills (e.g., Plumbing, Electrical work, Furniture assembly...)" 
          value={formData.skills} 
          onChange={handleChange} 
          rows="3"
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Profile...' : 'Complete Profile'}
        </button>
        <button type="reset" onClick={() => setFormData({
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
        })}>Reset Form</button>
        <p>Your information will be kept private.</p>
      </form>
    </div>
  );
};

export default TaskerForm;
