import React from 'react';
import ServiceTest from '../../Components/ServiceTest';

const TestPage = () => {
  return (
    <div className="test-page">
      <div className="test-header">
        <h1>Service API Test</h1>
        <p>Test and debug service-related functionality</p>
      </div>
      <ServiceTest />
    </div>
  );
};

export default TestPage;
