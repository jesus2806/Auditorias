import React, { useContext, useState } from 'react';
import axios from 'axios';
import './css/Info.css';
import { UserContext } from '../../App';
import Swal from 'sweetalert2';

const Informacion = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState(userData?.Nombre || '');
  const [correo, setCorreo] = useState(userData?.Correo || '');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!userData) {
    return <div>No hay información disponible.</div>;
  }

  const tipo =
    userData.TipoUsuario === 'auditado' ? 'Auditado' : userData.TipoUsuario;

  const validatePassword = (password) => {
    const exactLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length === exactLength && hasUpperCase && hasNumber;
  };

  const _id = userData.ID || userData._id;
  const token = userData.token;

  const handleSaveProfile = async () => {
    try {
      const { data: updated } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/usuarios/${_id}`,
        { Nombre: nombre, Correo: correo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar contexto para refrescar UI
      setUserData((prev) => ({
        ...prev,
        Nombre: updated.Nombre,
        Correo: updated.Correo,
      }));

      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    }
    if (!validatePassword(newPassword)) {
      return Swal.fire(
        'Advertencia',
        'La contraseña debe tener 8 caracteres, incluir al menos una mayúscula y un número',
        'warning'
      );
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/usuarios/cambiarPassword/${_id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('Éxito', 'Contraseña actualizada exitosamente', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al actualizar la contraseña', 'error');
    }
  };

  return (
    <div className="content-inf">
      <h1 className="inf-usuario">Información del Usuario</h1>

      {editMode ? (
        <>
          <div className="inf-contra">
            <input
              className="input-inf"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="input-inf"
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="inf-contra">
            <button onClick={handleSaveProfile}>Guardar cambios</button>
            <button onClick={() => setEditMode(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <p>Nombre: {userData.Nombre}</p>
          <p>Email: {userData.Correo}</p>
          <p>Tipo de Usuario: {tipo}</p>
          <div className="inf-contra">
          <button  onClick={() => setEditMode(true)}>Editar perfil</button>
          </div>
        </>
      )}

      <h2 className="inf-usuario">Cambiar Contraseña</h2>
      <div className="inf-contra">
        <input
          className="input-inf"
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          maxLength={8}
        />
        <input
          className="input-inf"
          type="password"
          placeholder="Confirmar Nueva Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          maxLength={8}
        />
      </div>
      <div className="inf-contra">
        <button onClick={handlePasswordChange}>Cambiar Contraseña</button>
      </div>
    </div>
  );
};

export default Informacion;