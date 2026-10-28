const Conexion = require('../config/Conexion');

const PedidoModelo = {

    
async calcularDetallePedido(client, detalle) {
    if (!Array.isArray(detalle) || detalle.length === 0) {
        throw new Error("El pedido debe contener al menos un producto.");
    }

    const detalleCalculado = [];

    for (const item of detalle) {
        const idproducto = Number(item.idproducto);
        const cantidad = Number(item.cantidad);
        const valorExtras = Number(item.valor_extras ?? 0);

        if (!Number.isInteger(idproducto) || idproducto <= 0) {
            throw new Error("Hay un producto con identificador inválido.");
        }

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new Error("La cantidad debe ser un entero mayor que cero.");
        }

        if (!Number.isFinite(valorExtras) || valorExtras < 0) {
            throw new Error("El valor de los extras no puede ser negativo.");
        }

        const resultado = await client.query(
            `SELECT idproducto, nombre, precio_base
             FROM productos
             WHERE idproducto = $1`,
            [idproducto]
        );

        if (resultado.rows.length === 0) {
            throw new Error(`El producto ${idproducto} no existe.`);
        }

        const producto = resultado.rows[0];
        const precioBase = Number(producto.precio_base);

        if (!Number.isFinite(precioBase) || precioBase < 0) {
            throw new Error("El precio base del producto no es válido.");
        }

        const precioUnitario = precioBase + valorExtras;
        const subtotal = precioUnitario * cantidad;

        detalleCalculado.push({
            idproducto: producto.idproducto,
            descripcion: item.descripcion ?? "",
            extras: item.extras ?? "",
            valor_extras: valorExtras,
            cantidad,
            precio_unitario: precioUnitario,
            subtotal
        });
    }

    const total = detalleCalculado.reduce(
        (suma, item) => suma + item.subtotal,
        0
    );

    return { detalle: detalleCalculado, total };
},

   
    // CREAR PEDIDO
    async crearPedido(data) {
        const client = await Conexion.connect();

        
try {
    await client.query("BEGIN");

    // Verificar que el cliente exista en la base de datos
    const clienteId = Number(data.idcliente);

    if (!Number.isInteger(clienteId) || clienteId <= 0) {
        throw new Error("Debe seleccionar un cliente válido.");
    }

    const resultadoCliente = await client.query(
        "SELECT idcliente FROM clientes WHERE idcliente = $1",
        [clienteId]
    );

    if (resultadoCliente.rows.length === 0) {
        throw new Error("El cliente seleccionado no existe.");
    }

    // Calcular los precios usando los valores reales de la base de datos


            // Calcular los precios usando los valores reales de la base de datos
            const { detalle, total } = await this.calcularDetallePedido(
                client,
                data.detalle
            );

            // Validar anticipo y calcular saldo en el servidor
            const anticipo = Number(data.anticipo ?? 0);

            if (
                !Number.isFinite(anticipo) ||
                anticipo < 0 ||
                anticipo > total
            ) {
                throw new Error(
                    "El anticipo debe estar entre cero y el total del pedido."
                );
            }

            const saldo = total - anticipo;

            // Crear el pedido con los importes calculados
            const sqlPedido = `
                INSERT INTO pedidos (
                    idcliente,
                    fecha_pedido,
                    fecha_entrega,
                    hora_entrega,
                    tipo_entrega,
                    direccion_entrega,
                    estado,
                    observaciones,
                    total,
                    anticipo,
                    saldo,
                    imagen_referencia
                )
                VALUES (
                    $1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING idpedido;
            `;

            const pedido = await client.query(sqlPedido, [
                data.idcliente,
                data.fecha_entrega,
                data.hora_entrega,
                data.tipo_entrega,
                data.direccion_entrega,
                data.estado || "Pendiente",
                data.observaciones,
                total,
                anticipo,
                saldo,
                data.imagen_referencia
            ]);

            const idpedido = pedido.rows[0].idpedido;

            // Guardar los detalles calculados por el servidor
            const sqlDetalle = `
                INSERT INTO detalle_pedido (
                    idpedido,
                    idproducto,
                    descripcion,
                    extras,
                    valor_extras,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `;

            for (const item of detalle) {
                await client.query(sqlDetalle, [
                    idpedido,
                    item.idproducto,
                    item.descripcion,
                    item.extras,
                    item.valor_extras,
                    item.cantidad,
                    item.precio_unitario,
                    item.subtotal
                ]);
            }

            await client.query("COMMIT");

            return idpedido;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;

        } finally {
            client.release();
        }
    },


  // OBTENER TODOS LOS PEDIDOS
  
    async obtenerPedidos() {

        const sql = `
            SELECT
                p.idpedido,
                c.nombre AS cliente,
                c.telefono,
                p.fecha_pedido,
                p.fecha_entrega,
                p.hora_entrega,
                p.tipo_entrega,
                p.estado,
                p.total,
                p.anticipo,
                p.saldo
            FROM pedidos p
            INNER JOIN clientes c
                ON p.idcliente = c.idcliente
            ORDER BY p.fecha_entrega DESC;
        `;

        const resultado = await Conexion.query(sql);

        return resultado.rows;

    },

    // BUSCAR PEDIDOS
   
    async buscarPedidos(termino) {

        const sql = `
            SELECT
                p.idpedido,
                c.nombre AS cliente,
                c.telefono,
                p.fecha_entrega,
                p.hora_entrega,
                p.estado,
                p.total
            FROM pedidos p
            INNER JOIN clientes c
                ON p.idcliente = c.idcliente
            WHERE
                c.nombre ILIKE $1
                OR c.telefono ILIKE $1
                OR CAST(p.idpedido AS TEXT) ILIKE $1
            ORDER BY p.fecha_entrega;
        `;

        const resultado = await Conexion.query(sql, [`%${termino}%`]);

        return resultado.rows;

    },

