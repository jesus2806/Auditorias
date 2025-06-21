import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './App';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Asegura que axios envíe siempre las cookies (HttpOnly JWT)
axios.defaults.withCredentials = true;

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Llamada al endpoint que lee el JWT de la cookie
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/verifyToken`
        );
        setUserData(data);
      } catch (err) {
        // No hay cookie válida o expiró → limpiar userData
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  // Muestra un loading modal mientras loading===true
  useEffect(() => {
    if (loading) {
      MySwal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    } else {
      Swal.close();
    }
  }, [loading]);

  // Interceptor global para 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          // aquí podrías intentar un refresh-token o forzar logout
          setUserData(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthProvider;