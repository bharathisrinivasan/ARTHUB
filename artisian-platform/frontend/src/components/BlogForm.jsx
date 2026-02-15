import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogForm.css'; 

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    shortSummary: '',
    category: 'Pottery',
    featured_image_url: '', 
    content: '',
  });
  const [imageFile, setImageFile] = useState(null); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) { // CRITICAL: Check token existence before submitting
        alert("Your session has expired. Please log in again.");
        navigate('/login');
        return;
    }

    if (!formData.content || formData.content.length < 10) {
        alert("Blog content is too short or empty.");
        return;
    }

    try {
      let imagePath = '';
      
      // 1. UPLOAD IMAGE FILE (if selected)
      if (imageFile) {
          const fileData = new FormData();
          fileData.append('image', imageFile); 
          
          const uploadResponse = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: { 'x-auth-token': token, }, 
            body: fileData, 
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            // If token failed now, redirect to login
            if (uploadResponse.status === 401) {
                alert("Session expired. Please log in again.");
                navigate('/login');
                return;
            }
            throw new Error(errorData.message || 'Image Upload Failed');
          }
          const uploadData = await uploadResponse.json();
          imagePath = uploadData.filePath;
      }

      // 2. SAVE BLOG POST DETAILS
      const finalBlogData = { 
        ...formData, 
        featured_image_url: imagePath, 
      };

      const blogResponse = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(finalBlogData),
      });

      if (blogResponse.ok) {
        alert('Blog post published successfully!');
        // Clear the form and navigate
        setFormData({ title: '', shortSummary: '', category: 'Pottery', featured_image_url: '', content: '' });
        setImageFile(null);
        navigate('/blogs'); 
      } else {
        const errorData = await blogResponse.json();
        alert(errorData.message || 'Failed to publish blog post');
      }
    } catch (error) {
      console.error('Error in blog submission:', error);
      alert(`Error in submission: ${error.message}`);
    }
  };

  return (
    <div className="blog-form-container">
      <h2>📝 Write a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        
        {/* A. Basic Details Section */}
        <div className="form-section-card">
            <h3>Basic Details</h3>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" required />
            <textarea name="shortSummary" value={formData.shortSummary} onChange={handleChange} placeholder="Short Summary (Max 200 Chars)" maxLength="200" required></textarea>
            
            <div className="input-group-row">
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="Pottery">Pottery</option>
                    <option value="Textile">Textile Art</option>
                    <option value="Woodwork">Woodwork</option>
                    <option value="Jewelry">Jewelry</option>
                </select>
                <input type="file" onChange={handleFileChange} required /> {/* File input for image */}
            </div>
        </div>

        {/* B. Blog Content Editor */}
        <div className="form-section-card">
            <h3>Blog Content</h3>
            <textarea 
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                placeholder="Start writing your story here..."
                required
                style={{ height: '300px', marginBottom: '10px', width: '100%', padding: '10px' }}
            ></textarea>
        </div>

        {/* C. SEO & Visibility (Simplified) */}
        <div className="form-section-card">
            <h3>Visibility</h3>
            <input type="text" placeholder="Tags (e.g., #sustainable, #craftlife)" />
            <div className="visibility-options">
                <label><input type="radio" name="visibility" defaultChecked /> Public</label>
                <label><input type="radio" name="visibility" /> Save as Draft</label>
            </div>
        </div>

        {/* D. Action Buttons */}
        <div className="form-actions">
            <button type="submit" className="btn-primary publish-btn">
                Publish Blog
            </button>
            <button type="button" className="btn-secondary preview-btn">Preview</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;