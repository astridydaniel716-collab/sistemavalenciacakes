const ClienteModelo = require('../models/clientesModelo');


// Registrar cliente
const crearCliente = async (req, res) => {
    try {
        let { nombre, telefono, correo, direccion, observaciones } = req.body;

        // Validar campos obligatorios
        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del cliente es obligatorio'
            });
        }

        if (!telefono || !String(telefono).trim()) {
            return res.status(400).json({
                mensaje: 'El teléfono del cliente es obligatorio'
            });
        }

        // Validar longitud del teléfono
        if (String(telefono).trim().length > 16) {
            return res.status(400).json({
                mensaje: 'El teléfono no puede superar los 16 caracteres'
            });
        }

        // Limpiar espacios
        nombre = nombre.trim();
        telefono = telefono.trim();

        // Validar correo solo si se proporciona
        if (correo !== undefined && correo !== null && correo.trim() !== '') {
            correo = correo.trim();

            const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formatoCorreo.test(correo)) {
                return res.status(400).json({
                    mensaje: 'El formato del correo electrónico no es válido.'
                });
            }
        } else {
            correo = null;
        }

        // Normalizar campos opcionales
        direccion = direccion?.trim() || null;
        observaciones = observaciones?.trim() || null;
const duplicados = await ClienteModelo.verificarDuplicados(
    telefono,
    correo
);

if (duplicados.telefono_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe un cliente registrado con ese teléfono.'
    });
}

if (duplicados.correo_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe un cliente registrado con ese correo electrónico.'
    });
}
        const cliente = await ClienteModelo.crearCliente({
            nombre,
            telefono,
            correo,
            direccion,
            observaciones
        });

        return res.status(201).json({
            mensaje: 'Cliente registrado correctamente.',
            cliente
        });

    } catch (error) {
        console.error('Error al registrar cliente:', error);

        return res.status(500).json({
            mensaje: 'Error interno al registrar el cliente.'
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
        let { nombre, telefono, correo, direccion, observaciones } = req.body;

        // Validar identificador
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El identificador del cliente no es válido.'
            });
        }

        // Validar campos obligatorios
        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del cliente es obligatorio'
            });
        }

        if (!telefono || !String(telefono).trim()) {
            return res.status(400).json({
                mensaje: 'El teléfono del cliente es obligatorio'
            });
        }

        if (String(telefono).trim().length > 16) {
            return res.status(400).json({
                mensaje: 'El teléfono no puede superar los 16 caracteres'
            });
        }

        // Validar correo si se proporciona
        if (correo !== undefined && correo !== null && correo.trim() !== '') {
            correo = correo.trim();

            const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formatoCorreo.test(correo)) {
                return res.status(400).json({
                    mensaje: 'El formato del correo electrónico no es válido.'
                });
            }
        } else {
            correo = null;
        }

        direccion = direccion?.trim() || null;
        observaciones = observaciones?.trim() || null;

        const duplicados = await ClienteModelo.verificarDuplicados(
    telefono,
    correo,
    id
);

if (duplicados.telefono_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe otro cliente registrado con ese teléfono.'
    });
}

if (duplicados.correo_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe otro cliente registrado con ese correo electrónico.'
    });
}
        const cliente = await ClienteModelo.editarCliente(id, {
            nombre,
            telefono,
            correo,
            direccion,
            observaciones
        });

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado.'
            });
        }

        return res.status(200).json({
            mensaje: 'Cliente actualizado correctamente.',
            cliente
        });

    } catch (error) {
        console.error('Error al editar cliente:', error);

        return res.status(500).json({
            mensaje: 'Error interno al actualizar el cliente.'
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