// OBTENER PEDIDO POR ID

async obtenerPedidoPorId(idpedido) {

    const sqlPedido = `
        SELECT
            p.idpedido,
            p.idcliente,
            c.nombre AS cliente,
            c.telefono,
            c.direccion AS direccion_cliente,
            p.fecha_pedido,
            p.fecha_entrega,
            p.hora_entrega,
            p.tipo_entrega,
            p.direccion_entrega,
            p.estado,
            p.observaciones,
            p.total,
            p.anticipo,
            p.saldo,
            p.imagen_referencia
        FROM pedidos p
        INNER JOIN clientes c
            ON p.idcliente = c.idcliente
        WHERE p.idpedido = $1;
    `;

    const pedido = await Conexion.query(sqlPedido, [idpedido]);

    if (pedido.rows.length === 0) return null;

    const sqlDetalle = `
        SELECT
            dp.iddetalle,
            dp.idproducto,
            pr.nombre AS producto,
            pr.tipo_crema,
            pr.porciones,
            dp.descripcion,
            dp.extras,
            dp.valor_extras,
            dp.cantidad,
            dp.precio_unitario,
            dp.subtotal
        FROM detalle_pedido dp
        INNER JOIN productos pr
            ON dp.idproducto = pr.idproducto
        WHERE dp.idpedido = $1;
    `;

    const detalle = await Conexion.query(sqlDetalle, [idpedido]);

    return {
        ...pedido.rows[0],
        detalle: detalle.rows
    };

},

    // EDITAR PEDIDO
    async editarPedido(idpedido, data) {
        const client = await Conexion.connect();

        try {
            await client.query("BEGIN");

            // Validar identificador del pedido
            const pedidoId = Number(idpedido);

            if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
                throw new Error("Identificador de pedido inválido.");
            }

            // Obtener y bloquear el pedido durante la transacción
            const consultaActual = `
                SELECT imagen_referencia, estado
                FROM pedidos
                WHERE idpedido = $1
                FOR UPDATE;
            `;

            const resultadoActual = await client.query(
                consultaActual,
                [pedidoId]
            );

            if (resultadoActual.rows.length === 0) {
                throw new Error("Pedido no encontrado.");
            }

            const imagenActual =
                resultadoActual.rows[0].imagen_referencia;

            const estadoActual =
                resultadoActual.rows[0].estado;

            // Impedir la edición de pedidos con estado entregado o cancelado
            if (
            estadoActual === "Entregado" ||
            estadoActual === "Cancelado"
        ) {
            throw new Error(
            "No se pueden editar pedidos entregados o cancelados."
        );
        }

            // Validar cliente
            const clienteId = Number(data.idcliente);

            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                throw new Error("Debe seleccionar un cliente válido.");
            }

            const resultadoCliente = await client.query(
                "SELECT idcliente FROM clientes WHERE idcliente = $1",
                [clienteId]
            );

            if (resultadoCliente.rows.length === 0) {
                throw new Error("El cliente seleccionado no existe.");
            }

            // Validar fecha
            const fechaValida =
                typeof data.fecha_entrega === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(data.fecha_entrega) &&
                (() => {
                    const [anio, mes, dia] =
                        data.fecha_entrega.split("-").map(Number);

                    const fecha = new Date(
                        Date.UTC(anio, mes - 1, dia)
                    );

                    return fecha.getUTCFullYear() === anio &&
                        fecha.getUTCMonth() === mes - 1 &&
                        fecha.getUTCDate() === dia;
                })();

            if (!fechaValida) {
                throw new Error(
                    "Debe indicar una fecha de entrega válida."
                );
            }

            // Validar hora
            if (
                typeof data.hora_entrega !== "string" ||
                !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(
                    data.hora_entrega
                )
            ) {
                throw new Error(
                    "Debe indicar una hora de entrega válida."
                );
            }

            // Validar tipo de entrega
            if (
                typeof data.tipo_entrega !== "string" ||
                !data.tipo_entrega.trim()
            ) {
                throw new Error("Debe indicar el tipo de entrega.");
            }

            // Aceptar el detalle como arreglo o como JSON
            let detalleRecibido;

            try {
                detalleRecibido =
                    typeof data.detalle === "string"
                        ? JSON.parse(data.detalle)
                        : data.detalle;
            } catch {
                throw new Error(
                    "El detalle del pedido no tiene un formato válido."
                );
            }

            // Calcular precios usando los datos reales de productos
            const { detalle, total } =
                await this.calcularDetallePedido(
                    client,
                    detalleRecibido
                );

            // Validar anticipo y calcular saldo en el servidor
            const anticipo = Number(data.anticipo ?? 0);

            if (
                !Number.isFinite(anticipo) ||
                anticipo < 0 ||
                anticipo > total
            ) {
                throw new Error(
                    "El anticipo debe estar entre cero y el total del pedido."
                );
            }

            const saldo = total - anticipo;

            // Conservar imagen anterior si no se carga otra
            const imagenReferencia =
                data.imagen_referencia || imagenActual;

            // Actualizar pedido con importes calculados en servidor
            const sqlPedido = `
                UPDATE pedidos
                SET
                    idcliente = $1,
                    fecha_entrega = $2,
                    hora_entrega = $3,
                    tipo_entrega = $4,
                    direccion_entrega = $5,
                    estado = $6,
                    observaciones = $7,
                    total = $8,
                    anticipo = $9,
                    saldo = $10,
                    imagen_referencia = $11
                WHERE idpedido = $12
                RETURNING *;
            `;

            const pedido = await client.query(sqlPedido, [
                clienteId,
                data.fecha_entrega,
                data.hora_entrega,
                data.tipo_entrega.trim(),
                data.direccion_entrega,
                estadoActual,
                data.observaciones,
                total,
                anticipo,
                saldo,
                imagenReferencia,
                pedidoId
            ]);

            // Reemplazar detalle anterior dentro de la transacción
            await client.query(
                "DELETE FROM detalle_pedido WHERE idpedido = $1",
                [pedidoId]
            );

            const sqlDetalle = `
                INSERT INTO detalle_pedido (
                    idpedido,
                    idproducto,
                    descripcion,
                    extras,
                    valor_extras,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `;

            for (const item of detalle) {
                await client.query(sqlDetalle, [
                    pedidoId,
                    item.idproducto,
                    item.descripcion,
                    item.extras,
                    item.valor_extras,
                    item.cantidad,
                    item.precio_unitario,
                    item.subtotal
                ]);
            }

            await client.query("COMMIT");

            return pedido.rows[0];

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;

        } finally {
            client.release();
        }
    },


