import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-brand" aria-label="Home">
        <img src={logo} alt="Artisan Platform" className="navbar-logo" />
      </Link>
      <div className="navbar-links">
        {/* Market Pages (Viewed by ALL) */}
        <Link to="/products">Products</Link>
        <Link to="/blogs">Blog</Link>
        <Link to="/portfolio">Portfolios</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        
        {token ? (
          <>
            {/* Conditional Access Links (Dashboard for Artisan, Cart for Buyer) */}
            {userRole === 'artisan' ? (
              <Link to="/dashboard" className="navbar-button">Dashboard</Link>
            ) : (
              <Link to="/cart" className="navbar-button">Cart</Link>
            )}
            
            <Link to="/orders" className="navbar-link">Orders</Link>
            

            <button onClick={handleLogout} className="navbar-button" style={{ backgroundColor: '#D9534F' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button" style={{ backgroundColor: '#007bff' }}>Login</Link>
            <Link to="/signup" className="navbar-button" style={{ backgroundColor: '#28a745' }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;