const PedidoModelo = require('../models/pedidosModelo');

const PedidoControlador = {

    //crear pedido
async crearPedido(req, res) {
    try {
        const {
            idcliente,
            fecha_entrega,
            hora_entrega,
            tipo_entrega,
            direccion_entrega,
            observaciones,
            anticipo
        } = req.body;

        // Validar cliente
        const clienteId = Number(idcliente);

        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            return res.status(400).json({
                mensaje: "Debe seleccionar un cliente válido."
            });
        }

        // Validar fecha real en formato YYYY-MM-DD
        const fechaValida =
            typeof fecha_entrega === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(fecha_entrega) &&
            (() => {
                const [anio, mes, dia] = fecha_entrega
                    .split("-")
                    .map(Number);

                const fecha = new Date(Date.UTC(anio, mes - 1, dia));

                return fecha.getUTCFullYear() === anio &&
                    fecha.getUTCMonth() === mes - 1 &&
                    fecha.getUTCDate() === dia;
            })();

        if (!fechaValida) {
            return res.status(400).json({
                mensaje: "Debe indicar una fecha de entrega válida."
            });
        }

        // Validar hora y tipo de entrega
        if (
            typeof hora_entrega !== "string" ||
            !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(hora_entrega)
        ) {
            return res.status(400).json({
                mensaje: "Debe indicar una hora de entrega válida."
            });
        }

        if (
            typeof tipo_entrega !== "string" ||
            !tipo_entrega.trim()
        ) {
            return res.status(400).json({
                mensaje: "Debe indicar el tipo de entrega."
            });
        }

        // Procesar el detalle, que puede llegar como JSON o arreglo
        let detallePedido;

        try {
            detallePedido = typeof req.body.detalle === "string"
                ? JSON.parse(req.body.detalle)
                : req.body.detalle;
        } catch {
            return res.status(400).json({
                mensaje: "El detalle del pedido no tiene un formato válido."
            });
        }

        if (!Array.isArray(detallePedido) || detallePedido.length === 0) {
            return res.status(400).json({
                mensaje: "Debe agregar al menos un producto."
            });
        }

        // Validar anticipo antes de llamar al modelo
        const valorAnticipo = Number(anticipo ?? 0);

        if (!Number.isFinite(valorAnticipo) || valorAnticipo < 0) {
            return res.status(400).json({
                mensaje: "El anticipo no puede ser negativo ni inválido."
            });
        }

        // IMAGEN DE REFERENCIA
        
        const imagen_referencia = req.file
            ? req.file.filename
            : null;

        const idpedido = await PedidoModelo.crearPedido({
            idcliente: clienteId,
            fecha_entrega,
            hora_entrega,
            tipo_entrega: tipo_entrega.trim(),
            direccion_entrega,
            observaciones,
            estado: "Pendiente",
            anticipo: valorAnticipo,
            imagen_referencia,
            detalle: detallePedido
        });

        return res.status(201).json({
            mensaje: "Pedido registrado correctamente.",
            idpedido
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);

        const erroresValidacion = [
            "Debe seleccionar un cliente válido.",
            "El cliente seleccionado no existe.",
            "El pedido debe contener al menos un producto.",
            "Hay un producto con identificador inválido.",
            "La cantidad debe ser un entero mayor que cero.",
            "El valor de los extras no puede ser negativo.",
            "El precio base del producto no es válido.",
            "El anticipo debe estar entre cero y el total del pedido."
        ];

        if (
            erroresValidacion.includes(error.message) ||
            /^El producto \d+ no existe\.$/.test(error.message)
        ) {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        return res.status(500).json({
            mensaje: "Error al registrar el pedido."
        });
    }
},

   
    // OBTENER TODOS LOS PEDIDOS
   
    async obtenerPedidos(req, res) {

        try {

            const pedidos = await PedidoModelo.obtenerPedidos();

            res.json(pedidos);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al obtener los pedidos."
            });

        }

    },

    // BUSCAR PEDIDOS
    
    async buscarPedidos(req, res) {

        try {

            const { termino } = req.query;

            if (!termino) {

                const pedidos = await PedidoModelo.obtenerPedidos();

                return res.json(pedidos);

            }

            const pedidos = await PedidoModelo.buscarPedidos(termino);

            res.json(pedidos);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al buscar pedidos."
            });

        }

    },

    
    // OBTENER PEDIDO POR ID
  
    async obtenerPedidoPorId(req, res) {

        try {

            const pedido = await PedidoModelo.obtenerPedidoPorId(req.params.id);

            if (!pedido) {

                return res.status(404).json({
                    mensaje: "Pedido no encontrado."
                });

            }

            res.json(pedido);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al obtener el pedido."
            });

        }

    },

   
