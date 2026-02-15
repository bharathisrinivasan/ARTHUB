import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioManagement = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>🖼️ Portfolio Management</h2>
      <p style={{ color: 'var(--color-medium-text)', marginBottom: '20px' }}>
        Manage the showcase gallery for your public Artisan profile.
      </p>
      <Link to="/portfolio/details" style={{ 
        padding: '10px 20px', 
        backgroundColor: 'var(--color-accent-terracotta)', 
        color: 'white', 
        borderRadius: '5px',
        textDecoration: 'none'
      }}>
        + Add New Portfolio Item
      </Link>
      <div style={{ marginTop: '30px' }}>
        {/* Future: Gallery view with edit/delete buttons goes here */}
        <p>No portfolio items ready to manage.</p>
      </div>
    </div>
  );
};

export default PortfolioManagement;