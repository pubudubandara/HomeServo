const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Dashboard API
export const adminAPI = {
  // Dashboard endpoints
  dashboard: {
    getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  // User management endpoints
  users: {
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        status: params.status || ''
      });
      
      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  // Tasker management endpoints
  taskers: {
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        status: params.status || '',
        category: params.category || ''
      });
      
      const response = await fetch(`${API_BASE_URL}/admin/taskers?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/admin/taskers/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  },

  // Approval endpoints
  approvals: {
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10
      });
      
      const response = await fetch(`${API_BASE_URL}/admin/approval?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },

    approve: async (id) => {
      const response = await fetch(`${API_BASE_URL}/admin/approval/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    },

    reject: async (id) => {
      const response = await fetch(`${API_BASE_URL}/admin/approval/${id}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    }
  }
};

export default adminAPI;
