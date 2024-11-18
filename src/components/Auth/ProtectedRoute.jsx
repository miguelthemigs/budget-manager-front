import React from "react";
import { Navigate } from "react-router-dom";
import TokenManager from "../../services/TokenManager";

const ProtectedRoute = ({ element: Component, roles }) => {
  const claims = TokenManager.getClaims();

  // Check if the user is logged in (claims exist)
  if (!claims) {
    return <Navigate to="/login" />;
  }

  // Check if roles are provided and the user's role matches
  if (roles && !roles.includes(claims.role)) {
    return <Navigate to="/" />;
  }

  // Render the component if user is logged in and authorized
  return <Component />;
};

export default ProtectedRoute;