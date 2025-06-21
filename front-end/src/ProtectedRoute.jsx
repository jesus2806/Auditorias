// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { UserContext } from './App';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loading } = useContext(UserContext);

  if (loading) {
    // Puedes poner un spinner real aquí
    return <div>Cargando sesión…</div>;
  }


  return children;
};

export default ProtectedRoute;