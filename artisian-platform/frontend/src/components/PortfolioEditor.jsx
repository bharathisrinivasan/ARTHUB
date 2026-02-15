import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, MapPin, Briefcase, Camera, Award, Link2, Plus, Eye, Save, XCircle, AlertCircle } from 'lucide-react';
import './PortfolioEditor.css';

const PortfolioEditor = () => {
    const navigate = useNavigate();
    // FIX: Initialize profile as an empty object to prevent .name errors
    const [profile, setProfile] = useState({}); 
    const [works, setWorks] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [socials, setSocials] = useState({ instagram: '', etsy: '', website: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const token = localStorage.getItem('token');

    // --- Fetch initial data (profile, works, achievements) ---
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // Fetch profile
                const profileRes = await fetch('http://localhost:5000/api/profile/me', { headers: { 'x-auth-token': token } });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData || {}); // Ensure profile is at least an empty object
                } else {
                    throw new Error('Failed to fetch profile');
                }

                // Fetch portfolio works
                const worksRes = await fetch('http://localhost:5000/api/portfolio', { headers: { 'x-auth-token': token } });
                if (worksRes.ok) {
                    const worksData = await worksRes.json();
                    setWorks(worksData || []); // Ensure works is at least an empty array
                } else {
                     throw new Error('Failed to fetch portfolio works');
                }

            } catch (error) {
                console.error("Failed to fetch portfolio data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate, token]);


    // --- Handlers ---
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e) => {
        setSocials({ ...socials, [e.target.name]: e.target.value });
    };

    const handleAddWork = () => {
        // Navigate to the guided form
        navigate('/add-portfolio');
    };
    
    const handleAddAchievement = () => {
        // Adds a new blank achievement to the list
        setAchievements([...achievements, { id: Date.now(), title: '', year: new Date().getFullYear(), description: '' }]);
    };
    
    const handlePublish = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // In a real app, this would save all changed data
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setIsSubmitting(false);
        alert('Portfolio Published Successfully! 🎉');
    };

    // --- RENDER FUNCTIONS ---

    // Renders a single work card
    const renderWorkCard = (work) => {
        // DEFENSIVE CHECK: Ensure media_url exists before calling .startsWith
        const imageUrl = work.media_url 
            ? (work.media_url.startsWith('http') ? work.media_url : `http://localhost:5000${work.media_url}`)
            : 'https://via.placeholder.com/100?text=Work';

        return (
            <div key={work.id} className="work-card">
                <img 
                    src={imageUrl}
                    alt={work.title} 
                    className="work-img-preview"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Work'; }}
                />
                <div className="work-details">
                    <h4 className="work-title">{work.title}</h4>
                    <p className="work-tags">{work.category} / {work.material_type}</p>
                </div>
                <div className="work-actions">
                    <button onClick={() => alert('Editing ' + work.title)}><Zap size={16} /></button>
                    <button onClick={() => setWorks(works.filter(w => w.id !== work.id))}><XCircle size={16} /></button>
                </div>
            </div>
        );
    };
    
    // Renders the live preview panel
    const renderLivePreview = () => (
        <div className="live-preview-panel">
            <h4>Live Public Preview</h4>
            <div className="preview-card">
                <div className="preview-profile-photo"></div>
                {/* DEFENSIVE CHECK: Ensure profile.name exists */}
                <h5>{profile?.name || 'Your Name'}</h5> 
                <p className="preview-tagline">{profile?.tagline || 'Your unique tagline goes here.'}</p>
                <div className="preview-socials">
                    {socials.instagram && <span>IG</span>}
                    {socials.website && <span>Web</span>}
                </div>
            </div>
        </div>
    );

    if (loading) return <h2 style={{textAlign: 'center', padding: '40px'}}>Loading Portfolio Editor...</h2>;
    
    if (error) return (
        <div className="portfolio-editor-page error-container">
            <AlertCircle size={48} color="#A65D4F" />
            <h2 className="section-title">Failed to Load Editor</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
        </div>
    );

    return (
        <div className="portfolio-editor-page">
            
            {/* 1. Header */}
            <div className="editor-header">
                <h1><Folder size={32} style={{marginRight: 10}} /> Create Your Portfolio</h1>
                <p className="subtitle">Add your details, upload your works, and let buyers discover your story.</p>
            </div>

            <form onSubmit={handlePublish} className="editor-form-grid">
                
                {/* 2. Profile Section (Left Column) */}
                <div className="section-container profile-section">
                    <h3 className="section-title">Profile & Branding</h3>
                    {renderLivePreview()}
                    
                    <div className="input-group">
                        <label><Camera size={18} /> Profile Image</label>
                        <input type="file" />
                    </div>

                    <div className="input-group">
                        <label>Name</label>
                        <input name="name" value={profile?.name || ''} onChange={handleProfileChange} placeholder="Enter your full name..." />
                    </div>
                    
                    <div className="input-group">
                        <label>Tagline</label>
                        <input name="tagline" value={profile?.tagline || ''} onChange={handleProfileChange} placeholder="E.g., Master of Clay, Textile Artist" />
                    </div>
                    
                    <div className="input-group">
                        <label><MapPin size={18} /> Location</label>
                        <input name="location" value={profile?.location || ''} onChange={handleProfileChange} placeholder="City, Country" />
                    </div>
                    
                    <div className="input-group">
                        <label><Briefcase size={18} /> Experience Level</label>
                        <input name="experience" value={profile?.experience || ''} onChange={handleProfileChange} placeholder="E.g., 5+ Years" />
                    </div>

                    <div className="input-group">
                        <label>About You</label>
                        <textarea name="about" value={profile?.about || ''} onChange={handleProfileChange} placeholder="Share your unique story and craft philosophy." rows="4" />
                    </div>
                </div>

                {/* Right Column */}
                <div className="section-container works-achievements-section">
                    
                    {/* 3. Works Section */}
                    <h3 className="section-title">Add Your Creations</h3>
                    <div className="works-list">
                        {works.length > 0 ? works.map(renderWorkCard) : <p className="placeholder-text">No works added yet.</p>}
                    </div>
                    <button type="button" onClick={handleAddWork} className="btn-secondary add-work-btn"><Plus size={18} /> Add New Project</button>
                    
                    {/* 4. Achievements Section */}
                    <h3 className="section-title" style={{marginTop: '30px'}}>Show Your Achievements</h3>
                    <div className="achievements-list">
                        {achievements.length > 0 ? achievements.map((ach, index) => (
                            <div key={ach.id || index} className="achievement-item">
                                <input placeholder="Award Title" defaultValue={ach.title} />
                                <input placeholder="Year" defaultValue={ach.year} style={{ width: '80px' }} />
                                <button type="button" onClick={() => setAchievements(achievements.filter(a => a.id !== ach.id))}><XCircle size={16} /></button>
                            </div>
                        )) : <p className="placeholder-text">No awards added.</p>}
                    </div>
                    <button type="button" onClick={handleAddAchievement} className="btn-secondary add-achievement-btn"><Award size={18} /> Add Achievement</button>


                    {/* 5. Social Media Section */}
                    <h3 className="section-title" style={{marginTop: '30px'}}>Social Media Links</h3>
                    <div className="social-links-grid">
                        <input name="instagram" value={socials.instagram} onChange={handleSocialChange} placeholder="Instagram URL" />
                        <input name="website" value={socials.website} onChange={handleSocialChange} placeholder="Personal Website URL" />
                    </div>

                </div>
                
                {/* 6. Review & Submit */}
                <div className="submit-section">
                    <button type="button" className="btn-secondary"><Eye size={18} /> Preview Portfolio</button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : <><Save size={18} /> Publish Now</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PortfolioEditor;