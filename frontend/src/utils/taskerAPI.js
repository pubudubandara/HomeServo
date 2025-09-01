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

export const getCurrentTasker = async () => {
  try {
    // Get tasker data from localStorage or other auth state
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    
    console.log('getCurrentTasker - userData:', userData);
    console.log('getCurrentTasker - token exists:', !!token);
    
    if (userData && (userData.role === 'tasker' || userData.userType === 'tasker')) {
      // Try to get tasker ID from various possible fields
      const taskerId = userData.taskerId || userData.id || userData._id;
      console.log('Found tasker ID:', taskerId);
      
      if (taskerId) {
        return { success: true, data: { ...userData, _id: taskerId, id: taskerId } };
      }
    }
    
    if (token) {
      // Try to fetch tasker profile if we have a token but no stored user data
      console.log('Attempting to fetch tasker profile with token');
      const profileResult = await getTaskerProfile(token);
      if (profileResult.success) {
        return { success: true, data: profileResult.data };
      }
    }
    
    return { success: false, message: 'No tasker logged in' };
  } catch (error) {
    console.error('Error getting current tasker:', error);
    return { success: false, message: 'Error getting current tasker' };
  }
};
