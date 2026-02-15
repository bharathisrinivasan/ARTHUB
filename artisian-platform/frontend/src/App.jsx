import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import './App.css';
import PrivateRoute from './PrivateRoute';
import SellProduct from './components/SellProduct';
import ProductListings from './components/ProductListings';
import ProductDetail from './components/ProductDetail';
import EditProduct from './components/EditProduct';
import CartPage from './components/CartPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ArtisanPortfolio from './components/ArtisanPortfolio';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'; 
import BlogPage from './components/BlogPage';
import BlogForm from './components/BlogForm'; 
import MyProducts from './components/MyProducts'; 
import DashboardHub from './components/DashboardHub'; 
import OrdersPage from './components/OrdersPage'; 
import BuyerProfile from './components/BuyerProfile';
import ArtisanPublicProfile from './components/ArtisanPublicProfile'; 
import BlogDetail from './components/BlogDetail'; 
import ProfileSettings from './components/ProfileSettings'; 
import MyBlogsManagement from './components/MyBlogsManagement'; 
import PortfolioEditor from './components/PortfolioEditor';
import PortfolioFormGuided from './components/PortfolioFormGuided';
import PortfolioDetails from './components/PortfolioDetails';
import PortfolioDetail from './components/PortfolioDetail';
function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ======================================= */}
        {/* PUBLIC/GENERAL ROUTES (Accessible by All) */}
        {/* ======================================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListings />} />
        <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:blogId" element={<BlogDetail />} /> 
        <Route path="/artisan/:artisanId" element={<ArtisanPublicProfile />} />
        
        {/* ======================================= */}
        {/* GENERAL PROTECTED ROUTES (Any Logged-in User) */}
        {/* ======================================= */}
        <Route element={<PrivateRoute />}>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<BuyerProfile />} />
        </Route>
       
        {/* ======================================= */}
        {/* ARTISAN MANAGEMENT ONLY (Role Restricted) */}
        {/* ======================================= */}
        <Route element={<PrivateRoute requiredRole="artisan" />}> 
          <Route path="/dashboard" element={<DashboardHub />} /> 
          <Route path="/products/my" element={<MyProducts />} /> 
          <Route path="/sell-product" element={<SellProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/blogs/new" element={<BlogForm />} />
          <Route path="/add-portfolio" element={<PortfolioFormGuided />} />
          
          {/* --- This is the corrected route --- */}
          <Route path="/portfolio/manage" element={<PortfolioEditor />} />
          <Route path="/portfolio/details" element={<PortfolioDetails />} />
          <Route path="/blogs/manage" element={<MyBlogsManagement />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path="/portfolio/detail" element={<PortfolioDetail />} />
          <Route path="/portfolio" element={<Navigate to="/portfolio/manage" replace />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;