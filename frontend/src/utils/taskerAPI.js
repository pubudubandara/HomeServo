// API utility to get tasker information
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getTaskerProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/taskers/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, message: 'Failed to fetch tasker profile' };
    }
  } catch (error) {
    console.error('Error fetching tasker profile:', error);
    return { success: false, message: 'Error fetching tasker profile' };
  }
};

export const checkTaskerProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/taskers/profile/check`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, message: 'Failed to check tasker profile' };
    }
  } catch (error) {
    console.error('Error checking tasker profile:', error);
    return { success: false, message: 'Error checking tasker profile' };
  }
};
