import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import './css/Login.css';
import logo from '../../assets/img/logoAudit.png';
import Swal from 'sweetalert2';
import MenuSup from '../menu-sup/MenuSup';

const PopUpProteccionDatos = ({ onClose }) => (
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
        Consulta Nuestra Ley de Privacidad de Datos aquí
      </a>
      <div className="modal-button-container">
        <button className="modal-button" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({ Correo: '', Contraseña: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUserData } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [nextRoute, setNextRoute] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Bloqueo de UI
    setIsSubmitting(true);
    mostrarCargando('Verificando credenciales...');

    try {
      // 2. Verificación de credenciales
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        formData,
        { withCredentials: true }
      );

      // 3. Sólo si pasaron, continuamos
      ocultarCargando();
      setUserData(data.usuario);

      // Decidir ruta de redirección según rol
      const tipo = data.usuario.TipoUsuario;
      if (tipo === 'administrador')      setNextRoute('/admin');
      else if (tipo === 'auditado')       setNextRoute('/auditado');
      else if (tipo === 'auditor')        setNextRoute('/auditor');
      else {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Rol no permitido.',
        });
      }

      // 4. Mostramos el popup *después* de verificar
      setShowPopup(true);

    } catch (error) {
      // Si falla la verificación, sólo mostramos error
      ocultarCargando();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Credenciales inválidas.',
      });

    } finally {
      // 5. Siempre desbloqueamos la UI
      setIsSubmitting(false);
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className="btn-login"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="reg-style">
            <span
              className="forgot-password-link"
              style={{ color: 'blue', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              onClick={() => !isSubmitting && navigate('/registro')}
            >
              ¿No tienes una cuenta?
            </span>
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <span
              className="forgot-password-link"
              style={{ color: 'blue', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              onClick={() => !isSubmitting && navigate('/forgot-password')}
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
