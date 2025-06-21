import React, { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import MenuSup from '../menu-sup/MenuSup';
import { Container,Paper, TextField, Button, Typography, Box } from '@mui/material';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null); // Estado para almacenar el token del captcha
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Al menos 8 caracteres, una mayúscula y un número.
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  // Función que se dispara al cambiar el valor del captcha
  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setError('');
    setMensaje('');

    // Validar la contraseña
    if (!validatePassword(contraseña)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula y un número.');
      return;
    }

    // Validar que el captcha haya sido completado
    if (!captchaValue) {
      setError('Por favor, verifica que eres humano completando el captcha.');
      return;
    }

    const data = {
      Nombre: nombre,
      Correo: correo,
      Contraseña: contraseña,
      captchaToken: captchaValue // Enviar el token al servidor para validación
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/usuarios/registro`, data);
      setMensaje(response.data.message);
      setError('');
      // Limpiar campos después del registro exitoso
      setNombre('');
      setCorreo('');
      setContraseña('');
      setCaptchaValue(null);
    } catch (err) {
      console.error('Error en la conexión:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Error al registrar el administrador');
      } else {
        setError('Error en la conexión al servidor');
      }
    }
  };

  return (
    <div>
    <MenuSup/>
    <Container maxWidth="sm">
    
      <Paper 
        sx={{
          p: 4,
          width: '80%',
          maxWidth: 400,
          backgroundColor: 'white',
          marginTop: '4em'
        }}
        elevation={3}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
        Regístrate con nosotros
        </Typography>
        {mensaje && <Typography variant="body1" sx={{ color: 'green', mb: 2 }}>{mensaje}</Typography>}
        {error && <Typography variant="body1" sx={{ color: 'red', mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            label="Correo"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            helperText="Debe tener al menos 8 caracteres, 1 mayúscula y 1 número."
          />
          {/* Agregar el componente reCAPTCHA */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleCaptchaChange}
            />
            
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Registrarse
          </Button>
        </form>
        </Paper>
    </Container>
    </div>
  );
}

export default Registro;