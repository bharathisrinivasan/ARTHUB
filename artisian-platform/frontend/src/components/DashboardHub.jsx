import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DashboardHub.css';

const DashboardHub = () => {
    const location = useLocation();
    const [artisanName, setArtisanName] = useState('Artisan');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        revenue: 0,
        views: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Fetch profile data
                const profileResponse = await fetch('http://localhost:5000/api/artisan/profile', {
                    headers: { 'x-auth-token': token }
                });

                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const profileData = await profileResponse.json();
                setArtisanName(profileData.name || 'Artisan');

                // Fetch dashboard stats
                const statsResponse = await fetch('http://localhost:5000/api/artisan/dashboard-stats', {
                    headers: { 'x-auth-token': token }
                });

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats({
                        products: statsData.totalProducts || 0,
                        orders: statsData.pendingOrders || 0,
                        revenue: statsData.monthlyRevenue || 0,
                        views: statsData.profileViews || 0
                    });
                }

            } catch (err) {
                setError(err.message);
                console.error('Dashboard data fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="artisan-profile">
                        <div className="profile-avatar">
                            {artisanName[0]}
                        </div>
                        <div className="profile-info">
                            <h3>{artisanName}</h3>
                            <p>Artisan</p>
                        </div>
                    </div>
                </div>

                <nav>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                📊 Overview
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products/my" className={`nav-link ${isActive('/products/my') ? 'active' : ''}`}>
                                🏪 My Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                                📦 Orders
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/portfolio/manage" className={`nav-link ${isActive('/portfolio/manage') ? 'active' : ''}`}>
                                🎨 Portfolio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/blogs/manage" className={`nav-link ${isActive('/blogs/manage') ? 'active' : ''}`}>
                                ✍️ Blog Posts
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile/settings" className={`nav-link ${isActive('/profile/settings') ? 'active' : ''}`}>
                                ⚙️ Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="content-wrapper">
                    <div className="welcome-header fade-in">
                        <h1>Welcome back, {artisanName}</h1>
                        <p>Here's an overview of your artisan business</p>
                    </div>



                    {/* Stats Grid */}
                    <div className="stats-grid fade-in">
                        {isLoading ? (
                            <>
                                <div className="stat-card loading-skeleton"></div>
                                <div className="stat-card loading-skeleton"></div>
                                <div className="stat-card loading-skeleton"></div>
                                <div className="stat-card loading-skeleton"></div>
                            </>
                        ) : (
                            <>
                                <div className="stat-card">
                                    <h3>{stats.products}</h3>
                                    <p>Active Products</p>
                                </div>
                                <div className="stat-card">
                                    <h3>{stats.orders}</h3>
                                    <p>New Orders</p>
                                </div>
                                <div className="stat-card">
                                    <h3>${stats.revenue.toLocaleString()}</h3>
                                    <p>Monthly Revenue</p>
                                </div>
                                <div className="stat-card">
                                    <h3>{stats.views.toLocaleString()}</h3>
                                    <p>Profile Views</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <h2 style={{ 
                        margin: '3rem 0 1rem',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--color-dark)',
                        textAlign: 'center'
                    }}>Quick Actions</h2>

                    <div className="actions-grid fade-in">
                        {isLoading ? (
                            <>
                                <div className="action-card loading-skeleton"></div>
                                <div className="action-card loading-skeleton"></div>
                                <div className="action-card loading-skeleton"></div>
                                <div className="action-card loading-skeleton"></div>
                            </>
                        ) : (
                            <>
                                <Link to="/sell-product" className="action-card" data-testid="add-product-action">
                                    <div className="icon">➕</div>
                                    <h3>Add New Product</h3>
                                    <p>List a new handcrafted item for sale</p>
                                    {stats.products === 0 && <span className="action-badge">Get Started!</span>}
                                </Link>

                                <Link to="/blogs/new" className="action-card" data-testid="write-blog-action">
                                    <div className="icon">✍️</div>
                                    <h3>Write Blog Post</h3>
                                    <p>Share your craft and stories</p>
                                </Link>

                                <Link 
                                    to="/portfolio/details" 
                                    className="action-card" 
                                    data-testid="add-portfolio-action"
                                    onClick={() => console.log('Add Portfolio link clicked')}
                                >
                                    <div className="icon">🎨</div>
                                    <h3>Add to Portfolio</h3>
                                    <p>Showcase your latest work</p>
                                </Link>

                                <Link 
                                    to="/orders" 
                                    className="action-card"
                                    data-testid="manage-orders-action"
                                    style={{ 
                                        position: 'relative',
                                        ...(stats.orders > 0 && { border: '2px solid var(--color-primary)' })
                                    }}
                                >
                                    <div className="icon">📦</div>
                                    <h3>Manage Orders</h3>
                                    <p>View and update order status</p>
                                    {stats.orders > 0 && (
                                        <span className="order-badge">{stats.orders} pending</span>
                                    )}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardHub;