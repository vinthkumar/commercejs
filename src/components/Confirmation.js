// src/components/Confirmation.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return <p>No order found. <Link to="/">Go back to shopping</Link></p>;
  }

  return (
    <div className="container">
      <h1>Thank you for your order!</h1>
      <p>Your order reference is: <strong>{order.customer_reference}</strong></p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
};

export default Confirmation;
