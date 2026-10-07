const db = require('../config/Conexion');

// Buscar usuario por su nombre de usuario
const buscarPorUsuario = async (usuario) => {
    const resultado = await db.query(
        'SELECT * FROM usuarios WHERE usuario = $1',
        [usuario]
    );

    return resultado.rows[0]; // Retornar el usuario encontrado
};


// Crear nuevo usuario
const crearUsuario = async (nombre, usuario, contrasena) => {
    const resultado = await db.query(
        `INSERT INTO usuarios (nombre, usuario, contrasena)
         VALUES ($1, $2, $3)
         RETURNING idusuario, nombre, usuario, rol`,
        [nombre, usuario, contrasena]
    );

    return resultado.rows[0]; // Retornar los datos del usuario creado
};

module.exports = {
    buscarPorUsuario,
    crearUsuario
};