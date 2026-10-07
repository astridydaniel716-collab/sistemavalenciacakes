const express = require('express'); // Framework para crear las rutas
const router = express.Router();
const UsuarioControlador = require('../controllers/usuarioControlador'); // Controlador de usuarios
const verificarToken = require('../middleware/autenticacion'); // Middleware de autenticación

// registrar usuario
router.post('/registrar', UsuarioControlador.registrarUsuario);

// iniciar sesión
router.post('/login', UsuarioControlador.iniciarSesion);

// Ruta protegida: requiere un token válido
router.get('/perfil', verificarToken, (req, res) => {res.json({mensaje: 'Acceso autorizado',usuario: req.usuario});});

module.exports = router;