import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './seller.css';

const Seller = ({ sellerId }) => {  // Assuming sellerId is passed as a prop
  const [sellerData, setSellerData] = useState(null);

  useEffect(() => {
    // Ensure sellerId is available before making the API call
    if (sellerId) {
      // Fetch tasker data as seller from MongoDB via API
      axios.get(`http://localhost:5001/api/seller/${id}`)  // Dynamically pass the sellerId
        .then(response => setSellerData(response.data))
        .catch(error => console.error("There was an error fetching the data!", error));
    }
  }, [sellerId]);  // Re-run the effect when sellerId changes

  if (!sellerData) return <p>Loading...</p>;

  return (
    <div className="seller-container">
      <div className="seller-header">
        <img src={sellerData.profilePic || "/default-pic.jpg"} alt="Profile" className="profile-pic" />
        <div className="seller-info">
          <h1>{sellerData.fullName}</h1>
          <p>Category: {sellerData.category}</p>
          <p>Email: {sellerData.email}</p>
        </div>
      </div>
      <hr className="divider" />
      <div className="orders-section">
        <h2>Your <span>Orders</span></h2>
        {sellerData.orders && sellerData.orders.length > 0 ? (
          sellerData.orders.map((order, index) => (
            <div key={index} className="order-item">
              <p className="order-title">• {order.title}</p>
              <p className="order-details">{order.details}</p>
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Seller;
