// Example of how to integrate the service API with the React component
import React, { useState, useEffect, useContext } from 'react';
import { serviceAPI, validateServiceData, SERVICE_CATEGORIES } from '../../utils/serviceAPI';
import { AuthContext } from '../../contexts/AuthContext';

const IntegratedTaskerServiceCards = () => {
  const [serviceCards, setServiceCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    image: '',
    tags: ''
  });

  const { user, token } = useContext(AuthContext); // Assuming you have auth context
  const taskerId = user?.taskerId; // Assuming taskerId is available in user object

  // Load services on component mount
  useEffect(() => {
    if (taskerId && token) {
      loadServices();
    }
  }, [taskerId, token]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviceAPI.getTaskerServices(taskerId, token);
      
      if (response.success) {
        setServiceCards(response.data);
      } else {
        setError(response.message || 'Failed to load services');
      }
    } catch (err) {
      setError('Error loading services');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateServiceData(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const serviceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const response = await serviceAPI.createService(taskerId, serviceData, token);
      
      if (response.success) {
        setServiceCards([response.data, ...serviceCards]);
        setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
        setShowCreateForm(false);
        alert(response.message || 'Service created successfully!');
      } else {
        setError(response.message || 'Failed to create service');
      }
    } catch (err) {
      setError('Error creating service');
      console.error('Error creating service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card._id);
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
    
    // Validate form data
    const validation = validateServiceData(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const serviceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      const response = await serviceAPI.updateService(editingCard, serviceData, token);
      
      if (response.success) {
        setServiceCards(serviceCards.map(card => 
          card._id === editingCard ? response.data : card
        ));
        setEditingCard(null);
        setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
        alert(response.message || 'Service updated successfully!');
      } else {
        setError(response.message || 'Failed to update service');
      }
    } catch (err) {
      setError('Error updating service');
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
        setServiceCards(serviceCards.map(card => 
          card._id === serviceId ? response.data : card
        ));
        alert(response.message);
      } else {
        setError(response.message || 'Failed to toggle service status');
        alert(response.message || 'Failed to toggle service status');
      }
    } catch (err) {
      setError('Error toggling service status');
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
        setServiceCards(serviceCards.filter(card => card._id !== serviceId));
        alert(response.message || 'Service deleted successfully!');
      } else {
        setError(response.message || 'Failed to delete service');
      }
    } catch (err) {
      setError('Error deleting service');
      console.error('Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
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

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="tasker-service-cards">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="service-container">
        {/* Rest of your JSX remains the same, but with updated event handlers */}
        {/* The UI code from your original component goes here */}
        {/* Make sure to use the backend data structure (e.g., card._id instead of card.id) */}
      </div>
    </div>
  );
};

export default IntegratedTaskerServiceCards;
