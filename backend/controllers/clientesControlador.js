const ClienteModelo = require('../models/clientesModelo');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Registrar cliente

const crearCliente = async (req, res) => {
    try {
        let { nombre, telefono, correo, direccion, observaciones } = req.body;

        // Validar nombre
        if (typeof nombre !== 'string' || !nombre.trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del cliente es obligatorio y debe ser un texto válido.'
            });
        }
if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(nombre)) {
    return res.status(400).json({
        mensaje: "El nombre debe contener al menos una letra."
    });
}
        nombre = nombre.trim();

        // Validar teléfono
        if (typeof telefono !== 'string' || !telefono.trim()) {
            return res.status(400).json({
                mensaje: 'El teléfono del cliente es obligatorio y debe ser un texto válido.'
            });
        }

        telefono = telefono.trim();

        // Verificar que incluya el código del país
        if (!telefono.startsWith('+')) {
            return res.status(400).json({
                mensaje: 'El teléfono debe incluir el código del país. Ejemplo: +573001234567.'
            });
        }

        // Contar los dígitos sin incluir el signo +
        const soloDigitos = telefono.replace(/\D/g, '');

        if (soloDigitos.length > 15) {
            return res.status(400).json({
                mensaje: 'El teléfono no puede superar los 15 dígitos, sin contar el signo +.'
            });
        }

        // Validar número internacional
        const telefonoValidado = parsePhoneNumberFromString(telefono);

        if (!telefonoValidado || !telefonoValidado.isValid()) {
            return res.status(400).json({
                mensaje: 'El número de teléfono no es válido. Verifica el código del país y el número.'
            });
        }

        // Guardar teléfono normalizado en formato E.164
        telefono = telefonoValidado.number;

        // Validar correo solo si se proporciona
        if (correo !== undefined && correo !== null) {
            if (typeof correo !== 'string') {
                return res.status(400).json({
                    mensaje: 'El correo electrónico debe ser un texto válido.'
                });
            }

            correo = correo.trim();

            if (correo !== '') {
                const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!formatoCorreo.test(correo)) {
                    return res.status(400).json({
                        mensaje: 'El formato del correo electrónico no es válido.'
                    });
                }
            } else {
                correo = null;
            }
        } else {
            correo = null;
        }

        // Validar dirección
        if (direccion !== undefined && direccion !== null) {
            if (typeof direccion !== 'string') {
                return res.status(400).json({
                    mensaje: 'La dirección debe ser un texto válido.'
                });
            }

            direccion = direccion.trim() || null;
        } else {
            direccion = null;
        }

        // Validar observaciones
        if (observaciones !== undefined && observaciones !== null) {
            if (typeof observaciones !== 'string') {
                return res.status(400).json({
                    mensaje: 'Las observaciones deben ser un texto válido.'
                });
            }

            observaciones = observaciones.trim() || null;
        } else {
            observaciones = null;
        }

        // Verificar duplicados
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

        // Registrar cliente
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
        if (typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({
        mensaje: 'El nombre del cliente es obligatorio y debe ser un texto válido.'
    });
}
if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(nombre)) {
    return res.status(400).json({
        mensaje: "El nombre debe contener al menos una letra."
    });
}
nombre = nombre.trim();

        // Validar teléfono
if (typeof telefono !== 'string' || !telefono.trim()) {
    return res.status(400).json({
        mensaje: 'El teléfono del cliente es obligatorio y debe ser un texto válido.'
    });
}

telefono = telefono.trim();

// Verificar que incluya el código del país
        if (!telefono.startsWith('+')) {
            return res.status(400).json({
                mensaje: 'El teléfono debe incluir el código del país. Ejemplo: +573001234567.'
            });
        }

        // Contar los dígitos sin incluir el signo +
        const soloDigitos = telefono.replace(/\D/g, '');

        if (soloDigitos.length > 15) {
            return res.status(400).json({
                mensaje: 'El teléfono no puede superar los 15 dígitos, sin contar el signo +.'
            });
        }

        // Validar número internacional
        const telefonoValidado = parsePhoneNumberFromString(telefono);

        if (!telefonoValidado || !telefonoValidado.isValid()) {
            return res.status(400).json({
                mensaje: 'El número de teléfono no es válido. Verifica el código del país y el número.'
            });
        }

        // Guardar teléfono normalizado en formato E.164
        telefono = telefonoValidado.number;

        // Validar correo solo si se proporciona
        if (correo !== undefined && correo !== null) {
            if (typeof correo !== 'string') {
                return res.status(400).json({
                    mensaje: 'El correo electrónico debe ser un texto válido.'
                });
            }

            correo = correo.trim();

            if (correo !== '') {
                const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!formatoCorreo.test(correo)) {
                    return res.status(400).json({
                        mensaje: 'El formato del correo electrónico no es válido.'
                    });
                }
            } else {
                correo = null;
            }
        } else {
            correo = null;
        }

       if (direccion !== undefined && direccion !== null) {
    if (typeof direccion !== 'string') {
        return res.status(400).json({
            mensaje: 'La dirección debe ser un texto válido.'
        });
    }

    direccion = direccion.trim() || null;
} else {
    direccion = null;
}
//validar observaciones
if (observaciones !== undefined && observaciones !== null) {
    if (typeof observaciones !== 'string') {
        return res.status(400).json({
            mensaje: 'Las observaciones deben ser un texto válido.'
        });
    }

    observaciones = observaciones.trim() || null;
} else {
    observaciones = null;
}
//verificar duplicados
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
//editar cliente      
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