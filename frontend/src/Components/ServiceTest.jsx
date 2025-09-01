import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../utils/serviceAPI';

const ServiceTest = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Testing public services API...');
      
      const response = await serviceAPI.getPublicServices();
      console.log('API Response:', response);
      
      if (response.success) {
        setServices(response.data);
        console.log('Services fetched:', response.data);
      } else {
        setError(response.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Error fetching services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Service API Test</h2>
      
      <button onClick={testAPI} disabled={loading}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>API Response:</h3>
        <p>Total Services: {services.length}</p>
        
        {services.length > 0 ? (
          <div>
            <h4>Services Found:</h4>
            {services.map((service, index) => (
              <div key={service._id || index} style={{ 
                border: '1px solid #ccc', 
                padding: '10px', 
                margin: '10px 0',
                borderRadius: '5px'
              }}>
                <h5>{service.name}</h5>
                <p><strong>Description:</strong> {service.description}</p>
                <p><strong>Price:</strong> ${service.price}</p>
                <p><strong>Category:</strong> {service.category}</p>
                <p><strong>Status:</strong> {service.status}</p>
                {service.tasker && (
                  <p><strong>Tasker:</strong> {service.tasker.firstName} {service.tasker.lastName}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No services found</p>
        )}
      </div>
    </div>
  );
};

export default ServiceTest;
