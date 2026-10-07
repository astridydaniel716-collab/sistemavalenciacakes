const ProductoModelo = require('../models/productosModelo');

const ProductoControlador = {

    // Crear
    async crearProducto(req, res) {

        try {

            const {
                nombre,
                categoria,
                tipo_crema,
                porciones,
                precio_base
            } = req.body;

            if (!nombre || !categoria || !tipo_crema || !porciones || !precio_base) {
                return res.status(400).json({
                    mensaje: 'Todos los campos obligatorios deben estar completos.'
                });
            }

            const producto = await ProductoModelo.crearProducto({
                nombre,
                categoria,
                tipo_crema,
                porciones,
                precio_base
            });

            res.status(201).json({
                mensaje: 'Producto registrado correctamente.',
                producto
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: 'Error al registrar el producto.'
            });

        }

    },

    // Obtener todos
    async obtenerProductos(req, res) {

        try {

            const productos = await ProductoModelo.obtenerProductos();

            res.json(productos);

        } catch (error) {

            res.status(500).json({
                mensaje: 'Error al obtener los productos.'
            });

        }

    },

    // Buscar
    async buscarProductos(req, res) {

        try {

            const { termino } = req.query;

            if (!termino) {

                const productos = await ProductoModelo.obtenerProductos();

                return res.json(productos);

            }

            const productos = await ProductoModelo.buscarProductos(termino);

            res.json(productos);

        } catch (error) {

            res.status(500).json({
                mensaje: 'Error al buscar productos.'
            });

        }

    },

    // Obtener por ID
    async obtenerProductoPorId(req, res) {

        try {

            const producto = await ProductoModelo.obtenerProductoPorId(req.params.id);

            if (!producto) {

                return res.status(404).json({
                    mensaje: 'Producto no encontrado.'
                });

            }

            res.json(producto);

        } catch (error) {

            res.status(500).json({
                mensaje: 'Error al obtener el producto.'
            });

        }

    },

    // Editar
    async editarProducto(req, res) {

        try {

            const producto = await ProductoModelo.editarProducto(
                req.params.id,
                req.body
            );

            if (!producto) {

                return res.status(404).json({
                    mensaje: 'Producto no encontrado.'
                });

            }

            res.json({
                mensaje: 'Producto actualizado correctamente.',
                producto
            });

        } catch (error) {

            res.status(500).json({
                mensaje: 'Error al actualizar el producto.'
            });

        }

    },

    // Eliminar
    async eliminarProducto(req, res) {

        try {

            const producto = await ProductoModelo.eliminarProducto(req.params.id);

            if (!producto) {

                return res.status(404).json({
                    mensaje: 'Producto no encontrado.'
                });

            }

            res.json({
                mensaje: 'Producto eliminado correctamente.'
            });

        } catch (error) {

            res.status(500).json({
                mensaje: 'Error al eliminar el producto.'
            });

        }

    }

};

module.exports = ProductoControlador;