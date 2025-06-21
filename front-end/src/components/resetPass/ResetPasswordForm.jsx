import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ResetPasswordForm() {
  // Se extraen los parámetros de la URL
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');
  
    if (newPassword !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/usuarios/reset-password/${id}/${token}`,
        { newPassword }
      );
      // Muestro un modal de éxito y solo tras cerrarlo navego a /login
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña restablecida!',
        text: response.data.message,
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      console.error('Error al restablecer la contraseña:', err.response);
      setError(err.response?.data?.error || 'Ocurrió un error, por favor inténtalo nuevamente.');
    }
  };  

  return (
    <Box
      sx={{
        mt: '7em', // Margen superior de 7em
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      {/* Contenedor blanco con Paper */}
      <Paper 
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'white',
        }}
        elevation={3}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Restablecer Contraseña
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Nueva contraseña"
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Restablecer Contraseña
          </Button>
        </Box>
        {mensaje && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default ResetPasswordForm;