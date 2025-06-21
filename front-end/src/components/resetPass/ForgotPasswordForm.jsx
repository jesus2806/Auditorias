import React, { useState } from 'react';
import axios from 'axios';
import { Box,Paper, Button, TextField, Typography, Alert } from '@mui/material';
import MenuSup from '../menu-sup/MenuSup';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/usuarios/reset-password-request`,
        { email }
      );
      setMensaje(response.data.message);
    } catch (err) {
      console.error('Error en la solicitud:', err);
      setError('Ocurrió un error, por favor inténtalo nuevamente.');
    }
  };

  return (
    <div>
      <MenuSup/>
    <Box 
      sx={{
        mt: '7em', // Margen superior de 7em
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
      }}
    >
    <Paper 
        sx={{
          p: 4,
          width: '80%',
          maxWidth: 400,
          backgroundColor: 'white',
        }}
        elevation={3}
      >
      <Typography variant="h4" component="h2" gutterBottom>
        ¿Olvidaste tu contraseña?
      </Typography>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Correo electrónico"
          type="email"
          id="email"
          name="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Enviar enlace de restablecimiento
        </Button>
      </Box>
      {mensaje && (
        <Alert severity="success" sx={{ mt: 2, width: '100%', maxWidth: 400 }}>
          {mensaje}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%', maxWidth: 400 }}>
          {error}
        </Alert>
      )}
      </Paper>
    </Box>
    </div>
  );
}

export default ForgotPasswordForm;