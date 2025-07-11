const Usuarios = require('../models/usuarioSchema');
const transporter = require('../emailconfig');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const logger = require('../util/logger'); // <- Importación del logger
console.log("Logger methods:", Object.keys(logger));

// Controlador para registrar un nuevo usuario
const registroUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuarios(req.body);
    await nuevoUsuario.save();

    logger.info(`Nuevo usuario registrado: ${nuevoUsuario.Nombre} (${nuevoUsuario.Correo}) - Rol: ${nuevoUsuario.TipoUsuario}`);

    if (nuevoUsuario.TipoUsuario === 'auditor') {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: nuevoUsuario.Correo,
        subject: 'Bienvenido al equipo de auditores',
        text: `Hola ${nuevoUsuario.Nombre},\n\nBienvenido al equipo de auditores. Nos alegra tenerte con nosotros.\n\nSaludos,\nEl equipo de la empresa`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Error al enviar correo a ${nuevoUsuario.Correo}: ${error.message}`);
        } else {
          logger.info(`Correo de bienvenida enviado a ${nuevoUsuario.Correo}`);
        }
      });
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    logger.error(`Error en registroUsuario: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.find();
    res.json(usuarios);
  } catch (error) {
    logger.error(`Error en obtenerUsuarios: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.id);
    if (!usuario) {
      logger.warn(`Usuario no encontrado con ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    logger.error(`Error en obtenerUsuarioPorId: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.FormaParteEquipoInocuidad !== undefined) {
      updates.FormaParteEquipoInocuidad = updates.FormaParteEquipoInocuidad === 'on' || updates.FormaParteEquipoInocuidad === true;
    }

    if (updates.PromedioEvaluacion !== undefined) {
      updates.Aprobado = updates.PromedioEvaluacion >= 80;
    }

    if (updates.calificaciones) {
      updates.calificaciones = updates.calificaciones.map(calificacion => ({
        nombreCurso: calificacion.nombreCurso,
        calificacion: calificacion.calificacion
      }));
    }

    const usuario = await Usuarios.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!usuario) {
      logger.warn(`Usuario no encontrado para actualizar con ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    logger.info(`Usuario actualizado: ${usuario.Nombre} (${usuario.Correo})`);
    res.json(usuario);
  } catch (error) {
    logger.error(`Error en actualizarUsuario: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerUsuarioPorNombre = async (req, res) => {
  try {
    const nombreUsuario = req.params.nombre;
    const usuario = await Usuarios.findOne({ Nombre: nombreUsuario });
    if (!usuario) {
      logger.warn(`Usuario no encontrado por nombre: ${nombreUsuario}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    logger.error(`Error en obtenerUsuarioPorNombre: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuarios.findByIdAndDelete(req.params.id);
    if (!usuario) {
      logger.warn(`Intento de eliminación fallido. Usuario con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    logger.info(`Usuario eliminado: ${usuario.Nombre} (${usuario.Correo})`);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    logger.error(`Error en eliminarUsuario: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuarios.findByIdAndUpdate(req.params.id, { Contraseña: hashedPassword }, { new: true });
    if (!usuario) {
      logger.warn(`Usuario no encontrado para cambio de contraseña: ID ${req.params.id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    logger.info(`Contraseña actualizada para usuario: ${usuario.Nombre} (${usuario.Correo})`);
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    logger.error(`Error en cambiarPassword: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const searchUsuarios = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim().length < 3) {
      return res.status(400).json({ error: 'Ingrese al menos 3 caracteres para buscar' });
    }

    const regex = new RegExp(search, 'i');
    const usuarios = await Usuarios.find({ Nombre: regex }).limit(10);
    res.json(usuarios);
  } catch (error) {
    logger.error(`Error en searchUsuarios: ${error.message}`);
    res.status(500).json({ error: 'Error en la búsqueda de usuarios' });
  }
};

const registroAdministrador = async (req, res) => {
  try {
    const captchaToken = req.body.captchaToken;
    if (!captchaToken) {
      return res.status(400).json({ error: 'Por favor, completa el captcha.' });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    const captchaResponse = await axios.post(verificationURL);
    if (!captchaResponse.data.success) {
      return res.status(400).json({ error: 'La verificación del captcha falló.' });
    }

    const datosAdmin = {
      ...req.body,
      TipoUsuario: 'administrador',
      Verificado: false
    };

    const nuevoAdministrador = new Usuarios(datosAdmin);
    await nuevoAdministrador.save();

    logger.info(`Administrador registrado: ${nuevoAdministrador.Nombre} (${nuevoAdministrador.Correo})`);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: nuevoAdministrador.Correo,
      subject: 'Bienvenido, Administrador',
      text: `Hola ${nuevoAdministrador.Nombre},\n\nHas sido registrado exitosamente como administrador en nuestro sistema.\n\nSaludos,\nEl equipo de la empresa`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Error al enviar correo al administrador: ${error.message}`);
      } else {
        logger.info(`Correo de bienvenida enviado a ${nuevoAdministrador.Correo}`);
      }
    });

    res.status(201).json({ message: 'Administrador registrado exitosamente' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.Correo) {
      return res.status(400).json({ error: 'El correo ya existe. Por favor, utilice otro correo.' });
    }
    logger.error(`Error en registroAdministrador: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const solicitarResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const mensajeGenerico = 'Si ese correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.';

    const usuario = await Usuarios.findOne({ Correo: email });
    if (!usuario) {
      logger.warn(`Solicitud de restablecimiento con correo no registrado: ${email}`);
      return res.status(200).json({ message: mensajeGenerico });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expiration = Date.now() + 3600000;

    usuario.resetToken = token;
    usuario.resetTokenExpires = expiration;
    await usuario.save();

    const resetUrl = `http://10.31.5.124:3000/reset-password/${usuario._id}/${token}`;

    const mailOptions = {
      from: '"Audit" <no-reply@tudominio.com>',
      to: usuario.Correo,
      subject: 'Restablecimiento de contraseña',
      html: `
        <h1>Restablece tu contraseña</h1>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${resetUrl}">Restablecer Contraseña</a>
        <p>Este enlace es válido por una hora.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Error al enviar correo de reset a ${usuario.Correo}: ${error.message}`);
      } else {
        logger.info(`Correo de restablecimiento enviado a ${usuario.Correo}`);
      }
    });

    return res.status(200).json({ message: mensajeGenerico });
  } catch (error) {
    logger.error(`Error en solicitarResetPassword: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const restablecerPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    const usuario = await Usuarios.findById(id);
    if (!usuario) {
      logger.warn(`Intento de restablecer contraseña de usuario no existente: ID ${id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.resetToken !== token || Date.now() > usuario.resetTokenExpires) {
      logger.warn(`Token inválido o expirado para usuario: ${usuario.Correo}`);
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    usuario.Contraseña = newPassword;
    usuario.resetToken = undefined;
    usuario.resetTokenExpires = undefined;

    await usuario.save();

    logger.info(`Contraseña restablecida exitosamente para usuario: ${usuario.Correo}`);
    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    logger.error(`Error en restablecerPassword: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  registroUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorNombre,
  cambiarPassword,
  searchUsuarios,
  registroAdministrador,
  restablecerPassword,
  solicitarResetPassword
};
