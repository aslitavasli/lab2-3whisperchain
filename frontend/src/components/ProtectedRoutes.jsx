import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider"; // Custom hook for auth context

// type of route used to access dashboard based on user status
// (user, moderator, admin)
// if token doesn't clear, redirect to login page

export const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
