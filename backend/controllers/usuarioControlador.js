const bcrypt = require('bcrypt'); // Encripta y compara contraseñas
const UsuarioModelo = require('../models/usuarioModelo'); // Modelo de usuarios
const jwt = require('jsonwebtoken'); // Genera tokens de autenticación
const Config = require('../config/Config'); // Configuración del sistema

// Registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    try {
        if (req.usuario?.rol !== 'Administrador') {
    return res.status(403).json({
        mensaje: 'No tienes permisos para registrar usuarios'
    });
}
        const { nombre, usuario, contrasena } = req.body;

        // Validar campos obligatorios
        if (!nombre || !usuario || !contrasena) {
            return res.status(400).json({
                mensaje: 'Nombre, usuario y contraseña son obligatorios'
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await UsuarioModelo.buscarPorUsuario(usuario);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'El nombre de usuario ya existe'
            });
        }

        // Encriptar la contraseña
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        // Crear usuario con rol de administrador
        const nuevoUsuario = await UsuarioModelo.crearUsuario(
            nombre,
            usuario,
            contrasenaEncriptada,
            'Administrador'
        );

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            usuario: nuevoUsuario
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};


// Iniciar sesión
const iniciarSesion = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Validar credenciales
        if (!usuario || !contrasena) {
            return res.status(400).json({
                mensaje: 'El usuario y la contraseña son obligatorios'
            });
        }

        // Buscar usuario en la base de datos
        const usuarioEncontrado = await UsuarioModelo.buscarPorUsuario(usuario);

        if (!usuarioEncontrado) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

        // Comparar contraseña ingresada con la encriptada
        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuarioEncontrado.contrasena
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                idusuario: usuarioEncontrado.idusuario,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol
            },
            Config.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,

            // Datos del usuario autenticado
            usuario: {
                idusuario: usuarioEncontrado.idusuario,
                nombre: usuarioEncontrado.nombre,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};