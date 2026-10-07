const jwt = require('jsonwebtoken'); 
const Config = require('../config/Config'); 

// Middleware para verificar el token de autenticación
const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Verificar que se haya enviado el token
        if (!authHeader) {
            return res.status(401).json({
                mensaje: 'Token de autenticación requerido'
            });
        }

        const partes = authHeader.split(' ');

        // Validar el formato Bearer Token
        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            return res.status(401).json({
                mensaje: 'Formato de token inválido'
            });
        }

        const token = partes[1];

        // Verificar que el token sea válido
        const usuario = jwt.verify(token, Config.JWT_SECRET);

        // Guardar los datos del usuario en la solicitud
        req.usuario = usuario;

        // Continuar con la siguiente función
        next();

    } catch (error) {
        console.error('Error al verificar token:', error.message);

        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

module.exports = verificarToken;