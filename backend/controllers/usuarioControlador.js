const bcrypt = require('bcrypt');
const UsuarioModelo = require('../models/usuarioModelo');
const jwt = require('jsonwebtoken');
const Config = require('../config/Config');

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, usuario, contrasena } = req.body;

        if (!nombre || !usuario || !contrasena) {
            return res.status(400).json({
                mensaje: 'Nombre, usuario y contraseña son obligatorios'
            });
        }

        const usuarioExistente = await UsuarioModelo.buscarPorUsuario(usuario);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'El nombre de usuario ya existe'
            });
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

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

const iniciarSesion = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        if (!usuario || !contrasena) {
            return res.status(400).json({
                mensaje: 'El usuario y la contraseña son obligatorios'
            });
        }

        const usuarioEncontrado = await UsuarioModelo.buscarPorUsuario(usuario);

        if (!usuarioEncontrado) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuarioEncontrado.contrasena
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

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