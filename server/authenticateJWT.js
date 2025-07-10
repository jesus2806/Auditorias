const jwt      = require('jsonwebtoken');
const Usuarios = require('./models/usuarioSchema');
require('dotenv').config();

async function authenticateJWT(req, res, next) {
  const token = req.cookies?.token
              || (req.headers.authorization?.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Opcional: puedes cargar más datos de usuario si los necesitas
    const usuario = await Usuarios.findById(payload.userId);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no existe' });
    }
    // adjunta info al req
    req.user = {
      ID: usuario._id,
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario,
      Area: usuario.area,
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authenticateJWT;