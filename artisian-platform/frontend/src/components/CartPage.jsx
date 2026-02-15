import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const token = localStorage.getItem('token');

  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };
  
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (!token) {
      alert('You must be logged in to checkout!');
      return navigate('/login');
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ cart }),
      });

      if (response.ok) {
        alert('Order placed successfully! Redirecting to order history.');
        setCart([]); // Clear the cart state
        localStorage.removeItem('cart'); // Clear the cart from localStorage
        navigate('/orders'); // Redirect to the new Orders page
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to checkout due to a server error.');
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                    <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.title} className="item-thumbnail" />
                    <div className="item-info">
                        <h3>{item.title}</h3>
                        <p className="item-price">Price: ${item.price}</p>
                    </div>
                </div>
                
                <div className="item-controls">
                    <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="remove-button">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-line">
                <span>Shipping:</span>
                <span>FREE</span>
            </div>
            <div className="summary-line total-line">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;