import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductListings.css';

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products (assuming your backend SELECT * FROM Products includes artisan_id)
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          let data = await response.json();

          // Fetch artisan names for each product
          const productsWithArtisan = await Promise.all(data.map(async (product) => {
            const artisanResponse = await fetch(`http://localhost:5000/api/artisan/profile/${product.artisan_id}`);
            const artisanData = artisanResponse.ok ? await artisanResponse.json() : { name: 'Unknown Artisan' };
            return { ...product, artisan_name: artisanData.name };
          }));

          setProducts(productsWithArtisan);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Network error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <h2 className="products-title">Loading the Marketplace...</h2>;
  }

  return (
    <div className="products-listings-container">
      <h2 className="products-title">Autumn Hosting and Decor</h2>
      <p className="products-subtitle">Everything you need for autumn entertaining.</p>
      
      {/* Filters (Placeholder) */}
      <div className="filter-bar">
        <button className="filter-button">Price ($)</button>
        <button className="filter-button">On Sale</button>
        <button className="filter-button">Artisan's Pick</button>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-link" aria-label={`View ${product.title}`}>
            <div className="product-card" role="article">

              {/* Product Image */}
              <div className="product-image-wrapper">
                {product.image_url && (
                  <img
                    src={product.image_url.startsWith('http') 
                      ? product.image_url 
                      : `http://localhost:5000${product.image_url}`
                    } 
                    alt={product.title}
                    className="product-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-info-top">
                  <p className="product-title-text">{product.title}</p>
                  <p className="product-artisan-name">by {product.artisan_name}</p>
                </div>
                <div className="product-info-bottom">
                  <p className="product-price-text">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductListings;
