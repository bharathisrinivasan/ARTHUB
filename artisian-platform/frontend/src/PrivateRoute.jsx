import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Component that checks if the user is logged in AND has the right role (if specified)
const PrivateRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  // Debug logs
  console.log('PrivateRoute Check:', {
    path: location.pathname,
    requiredRole,
    userRole,
    hasToken: !!token
  });

  // 1. Check if user is logged in
  if (!token) {
    console.log('Access denied: No token found');
    // If no token, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check for required role
  if (requiredRole && userRole !== requiredRole) {
    console.log('Access denied: Role mismatch', { requiredRole, userRole });
    // If the user doesn't have the required role, redirect to a safe default page (like products)
    alert(`Access Denied. You must be a ${requiredRole} to view this page.`);
    return <Navigate to="/products" replace />;
  }

  // If logged in and role check passes (or no role check needed), allow access
  return <Outlet />;
};

export default PrivateRoute;
