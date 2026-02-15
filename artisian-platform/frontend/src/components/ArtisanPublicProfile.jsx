import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArtisanPublicProfile.css';

const ArtisanPublicProfile = () => {
    const { artisanId } = useParams();
    const [profile, setProfile] = useState(null);
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);

    // Placeholder Testimonials for UI purposes
    const testimonials = [
        { id: 1, quote: "The vase is stunning. Maria's commitment to traditional technique really shows!", author: "Sarah L." },
        { id: 2, quote: "Excellent communication! The custom textile art exceeded all expectations.", author: "David K." },
        { id: 3, quote: "Fast shipping and the quality of the ceramic mug is top-notch.", author: "Aisha R." },
    ];

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                // 1. Fetch Artisan Profile
                const profileResponse = await fetch(`http://localhost:5000/api/artisan/profile/${artisanId}`);
                const profileData = profileResponse.ok ? await profileResponse.json() : null;
                setProfile(profileData);

                // 2. Fetch Portfolio Items
                const portfolioResponse = await fetch(`http://localhost:5000/api/public/portfolio/${artisanId}`);
                const portfolioData = portfolioResponse.ok ? await portfolioResponse.json() : [];
                setPortfolio(portfolioData);

            } catch (error) {
                console.error("Public Profile fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicData();
    }, [artisanId]);

    if (loading) return <h2 style={{ textAlign: 'center', padding: '40px' }}>Loading Artisan Profile...</h2>;
    if (!profile) return <h2 style={{ textAlign: 'center', padding: '40px' }}>Artisan Not Found.</h2>;

    return (
        <div className="artisan-profile-page">
            
            {/* Header Section (Banner/Bio) */}
            <div className="profile-header-card">
                <div className="profile-banner-image"></div>
                <div className="profile-info-content">
                    <div className="profile-photo"></div>
                    <div className="profile-details">
                        <h2>{profile.name}</h2>
                        <p className="craft-type">{profile.craft_type || 'Artist'} | {profile.location}</p>
                        <p className="bio">{profile.bio}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-primary message-btn">Message Me</button>
                    <Link to="/products" className="btn-secondary view-products-btn">View Products for Sale</Link>
                    <button className="btn-secondary follow-btn">Follow (12k)</button>
                </div>
            </div>

            {/* Portfolio Gallery Section */}
            <div className="gallery-section">
                <h3>My Showcase Gallery ({portfolio.length})</h3>
                <p className="section-description">A collection of my unique and favorite handcrafted projects.</p>
                
                <div className="portfolio-filters">
                    <button className="filter-btn active">All Projects</button>
                    <button className="filter-btn">Pottery</button>
                    <button className="filter-btn">Textiles</button>
                </div>

                <div className="portfolio-grid-public">
                    {portfolio.length === 0 ? (
                        <p style={{ width: '100%' }}>This artisan has not added any showcase projects yet.</p>
                    ) : (
                        portfolio.map(item => (
                            <div key={item.id} className="project-card-public">
                                <div className="project-thumbnail-wrapper">
                                    <img 
                                        src={item.media_url.startsWith('http') ? item.media_url : `http://localhost:5000${item.media_url}`} 
                                        alt={item.title}
                                        className="project-thumbnail"
                                    />
                                </div>
                                <div className="project-details">
                                    <h4>{item.title}</h4>
                                    <p className="project-tags">#Ceramics #Technique</p>
                                    <p className="project-desc">{item.description.substring(0, 50)}...</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="contact-testimonials-section">
                <h3 className="section-title">What Buyers Say</h3>
                <div className="testimonials-grid">
                    {testimonials.map(t => (
                        <div key={t.id} className="testimonial-card">
                            <p className="quote">"{t.quote}"</p>
                            <p className="author">— {t.author}</p>
                        </div>
                    ))}
                </div>

                {/* Collaboration Section */}
                <h3 className="section-title" style={{ marginTop: '50px' }}>Contact & Collaboration</h3>
                <div className="collaboration-box">
                    <button className="btn-primary custom-order-btn">Book a Custom Order</button>
                </div>
            </div>
        </div>
    );
};

export default ArtisanPublicProfile;