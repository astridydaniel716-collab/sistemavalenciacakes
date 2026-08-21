const jwt = require('jsonwebtoken');
const Config = require('../config/Config');

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: 'Token de autenticación requerido'
            });
        }

        const partes = authHeader.split(' ');

        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            return res.status(401).json({
                mensaje: 'Formato de token inválido'
            });
        }

        const token = partes[1];

        const usuario = jwt.verify(token, Config.JWT_SECRET);

        req.usuario = usuario;

        next();

    } catch (error) {
        console.error('Error al verificar token:', error.message);

        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

module.exports = verificarToken;