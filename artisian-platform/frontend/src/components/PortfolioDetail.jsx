import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Mail, Phone, Award, ExternalLink,
    Instagram, Facebook, Youtube, Globe, Heart,
    MessageCircle, Share2, ArrowLeft
} from 'lucide-react';
import './PortfolioDetail.css';

const PortfolioDetail = () => {
    const { artisanId } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('works');

    useEffect(() => {
        fetchPortfolio();
    }, [artisanId]);

    const fetchPortfolio = async () => {
        try {
            const response = await fetch(`/api/portfolio/${artisanId}`);
            if (!response.ok) {
                throw new Error('Portfolio not found');
            }
            const data = await response.json();
            setPortfolio(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <Link to="/explore" className="btn-back">Back to Explore</Link>
            </div>
        );
    }

    if (!portfolio) {
        return null;
    }

    return (
        <div className="portfolio-detail">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="cover-image">
                    {portfolio.cover_image ? (
                        <img src={portfolio.cover_image} alt="Cover" />
                    ) : (
                        <div className="cover-placeholder"></div>
                    )}
                    <div className="gradient-overlay"></div>
                </div>

                <div className="hero-content">
                    <div className="profile-info">
                        <div className="profile-image">
                            {portfolio.profile_image ? (
                                <img src={portfolio.profile_image} alt={portfolio.name} />
                            ) : (
                                <div className="avatar-placeholder">{portfolio.name[0]}</div>
                            )}
                        </div>
                        <h1>{portfolio.name}</h1>
                        <p className="tagline">{portfolio.tagline}</p>
                        {portfolio.location && (
                            <p className="location">
                                <MapPin className="icon" />
                                {portfolio.location}
                            </p>
                        )}
                    </div>

                    <div className="action-buttons">
                        <button className="btn-primary">
                            <Heart className="icon" />
                            Follow
                        </button>
                        <button className="btn-secondary">
                            <MessageCircle className="icon" />
                            Message
                        </button>
                        <button className="btn-secondary">
                            <Share2 className="icon" />
                            Share
                        </button>
                    </div>
                </div>

                {/* Artisan Stats */}
                <div className="artisan-stats">
                    <div className="stat">
                        <span className="stat-value">{portfolio.works?.length || 0}</span>
                        <span className="stat-label">Works</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{portfolio.achievements?.length || 0}</span>
                        <span className="stat-label">Achievements</span>
                    </div>
                    {portfolio.experience && (
                        <div className="stat">
                            <span className="stat-value">{portfolio.experience}</span>
                            <span className="stat-label">Experience</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Navigation Tabs */}
            <nav className="portfolio-nav">
                <button
                    className={`nav-tab ${activeTab === 'works' ? 'active' : ''}`}
                    onClick={() => setActiveTab('works')}
                >
                    Works
                </button>
                <button
                    className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                >
                    About
                </button>
                <button
                    className={`nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                >
                    Achievements
                </button>
            </nav>

            {/* Main Content */}
            <div className="portfolio-content">
                {activeTab === 'works' && (
                    <div className="works-grid">
                        {portfolio.works?.map(work => (
                            <div key={work.work_id} className="work-card">
                                <div className="work-image">
                                    {work.image_urls?.[0] && (
                                        <img src={work.image_urls[0]} alt={work.title} />
                                    )}
                                    <div className="work-overlay">
                                        <h3>{work.title}</h3>
                                        <p>{work.category}</p>
                                        {work.price_range && (
                                            <p className="price-range">{work.price_range}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="about-section">
                        <div className="about-content">
                            <h2>About {portfolio.name}</h2>
                            <p>{portfolio.about}</p>

                            <div className="specializations">
                                <h3>Specializations</h3>
                                <div className="tags">
                                    {portfolio.specialization?.split(',').map(spec => (
                                        <span key={spec.trim()} className="tag">
                                            {spec.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {portfolio.language && (
                                <div className="languages">
                                    <h3>Languages</h3>
                                    <div className="tags">
                                        {portfolio.language.split(',').map(lang => (
                                            <span key={lang.trim()} className="tag">
                                                {lang.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="contact-info">
                                <h3>Contact Information</h3>
                                {portfolio.email && (
                                    <p>
                                        <Mail className="icon" />
                                        {portfolio.email}
                                    </p>
                                )}
                                {portfolio.phone && (
                                    <p>
                                        <Phone className="icon" />
                                        {portfolio.phone}
                                    </p>
                                )}
                            </div>

                            {/* Social Links */}
                            {(portfolio.instagram || portfolio.facebook || portfolio.youtube || portfolio.website) && (
                                <div className="social-links">
                                    <h3>Connect with {portfolio.name}</h3>
                                    <div className="social-icons">
                                        {portfolio.instagram && (
                                            <a href={portfolio.instagram} target="_blank" rel="noopener noreferrer">
                                                <Instagram className="icon" />
                                            </a>
                                        )}
                                        {portfolio.facebook && (
                                            <a href={portfolio.facebook} target="_blank" rel="noopener noreferrer">
                                                <Facebook className="icon" />
                                            </a>
                                        )}
                                        {portfolio.youtube && (
                                            <a href={portfolio.youtube} target="_blank" rel="noopener noreferrer">
                                                <Youtube className="icon" />
                                            </a>
                                        )}
                                        {portfolio.website && (
                                            <a href={portfolio.website} target="_blank" rel="noopener noreferrer">
                                                <Globe className="icon" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="achievements-section">
                        <div className="achievements-timeline">
                            {portfolio.achievements?.map(achievement => (
                                <div key={achievement.achievement_id} className="achievement-card">
                                    <div className="achievement-year">{achievement.year}</div>
                                    <div className="achievement-content">
                                        <h3>{achievement.title}</h3>
                                        <p>{achievement.description}</p>
                                        {achievement.award_image && (
                                            <img src={achievement.award_image} alt={achievement.title} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="portfolio-footer">
                <Link to="/explore" className="btn-back">
                    <ArrowLeft className="icon" />
                    Back to Explore
                </Link>
                <p className="copyright">© {new Date().getFullYear()} ArtisanHub</p>
            </footer>
        </div>
    );
};

export default PortfolioDetail;