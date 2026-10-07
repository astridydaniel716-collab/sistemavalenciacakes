const ClienteModelo = require('../models/clientesModelo');


// Registrar cliente
const crearCliente = async (req, res) => {

    try {

        const cliente = await ClienteModelo.crearCliente(req.body);

        res.status(201).json({
            mensaje: 'Cliente registrado correctamente',
            cliente
        });

    } catch (error) {

        console.error('Error al registrar cliente:', error);

        res.status(500).json({
            mensaje: 'Error al registrar el cliente'
        });
    }
};


// Obtener todos los clientes
const obtenerClientes = async (req, res) => {

    try {

        const clientes = await ClienteModelo.obtenerClientes();

        res.status(200).json(clientes);

    } catch (error) {

        console.error('Error al obtener clientes:', error);

        res.status(500).json({
            mensaje: 'Error al obtener los clientes'
        });
    }
};


// Obtener cliente por ID
const obtenerClientePorId = async (req, res) => {

    try {

        const cliente = await ClienteModelo.obtenerClientePorId(
            req.params.id
        );

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.status(200).json(cliente);

    } catch (error) {

        console.error('Error al obtener cliente:', error);

        res.status(500).json({
            mensaje: 'Error al obtener el cliente'
        });
    }
};


// Buscar clientes
const buscarClientes = async (req, res) => {

    try {

        const { termino } = req.query;

        if (!termino || termino.trim() === '') {
            return res.status(400).json({
                mensaje: 'Debe ingresar un término de búsqueda'
            });
        }

        const clientes = await ClienteModelo.buscarClientes(
            termino.trim()
        );

        res.status(200).json(clientes);

    } catch (error) {

        console.error('Error al buscar clientes:', error);

        res.status(500).json({
            mensaje: 'Error al buscar clientes'
        });
    }
};


// Editar cliente
const editarCliente = async (req, res) => {

    try {

        const cliente = await ClienteModelo.editarCliente(
            req.params.id,
            req.body
        );

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Cliente actualizado correctamente',
            cliente
        });

    } catch (error) {

        console.error('Error al editar cliente:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar el cliente'
        });
    }
};

// Obtener historial de pedidos de un cliente
const obtenerHistorialPedidos = async (req, res) => {

    try {

        const idcliente = req.params.id;

        const historial = await ClienteModelo.obtenerHistorialPedidos(
            idcliente
        );

        res.status(200).json(historial);

    } catch (error) {

        console.error(
            "Error al obtener historial de pedidos:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener el historial de pedidos del cliente."
        });
    }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {

    try {

        const cliente = await ClienteModelo.eliminarCliente(
            req.params.id
        );

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Cliente eliminado correctamente',
            cliente
        });

    } catch (error) {

        console.error('Error al eliminar cliente:', error);

        res.status(500).json({
            mensaje: 'Error al eliminar el cliente'
        });
    }
};


module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    buscarClientes,
    editarCliente,
    obtenerHistorialPedidos,
    eliminarCliente
};