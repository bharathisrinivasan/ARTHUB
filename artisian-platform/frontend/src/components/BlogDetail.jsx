import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './BlogDetail.css';

const BlogDetail = () => {
  const { blogId } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to resolve the image URL
  const resolveImageUrl = (path) => {
    if (!path || path.trim() === '') return 'https://via.placeholder.com/900x400?text=Blog+Banner';
    
    // Check if the path is local (/uploads/...) and prepend the server address
    if (path.startsWith('/uploads')) {
      return `http://localhost:5000${path}`;
    }
    return path; 
  };


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // NOTE: This assumes a public route: app.get('/api/blogs/:id', ...) in backend
        const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else {
          alert("Blog post not found.");
          navigate('/blogs'); 
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Failed to load blog post due to a network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId, navigate]);

  if (loading) return <h2>Loading Blog Post...</h2>;
  if (!blog) return <h2>Blog Post Not Found.</h2>;

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return 'Invalid Date';
  }
  };

  return (
    <div className="blog-detail-container">
        <Link to="/blogs" className="back-link">← Back to All Blogs</Link>

        {/* Header/Title Section */}
        <div className="blog-header-section">
            <h1 className="blog-title-detail">{blog.title}</h1>
            <div className="blog-meta-detail">
                <span className="author-name-detail">By Artisan Bharathi</span>
                <span className="publish-date-detail">Published on {formatDate(blog.created_at)}</span>
            </div>
        </div>
        
        {/* Featured Image */}
        <div className="featured-image-wrapper-detail">
            {/* FIX APPLIED: Use the robust resolveImageUrl helper */}
            <img 
                src={resolveImageUrl(blog.featured_image_url)} 
                alt={blog.title} 
                className="featured-image-detail"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/900x400?text=No+Image+Available'; }}
            />
        </div>

        {/* Content Area */}
        <div className="blog-content">
            <p>{blog.content}</p>
            
            {/* Placeholder for embedded media or quotes */}
            <div className="highlight-box">
                "Art is not about perfection but connection."
            </div>
        </div>

        {/* Bottom Section */}
        <div className="blog-bottom-section">
            <div className="tags-section">
                <span>Tags:</span> #Handmade #CraftLife
            </div>

            <div className="engagement-bar">
                <button className="engage-btn">❤️ Like</button>
                <button className="engage-btn">💬 Comment</button>
                <button className="engage-btn">🔗 Share</button>
            </div>
            
            {/* Comment Section Placeholder */}
            <div className="comments-section">
                <h4>Comments (0)</h4>
                <textarea placeholder="Write a comment..." rows="3"></textarea>
                <button className="btn-primary">Post Comment</button>
            </div>
        </div>
    </div>
  );
};

export default BlogDetail;