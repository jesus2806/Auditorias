import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import './css/Login.css';
import logo from '../../assets/img/logoAudit.png';
import Swal from 'sweetalert2';
import MenuSup from '../menu-sup/MenuSup';

const Login = () => {
  const [formData, setFormData] = useState({ Correo: '', Contraseña: '' });
  const { setUserData } = useContext(UserContext);
  const [mostrarVerificacion, setMostrarVerificacion] = useState(false);
  const [codigoInputs, setCodigoInputs] = useState(Array(6).fill(''));
  const navigate = useNavigate();

  // Para que axios incluya siempre la cookie
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

  // Paso 1: solicitamos /login → retorna 403 y dispara envío de código
  const handleSubmit = async (e) => {
    e.preventDefault();
    mostrarCargando('Verificando credenciales...');
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        formData,
        { withCredentials: true }
      );
      // No debería llegar aquí (esperamos 403)
    } catch (error) {
      ocultarCargando();
      if (error.response?.status === 403) {
        setMostrarVerificacion(true);
        Swal.fire({
          icon: 'info',
          title: 'Código enviado',
          text: 'Revisa tu correo e ingresa el código.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales inválidas.',
        });
      }
    }
  };

  // Paso 2: verificamos el código → /verificar setea la cookie + devuelve usuario
  const handleSubmitCodigo = async (e) => {
    e.preventDefault();
    const codigo = codigoInputs.join('');
    mostrarCargando('Verificando código...');
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/verificar`,
        { Correo: formData.Correo, codigo },
        { withCredentials: true }
      );

      // Ya no hay token en body; el servidor lo puso en cookie HttpOnly
      setUserData(data.usuario);

      // Redirigir según rol
      const tipo = data.usuario.TipoUsuario;
      if (tipo === 'administrador') navigate('/admin');
      else if (tipo === 'auditado')   navigate('/auditado');
      else if (tipo === 'auditor')    navigate('/auditor');
      else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Rol no permitido.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Error al verificar el código.',
      });
    } finally {
      ocultarCargando();
      setCodigoInputs(Array(6).fill(''));
      setMostrarVerificacion(false);
    }
  };

  const handleCodigoChange = (e, idx) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const inputs = [...codigoInputs];
      inputs[idx] = value;
      setCodigoInputs(inputs);
      if (value && idx < inputs.length - 1) {
        document.getElementById(`codigo-${idx + 1}`)?.focus();
      }
    }
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

        {mostrarVerificacion && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Verificar Código</h2>
              <p>Ingresa el código de verificación:</p>
              <div className="codigo-container">
                {codigoInputs.map((val, idx) => (
                  <input
                    key={idx}
                    id={`codigo-${idx}`}
                    type="text"
                    maxLength="1"
                    value={val}
                    onChange={(e) => handleCodigoChange(e, idx)}
                    className="input-code"
                  />
                ))}
              </div>
              <button
                className="btn-verify"
                onClick={handleSubmitCodigo}
              >
                Verificar Código
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;