import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Import useNavigate
import "./Form.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    craft_type: '',
    location: '',
    role: 'artisan'
  });
  const navigate = useNavigate(); // ⬅️ Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('There was an error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a strong password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">I am a</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="artisan">Artisan</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
        
        {formData.role === 'artisan' && (
          <>
            <div className="form-group">
              <label htmlFor="craft_type">Type of Craft</label>
              <input
                id="craft_type"
                type="text"
                name="craft_type"
                value={formData.craft_type}
                onChange={handleChange}
                placeholder="e.g., Pottery, Weaving, Woodworking"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your city, country"
              />
            </div>
          </>
        )}

        {error && <div className="form-error">{error}</div>}
        
        <button type="submit" className={loading ? 'loading' : ''}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="form-switch">
          Already have an account? <a href="/login">Sign in here</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
