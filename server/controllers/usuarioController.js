const Usuarios = require('../models/usuarioSchema');
const transporter = require('../emailconfig');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');

// Controlador para registrar un nuevo usuario
const registroUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuarios(req.body);
    await nuevoUsuario.save();

    // Enviar correo electrónico si el nuevo usuario es un auditor
    if (nuevoUsuario.TipoUsuario === 'auditor') {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: nuevoUsuario.Correo,
        subject: 'Bienvenido al equipo de auditores',
        text: `Hola ${nuevoUsuario.Nombre},\n\nBienvenido al equipo de auditores. Nos alegra tenerte con nosotros.\n\nSaludos,\nEl equipo de la empresa`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo electrónico enviado:', info.response);
        }
      });
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Controlador para obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.find();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener un usuario por su ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar un usuario por su ID
const actualizarUsuario = async (req, res) => {
  try {
    const updates = req.body;
    // Convertir FormaParteEquipoInocuidad a booleano
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
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener un usuario por su nombre
const obtenerUsuarioPorNombre = async (req, res) => {
  try {
    const nombreUsuario = req.params.nombre;
    const usuario = await Usuarios.findOne({ Nombre: nombreUsuario });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario por nombre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para eliminar un usuario por su ID
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuarios.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log('Aquiii', req.body)
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuarios.findByIdAndUpdate(req.params.id, { Contraseña: hashedPassword }, { new: true });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const searchUsuarios = async (req, res) => {
  try {
    const { search } = req.query;
    // Se valida que el término de búsqueda tenga al menos 3 caracteres
    if (!search || search.trim().length < 3) {
      return res.status(400).json({ error: 'Ingrese al menos 3 caracteres para buscar' });
    }
    
    // Se crea una expresión regular para realizar una búsqueda insensible a mayúsculas/minúsculas
    const regex = new RegExp(search, 'i');
    const usuarios = await Usuarios.find({ Nombre: regex }).limit(10);
    
    res.json(usuarios);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ error: 'Error en la búsqueda de usuarios' });
  }
};

const registroAdministrador = async (req, res) => {
  try {
    // 1. Extraer y validar el token del captcha
    const captchaToken = req.body.captchaToken;
    if (!captchaToken) {
      return res.status(400).json({ error: 'Por favor, completa el captcha.' });
    }
    
    // 2. Verificar el captcha con Google (de prueba)
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    
    const captchaResponse = await axios.post(verificationURL);
    if (!captchaResponse.data.success) {
      return res.status(400).json({ error: 'La verificación del captcha falló.' });
    }
    
    // 3. Continuar con el registro del administrador
    const datosAdmin = {
      ...req.body,
      TipoUsuario: 'administrador',
      Verificado: false
    };

    const nuevoAdministrador = new Usuarios(datosAdmin);
    await nuevoAdministrador.save();

    // Enviar correo electrónico de bienvenida al administrador
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: nuevoAdministrador.Correo,
      subject: 'Bienvenido, Administrador',
      text: `Hola ${nuevoAdministrador.Nombre},\n\nHas sido registrado exitosamente como administrador en nuestro sistema.\n\nSaludos,\nEl equipo de la empresa`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });

    res.status(201).json({ message: 'Administrador registrado exitosamente' });
  } catch (error) {
    // Si el error es por clave duplicada (correo ya registrado)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.Correo) {
      return res.status(400).json({ error: 'El correo ya existe. Por favor, utilice otro correo.' });
    }
    console.error('Error al registrar el administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const solicitarResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Mensaje genérico para no revelar si el usuario existe o no
    const mensajeGenerico = 'Si ese correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.';

    const usuario = await Usuarios.findOne({ Correo: email });
    if (!usuario) {
      // Responde con mensaje genérico
      return res.status(200).json({ message: mensajeGenerico });
    }

    // Genera token aleatorio y fecha de expiración (1 hora)
    const token = crypto.randomBytes(16).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hora en milisegundos

    // Guarda el token y su expiración en el documento del usuario
    usuario.resetToken = token;
    usuario.resetTokenExpires = expiration;
    await usuario.save();

    // Genera la URL de restablecimiento. Puedes enviarla con parámetros
    const resetUrl = `http://10.31.5.124:3000/reset-password/${usuario._id}/${token}`;

    // Define el contenido del correo
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

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo de restablecimiento:', error);
      } else {
        console.log('Correo de restablecimiento enviado:', info.messageId);
      }
    });

    return res.status(200).json({ message: mensajeGenerico });
  } catch (error) {
    console.error('Error en solicitarResetPassword:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const restablecerPassword = async (req, res) => {
  try {
    const { id, token } = req.params; // Se espera que la URL sea: /reset-password/:id/:token
    const { newPassword } = req.body;

    const usuario = await Usuarios.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que el token coincida y que no haya expirado
    if (usuario.resetToken !== token || Date.now() > usuario.resetTokenExpires) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    console.log('nueva contra: ', newPassword)

    usuario.Contraseña = newPassword;

    // Limpia los campos del token para que no se puedan reusar
    usuario.resetToken = undefined;
    usuario.resetTokenExpires = undefined;

    await usuario.save();
    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecerPassword:', error);
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