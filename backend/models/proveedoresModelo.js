const Conexion = require('../config/Conexion');


// Registrar proveedor
const crearProveedor = async (proveedor) => {
    const { nombre, telefono, correo, direccion, productos_suministrados, observaciones } = proveedor;

    const resultado = await Conexion.query(
        `INSERT INTO proveedores
        (nombre, telefono, correo, direccion, productos_suministrados, observaciones)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [nombre, telefono, correo, direccion, productos_suministrados, observaciones]
    );

    return resultado.rows[0];
};


// Obtener todos los proveedores
const obtenerProveedores = async () => {

    const resultado = await Conexion.query(
        `SELECT *
         FROM proveedores
         ORDER BY idproveedor ASC`
    );

    return resultado.rows;
};


// Obtener proveedor por ID
const obtenerProveedorPorId = async (id) => {

    const resultado = await Conexion.query(
        `SELECT *
         FROM proveedores
         WHERE idproveedor = $1`,
        [id]
    );

    return resultado.rows[0];
};


// Buscar proveedores
const buscarProveedores = async (termino) => {

    const resultado = await Conexion.query(
        `SELECT *
         FROM proveedores
         WHERE nombre ILIKE $1
            OR telefono ILIKE $1
            ORDER BY idproveedor ASC`,
        [`%${termino}%`]
    );

    return resultado.rows;
};


// Editar proveedor
const editarProveedor = async (id, proveedor) => {

    const {
        nombre,
        telefono,
        correo,
        direccion,
        productos_suministrados,
        observaciones
    } = proveedor;

    const resultado = await Conexion.query(
        `UPDATE proveedores
         SET nombre = $1,
             telefono = $2,
             correo = $3,
             direccion = $4,
             productos_suministrados = $5,
             observaciones = $6
         WHERE idproveedor = $7
         RETURNING *`,
        [
            nombre,
            telefono,
            correo,
            direccion,
            productos_suministrados,
            observaciones,
            id
        ]
    );

    return resultado.rows[0];
};


// Eliminar proveedor
const eliminarProveedor = async (id) => {

    const resultado = await Conexion.query(
        `DELETE FROM proveedores
         WHERE idproveedor = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0];
};


module.exports = {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedorPorId,
    buscarProveedores,
    editarProveedor,
    eliminarProveedor
};