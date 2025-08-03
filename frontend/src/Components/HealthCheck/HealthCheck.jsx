import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HealthCheck = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch health check status from the backend
    axios.get('http://localhost:5000/api/health-check')
      .then(response => {
        setStatus(response.data);
      })
      .catch(error => {
        console.error('There was an error connecting to the backend!', error);
        setStatus('Backend is not running');
      });
  }, []);

  return (
    <div>
      <h1>Health Check</h1>
      <p>{status}</p>
    </div>
  );
};

export default HealthCheck;