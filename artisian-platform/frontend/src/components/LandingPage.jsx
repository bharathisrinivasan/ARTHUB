import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
// Icons are placeholders; replace with actual image/SVG assets later
import { Hand, Globe, Zap, Heart, ShoppingBag, Truck } from 'lucide-react';

const categories = [
  { name: 'Kitchen Décor', icon: Hand, path: '/products?cat=kitchen' },
  { name: 'Pottery & Ceramics', icon: Zap, path: '/products?cat=pottery' },
  { name: 'Handmade Clothes', icon: ShoppingBag, path: '/products?cat=clothes' },
  { name: 'Jewelry & Accessories', icon: Heart, path: '/products?cat=jewelry' },
  { name: 'Woodwork & Crafts', icon: Truck, path: '/products?cat=woodwork' },
];

const features = [
  { title: 'Discover Unique Products', description: 'Browse thousands of authentic items, each handcrafted with a unique cultural story.', icon: Hand },
  { title: 'Support Artisans Directly', description: 'Your purchase goes directly to supporting the livelihood and craft education of the creator.', icon: Globe },
  { title: 'Share Your Craft Globally', description: 'Artisans can easily manage their shop, share their portfolio, and connect with global buyers.', icon: Zap },
  { title: 'Connect with Creators', description: 'Join a vibrant community of makers and buyers dedicated to sustainable and ethical consumption.', icon: Heart },
];

const sdgGoals = [
  { title: 'Decent Work & Economic Growth', sdg: 8, explanation: 'We ensure fair wages and sustainable employment, directly supporting artisan livelihoods.' },
  { title: 'Responsible Consumption & Production', sdg: 12, explanation: 'Promoting handmade goods reduces mass-production waste and encourages responsible sourcing.' },
  { title: 'No Poverty', sdg: 1, explanation: 'Empowering marginalized communities to earn sustainable income through their traditional skills.' },
];

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-tagline">Discover Authentic Handcrafted Treasures</h1>
          <p className="hero-subtext">Bridging artisans and buyers worldwide to preserve cultural heritage through craft.</p>
          <Link to="/products" className="hero-button">
            Explore Products
          </Link>
        </div>
      </section>

      {/* 2. Impact Counter & Teaser */}
      <section className="section-padding impact-teaser-section">
        <div className="impact-grid">
          <div className="impact-card">
            <h3>150+</h3>
            <p>Empowered Artisans</p>
          </div>
          <div className="impact-card">
            <h3>800+</h3>
            <p>Products Listed</p>
          </div>
          <div className="impact-card">
            <h3>60+</h3>
            <p>Cultural Stories Shared</p>
          </div>
        </div>
        
        <div className="featured-artisan-card">
          <h4>Featured Artisan of the Month</h4>
          <p>"My craft tells the story of my village. Thank you for making it global." - *Maria, Potter*</p>
          <Link to="/about" className="learn-more-link">Read More Stories →</Link>
        </div>
      </section>

      {/* 3. Categories Section (Animated Scroll) */}
      <section className="section-padding">
        <h2 className="section-title">Explore by Categories</h2>
        <div className="categories-scroll-wrapper">
          <div className="categories-scroll-content">
            {categories.map((cat, index) => (
              <Link to={cat.path} key={index} className="category-card">
                <cat.icon size={36} className="category-icon" />
                <p>{cat.name}</p>
              </Link>
            ))}
            {/* Duplicate content for infinite-like scroll effect */}
            {categories.map((cat, index) => (
              <Link to={cat.path} key={index + categories.length} className="category-card">
                <cat.icon size={36} className="category-icon" />
                <p>{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What You Can Do Section */}
      <section className="section-padding what-you-can-do-section">
        <h2 className="section-title">What You Can Do Here</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-block">
              <feature.icon size={32} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SDG (Sustainability Section) */}
      <section className="section-padding sdg-section">
        <h2 className="section-title">Contributing to Global Goals</h2>
        <div className="sdg-grid">
          {sdgGoals.map((goal, index) => (
            <div key={index} className="sdg-card">
              <div className="sdg-logo">SDG {goal.sdg}</div>
              <h3>{goal.title}</h3>
              <p>{goal.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="footer-container">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/blogs">Blog</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="social-icons">
          {/* Placeholder icons */}
          <span>FB</span>
          <span>IG</span>
          <span>TT</span>
        </div>
        <p className="copyright-text">
          © 2025 Artisan Platform. Empowering Creators Worldwide.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
