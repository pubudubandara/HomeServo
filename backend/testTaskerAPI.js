import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5001/api';

async function testTaskerAPI() {
  try {
    console.log('=== Testing Tasker API ===\n');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'testtasker@example.com',
        password: '123456'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login response:', loginResult);
    
    if (!loginResponse.ok) {
      console.error('Login failed:', loginResult);
      return;
    }
    
    const token = loginResult.token;
    console.log('✓ Login successful\n');
    
    // Step 2: Check if profile exists
    console.log('2. Checking if tasker profile exists...');
    const checkResponse = await fetch(`${API_BASE_URL}/taskers/profile/check`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const checkResult = await checkResponse.json();
    console.log('Profile check response:', checkResult);
    
    // Step 3: Create tasker profile if it doesn't exist
    if (!checkResult.hasProfile) {
      console.log('3. Creating tasker profile...');
      
      const formData = new FormData();
      formData.append('phoneNumber', '123-456-7890');
      formData.append('addressLine1', '123 Test St');
      formData.append('addressLine2', 'Apt 1');
      formData.append('city', 'Test City');
      formData.append('stateProvince', 'Test State');
      formData.append('postalCode', '12345');
      formData.append('country', 'Test Country');
      formData.append('category', 'Cleaning');
      formData.append('experience', 'Intermediate');
      formData.append('hourlyRate', '25');
      formData.append('bio', 'I am a test tasker with great cleaning skills');
      formData.append('skills', 'cleaning, organizing, deep cleaning');
      
      const createResponse = await fetch(`${API_BASE_URL}/taskers/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const createResult = await createResponse.json();
      console.log('Create profile response:', createResult);
      
      if (createResponse.ok) {
        console.log('✓ Tasker profile created successfully\n');
      } else {
        console.error('✗ Failed to create tasker profile:', createResult);
        return;
      }
    } else {
      console.log('✓ Tasker profile already exists\n');
    }
    
    // Step 4: Get tasker profile
    console.log('4. Getting tasker profile...');
    const getResponse = await fetch(`${API_BASE_URL}/taskers/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const getResult = await getResponse.json();
    console.log('Get profile response:', JSON.stringify(getResult, null, 2));
    
    if (getResponse.ok) {
      console.log('✓ Tasker profile retrieved successfully\n');
    } else {
      console.error('✗ Failed to get tasker profile:', getResult);
    }
    
    console.log('=== Test completed ===');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testTaskerAPI();
