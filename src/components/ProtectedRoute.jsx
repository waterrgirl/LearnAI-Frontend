import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const location = useLocation();

  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;