// ACTUALIZAR ESTADO DEL PEDIDO

async actualizarEstado(idpedido, nuevoEstado) {

    // Obtener el estado actual del pedido
    const consultaActual = `
        SELECT estado
        FROM pedidos
        WHERE idpedido = $1;
    `;

    const resultadoActual = await Conexion.query(consultaActual, [idpedido]);

    if (resultadoActual.rows.length === 0) {
        return {
            error: "Pedido no encontrado."
        };
    }

    const estadoActual = resultadoActual.rows[0].estado;

    if (
    estadoActual === "Entregado" ||
    estadoActual === "Cancelado"
) {
    throw new Error(
        "No se pueden editar pedidos entregados o cancelados."
    );
}

    // Secuencia permitida
    const flujoEstados = [
        "Pendiente",
        "En preparación",
        "Listo para entregar",
        "Entregado"
    ];

    // Cancelado no puede avanzar ni retroceder
    if (estadoActual === "Cancelado") {
        return {
            error: "Un pedido cancelado no puede cambiar de estado."
        };
    }

    // Entregado es el estado final
    if (estadoActual === "Entregado") {
        return {
            error: "Un pedido entregado no puede cambiar de estado."
        };
    }

    const posicionActual = flujoEstados.indexOf(estadoActual);
    const posicionNueva = flujoEstados.indexOf(nuevoEstado);

    // Verificar que el nuevo estado sea válido
    if (posicionNueva === -1) {
        return {
            error: "Estado no válido."
        };
    }

    // Solo se permite avanzar exactamente un estado
    if (posicionNueva !== posicionActual + 1) {
        return {
            error: `No se puede cambiar de "${estadoActual}" a "${nuevoEstado}".`
        };
    }

    const sql = `
        UPDATE pedidos
        SET estado = $1
        WHERE idpedido = $2
        RETURNING *;
    `;

    const resultado = await Conexion.query(sql, [
        nuevoEstado,
        idpedido
    ]);

    return resultado.rows[0];
},


    // CANCELAR PEDIDO
    async cancelarPedido(idpedido) {
        const client = await Conexion.connect();

        try {
            await client.query("BEGIN");

            const pedidoId = Number(idpedido);

            if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
                throw new Error("Identificador de pedido inválido.");
            }

            // Consultar el estado actual del pedido
            const resultado = await client.query(
                `SELECT idpedido, estado
                 FROM pedidos
                 WHERE idpedido = $1
                 FOR UPDATE;`,
                [pedidoId]
            );

            if (resultado.rows.length === 0) {
                throw new Error("Pedido no encontrado.");
            }

            const estadoActual = resultado.rows[0].estado;

            // Solo se pueden cancelar pedidos pendientes
            if (estadoActual !== "Pendiente") {
                throw new Error(
                    "Solo se pueden cancelar pedidos que estén pendientes."
                );
            }

            const actualizacion = await client.query(
                `UPDATE pedidos
                 SET estado = 'Cancelado'
                 WHERE idpedido = $1
                   AND estado = 'Pendiente'
                 RETURNING *;`,
                [pedidoId]
            );

            if (actualizacion.rows.length === 0) {
                throw new Error(
                    "No se pudo cancelar el pedido porque su estado cambió."
                );
            }

            await client.query("COMMIT");

            return actualizacion.rows[0];

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;

        } finally {
            client.release();
        }
    },

}
module.exports = PedidoModelo;