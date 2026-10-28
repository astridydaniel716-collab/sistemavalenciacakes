const ProductoModelo = require('../models/productosModelo');

const ProductoControlador = {

    // Crear producto
    async crearProducto(req, res) {
        try {
            let {
                nombre,
                categoria,
                tipo_crema,
                porciones,
                precio_base
            } = req.body;

            // Validar campos obligatorios
            if (!nombre || !String(nombre).trim()) {
                return res.status(400).json({
                    mensaje: 'El nombre del producto es obligatorio.'
                });
            }

            if (!categoria || !String(categoria).trim()) {
                return res.status(400).json({
                    mensaje: 'La categoría del producto es obligatoria.'
                });
            }

            if (!tipo_crema || !String(tipo_crema).trim()) {
                return res.status(400).json({
                    mensaje: 'El tipo de crema es obligatorio.'
                });
            }

            if (!porciones || !String(porciones).trim()) {
                return res.status(400).json({
                    mensaje: 'Las porciones del producto son obligatorias.'
                });
            }

            // Validar precio
            if (
                precio_base === undefined ||
                precio_base === null ||
                String(precio_base).trim() === ''
            ) {
                return res.status(400).json({
                    mensaje: 'El precio base del producto es obligatorio.'
                });
            }

            const precio = Number(precio_base);

                if (!Number.isFinite(precio) || !Number.isInteger(precio) || precio <= 0){
                return res.status(400).json({
                mensaje: 'El precio base debe ser un número entero mayor que cero.'
            });
            }

            // Limpiar espacios
            nombre = String(nombre).trim();
            categoria = String(categoria).trim();
            tipo_crema = String(tipo_crema).trim();
            porciones = String(porciones).trim();
            precio_base = precio;

            const producto = await ProductoModelo.crearProducto({
                nombre,
                categoria,
                tipo_crema,
                porciones,
                precio_base
            });

            return res.status(201).json({
                mensaje: 'Producto registrado correctamente.',
                producto
            });

        } catch (error) {
            console.error('Error al registrar producto:', error);

            return res.status(500).json({
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

     // Editar producto
    async editarProducto(req, res) {
        try {
            let {
                nombre,
                categoria,
                tipo_crema,
                porciones,
                precio_base
            } = req.body;

            // Validar identificador
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador del producto no es válido.'
                });
            }

            // Validar campos obligatorios
            if (!nombre || !String(nombre).trim()) {
                return res.status(400).json({
                    mensaje: 'El nombre del producto es obligatorio.'
                });
            }

            if (!categoria || !String(categoria).trim()) {
                return res.status(400).json({
                    mensaje: 'La categoría del producto es obligatoria.'
                });
            }

            if (!tipo_crema || !String(tipo_crema).trim()) {
                return res.status(400).json({
                    mensaje: 'El tipo de crema es obligatorio.'
                });
            }

            if (!porciones || !String(porciones).trim()) {
                return res.status(400).json({
                    mensaje: 'Las porciones del producto son obligatorias.'
                });
            }

            // Validar precio
            if (
                precio_base === undefined ||
                precio_base === null ||
                String(precio_base).trim() === ''
            ) {
                return res.status(400).json({
                    mensaje: 'El precio base del producto es obligatorio.'
                });
            }

            const precio = Number(precio_base);
                if (
                !Number.isFinite(precio) ||!Number.isInteger(precio) || precio <= 0){
                return res.status(400).json({
                mensaje: 'El precio base debe ser un número entero mayor que cero.'
            });
            }

            // Limpiar espacios
            nombre = String(nombre).trim();
            categoria = String(categoria).trim();
            tipo_crema = String(tipo_crema).trim();
            porciones = String(porciones).trim();
            precio_base = precio;

            const producto = await ProductoModelo.editarProducto(id, {
                nombre,
                categoria,
                tipo_crema,
                porciones,
                precio_base
            });

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado.'
                });
            }

            return res.status(200).json({
                mensaje: 'Producto actualizado correctamente.',
                producto
            });

        } catch (error) {
            console.error('Error al actualizar producto:', error);

            return res.status(500).json({
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