// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from './App';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userData, loading } = useContext(UserContext);
  const location = useLocation();

  // Mientras validamos el token → spinner o texto de carga
  if (loading) {
    return <div>Cargando sesión…</div>;
  }

  // Si no hay usuario logueado → login
  if (!userData) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location }} 
      />
    );
  }

  console.log('allowedRoles:', allowedRoles, '-> userData.role:', userData.TipoUsuario);

  // Si se pasaron roles y el rol del usuario no está entre ellos → unauthorized
  if (
    Array.isArray(allowedRoles) && 
    allowedRoles.length > 0 && 
    !allowedRoles.includes(userData.TipoUsuario)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuario autenticado (y con rol permitido si se pidió) → renderiza la ruta
  return children;
};

export default ProtectedRoute;
