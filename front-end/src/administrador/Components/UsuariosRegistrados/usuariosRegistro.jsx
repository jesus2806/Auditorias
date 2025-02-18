import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/usuarios.css';
import './css/editForm.css';
import { format } from 'date-fns';
import RegistroUsuarioModal from './RegistroUsuarioModal';
import CalificacionModal from './CalificacionModal';

const UsuariosRegistro = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCalificacionModal, setShowCalificacionModal] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [editFormData, setEditFormData] = useState({
    Nombre: '',
    Correo: '',
    PromedioEvaluacion: '',
    Puesto: '',
    FechaIngreso: '',
    Escolaridad: '',
    Departamento: '',
    Carrera: '',
    AñosExperiencia: '',
    FormaParteEquipoInocuidad: false,
    PuntuacionEspecialidad: '',
    area: '',
    calificaciones: []
  });
  const [editFormError, setEditFormError] = useState('');
  const [filtroTipoUsuario, setFiltroTipoUsuario] = useState('');
  const [filtroInocuidad, setFiltroInocuidad] = useState('');
  const [filtroAprobado, setFiltroAprobado] = useState('');
  const [filtroEscolaridad, setFiltroEscolaridad] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/usuarios`);
        setUsers(response.data);
      } catch (error) {
        setError('Error al obtener los usuarios');
        console.error('Error al obtener los usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const calculateYearsInCompany = (fechaIngreso) => {
    const ingresoDate = new Date(fechaIngreso);
    const currentDate = new Date();
    let yearsInCompany = currentDate.getFullYear() - ingresoDate.getFullYear();
    let monthsDifference = currentDate.getMonth() - ingresoDate.getMonth();

    if (monthsDifference < 0 || (monthsDifference === 0 && currentDate.getDate() < ingresoDate.getDate())) {
      yearsInCompany--;
    }

    return yearsInCompany;
  };

  const handlePasswordChange = async (userId) => {
    setUsuarioAEditar(users.find(user => user._id === userId));
    setShowPasswordModal(true);
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordFormData.password !== passwordFormData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (passwordFormData.password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/usuarios/cambiarPassword/${usuarioAEditar._id}`, {
        password: passwordFormData.password
      });
      setShowPasswordModal(false);
      setPasswordFormData({ password: '', confirmPassword: '' });
      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setPasswordError('Error al cambiar la contraseña');
    }
  };

  const handleEditClick = (usuario) => {
    const formattedFechaIngreso = usuario.FechaIngreso ? new Date(usuario.FechaIngreso).toISOString().split('T')[0] : '';
    setUsuarioAEditar(usuario);
    setEditFormData({
      Nombre: usuario.Nombre,
      Correo: usuario.Correo,
      PromedioEvaluacion: usuario.PromedioEvaluacion,
      Puesto: usuario.Puesto || '',
      FechaIngreso: formattedFechaIngreso,
      Escolaridad: usuario.Escolaridad || '',
      Carrera: usuario.Carrera || '',
      Departamento: usuario.Departamento || '',
      AñosExperiencia: usuario.AñosExperiencia || '',
      FormaParteEquipoInocuidad: usuario.FormaParteEquipoInocuidad || false,
      PuntuacionEspecialidad: usuario.PuntuacionEspecialidad || '',
      area: usuario.area || '',
      calificaciones: usuario.calificaciones || []
    });
    setShowEditModal(true);
  };

  const handleAgregarCalificaciones = (usuario) => {
    setUsuarioAEditar(usuario);
    setShowCalificacionModal(true);
  };

  const handleGuardarCalificaciones = (calificaciones) => {
    if (!usuarioAEditar || !calificaciones || calificaciones.length === 0) {
      console.error("Usuario o calificaciones inválidas");
      return;
    }

    const updatedUser = {
      ...usuarioAEditar,
      calificaciones: [...usuarioAEditar.calificaciones, ...calificaciones]
    };

    axios.put(`${process.env.REACT_APP_BACKEND_URL}/usuarios/${usuarioAEditar._id}`, updatedUser)
      .then(response => {
        setUsers(users.map(user => (user._id === usuarioAEditar._id ? response.data : user)));
        setUsuarioAEditar(null);
        setShowCalificacionModal(false);
      })
      .catch(error => {
        console.error('Error al actualizar las calificaciones:', error);
      });
  };

  const handleEditFormChange = (e, value) => {
    const { name, type } = e.target;
    const newValue = type === 'checkbox' ? value : e.target.value;
    setEditFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const fechaIngresoDate = new Date(editFormData.FechaIngreso);
    const currentDate = new Date();

    if (fechaIngresoDate > currentDate) {
      setEditFormError('La fecha de ingreso no puede ser mayor a la fecha actual.');
      return;
    } else {
      setEditFormError('');
    }

    try {
      const updatedFormData = { ...editFormData };
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/usuarios/${usuarioAEditar._id}`, updatedFormData);
      setUsers(users.map(user => (user._id === usuarioAEditar._id ? response.data : user)));
      setShowEditModal(false);
      setUsuarioAEditar(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setUsuarioAEditar(null);
    setEditFormData({});
    setEditFormError('');
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/usuarios/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleDegradarClick = async (userId) => {
    try {
      const userToDegradar = users.find(user => user._id === userId);
      if (userToDegradar && userToDegradar.PromedioEvaluacion < 80) {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/usuarios/${userId}`, { TipoUsuario: 'auditado' });
        setUsers(users.map(user => (user._id === userId ? response.data : user)));
        alert('Usuario degradado a auditado exitosamente');
      } else {
        alert('El usuario no puede ser degradado porque su promedio de evaluación es mayor o igual a 80');
      }
    } catch (error) {
      console.error('Error al degradar el usuario:', error);
    }
  };

  const handlePromocionarClick = async (userId) => {
    try {
      const userToPromote = users.find(user => user._id === userId);
      if (userToPromote && userToPromote.PromedioEvaluacion >= 80) {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/usuarios/${userId}`, { TipoUsuario: 'auditor' });
        setUsers(users.map(user => (user._id === userId ? response.data : user)));
        alert('Usuario promovido a auditor exitosamente');
      } else {
        alert('El usuario no puede ser promovido a auditor porque su promedio de evaluación es menor o igual a 80');
      }
    } catch (error) {
      console.error('Error al promover el usuario:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      (filtroTipoUsuario === '' || user.TipoUsuario === filtroTipoUsuario) &&
      (filtroInocuidad === '' || user.FormaParteEquipoInocuidad.toString() === filtroInocuidad) &&
      (filtroAprobado === '' || user.Aprobado.toString() === filtroAprobado) &&
      (filtroEscolaridad === '' || user.Escolaridad.toString() === filtroEscolaridad)
    );
  });

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="usuarios-container">
        <h1 className="h1-small-margin">Usuarios</h1>
        <div className='botonA-pos'>
          <button className='botonA' onClick={() => setShowRegistrationForm(true)}>Agregar +</button>
        </div>
        <div className="filters">
          <select value={filtroTipoUsuario} onChange={(e) => setFiltroTipoUsuario(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="auditado">Auditado</option>
            <option value="auditor">Auditor</option>
            <option value="Administrador">Administrador</option>
          </select>

          <select value={filtroEscolaridad} onChange={(e) => setFiltroEscolaridad(e.target.value)}>
            <option value="">Escolaridad</option>
            <option value="TSU">TSU</option>
            <option value="Profesional">Profesional</option>
            <option value="Preparatoria">Preparatoria</option>
          </select>

          <select value={filtroInocuidad} onChange={(e) => setFiltroInocuidad(e.target.value)}>
            <option value="">Inocuidad</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>

          <select value={filtroAprobado} onChange={(e) => setFiltroAprobado(e.target.value)}>
            <option value="">Aprobado</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="card-grid">
          {filteredUsers.map(user => (
            <UserCard
              key={user._id}
              user={user}
              formatDate={formatDate}
              calculateYearsInCompany={calculateYearsInCompany}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onDegradarClick={handleDegradarClick}
              onPromocionarClick={handlePromocionarClick}
              onAgregarCalificaciones={() => handleAgregarCalificaciones(user)}
              onPasswordChange={handlePasswordChange}
            />
          ))}
        </div>
        <RegistroUsuarioModal
          show={showRegistrationForm}
          handleClose={() => setShowRegistrationForm(false)}
        />
        <CalificacionModal
          show={showCalificacionModal}
          handleClose={() => setShowCalificacionModal(false)}
          onSubmit={handleGuardarCalificaciones}
          usuario={usuarioAEditar}
        />

        {showEditModal && (
          <div className="modal">
            <div className="modal-content edit-modal-content" style={{ overflowY: 'scroll' }}>
              <span className="close" onClick={handleCloseEditModal}>&times;</span>
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="Nombre"
                    value={editFormData.Nombre}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Correo:</label>
                  <input
                    type="email"
                    name="Correo"
                    value={editFormData.Correo}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Puesto:</label>
                  <input
                    type="text"
                    name="Puesto"
                    value={editFormData.Puesto}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Departamento:</label>
                  <select
                    name="Departamento"
                    value={editFormData.Departamento}
                    onChange={handleEditFormChange}
                  >
                    <option value="">Selecciona el departamento</option>
                    <option value="Administración">Administración</option>
                    <option value="Aseguramiento de calidad">Aseguramiento de calidad</option>
                    <option value="Gestión para la calidad">Gestión para la calidad</option>
                    <option value="Gestión para la productividad">Gestión para la productividad</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Ingeniería">Ingeniería</option>
                    <option value="Planeación y Logística">Planeación y Logística</option>
                    <option value="Producción">Producción</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Área:</label>
                  <input
                    type="text"
                    name="area"
                    value={editFormData.area}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                {(usuarioAEditar.TipoUsuario === 'auditor' || usuarioAEditar.TipoUsuario === 'Administrador' || usuarioAEditar.TipoUsuario === 'empleado') && (
                  <>
                    <div className="form-group">
                      <label>Fecha de Ingreso:</label>
                      <input
                        type="date"
                        name="FechaIngreso"
                        value={editFormData.FechaIngreso}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Promedio de Evaluación:</label>
                      <input
                        type="number"
                        name="PromedioEvaluacion"
                        value={editFormData.PromedioEvaluacion}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Escolaridad:</label>
                      <select name="Escolaridad" value={editFormData.Escolaridad} onChange={handleEditFormChange} required>
                        <option value="">Seleccione una opción</option>
                        <option value="TSU">TSU</option>
                        <option value="Profesional">Profesional</option>
                        <option value="Preparatoria">Preparatoria</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Carrera:</label>
                      <input
                        type="text"
                        name="Carrera"
                        value={editFormData.Carrera}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Años de Experiencia:</label>
                      <input
                        type="number"
                        name="AñosExperiencia"
                        value={editFormData.AñosExperiencia}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Puntuación Especialidad:</label>
                      <input
                        type="number"
                        name="PuntuacionEspecialidad"
                        value={editFormData.PuntuacionEspecialidad}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>¿Forma parte del equipo de Inocuidad?</label>
                      <input
                        type="checkbox"
                        name="FormaParteEquipoInocuidad"
                        checked={editFormData.FormaParteEquipoInocuidad}
                        onChange={(e) => handleEditFormChange(e, e.target.checked)}
                      />
                    </div>
                  </>
                )}

                {editFormError && <p className="error">{editFormError}</p>}
                <button type="submit" className="btn-guardar">Guardar Cambios</button>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowPasswordModal(false)}>&times;</span>
              <form onSubmit={handlePasswordSubmit} className="edit-form">
                <h2>Cambiar Contraseña</h2>
                <div className="form-group">
                  <label>Nueva Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    value={passwordFormData.password}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                {passwordError && <p className="error">{passwordError}</p>}
                <button type="submit" className="btn-guardar">Cambiar Contraseña</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user, formatDate, calculateYearsInCompany, onEditClick, onDeleteClick, onDegradarClick, onPromocionarClick, onAgregarCalificaciones, onPasswordChange }) => {
  const [showCalificaciones, setShowCalificaciones] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="card">
      <h3>{user.Nombre}</h3>
      <p style={{overflowWrap: 'break-word'}}><strong>Correo:</strong> {user.Correo}</p>
      <p><strong>Tipo de usuario:</strong> {user.TipoUsuario}</p>
      <p><strong>Puesto:</strong> {user.Puesto}</p>
      <p><strong>Departamento:</strong> {user.Departamento}</p>
      <p><strong>Área:</strong> {user.area}</p>
      {(user.TipoUsuario === 'auditor' || user.TipoUsuario === 'Administrador' || user.TipoUsuario === 'empleado') && (
        <>
          {user.FechaIngreso && (
            <p><strong>Fecha de Ingreso:</strong> {user.FechaIngreso.substring(8, 10)}/{user.FechaIngreso.substring(5, 7)}/{user.FechaIngreso.substring(0, 4)}</p>
          )}
          <p><strong>Años en la Empresa:</strong> {calculateYearsInCompany(user.FechaIngreso)}</p>
          <p><strong>Escolaridad:</strong> {user.Escolaridad}</p>
          <p><strong>Carrera:</strong> {user.Carrera}</p>
          <p><strong>Años de Experiencia:</strong> {user.AñosExperiencia}</p>
          <p><strong>Puntuación Especialidad:</strong> {user.PuntuacionEspecialidad}</p>
          <p><strong>Forma Parte del Equipo de Inocuidad:</strong> {user.FormaParteEquipoInocuidad ? 'Sí' : 'No'}</p>
          <p><strong>Aprobado:</strong> {user.Aprobado ? 'Sí' : 'No'}</p>
          <p><strong>Promedio de Evaluación:</strong> {user.PromedioEvaluacion}</p>
          <div className="botones-cards">
            <div className="dropdown">
              <div className='dropdown-toggle-m'>
                <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  Opciones
                </button>
              </div>
              {dropdownOpen && (
                <div className='botones-cards-2'>
                  <button onClick={() => onEditClick(user)}>Editar</button>
                  <button onClick={() => onDeleteClick(user._id)}>Eliminar</button>
                  <button onClick={onAgregarCalificaciones}>Agregar Calificaciones</button>
                  <button onClick={() => onPasswordChange(user._id)}>Cambiar Contraseña</button>

                  {(user.TipoUsuario === 'empleado') && (
                    <>
                      {(user.PromedioEvaluacion >= 80) && <button onClick={() => onPromocionarClick(user._id)}>Promocionar</button>}
                    </>
                  )}

                  {(user.TipoUsuario === 'auditor') && (
                    <>
                      {(user.PromedioEvaluacion <= 79 ) && <button onClick={() => onDegradarClick(user._id)}>Degradar</button>}
                    </>
                  )}

                  <div className="accordion">
                    <button onClick={() => setShowCalificaciones(!showCalificaciones)}>
                      Ver Calificaciones
                    </button>
                  </div>
                  {showCalificaciones && (
                    <div className="calificaciones">
                      <h4>Calificaciones</h4>
                      <ul>
                        {user.calificaciones.map((calificacion, index) => (
                          <li key={index}>
                            <p>
                              Curso: {calificacion.nombreCurso}, Calificación: {calificacion.calificacion}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {user.TipoUsuario === 'auditado' && (
        <div className="editar-eliminar">
          <button className="editar" onClick={() => onEditClick(user)}>Editar</button>
          <button onClick={() => onDeleteClick(user._id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default UsuariosRegistro;
