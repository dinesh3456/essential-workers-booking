import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/dashboard",
}) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect to dashboard or specified route
  if (isAuthenticated) {
    // Get the intended destination from location state, or use default
    const from = (location.state as any)?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the children (login/register pages)
  return <>{children}</>;
};

export default PublicRoute;
