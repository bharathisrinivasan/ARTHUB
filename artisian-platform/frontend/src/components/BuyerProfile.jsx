import React, { useState, useEffect } from 'react';
import './BuyerProfile.css';

const BuyerProfile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    
    // NOTE: This component assumes you have a protected route like /api/user/profile 
    // to fetch the current user's details. For now, it will use placeholder data.

    useEffect(() => {
        // Placeholder fetch logic
        if (token) {
            setProfile({
                name: "Buyer Jane Doe",
                email: "jane.doe@example.com",
                role: "buyer",
                location: "Coimbatore, IN",
                member_since: "01/01/2024"
            });
        }
        setLoading(false);
    }, [token]);

    if (!token) return <div className="profile-container error-message">Please log in to view your profile.</div>;
    if (loading) return <h2 className="profile-title">Loading Profile...</h2>;

    return (
        <div className="profile-container">
            <h2 className="profile-title">My Account</h2>
            <div className="profile-card">
                <div className="avatar-placeholder"></div>
                <div className="profile-details">
                    <h3>{profile.name}</h3>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Location:</strong> {profile.location}</p>
                    <p><strong>Member Since:</strong> {profile.member_since}</p>
                </div>
            </div>
            <div className="section-links">
                <Link to="/orders" className="section-link">View Order History</Link>
                <Link to="/cart" className="section-link">Review Shopping Cart</Link>
                <button className="section-link settings-button">Update Settings</button>
            </div>
        </div>
    );
};

export default BuyerProfile;