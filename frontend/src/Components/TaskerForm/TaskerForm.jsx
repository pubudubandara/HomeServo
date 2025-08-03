import React, { useState } from 'react';
import './TaskerForm.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const TaskerForm = () => {
  const [formData, setFormData] = useState({
    // Signup fields
    username: '',
    password: '',
    confirmPassword: '',
    // Personal Information
    fullName: '',
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
    profileImage: null
  });

  const navigate = useNavigate();  // Initialize the useNavigate hook

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
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5001/api/taskers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('You are a Tasker now!');
        navigate('/tasker/profile');  // Redirect to Tasker Profile page after successful signup
      } else {
        alert('Error submitting application');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id="tasker-form">
      <h1>Become a Tasker</h1>
      <p>Join our community of skilled Taskers and start earning!</p>
      <form onSubmit={handleSubmit}>
        <h2>Account Information</h2>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          required 
        />

        <h2>Profile Image</h2>
        <input 
          type="file" 
          name="profileImage" 
          accept="image/*"
          onChange={handleChange} 
        />

        <h2>Personal Information</h2>
        <input 
          type="text" 
          name="fullName" 
          placeholder="Full Name" 
          value={formData.fullName} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
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

        <button type="submit">Submit Application</button>
        <button type="reset" onClick={() => setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          email: '',
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
