import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          console.error('Failed to fetch blog posts');
        }
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Helper to format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to resolve the image URL
  const resolveImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x250?text=Blog+Image';
    
    // Check if the path is local (/uploads/...) and prepend the server address
    if (path.startsWith('/uploads')) {
      return `http://localhost:5000${path}`;
    }
    return path; // Assume it's already a full URL if not starting with /uploads
  };

  if (loading) {
    return <h2 className="blog-title" style={{ textAlign: 'center', padding: '40px' }}>Loading Stories...</h2>;
  }

  return (
    <div className="blog-container">
        {/* Hero Section */}
        <div className="blog-hero-section">
            <div className="hero-content">
                <h1>Artisan Blogs</h1>
                <p className="subtitle">Stories, techniques, and the passion behind every craft.</p>
            </div>
            
            {/* Create Blog Button (Visible only to Artisans) */}
            {userRole === 'artisan' && (
                <Link to="/blogs/new" className="create-blog-btn btn-primary">
                    + Write a Blog
                </Link>
            )}
        </div>

        {/* Filters/Sort Bar */}
        <div className="filter-bar">
            <input type="text" placeholder="Search blogs..." className="search-input" />
            <select className="sort-dropdown">
                <option>Newest First</option>
                <option>Most Popular</option>
            </select>
        </div>

        {/* Blog Grid/List View */}
        <div className="blog-posts-grid">
            {blogs.length === 0 ? (
                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', marginTop: '50px' }}>No blog posts to display yet.</p>
            ) : (
                blogs.map(blog => (
                    <div key={blog.id} className="blog-post-card">
                        <div className="card-thumbnail-wrapper">
                            {/* FIX APPLIED HERE: Use resolveImageUrl helper */}
                            <img 
                                src={resolveImageUrl(blog.featured_image_url)} 
                                alt={blog.title} 
                                className="card-thumbnail"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Artistic+Story'; }}
                            />
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{blog.title}</h3>
                            <p className="card-date">Published: {formatDate(blog.created_at)}</p>
                            <p className="card-description">
                                {blog.content.substring(0, 100).replace(/<\/?[^>]+(>|$)/g, "")}...
                            </p>
                            <div className="card-footer">
                                <span className="artisan-info">By Artisan Bharathi</span>
                                <Link to={`/blogs/${blog.id}`} className="read-more-btn">Read More →</Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default BlogPage;