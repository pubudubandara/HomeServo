import fetch from 'node-fetch';

const testBookingsAPI = async () => {
  try {
    const taskerId = '68b6dc5c3b165b4105b47656'; // From database
    const response = await fetch(`http://localhost:5001/api/bookings/tasker/${taskerId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testBookingsAPI();
