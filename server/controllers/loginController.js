const Usuarios = require('../models/usuarioSchema');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const iniciarSesion = async (req, res) => {
  const { Correo, Contraseña } = req.body;
  try {
    const usuario = await Usuarios.findOne({ Correo });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const esContraseñaCorrecta = await bcrypt.compare(Contraseña, usuario.Contraseña);
    if (!esContraseñaCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT directamente sin código de verificación
    const payload = { userId: usuario._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Establecer token en cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000, // 8 horas
    });

    const usuarioRes = {
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario,
      Area: usuario.area,
    };

    return res.status(200).json({ usuario: usuarioRes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { iniciarSesion };
