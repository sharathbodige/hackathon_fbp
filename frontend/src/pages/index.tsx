import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import "./index.css";
const Index: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Redirect to dashboard if authenticated, otherwise to login
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
