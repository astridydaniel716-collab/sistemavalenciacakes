// Simular el modelo de usuarios para no utilizar la base de datos real
jest.mock('../models/usuarioModelo', () => ({
    buscarPorUsuario: jest.fn(),
    crearUsuario: jest.fn()
}));

// Simular bcrypt para no realizar una comparación real de contraseñas
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

// Importar el controlador después de simular el modelo
const UsuarioControlador = require('../controllers/usuarioControlador');

// Crear una respuesta simulada
const crearRespuesta = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Pruebas de autenticación', () => {

    // B-AUTH-01: Validar campos obligatorios
    test('registrar usuario rechaza campos obligatorios vacíos', async () => {

        const req = {
    usuario: {
        rol: 'Administrador'
    },
    body: {
        nombre: '',
        usuario: '',
        contrasena: ''
    }
};

        const res = crearRespuesta();

        // Ejecutar el registro con campos vacíos
        await UsuarioControlador.registrarUsuario(req, res);

        // Verificar que responda con código 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Verificar el mensaje esperado
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Nombre, usuario y contraseña son obligatorios'
        });
    });
});

// B-AUTH-02: Rechazar usuario existente
test('registrar usuario rechaza un nombre de usuario ya existente', async () => {

    // Simular que el usuario ya existe en la base de datos
    const UsuarioModelo = require('../models/usuarioModelo');

    UsuarioModelo.buscarPorUsuario.mockResolvedValue({
        idusuario: 1,
        nombre: 'Astrid',
        usuario: 'astrid'
    });

    const req = {
    usuario: {
        rol: 'Administrador'
    },
    body: {
        nombre: 'Otra Persona',
        usuario: 'astrid',
        contrasena: '123456'
    }
};

    const res = crearRespuesta();

    // Ejecutar el registro
    await UsuarioControlador.registrarUsuario(req, res);

    // Verificar código de respuesta
    expect(res.status).toHaveBeenCalledWith(409);

    // Verificar mensaje
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'El nombre de usuario ya existe'
    });
});

// B-AUTH-03: Rechazar contraseña incorrecta
test('iniciar sesión rechaza una contraseña incorrecta', async () => {

    const UsuarioModelo = require('../models/usuarioModelo');
    const bcrypt = require('bcrypt');

    // Simular que el usuario existe
    UsuarioModelo.buscarPorUsuario.mockResolvedValue({
        idusuario: 1,
        nombre: 'Astrid',
        usuario: 'astrid',
        contrasena: 'contraseña-encriptada'
    });

    // Simular que la contraseña ingresada no coincide
    bcrypt.compare.mockResolvedValue(false);

    const req = {
        body: {
            usuario: 'astrid',
            contrasena: 'contraseña-incorrecta'
        }
    };

    const res = crearRespuesta();

    // Ejecutar el inicio de sesión
    await UsuarioControlador.iniciarSesion(req, res);

    // Verificar código de respuesta
    expect(res.status).toHaveBeenCalledWith(401);

    // Verificar mensaje
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Usuario o contraseña incorrectos'
    });
});

// B-AUTH-04: Inicio de sesión válido y generación del JWT
test('iniciar sesión correctamente genera un token JWT', async () => {

    const UsuarioModelo = require('../models/usuarioModelo');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    // Simular usuario existente
    UsuarioModelo.buscarPorUsuario.mockResolvedValue({
        idusuario: 1,
        nombre: 'Astrid',
        usuario: 'astrid',
        rol: 'Administrador',
        contrasena: 'contraseña-encriptada'
    });

    // Simular contraseña correcta
    bcrypt.compare.mockResolvedValue(true);

    // Simular generación del token
    jwt.sign.mockReturnValue('token-prueba');

    const req = {
        body: {
            usuario: 'astrid',
            contrasena: 'contraseña-correcta'
        }
    };

    const res = crearRespuesta();

    // Ejecutar el inicio de sesión
    await UsuarioControlador.iniciarSesion(req, res);

    // Verificar que se generó el token
    expect(jwt.sign).toHaveBeenCalled();

    // Verificar respuesta exitosa
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Inicio de sesión exitoso',
        token: 'token-prueba',
        usuario: {
            idusuario: 1,
            nombre: 'Astrid',
            usuario: 'astrid',
            rol: 'Administrador'
        }
    });
}); 