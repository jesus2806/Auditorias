const Usuarios = require('../models/usuarioSchema');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const transporter = require('../emailconfig');
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

    // Generamos un código y lo enviamos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    usuario.codigoVerificacion       = verificationCode;
    usuario.codigoVerificacionExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await usuario.save();

    // Envío de correo
    await transporter.sendMail({
      from:    process.env.EMAIL_USERNAME,
      to:      usuario.Correo,
      subject: 'Tu código de verificación',
      text:    `Hola ${usuario.Nombre}, tu código es: ${verificationCode}. Expira en 10 minutos.`
    });

    // Devolvemos sólo un 403 para que el front abra el modal
    return res.status(403).json({ message: 'Código de verificación enviado al correo.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const verificarCodigo = async (req, res) => {
  const { Correo, codigo } = req.body;
  try {
    const usuario = await Usuarios.findOne({ Correo });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    if (usuario.codigoVerificacion !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }
    if (new Date() > usuario.codigoVerificacionExpires) {
      return res.status(400).json({ error: 'El código ha expirado' });
    }

    // Limpio código en BD
    usuario.codigoVerificacion       = undefined;
    usuario.codigoVerificacionExpires = undefined;
    await usuario.save();

    // ** Aquí genero el JWT y mando datos de sesión **
    const payload = { userId: usuario._id };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });

    // Establecer el token en una cookie HttpOnly
   res.cookie('token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'strict',
     maxAge: 8 * 60 * 60 * 1000, // 8 horas
   });

    const usuarioRes = {
      Correo:      usuario.Correo,
      Nombre:      usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario,
      Area:        usuario.area
    };

    return res.status(200).json({ usuario: usuarioRes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { iniciarSesion, verificarCodigo };