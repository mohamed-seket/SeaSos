import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    console.log("PrivateRoute mounted");
    console.log("PrivateRoute: isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    console.log("PrivateRoute: redirecting to /auth/sign-in");
    return <Navigate to="/auth/sign-in" />;
  }

  return <Component />;
};

export default PrivateRoute;
