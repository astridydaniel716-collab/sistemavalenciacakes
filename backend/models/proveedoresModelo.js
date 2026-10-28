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
             productos_suministrados = COALESCE($5, productos_suministrados),
             observaciones = $6
         WHERE idproveedor = $7
         RETURNING *`,
        [
            nombre,
            telefono,
            correo,
            direccion,
            productos_suministrados ?? null,
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

// Verificar si el teléfono o correo ya existen entre los proveedores
const verificarDuplicados = async (telefono, correo, idExcluir = null) => {
    const resultado = await Conexion.query(
        `SELECT
            EXISTS (
                SELECT 1
                FROM proveedores
                WHERE telefono = $1
                  AND ($3::integer IS NULL OR idproveedor <> $3)
            ) AS telefono_duplicado,
            EXISTS (
                SELECT 1
                FROM proveedores
                WHERE correo IS NOT NULL
                  AND LOWER(TRIM(correo)) = LOWER(TRIM($2))
                  AND TRIM($2) <> ''
                  AND ($3::integer IS NULL OR idproveedor <> $3)
            ) AS correo_duplicado`,
        [telefono, correo || '', idExcluir]
    );

    return resultado.rows[0];
};

module.exports = {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedorPorId,
    buscarProveedores,
    editarProveedor,
    eliminarProveedor,
    verificarDuplicados
};