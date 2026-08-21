const Conexion = require('../config/Conexion');


// Registrar cliente
const crearCliente = async (cliente) => {
    const { nombre, telefono, correo, direccion, observaciones } = cliente;

    const resultado = await Conexion.query(
        `INSERT INTO clientes
        (nombre, telefono, correo, direccion, observaciones)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [nombre, telefono, correo, direccion, observaciones]
    );

    return resultado.rows[0];
};


// Obtener todos los clientes
const obtenerClientes = async () => {

    const resultado = await Conexion.query(
        `SELECT *
         FROM clientes
         ORDER BY idcliente ASC`
    );

    return resultado.rows;
};


// Obtener cliente por ID
const obtenerClientePorId = async (id) => {

    const resultado = await Conexion.query(
        `SELECT *
         FROM clientes
         WHERE idcliente = $1`,
        [id]
    );

    return resultado.rows[0];
};


// Buscar clientes
const buscarClientes = async (termino) => {

    const resultado = await Conexion.query(
        `SELECT *
         FROM clientes
         WHERE nombre ILIKE $1
            OR telefono ILIKE $1
            ORDER BY idcliente ASC`,
        [`%${termino}%`]
    );

    return resultado.rows;
};


// Editar cliente
const editarCliente = async (id, cliente) => {

    const {
        nombre,
        telefono,
        correo,
        direccion,
        observaciones
    } = cliente;

    const resultado = await Conexion.query(
        `UPDATE clientes
         SET nombre = $1,
             telefono = $2,
             correo = $3,
             direccion = $4,
             observaciones = $5
         WHERE idcliente = $6
         RETURNING *`,
        [
            nombre,
            telefono,
            correo,
            direccion,
            observaciones,
            id
        ]
    );

    return resultado.rows[0];
};


// Eliminar cliente
const eliminarCliente = async (id) => {

    const resultado = await Conexion.query(
        `DELETE FROM clientes
         WHERE idcliente = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0];
};


module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    buscarClientes,
    editarCliente,
    eliminarCliente
};