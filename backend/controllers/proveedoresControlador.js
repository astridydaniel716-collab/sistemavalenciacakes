const ProveedorModelo = require('../models/proveedoresModelo');


// Registrar proveedor
const crearProveedor = async (req, res) => {

    try {

        const proveedor = await ProveedorModelo.crearProveedor(req.body);

        res.status(201).json({
            mensaje: 'Proveedor registrado correctamente',
            proveedor
        });

    } catch (error) {

        console.error('Error al registrar proveedor:', error);

        res.status(500).json({
            mensaje: 'Error al registrar el proveedor'
        });
    }
};


// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {

    try {

        const proveedores = await ProveedorModelo.obtenerProveedores();

        res.status(200).json(proveedores);

    } catch (error) {

        console.error('Error al obtener los proveedores:', error);

        res.status(500).json({
            mensaje: 'Error al obtener los proveedores'
        });
    }
};


// Obtener proveedor por ID
const obtenerProveedorPorId = async (req, res) => {

    try {

        const proveedor = await ProveedorModelo.obtenerProveedorPorId(
            req.params.id
        );

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json(proveedor);

    } catch (error) {

        console.error('Error al obtener proveedor:', error);

        res.status(500).json({
            mensaje: 'Error al obtener el proveedor'
        });
    }
};


// Buscar proveedores
const buscarProveedores = async (req, res) => {

    try {

        const { termino } = req.query;

        if (!termino || termino.trim() === '') {
            return res.status(400).json({
                mensaje: 'Debe ingresar un término de búsqueda'
            });
        }

        const proveedores = await ProveedorModelo.buscarProveedores(
            termino.trim()
        );

        res.status(200).json(proveedores);

    } catch (error) {

        console.error('Error al buscar proveedores:', error);

        res.status(500).json({
            mensaje: 'Error al buscar proveedores'
        });
    }
};


// Editar proveedor
const editarProveedor = async (req, res) => {

    try {

        const proveedor = await ProveedorModelo.editarProveedor(
            req.params.id,
            req.body
        );

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Proveedor actualizado correctamente',
            proveedor
        });

    } catch (error) {

        console.error('Error al editar proveedor:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar el proveedor'
        });
    }
};


// Eliminar proveedor
const eliminarProveedor = async (req, res) => {

    try {

        const proveedor = await ProveedorModelo.eliminarProveedor(
            req.params.id
        );

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Proveedor eliminado correctamente',
            proveedor
        });

    } catch (error) {

        console.error('Error al eliminar proveedor:', error);

        res.status(500).json({
            mensaje: 'Error al eliminar el proveedor'
        });
    }
};


module.exports = {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedorPorId,
    buscarProveedores,
    editarProveedor,
    eliminarProveedor
};