const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarioController');

// Ruta para el registro de usuarios (POST)
router.post('/', usuariosController.registroUsuario);

router.post('/registro', usuariosController.registroAdministrador);

// Ruta para obtener todos los usuarios (GET)
router.get('/', usuariosController.obtenerUsuarios);

router.get('/search', usuariosController.searchUsuarios);

// Ruta para obtener un usuario por su ID (GET)
router.get('/:id', usuariosController.obtenerUsuarioPorId);

// Ruta para actualizar un usuario por su ID (PUT)
router.put('/:id', usuariosController.actualizarUsuario);

// Ruta para eliminar un usuario por su ID (DELETE)
router.delete('/:id', usuariosController.eliminarUsuario);

router.get('/nombre/:nombre', usuariosController.obtenerUsuarioPorNombre);

router.put('/cambiarPassword/:id', usuariosController.cambiarPassword);

// Rutas para restablecimiento de contraseña
// 1. Endpoint para solicitar el reseteo
router.post('/reset-password-request', usuariosController.solicitarResetPassword);

// 2. Endpoint para restablecer la contraseña. Se envían el ID y token en la URL.
router.post('/reset-password/:id/:token', usuariosController.restablecerPassword);

module.exports = router;
