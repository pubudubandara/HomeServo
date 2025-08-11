// API endpoints for service management
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const serviceAPI = {
  // Public services (no authentication required)
  getPublicServices: async (queryParams = {}) => {
    const searchParams = new URLSearchParams(queryParams);
    const response = await fetch(`${API_BASE_URL}/services/public?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Get all services for a tasker
  getTaskerServices: async (taskerId, token) => {
    const response = await fetch(`${API_BASE_URL}/services/tasker/${taskerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Create a new service
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

  // Update a service
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

  // Toggle service status
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

  // Delete a service
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

  // Get service statistics
  getServiceStats: async (taskerId, token) => {
    const response = await fetch(`${API_BASE_URL}/services/tasker/${taskerId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Admin functions
  getAllServicesForAdmin: async (queryParams = {}, token) => {
    const searchParams = new URLSearchParams(queryParams);
    const response = await fetch(`${API_BASE_URL}/services/admin/all?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Admin review service
  adminReviewService: async (serviceId, reviewData, token) => {
    const response = await fetch(`${API_BASE_URL}/services/admin/${serviceId}/review`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    return response.json();
  }
};

// Service validation helpers
export const validateServiceData = (serviceData) => {
  const errors = {};

  if (!serviceData.title || serviceData.title.trim().length === 0) {
    errors.title = 'Service title is required';
  } else if (serviceData.title.length > 100) {
    errors.title = 'Service title must be less than 100 characters';
  }

  if (!serviceData.category) {
    errors.category = 'Category is required';
  }

  if (!serviceData.description || serviceData.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (serviceData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!serviceData.price || serviceData.price.trim().length === 0) {
    errors.price = 'Price is required';
  }

  if (!serviceData.image || serviceData.image.trim().length === 0) {
    errors.image = 'Image URL is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Service categories
export const SERVICE_CATEGORIES = [
  'Assembly',
  'Mounting', 
  'Moving',
  'Cleaning',
  'Outdoor Help',
  'Home Repairs',
  'Painting'
];

// Service states
export const SERVICE_STATES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Service statuses
export const SERVICE_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};
