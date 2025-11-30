import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const UnProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/auth/isLoggedIn`, { withCredentials: true }) // must match backend route exactly
      .then((res) => {
        console.log(res.success);
        setIsAuthenticated(res.data.success);
      })
      .catch((err) => {
        console.error("Auth check failed:", err.message); // helpful for debugging
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/" />:<Outlet />;
};

export default UnProtectedRoute;