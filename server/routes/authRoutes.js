const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/usuarioSchema');
const dotenv = require('dotenv');
const authenticateJWT = require('../authenticateJWT');

dotenv.config();

// Ruta para verificar el token JWT
router.get('/verifyToken', authenticateJWT, async (req, res) => {
  const token = req.cookies.token;

  try {
    // Verifica el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca al usuario en la base de datos usando el ID del token decodificado
    const usuario = await Usuarios.findById(decoded.userId);

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Retorna la información del usuario
    return res.status(200).json({
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario,
      Puesto: usuario.Puesto,
      Departamento: usuario.Departamento,
      area: usuario.area,
      ID:usuario.id
    });
  } catch (err) {
    // El token no es válido o hubo otro error
    return res.status(401).json({ error: 'Token inválido' });
  }
});

router.post('/refreshToken', async (req, res) => {
    const { token } = req.body;
    try {
      // validamos la firma pero ignoramos expiración
      const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      // generamos uno nuevo
      const newToken = jwt.sign(
        { userId: payload.userId },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
      );
      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: 'No se pudo renovar el token' });
    }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});


module.exports = router;