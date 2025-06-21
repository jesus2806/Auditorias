const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Ruta para el inicio de sesión
router.post('/login', loginController.iniciarSesion);
router.post('/verificar', loginController.verificarCodigo);

module.exports = router;
