const express = require('express');
const router = express.Router();

const UsuarioControlador = require('../controllers/usuarioControlador');
const verificarToken = require('../middleware/autenticacion');

router.post('/registrar', UsuarioControlador.registrarUsuario);

router.post('/login', UsuarioControlador.iniciarSesion);

router.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
    });
});

module.exports = router;