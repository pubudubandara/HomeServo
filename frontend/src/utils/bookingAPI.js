// API utility for booking operations
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getTaskerBookings = async (taskerId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add optional query parameters
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/bookings/tasker/${taskerId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Failed to fetch bookings' };
    }
  } catch (error) {
    console.error('Error fetching tasker bookings:', error);
    return { success: false, message: 'Error fetching tasker bookings' };
  }
};

export const updateBookingStatus = async (bookingId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Failed to update booking status' };
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, message: 'Error updating booking status' };
  }
};

export const getCustomerBookings = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/customer/${encodeURIComponent(userId)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data.data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Failed to fetch customer bookings' };
    }
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return { success: false, message: 'Error fetching customer bookings' };
  }
};
