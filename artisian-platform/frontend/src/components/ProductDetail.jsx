import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ cart, setCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to safely resolve the image URL
  const resolveImg = (path) => {
    // If path is null, empty, or undefined, return placeholder
    if (!path || path.trim() === '') {
      return 'https://via.placeholder.com/600x600?text=Image+Not+Available';
    }
    // If path is already a full URL, use it
    if (path.startsWith('http')) {
      return path;
    }
    // Otherwise, prepend the backend server address
    return `http://localhost:5000${path}`;
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '—';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    } catch {
      return `$${price}`;
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!productResponse.ok) {
          throw new Error('Product not found');
        }
        const productData = await productResponse.json();
        setProduct(productData);

        // If product has an artisan, fetch their public profile
        if (productData.artisan_id) {
          const artisanResponse = await fetch(`http://localhost:5000/api/artisan/profile/${productData.artisan_id}`);
          if (artisanResponse.ok) {
            const artisanData = await artisanResponse.json();
            setArtisan(artisanData);
          }
        }
        // Removed the broken fetch to /api/portfolio
      } catch (error) {
        console.error("Failed to fetch details:", error);
        navigate('/products'); // Redirect if product fails to load
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleAddToCart = (buyNow = false) => {
    if (!product) return; // Safety check
    
    const isAlreadyInCart = cart.find(item => item.id === product.id);
    const itemToAdd = { ...product, quantity: 1, artisan_id: product.artisan_id };

    if (isAlreadyInCart) {
      if (!buyNow) { // Only show alert if not 'Buy Now'
        alert('This product is already in your cart.');
      }
    } else {
      setCart([...cart, itemToAdd]);
      if (!buyNow) { // Only show alert if not 'Buy Now'
        alert('Product added to cart!');
      }
    }
    
    if (buyNow) {
        navigate('/cart'); 
    }
  };

  if (loading) {
    return <h2 className="detail-title" style={{textAlign: 'center', padding: '40px'}}>Loading product details...</h2>;
  }

  if (!product) {
    return <h2 className="detail-title" style={{textAlign: 'center', padding: '40px'}}>Product not found.</h2>;
  }

  return (
    <div className="product-detail-container">
      
      {/* Left Column: Image Gallery */}
      <div className="image-gallery">
        <div className="main-image-wrapper">
          <img
            src={resolveImg(product.image_url)} 
            alt={product.title}
            className="main-product-image"
          />
        </div>
      </div>

      {/* Right Column: Product Information and Actions */}

    <div className="info-action-panel">
    <h1 className="detail-title-text">{product.title}</h1>

    {/* Pricing and rating */}
    <div className="price-and-rating">
      <p className="detail-price-text">{formatPrice(product.price)}</p>
      <div className="reviews-stars" aria-hidden>★★★★★</div>
    </div>

    {/* Artisan Profile Card - This is the only artisan block now */}
    {artisan && (
      <div className="artisan-profile-card">
        <div className="artisan-info">
          <div className="profile-photo-placeholder" aria-hidden></div>
          <div className="artisan-details">
            <p className="artisan-name">{artisan.name}</p>
            <p className="artisan-craft">{artisan.craft_type} · {artisan.location}</p>
            {artisan.bio && <p className="artisan-bio">{artisan.bio}</p>}
          </div>
        </div>
        <div className="artisan-actions">
          <button className="message-button" aria-label="Message seller">Message Seller</button>
          {/* FIX: Link to the correct public artisan profile route */}
          <Link to={`/artisan/${product.artisan_id}`} className="view-portfolio-button" aria-label="View artisan portfolio">
            View Portfolio
          </Link>
        </div>
      </div>
    )}

    <div className="options-group">
      <select className="option-select" aria-label="Select size"><option>Select Size</option></select>
      <select className="option-select" aria-label="Select color"><option>Select Color</option></select>
    </div>

    {/* Action Buttons */}
    <div className="action-buttons-group">
      <button className="add-to-cart-button primary-btn" onClick={() => handleAddToCart(false)} aria-label="Add to cart">Add to cart</button>
      <button className="buy-now-button secondary-btn" onClick={() => handleAddToCart(true)} aria-label="Buy now">Buy Now</button>
    </div>

        {/* Detailed Description */}
        <div className="product-description-group">
            <h3>Description</h3>
            <p>{product.description}</p>
            <h3>Cultural Story</h3>
            <p>{product.cultural_story}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Customizable:</strong> {product.is_customizable ? 'Yes' : 'No'}</p>
            <button className="request-custom-button">Request Customization</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;