// EDITAR PEDIDO

async editarPedido(req, res) {

    try {

        const {
            idcliente,
            fecha_entrega,
            hora_entrega,
            tipo_entrega,
            direccion_entrega,
            observaciones,
            total,
            anticipo,
            saldo,
            detalle
        } = req.body;

        
        // IMAGEN DE REFERENCIA
        
        const imagen_referencia = req.file
            ? req.file.filename
            : null;

      
        // DETALLE DEL PEDIDO
      
        let detallePedido;

        try {
    if (Array.isArray(detalle)) {
        detallePedido = detalle;
    } else if (typeof detalle === "string") {
        detallePedido = JSON.parse(detalle);
    } else {
        detallePedido = [];
    }
} catch (error) {
    return res.status(400).json({
        mensaje: "El detalle del pedido no tiene un formato válido."
    });
}

        // DATOS DEL PEDIDO
        
        const datosPedido = {
    idcliente,
    fecha_entrega:
        typeof fecha_entrega === "string"
            ? fecha_entrega.slice(0, 10)
            : fecha_entrega,
    hora_entrega,
    tipo_entrega,
    direccion_entrega,
    observaciones,
    total,
    anticipo,
    saldo,
    detalle: detallePedido
};

        // Si se seleccionó una nueva imagen,
        
        if (imagen_referencia) {
            datosPedido.imagen_referencia = imagen_referencia;
        }

       
        // ACTUALIZAR PEDIDO
   
        const pedido = await PedidoModelo.editarPedido(
            req.params.id,
            datosPedido
        );

        if (!pedido) {

            return res.status(404).json({
                mensaje: "Pedido no encontrado."
            });

        }

        res.json({
            mensaje: "Pedido actualizado correctamente.",
            pedido
        });

    } catch (error) {
    console.error("Error al editar pedido:", error);

    if (
        error.message ===
        "No se pueden editar pedidos entregados o cancelados."
    ) {
        return res.status(409).json({
            mensaje: error.message
        });
    }

    if (
        error.message === "Pedido no encontrado."
    ) {
        return res.status(404).json({
            mensaje: error.message
        });
    }

    const erroresValidacion = [
        "Identificador de pedido inválido.",
        "Debe seleccionar un cliente válido.",
        "El cliente seleccionado no existe.",
        "Debe indicar una fecha de entrega válida.",
        "Debe indicar una hora de entrega válida.",
        "Debe indicar el tipo de entrega.",
        "El pedido debe contener al menos un producto.",
        "Hay un producto con identificador inválido.",
        "La cantidad debe ser un entero mayor que cero.",
        "El valor de los extras no puede ser negativo.",
        "El precio base del producto no es válido.",
        "El anticipo debe estar entre cero y el total del pedido."
    ];

    if (erroresValidacion.includes(error.message)) {
        return res.status(400).json({
            mensaje: error.message
        });
    }

    return res.status(500).json({
        mensaje: "Error al actualizar el pedido."
    });
}

},

// ACTUALIZAR ESTADO

async actualizarEstado(req, res) {

    try {

        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                mensaje: "Debe indicar el nuevo estado."
            });
        }

        const estadosPermitidos = [
            "Pendiente",
            "En preparación",
            "Listo para entregar",
            "Entregado"
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: "Estado no válido."
            });
        }

        const pedido = await PedidoModelo.actualizarEstado(
            req.params.id,
            estado
        );

        if (!pedido) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado."
            });
        }

        if (pedido.error) {
            return res.status(400).json({
                mensaje: pedido.error
            });
        }

        res.json({
            mensaje: "Estado actualizado correctamente.",
            pedido
        });

    } catch (error) {

        console.error("Error al actualizar estado:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el estado del pedido."
        });
    }
},

   
    // CANCELAR PEDIDO
    async cancelarPedido(req, res) {
        try {
            const pedido = await PedidoModelo.cancelarPedido(req.params.id);

            return res.status(200).json({
                mensaje: "Pedido cancelado correctamente.",
                pedido
            });

        } catch (error) {
            console.error("Error al cancelar pedido:", error);

            if (error.message === "Pedido no encontrado.") {
                return res.status(404).json({
                    mensaje: error.message
                });
            }

            const erroresValidacion = [
                "Identificador de pedido inválido.",
                "Solo se pueden cancelar pedidos que estén pendientes.",
                "No se pudo cancelar el pedido porque su estado cambió."
            ];

            if (erroresValidacion.includes(error.message)) {
                return res.status(400).json({
                    mensaje: error.message
                });
            }

            return res.status(500).json({
                mensaje: "Error al cancelar el pedido."
            });
        }
    },

};

module.exports = PedidoControlador;