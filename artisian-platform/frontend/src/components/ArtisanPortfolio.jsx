import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ArtisanPublicProfile.css'; // Reusing public profile styles for a clean look

const ArtisanPortfolio = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // NOTE: This fetch retrieves ALL portfolio items for the logged-in artisan.
    // It's a placeholder function, but useful for displaying the list.
    useEffect(() => {
        const fetchPrivatePortfolio = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // Assuming you have a protected route like /api/portfolio that returns ALL items for the logged-in user
                const response = await fetch('http://localhost:5000/api/portfolio', {
                    headers: { 'x-auth-token': token }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPortfolioItems(data);
                }
            } catch (error) {
                console.error("Error fetching private portfolio:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrivatePortfolio();
    }, [navigate, token]);

    if (loading) return <h2>Loading Portfolio Management...</h2>;

    return (
        <div className="artisan-profile-page">
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>My Portfolio Management</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
                <Link to="/portfolio/manage" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Manage Items
                </Link>
                <Link to="/add-portfolio" className="btn-secondary" style={{ textDecoration: 'none' }}>
                    + Add New Project
                </Link>
            </div>
            
            <div className="portfolio-gallery-section">
                <h3>Current Showcase Items ({portfolioItems.length})</h3>
                
                <div className="portfolio-grid-public">
                    {portfolioItems.length === 0 ? (
                        <p>You have no projects listed. Add your first item!</p>
                    ) : (
                        portfolioItems.map(item => (
                            <div key={item.id} className="project-card-public">
                                <img 
                                    src={item.media_url || 'https://via.placeholder.com/350x250?text=Project'} 
                                    alt={item.title}
                                    className="project-thumbnail"
                                />
                                <h4>{item.title}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <button className="btn-primary" onClick={() => alert(`Editing project ${item.id}`)}>Edit</button>
                                    <button className="btn-secondary" style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={() => alert(`Deleting project ${item.id}`)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtisanPortfolio;
