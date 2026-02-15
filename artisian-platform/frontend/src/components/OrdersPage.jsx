import React, { useState, useEffect } from 'react';
import './OrdersPage.css';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError("Please log in to view your orders.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/orders/buyer', {
                    headers: { 'x-auth-token': token }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else if (response.status === 401) {
                    setError("Your session expired. Please log in again.");
                    localStorage.removeItem('token');
                } else {
                    setError("Failed to fetch orders.");
                }
            } catch (error) {
                setError("Network error. Could not connect to server.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    if (loading) return <h2 className="orders-title">Loading Orders...</h2>;
    if (error) return <div className="orders-container error-message">{error}</div>;

    return (
        <div className="orders-container">
            <h2 className="orders-title">Your Order History</h2>
            <div className="orders-summary">Total Orders: {orders.length}</div>

            {orders.length === 0 ? (
                <p>You have not placed any orders yet. <Link to="/products">Start shopping!</Link></p>
            ) : (
                <div className="order-list">
                    {orders.map(order => {
                        // CRITICAL FIX: Convert price string from MySQL to a float number
                        const totalPrice = parseFloat(order.total_price);
                        const unitPrice = order.quantity ? totalPrice / order.quantity : 0;
                        const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A';

                        return (
                            <div key={order.order_id} className="order-card">
                                <div className="order-header">
                                    <span className="order-id">Order #{order.order_id}</span>
                                    <span className={`order-status status-${order.status ? order.status.toLowerCase() : 'unknown'}`}>{order.status}</span>
                                </div>
                                
                                <div className="order-body">
                                    <img src={order.product_image || 'https://via.placeholder.com/60'} alt={order.product_title} className="product-thumb" />
                                    <div className="product-info-details">
                                        <h3>{order.product_title}</h3>
                                        <p>Artisan: {order.artisan_name}</p>
                                        <p>Quantity: {order.quantity} @ ${unitPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="order-price-details">
                                        {/* FIX APPLIED HERE: Use the converted number */}
                                        <span className="total-price">${totalPrice.toFixed(2)}</span> 
                                        <span className="order-date">Placed: {orderDate}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;