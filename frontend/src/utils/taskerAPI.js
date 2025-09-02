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
    // Get token first
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    
    console.log('getCurrentTasker - userData:', userData);
    console.log('getCurrentTasker - token exists:', !!token);
    
    if (!token || !userData) {
      return { success: false, message: 'No authentication found' };
    }
    
    // Check if user has tasker role
    if (userData.role !== 'tasker') {
      return { success: false, message: 'User is not a tasker' };
    }
    
    // Try to fetch tasker profile to get the tasker ID
    console.log('Attempting to fetch tasker profile with token');
    const profileResult = await getTaskerProfile(token);
    
    if (profileResult.success) {
      // The profile data should include the tasker _id
      const taskerData = {
        ...profileResult.data,
        userId: userData._id, // The user ID from login
        _id: profileResult.data._id, // The tasker profile ID
        id: profileResult.data._id // Alias for consistency
      };
      console.log('Successfully got tasker profile:', taskerData);
      return { success: true, data: taskerData };
    } else {
      console.log('Failed to get tasker profile:', profileResult.message);
      return { success: false, message: 'Tasker profile not found' };
    }
    
  } catch (error) {
    console.error('Error getting current tasker:', error);
    return { success: false, message: 'Error getting current tasker' };
  }
};
