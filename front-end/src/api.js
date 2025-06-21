import axios from 'axios';
import Swal from 'sweetalert2';

// Configura la URL base y el envío de cookies
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true
});

// helper de logout vía backend
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Error al hacer logout:', err);
  }
  // limpia cualquier estado local y redirige
  window.location.href = '/login';
};

// Evitamos abrir varios modales a la vez
let showingExpiryModal = false;

api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    if ((status === 401 || status === 403) && !showingExpiryModal) {
      showingExpiryModal = true;

      Swal.fire({
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. ¿Quieres extenderla 30 minutos o cerrar sesión?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Extender 30 min',
        denyButtonText: 'Cerrar sesión',
        timer: 10000,
        timerProgressBar: true,
        allowOutsideClick: false,
        willClose: () => {
          showingExpiryModal = false;
        }
      }).then(result => {
        if (result.isConfirmed) {
          // Llamada a endpoint de refresh, sin pasar token (se lee de la cookie)
          api.post('/auth/refreshToken')
            .catch(() => {
              logout();
            });
        } else if (result.isDenied) {
          logout();
        }
      });
    }
    return Promise.reject(err);
  }
);

export default api;