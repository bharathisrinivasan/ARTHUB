import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const SellProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Pottery',
    cultural_story: '',
    is_customizable: false,
    stock_count: 0
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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
    
    // Prepare FormData for the combined upload/submit
    const data = new FormData();
    if (image) {
        data.append('image', image);
    }
    
    try {
      let imagePath = '';
      
      // 1. Upload Image (Only if an image is selected)
      if (image) {
          const uploadResponse = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: {
              'x-auth-token': token,
            },
            body: data, 
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            alert(errorData.message);
            return;
          }
          const uploadData = await uploadResponse.json();
          imagePath = uploadData.filePath;
      }
      
      // 2. Save Product Details with Image Path
      const productData = { ...formData, image_url: imagePath };
      const productResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(productData),
      });

      if (productResponse.ok) {
        alert('Product added successfully!');
        // Clear the form
        setFormData({ title: '', description: '', price: 0, category: 'Pottery', cultural_story: '', is_customizable: false, stock_count: 0 });
        setImage(null);
        navigate('/products/my'); // Go to the product listing page
      } else {
        const errorData = await productResponse.json();
        alert(errorData.message);
      }

    } catch (error) {
      console.error('There was an error:', error);
      alert('Failed to add product due to a server error.');
    }
  };

  return (
    <div className="form-container">
      <h2>Sell Your Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Product Name" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed Description" required></textarea>
        
        <div style={{ display: 'flex', gap: '20px' }}>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price ($)" required style={{ flex: 1 }} />
            <select name="category" value={formData.category} onChange={handleChange} required style={{ flex: 1 }}>
                <option value="Pottery">Pottery</option>
                <option value="Decor">Home Decor</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Fabric Art">Fabric Art</option>
            </select>
        </div>

        <textarea name="cultural_story" value={formData.cultural_story} onChange={handleChange} placeholder="Cultural Story / Heritage" required></textarea>
        
        <input type="file" onChange={handleImageChange} required />
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <input type="number" name="stock_count" value={formData.stock_count} onChange={handleChange} placeholder="Stock Count" required style={{ flex: 1 }} />
            <label style={{ flex: 1, textAlign: 'left' }}>
                <input type="checkbox" name="is_customizable" checked={formData.is_customizable} onChange={handleChange} /> Customizable Option
            </label>
        </div>

        <button type="submit" className="btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default SellProduct;
