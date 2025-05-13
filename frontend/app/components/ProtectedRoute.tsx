import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
}
