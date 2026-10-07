const Conexion = require('../config/Conexion');

const ProductoModelo = {

    // Crear producto
    async crearProducto(data) {

        const sql = `
            INSERT INTO productos
            (nombre, categoria, tipo_crema, porciones, precio_base)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
        `;

        const valores = [
            data.nombre,
            data.categoria,
            data.tipo_crema,
            data.porciones,
            data.precio_base    
        ];

        const resultado = await Conexion.query(sql, valores);

        return resultado.rows[0];
    },

    // Obtener todos
    async obtenerProductos() {

        const sql = `
            SELECT *
            FROM productos
            ORDER BY categoria, nombre, tipo_crema, porciones;
        `;

        const resultado = await Conexion.query(sql);

        return resultado.rows;
    },

    // Buscar
    async buscarProductos(termino) {

        const sql = `
            SELECT *
            FROM productos
            WHERE nombre ILIKE $1
               OR categoria ILIKE $1
               OR tipo_crema ILIKE $1
               OR porciones ILIKE $1
            ORDER BY categoria, nombre;
        `;

        const resultado = await Conexion.query(sql, [`%${termino}%`]);

        return resultado.rows;
    },

    // Obtener por ID
    async obtenerProductoPorId(id) {

        const sql = `
            SELECT *
            FROM productos
            WHERE idproducto = $1;
        `;

        const resultado = await Conexion.query(sql, [id]);

        return resultado.rows[0];
    },

    // Editar
    async editarProducto(id, data) {

        const sql = `
            UPDATE productos
            SET nombre=$1,
                categoria=$2,
                tipo_crema=$3,
                porciones=$4,
                precio_base=$5
            WHERE idproducto=$6
            RETURNING *;
        `;

        const valores = [
            data.nombre,
            data.categoria,
            data.tipo_crema,
            data.porciones,
            data.precio_base,
            id
        ];

        const resultado = await Conexion.query(sql, valores);

        return resultado.rows[0];
    },

    // Eliminar
    async eliminarProducto(id) {

        const sql = `
            DELETE FROM productos
            WHERE idproducto=$1
            RETURNING *;
        `;

        const resultado = await Conexion.query(sql, [id]);

        return resultado.rows[0];
    }

};

module.exports = ProductoModelo;