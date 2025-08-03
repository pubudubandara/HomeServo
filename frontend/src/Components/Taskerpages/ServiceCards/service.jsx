import React, { useState } from 'react';
import './service.css';
import TaskerNavbar from '../navbar/navbar';

const TaskerServiceCards = () => {
  const [serviceCards, setServiceCards] = useState([
    {
      id: 1,
      title: 'Furniture Assembly & Installation',
      category: 'Assembly',
      description: 'Professional furniture assembly service for IKEA, Wayfair, and other furniture brands. Quick and efficient setup with proper tools.',
      price: '$45/hour',
      image: '/src/assets/CardImage/hammer 1.png',
      status: 'active',
      rating: 4.8,
      jobsCompleted: 23,
      tags: ['IKEA', 'Furniture', 'Assembly', 'Installation']
    },
    {
      id: 2,
      title: 'Interior Painting Services',
      category: 'Painting',
      description: 'Complete interior painting including walls, ceilings, and trim. Using high-quality paints and professional techniques.',
      price: '$55/hour',
      image: '/src/assets/CardImage/paintwork 1.png',
      status: 'active',
      rating: 4.9,
      jobsCompleted: 18,
      tags: ['Interior', 'Walls', 'Ceilings', 'Professional']
    },
    {
      id: 3,
      title: 'Home Repair & Maintenance',
      category: 'Home Repairs',
      description: 'General home repairs including plumbing fixes, electrical work, drywall repair, and general maintenance tasks.',
      price: '$50/hour',
      image: '/src/assets/CardImage/car-repair 1.png',
      status: 'inactive',
      rating: 4.7,
      jobsCompleted: 31,
      tags: ['Plumbing', 'Electrical', 'Drywall', 'Maintenance']
    }
  ]);

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

  const categories = [
    'Assembly', 'Mounting', 'Moving', 'Cleaning', 
    'Outdoor Help', 'Home Repairs', 'Painting'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(),
      ...formData,
      status: 'active',
      rating: 0,
      jobsCompleted: 0,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };
    setServiceCards([...serviceCards, newCard]);
    setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
    setShowCreateForm(false);
  };

  const handleEditCard = (card) => {
    setEditingCard(card.id);
    setFormData({
      title: card.title,
      category: card.category,
      description: card.description,
      price: card.price,
      image: card.image,
      tags: card.tags.join(', ')
    });
  };

  const handleUpdateCard = (e) => {
    e.preventDefault();
    setServiceCards(serviceCards.map(card => 
      card.id === editingCard 
        ? { ...card, ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) }
        : card
    ));
    setEditingCard(null);
    setFormData({ title: '', category: '', description: '', price: '', image: '', tags: '' });
  };

  const handleToggleStatus = (id) => {
    setServiceCards(serviceCards.map(card => 
      card.id === id 
        ? { ...card, status: card.status === 'active' ? 'inactive' : 'active' }
        : card
    ));
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('Are you sure you want to delete this service card?')) {
      setServiceCards(serviceCards.filter(card => card.id !== id));
    }
  };

  const getStatusClass = (status) => {
    return status === 'active' ? 'status-active' : 'status-inactive';
  };

  return (
    <div>
      <TaskerNavbar />
      <div className="tasker-service-cards">
        <div className="service-container">
          {/* Header Section */}
          <div className="service-header">
            <div className="header-content">
              <h1>My Service Cards</h1>
              <p>Manage your service offerings and showcase your skills to customers</p>
            </div>
            <button 
              className="create-card-btn"
              onClick={() => setShowCreateForm(true)}
            >
              <i className="fas fa-plus"></i>
              Create New Service
            </button>
          </div>

          {/* Statistics */}
          <div className="service-stats">
            <div className="stat-card">
              <div className="stat-number">{serviceCards.length}</div>
              <div className="stat-label">Total Services</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{serviceCards.filter(card => card.status === 'active').length}</div>
              <div className="stat-label">Active Services</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{serviceCards.reduce((sum, card) => sum + card.jobsCompleted, 0)}</div>
              <div className="stat-label">Total Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {serviceCards.length > 0 
                  ? (serviceCards.reduce((sum, card) => sum + card.rating, 0) / serviceCards.length).toFixed(1)
                  : '0.0'
                }★
              </div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="service-cards-grid">
            {serviceCards.map((card) => (
              <div key={card.id} className={`service-card ${card.status}`}>
                <div className="card-header">
                  <div className="card-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                  <div className={`card-status ${getStatusClass(card.status)}`}>
                    {card.status}
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
                </div>

                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditCard(card)}
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button 
                    className={`toggle-btn ${card.status === 'active' ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleStatus(card.id)}
                  >
                    <i className={`fas ${card.status === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                    {card.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCard(card.id)}
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