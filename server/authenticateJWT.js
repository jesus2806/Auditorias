// middlewares/authenticateJWT.js
const jwt      = require('jsonwebtoken');
const Usuarios = require('./models/usuarioSchema');
require('dotenv').config();

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;        // “Bearer eyJ…”
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Opcional: puedes cargar más datos de usuario si los necesitas
    const usuario = await Usuarios.findById(payload.userId);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no existe' });
    }
    // adjunta info al req
    req.user = {
      id:       usuario._id,
      rol:      usuario.TipoUsuario,
      correo:   usuario.Correo,
      nombre:   usuario.Nombre,
      area:     usuario.area
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authenticateJWT;