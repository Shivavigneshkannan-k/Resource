import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../services/AuthContext";

const ProtectedRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // Show a loading state while auth is being verified

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
