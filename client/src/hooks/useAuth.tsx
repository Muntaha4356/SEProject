// import { useState, useEffect } from 'react';

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const checkAuth = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/org/auth');
//       const data = await response.json();
//       setIsAuthenticated(data.authenticated);
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setIsAuthenticated(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return { isAuthenticated, isLoading, checkAuth };
// };
