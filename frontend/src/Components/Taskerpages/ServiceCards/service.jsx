import React, { useState, useEffect } from 'react';
import './service.css';
import TaskerNavbar from '../navbar/navbar';
import { useAuth } from '../../../contexts/AuthContext';
import { getTaskerProfile } from '../../../utils/taskerAPI';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Service API functions
const serviceAPI = {
  getTaskerServices: async (taskerId, token) => {
    const response = await fetch(`${API_BASE_URL}/services/tasker/${taskerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  createService: async (taskerId, serviceData, token) => {
    const response = await fetch(`${API_BASE_URL}/services/tasker/${taskerId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    return response.json();
  },

  updateService: async (serviceId, serviceData, token) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    return response.json();
  },

  toggleServiceStatus: async (serviceId, token) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  deleteService: async (serviceId, token) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  getServiceStats: async (taskerId, token) => {
    const response = await fetch(`${API_BASE_URL}/services/tasker/${taskerId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};

const TaskerServiceCards = () => {
  const { user } = useAuth();
  const [serviceCards, setServiceCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [taskerId, setTaskerId] = useState(null);
  const [serviceStats, setServiceStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalJobs: 0,
    averageRating: '0.0'
  });
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    image: '',
    tags: ''
  });

  const token = localStorage.getItem('token');

  const categories = [
    'Assembly', 'Mounting', 'Moving', 'Cleaning', 
    'Outdoor Help', 'Home Repairs', 'Painting'
  ];

  // Get tasker profile and load services
  useEffect(() => {
    const initializeData = async () => {
      if (token && user) {
        try {
          setLoading(true);
          
          // Get tasker profile to get taskerId
          const taskerResponse = await getTaskerProfile(token);
          
          if (taskerResponse.success && taskerResponse.data) {
            const fetchedTaskerId = taskerResponse.data._id;
            setTaskerId(fetchedTaskerId);
            
            // Load services and stats with the taskerId
            await Promise.all([
              loadServices(fetchedTaskerId),
              loadServiceStats(fetchedTaskerId)
            ]);
          } else {
            setError('Please complete your tasker profile first to manage services.');
          }
        } catch (err) {
          setError('Error loading tasker information.');
          console.error('Error initializing data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeData();
  }, [token, user]);

  const loadServices = async (currentTaskerId = taskerId) => {
    if (!currentTaskerId) return;
    
    try {
      setError(null);
      
      const response = await serviceAPI.getTaskerServices(currentTaskerId, token);
      
      if (response.success) {
        setServiceCards(response.data);
      } else {
        setError(response.message || 'Failed to load services');
      }
    } catch (err) {
      setError('Error loading services. Please try again.');
      console.error('Error loading services:', err);
    }
  };

  const loadServiceStats = async (currentTaskerId = taskerId) => {
    if (!currentTaskerId) return;
    
    try {
      const response = await serviceAPI.getServiceStats(currentTaskerId, token);
      
      if (response.success) {
        setServiceStats(response.data);
      }
    } catch (err) {
      console.error('Error loading service stats:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    
    if (!taskerId) {
      setError('Tasker profile not found. Please refresh the page.');
      return;
    }

    // Basic validation
    if (!formData.title || !formData.category || !formData.description || !formData.price || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const serviceData = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: formData.price.trim(),
        image: formData.image.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const response = await serviceAPI.createService(taskerId, serviceData, token);
      
      if (response.success) {
        await Promise.all([
          loadServices(),
          loadServiceStats()
        ]);
        setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
        setShowCreateForm(false);
        alert(response.message || 'Service created successfully! It will be reviewed by admin before activation.');
      } else {
        setError(response.message || 'Failed to create service');
      }
    } catch (err) {
      setError('Error creating service. Please try again.');
      console.error('Error creating service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card._id); // Use _id from MongoDB
    setFormData({
      title: card.title,
      category: card.category,
      description: card.description,
      price: card.price,
      image: card.image,
      tags: card.tags.join(', ')
    });
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.category || !formData.description || !formData.price || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const serviceData = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: formData.price.trim(),
        image: formData.image.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const response = await serviceAPI.updateService(editingCard, serviceData, token);
      
      if (response.success) {
        await Promise.all([
          loadServices(),
          loadServiceStats()
        ]);
        setEditingCard(null);
        setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
        alert(response.message || 'Service updated successfully!');
      } else {
        setError(response.message || 'Failed to update service');
      }
    } catch (err) {
      setError('Error updating service. Please try again.');
      console.error('Error updating service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (serviceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await serviceAPI.toggleServiceStatus(serviceId, token);
      
      if (response.success) {
        await Promise.all([
          loadServices(),
          loadServiceStats()
        ]);
        alert(response.message);
      } else {
        setError(response.message || 'Failed to toggle service status');
        alert(response.message || 'This service must be approved by admin before you can activate it.');
      }
    } catch (err) {
      setError('Error toggling service status. Please try again.');
      console.error('Error toggling service status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service card?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await serviceAPI.deleteService(serviceId, token);
      
      if (response.success) {
        await Promise.all([
          loadServices(),
          loadServiceStats()
        ]);
        alert(response.message || 'Service deleted successfully!');
      } else {
        setError(response.message || 'Failed to delete service');
      }
    } catch (err) {
      setError('Error deleting service. Please try again.');
      console.error('Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status === 'active' ? 'status-active' : 'status-inactive';
  };

  const getStateClass = (state) => {
    switch(state) {
      case 'approved': return 'state-approved';
      case 'rejected': return 'state-rejected';
      case 'pending': return 'state-pending';
      default: return 'state-pending';
    }
  };

  const getStateIcon = (state) => {
    switch(state) {
      case 'approved': return 'fas fa-check-circle';
      case 'rejected': return 'fas fa-times-circle';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-clock';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Show professional loading screen
  if (loading) {
    return (
      <div>
        <TaskerNavbar />
        <div className="tasker-service-cards">
          <div className="service-container">
            <div className="professional-loading">
              <div className="loading-container">
                {/* Main Logo at Top */}
                <div className="loading-header">
                  <div className="loading-logo">
                    <div className="logo-icon">
                      <i className="fas fa-tools"></i>
                    </div>
                    <div className="loading-rings">
                      <div className="ring ring-1"></div>
                      <div className="ring ring-2"></div>
                      <div className="ring ring-3"></div>
                    </div>
                  </div>
                </div>

                {/* Loading Text */}
                <div className="loading-content">
                  <h2 className="loading-title">Loading Services</h2>
                  <p className="loading-subtitle">Preparing your service dashboard...</p>
                </div>

                {/* Progress Bar */}
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <div className="progress-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>

                {/* Loading Features */}
                <div className="loading-features">
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Fetching your services</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-chart-line"></i>
                    <span>Loading statistics</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-star"></i>
                    <span>Calculating ratings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!taskerId || !token) {
    return (
      <div>
        <TaskerNavbar />
        <div className="tasker-service-cards">
          <div className="service-container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Please log in as a tasker to manage your services.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskerNavbar />
      <div className="tasker-service-cards">
        <div className="service-container">
          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <div className="error-content">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="error-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="service-header">
            <div className="header-content">
              <h1>My Service Cards</h1>
              <p>Manage your service offerings and showcase your skills to customers</p>
            </div>
            <button 
              className="create-card-btn"
              onClick={() => setShowCreateForm(true)}
              disabled={loading}
            >
              <i className="fas fa-plus"></i>
              Create New Service
            </button>
          </div>

          {/* Statistics */}
          <div className="service-stats">
            <div className="stat-card">
              <div className="stat-number">{serviceStats.total}</div>
              <div className="stat-label">Total Services</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{serviceStats.active}</div>
              <div className="stat-label">Active Services</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{serviceStats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{serviceStats.totalJobs}</div>
              <div className="stat-label">Total Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{serviceStats.averageRating}★</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="service-cards-grid">
            {serviceCards.map((card) => (
              <div key={card._id} className={`service-card ${card.status} ${card.state}`}>
                <div className="card-header">
                  <div className="card-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                  <div className="card-badges">
                    <div className={`card-status ${getStatusClass(card.status)}`}>
                      {card.status}
                    </div>
                    <div className={`card-state ${getStateClass(card.state)}`}>
                      <i className={getStateIcon(card.state)}></i>
                      {card.state}
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-category">{card.category}</div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                  
                  <div className="card-tags">
                    {card.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="card-stats">
                    <div className="stat-item">
                      <i className="fas fa-star"></i>
                      <span>{card.rating > 0 ? card.rating : 'No ratings'}</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-briefcase"></i>
                      <span>{card.jobsCompleted} jobs</span>
                    </div>
                    <div className="card-price">{card.price}</div>
                  </div>

                  {/* Admin Review Info */}
                  <div className="review-info">
                    <div className="created-date">
                      <i className="fas fa-calendar"></i>
                      Created: {formatDate(card.createdAt)}
                    </div>
                    {card.state === 'pending' && (
                      <div className="pending-message">
                        <i className="fas fa-info-circle"></i>
                        Waiting for admin approval
                      </div>
                    )}
                    {card.state === 'rejected' && (
                      <div className="rejected-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        Rejected by admin
                        {card.reviewNotes && <span className="review-notes">: {card.reviewNotes}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditCard(card)}
                    disabled={loading}
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button 
                    className={`toggle-btn ${card.status === 'active' ? 'deactivate' : 'activate'} ${card.state !== 'approved' ? 'disabled' : ''}`}
                    onClick={() => handleToggleStatus(card._id)}
                    disabled={card.state !== 'approved' || loading}
                    title={card.state !== 'approved' ? 'Service must be approved by admin first' : ''}
                  >
                    <i className={`fas ${card.status === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                    {card.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCard(card._id)}
                    disabled={loading}
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create/Edit Form Modal */}
          {(showCreateForm || editingCard) && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{editingCard ? 'Edit Service Card' : 'Create New Service Card'}</h2>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingCard(null);
                      setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <form onSubmit={editingCard ? handleUpdateCard : handleCreateCard}>
                  <div className="form-group">
                    <label>Service Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter service title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your service in detail"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., $45/hour or $100 fixed"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., IKEA, Furniture, Assembly"
                      required
                    />
                  </div>

                  {/* Admin Review Notice */}
                  <div className="admin-review-notice">
                    <div className="notice-content">
                      <i className="fas fa-info-circle"></i>
                      <div>
                        <strong>Admin Review Required</strong>
                        <p>Your service card will be reviewed by our admin team before it becomes active. This helps ensure quality and accuracy for our customers.</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      {editingCard ? 'Update Service' : 'Create Service'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingCard(null);
                        setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {serviceCards.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <h3>No Service Cards Yet</h3>
              <p>Create your first service card to start receiving bookings from customers</p>
              <button 
                className="create-first-btn"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Service
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskerServiceCards;