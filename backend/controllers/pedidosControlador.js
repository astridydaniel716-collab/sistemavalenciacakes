const PedidoModelo = require('../models/pedidosModelo');

const PedidoControlador = {

    
// CREAR PEDIDO

async crearPedido(req, res) {

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
            detallePedido = detalle
                ? JSON.parse(detalle)
                : [];
        } catch (error) {
            return res.status(400).json({
                mensaje: "El detalle del pedido no tiene un formato válido."
            });
        }

        
        // VALIDACIONES BÁSICAS
        
        if (
            !idcliente ||
            !fecha_entrega ||
            !hora_entrega ||
            !tipo_entrega ||
            !detallePedido ||
            detallePedido.length === 0
        ) {
            return res.status(400).json({
                mensaje: "Debe completar la información del pedido y agregar al menos un producto."
            });
        }

        const idpedido = await PedidoModelo.crearPedido({

            idcliente,
            fecha_entrega,
            hora_entrega,
            tipo_entrega,
            direccion_entrega,
            observaciones,
            estado: "Pendiente",
            total,
            anticipo,
            saldo,
            imagen_referencia,
            detalle: detallePedido

        });

        res.status(201).json({
            mensaje: "Pedido registrado correctamente.",
            idpedido
        });

    } catch (error) {

        console.error("Error al crear pedido:", error);

        res.status(500).json({
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

            detallePedido = detalle
                ? JSON.parse(detalle)
                : [];

        } catch (error) {

            return res.status(400).json({
                mensaje: "El detalle del pedido no tiene un formato válido."
            });

        }

        // DATOS DEL PEDIDO
        
        const datosPedido = {
            idcliente,
            fecha_entrega,
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

        res.status(500).json({
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

            if (!pedido) {

                return res.status(404).json({
                    mensaje: "Pedido no encontrado."
                });

            }

            res.json({
                mensaje: "Pedido cancelado correctamente.",
                pedido
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error al cancelar el pedido."
            });

        }

    }

};

module.exports = PedidoControlador;