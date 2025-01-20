import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../services/AuthContext"; 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
