import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ArtisanDashboard.css'; 

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/artisan/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('Network error. Please check if your backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [navigate]);

    const handleEdit = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.ok) {
                setProducts(products.filter(product => product.id !== productId));
                alert('Product deleted successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Network error while deleting product');
        }
    };

    if (loading) {
        return <h2 className="dashboard-title">Loading your products...</h2>;
    }

    if (error) {
        return <div className="dashboard-container" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
                <Link to="/sell-product" className="back-button" style={{ backgroundColor: 'var(--color-accent-terracotta)' }}>+ Add New Product</Link>
            </div>
            
            <h2 className="dashboard-title">My Current Product Listings ({products.length})</h2>
            
            <div className="product-list">
                {products.length === 0 ? (
                    <p>You haven't added any products yet. <Link to="/sell-product">Click here</Link> to get started!</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="dashboard-product-card">
                            <div className="product-details">
                                {product.image_url && (
                                    <img 
                                        src={product.image_url.startsWith('http') 
                                            ? product.image_url 
                                            : `http://localhost:5000${product.image_url}`
                                        } 
                                        alt={product.title}
                                        className="product-thumbnail"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=Image'; }}
                                    />
                                )}
                                <div>
                                    <h3>{product.title}</h3>
                                    <p>Price: ${product.price} | Stock: {product.stock_count} | Category: {product.category}</p>
                                </div>
                            </div>
                            <div className="product-actions">
                                <button onClick={() => handleEdit(product.id)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyProducts;