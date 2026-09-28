import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { accessToken } = useSelector((state) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}