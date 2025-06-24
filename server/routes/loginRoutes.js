const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Ruta para el inicio de sesión (sin verificación)
router.post('/login', loginController.iniciarSesion);

module.exports = router;
