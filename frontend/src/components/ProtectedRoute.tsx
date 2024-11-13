import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {

  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return isLoggedIn ? <Outlet /> : <Navigate to={'/auth'}/>;
};

export default ProtectedRoute;
