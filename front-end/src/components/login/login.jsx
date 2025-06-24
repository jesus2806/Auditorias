import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import './css/Login.css';
import logo from '../../assets/img/logoAudit.png';
import Swal from 'sweetalert2';
import MenuSup from '../menu-sup/MenuSup';

const PopUpProteccionDatos = ({ onClose }) => {
  return (
    <div className="modal-overlay enhanced-overlay">
      <div className="modal-content enhanced-modal">
        <div className="modal-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2 className="modal-title">Protección de Datos Personales</h2>
        <p className="modal-text">
          Tu privacidad y seguridad son muy importantes para nosotros. 
          Los datos que proporcionas serán tratados conforme a la Ley de Protección de Datos Personales vigente, garantizando su confidencialidad y uso responsable.
        </p>
        <a 
          href="https://drive.google.com/file/d/1szmsC3ouLoSbamZZF8ExRto0Q8dKkwR2/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="modal-link"
        >
          Consulta la Ley de Privacidad de Datos Oficial aquí
        </a>
        <div className="modal-button-container">
          <button className="modal-button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};


const Login = () => {
  const [formData, setFormData] = useState({ Correo: '', Contraseña: '' });
  const { setUserData } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [nextRoute, setNextRoute] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const mostrarCargando = (message = 'Por favor, espere') => {
    Swal.fire({
      title: 'Procesando...',
      text: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const ocultarCargando = () => Swal.close();

  // Login sin código de verificación
  const handleSubmit = async (e) => {
    e.preventDefault();
    mostrarCargando('Verificando credenciales...');
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        formData,
        { withCredentials: true }
      );

      ocultarCargando();

      setUserData(data.usuario);

      // Guardamos la ruta para redirigir después de mostrar el popup
      const tipo = data.usuario.TipoUsuario;
      if (tipo === 'administrador') setNextRoute('/admin');
      else if (tipo === 'auditado') setNextRoute('/auditado');
      else if (tipo === 'auditor') setNextRoute('/auditor');
      else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Rol no permitido.',
        });
        return;
      }

      setShowPopup(true); // Mostrar el popup de protección de datos

    } catch (error) {
      ocultarCargando();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Credenciales inválidas.',
      });
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate(nextRoute);
  };

  return (
    <div>
      <MenuSup />
      <div className="login-container-all">
        <div className="login-container">
          <div className="form-group espacio">
            <img
              src={logo}
              alt="Logo Empresa"
              className="logo-empresa-login"
            />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="Correo"
                value={formData.Correo}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="Contraseña"
                value={formData.Contraseña}
                onChange={handleChange}
                placeholder="Contraseña"
                required
              />
            </div>
            <button type="submit" className="btn-login">
              Iniciar Sesión
            </button>
          </form>

          <div className="reg-style">
            <span
              className="forgot-password-link"
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => navigate('/registro')}
            >
              ¿No tienes una cuenta?
            </span>
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <span
              className="forgot-password-link"
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        </div>

        {showPopup && <PopUpProteccionDatos onClose={handleClosePopup} />}
      </div>
    </div>
  );
};

export default Login;
