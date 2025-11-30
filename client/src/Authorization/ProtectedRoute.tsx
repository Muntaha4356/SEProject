// import { Outlet, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const ProtectedRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:3000/api/org/auth`, { withCredentials: true }) // must match backend route exactly
//       .then((res) => {
//         console.log(res.success);
//         setIsAuthenticated(res.data.success);
//       })
//       .catch((err) => {
//         console.error("Auth check failed:", err.message); // helpful for debugging
//         setIsAuthenticated(false);
//       });
//   }, []);

//   if (isAuthenticated === null) return <div>Loading...</div>;

//   return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
// };

// export default ProtectedRoute;

// import React, {useEffect} from 'react'
// import { useNavigate } from 'react-router-dom'
// const ProtectedRoutess = ({children}) => {
//   const isAuthenticated = false;
//   const navigate = useNavigate();


//   useEffect(() => {
//     if(!isAuthenticated) navigate('/signin')
//   }, [])
//   return(
//     children
//   )
// }

// export default ProtectedRoutess


// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/signin" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
