const Usuarios = require('../models/usuarioSchema');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const logger = require('../util/logger');
require('dotenv').config();


const loginAttempts = {};

const iniciarSesion = async (req, res) => {
  const { Correo, Contraseña } = req.body;
  const ip = req.ip;

  try {
    const usuario = await Usuarios.findOne({ Correo });

    if (!usuario) {
      // Intento fallido desde IP
      registrarIntentoFallido(ip, Correo);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const esContraseñaCorrecta = await bcrypt.compare(Contraseña, usuario.Contraseña);

    if (!esContraseñaCorrecta) {
      registrarIntentoFallido(ip, Correo);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Reiniciar contador si login exitoso
    if (loginAttempts[ip]) delete loginAttempts[ip];

    usuario.lastActivity = Date.now();
    await usuario.save();

    const payload = { userId: usuario._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000,
    });

    const usuarioRes = {
      ID: usuario._id,
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario,
      Area: usuario.area,
    };

    logger.info(`Inicio de sesión exitoso: ${Correo}`);

    return res.status(200).json({ usuario: usuarioRes });

  } catch (error) {
    logger.error(`Error en iniciarSesion: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para registrar intentos fallidos y detectar actividad sospechosa
function registrarIntentoFallido(ip, correoIntentado) {
  const now = Date.now();
  loginAttempts[ip] = loginAttempts[ip] || { count: 0, lastAttempt: now };

  if (now - loginAttempts[ip].lastAttempt < 60000) {
    loginAttempts[ip].count += 1;
  } else {
    loginAttempts[ip].count = 1;
  }

  loginAttempts[ip].lastAttempt = now;

  logger.warn(`Intento de inicio de sesión fallido  usando correo ${correoIntentado}. Intentos recientes: ${loginAttempts[ip].count}`);

  if (loginAttempts[ip].count >= 3) {
    logger.warn(`⚠️ Posible actividad sospechosa detectada. Múltiples intentos fallidos en menos de 1 minuto.`);
  }
}

module.exports = { iniciarSesion };
