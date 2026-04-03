import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated)       return <Navigate to="/login"  replace />;
  if (adminOnly && !isAdmin)  return <Navigate to="/"       replace />;

  return <Outlet />;
};

export default ProtectedRoute;