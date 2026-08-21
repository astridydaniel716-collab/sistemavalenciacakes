const db = require('../config/conexion');

const buscarPorUsuario = async (usuario) => {
    const resultado = await db.query(
        'SELECT * FROM usuarios WHERE usuario = $1',
        [usuario]
    );

    return resultado.rows[0];
};

const crearUsuario = async (nombre, usuario, contrasena) => {
    const resultado = await db.query(
        `INSERT INTO usuarios (nombre, usuario, contrasena)
         VALUES ($1, $2, $3)
         RETURNING idusuario, nombre, usuario, rol`,
        [nombre, usuario, contrasena]
    );

    return resultado.rows[0];
};

module.exports = {
    buscarPorUsuario,
    crearUsuario
};