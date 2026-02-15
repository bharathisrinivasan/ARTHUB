import React from 'react';
import { Link } from 'react-router-dom';

const MyBlogsManagement = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>✍️ Blog Management</h2>
      <p style={{ color: 'var(--color-medium-text)', marginBottom: '20px' }}>
        View, edit, and delete your published stories.
      </p>
      <Link to="/blogs/new" style={{ 
        padding: '10px 20px', 
        backgroundColor: 'var(--color-accent-green)', 
        color: 'white', 
        borderRadius: '5px',
        textDecoration: 'none'
      }}>
        + Write New Blog Post
      </Link>
      <div style={{ marginTop: '30px' }}>
        {/* Future: Table/List of artisan's blogs goes here */}
        <p>No blogs found. Use the button above to start writing!</p>
      </div>
    </div>
  );
};

export default MyBlogsManagement;