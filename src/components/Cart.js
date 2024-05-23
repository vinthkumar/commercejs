// src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { commerce } from '../lib/commerce';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await commerce.cart.retrieve();
        setCart(cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const { cart } = await commerce.cart.update(lineItemId, { quantity });
    setCart(cart);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    const { cart } = await commerce.cart.remove(lineItemId);
    setCart(cart);
  };

  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!cart || cart.total_items === 0) {
    return <p>Your cart is empty. <Link to="/">Go shopping</Link></p>;
  }

  return (
    <div className="container">
      <h1>Your Shopping Cart</h1>
      <div className="row">
        {cart.line_items.map((item) => (
          <div key={item.id} className="col-md-12 mb-4">
            <div className="card">
              <div className="row no-gutters">
                <div className="col-md-4">
                  <img
                    src={item.image.url}
                    className="card-img"
                    alt={item.name}
                    style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text"><strong>{item.price.formatted_with_symbol}</strong></p>
                    <p className="card-text">
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateCartQty(item.id, e.target.value)}
                        style={{ margin: '0 10px', width: '60px' }}
                      />
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-12">
          <h4>Total: {cart.subtotal.formatted_with_symbol}</h4>
          <button className="btn btn-danger" onClick={handleEmptyCart}>Empty Cart</button>
          <Link to="/" className="btn btn-primary" style={{ marginLeft: '10px' }}>Continue Shopping</Link>
          <Link to="/checkout" className="btn btn-success" style={{ marginLeft: '10px' }}>Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
