import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Form.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    cultural_story: '',
    is_customizable: false,
    stock_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error('Failed to fetch product');
          navigate('/dashboard'); // Go back to dashboard if product not found
        }
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/dashboard'); // Go back to dashboard after updating
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product due to a server error.');
    }
  };

  if (loading) {
    return <h2>Loading product data...</h2>;
  }

  return (
    <div className="form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Product Title" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
        <textarea name="cultural_story" value={formData.cultural_story} onChange={handleChange} placeholder="Cultural Story"></textarea>
        <label>
          <input type="checkbox" name="is_customizable" checked={formData.is_customizable} onChange={handleChange} /> Customizable?
        </label>
        <input type="number" name="stock_count" value={formData.stock_count} onChange={handleChange} placeholder="Stock Count" />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;