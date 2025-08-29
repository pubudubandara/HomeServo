import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const TestPage = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Test Services Page</h1>
        <p>This is a test page for services functionality.</p>
      </div>
      <Footer />
    </div>
  );
};

export default TestPage;
