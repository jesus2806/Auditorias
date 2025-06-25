import axios from 'axios';
import Swal from 'sweetalert2';

// Configura la URL base y el envío de cookies
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true
});

export default api;