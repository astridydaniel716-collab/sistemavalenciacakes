import apiFetch from './api';
const API_PEDIDOS = '/app/pedidos';

const pedidosService = {

    // Obtener todos los pedidos
    async obtenerTodos() {

        const respuesta = await apiFetch(`${API_PEDIDOS}/todos`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los pedidos.");
        }

        return await respuesta.json();
    },

    // Buscar pedidos
    async buscar(termino) {

        const respuesta = await apiFetch(
            `${API_PEDIDOS}/buscar?termino=${encodeURIComponent(termino)}`
        );

        if (!respuesta.ok) {
            throw new Error("Error al buscar pedidos.");
        }

        return await respuesta.json();
    },

    // Crear pedido
    async crear(pedido) {

        const formulario = new FormData();

        formulario.append("idcliente", pedido.idcliente);
        formulario.append("fecha_entrega", pedido.fecha_entrega);
        formulario.append("hora_entrega", pedido.hora_entrega);
        formulario.append("tipo_entrega", pedido.tipo_entrega);
        formulario.append(
            "direccion_entrega",
            pedido.direccion_entrega || ""
        );
        formulario.append(
            "observaciones",
            pedido.observaciones || ""
        );
        formulario.append("total", pedido.total);
        formulario.append("anticipo", pedido.anticipo);
        formulario.append("saldo", pedido.saldo);

        // Enviar los detalles como JSON
        formulario.append(
            "detalle",
            JSON.stringify(pedido.detalle || [])
        );

        // Imagen de referencia
        if (pedido.imagen_referencia) {
            formulario.append(
                "imagen_referencia",
                pedido.imagen_referencia
            );
        }

        const respuesta = await apiFetch(`${API_PEDIDOS}/crear`, {
            method: "POST",
            body: formulario
        });

        const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || "Error al registrar el pedido."
        );
    }

    return datos;
},

    // Obtener pedido por ID
    async obtenerPorId(id) {

        const respuesta = await apiFetch(`${API_PEDIDOS}/${id}`);

        if (!respuesta.ok) {
            throw new Error("Pedido no encontrado.");
        }

        return await respuesta.json();
    },

    async editar(id, pedido) {
    const formulario = new FormData();

    formulario.append("idcliente", pedido.idcliente);
    formulario.append("fecha_entrega", pedido.fecha_entrega);
    formulario.append("hora_entrega", pedido.hora_entrega);
    formulario.append("tipo_entrega", pedido.tipo_entrega);
    formulario.append("direccion_entrega", pedido.direccion_entrega || "");
    formulario.append("observaciones", pedido.observaciones || "");
    formulario.append("total", pedido.total);
    formulario.append("anticipo", pedido.anticipo);
    formulario.append("saldo", pedido.saldo);
    formulario.append(
        "detalle",
        JSON.stringify(pedido.detalle || [])
    );

    // Solo enviar imagen si realmente se seleccionó una nueva
    if (
        pedido.imagen_referencia &&
        pedido.imagen_referencia instanceof File
    ) {
        formulario.append(
            "imagen_referencia",
            pedido.imagen_referencia
        );
    }

    const respuesta = await apiFetch(
        `${API_PEDIDOS}/editar/${id}`,
        {
            method: "PUT",
            body: formulario
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || "Error al actualizar el pedido."
        );
    }

    return datos;
},

    // Actualizar estado
    
async actualizarEstado(id, estado) {
    const respuesta = await apiFetch(
        `${API_PEDIDOS}/estado/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ estado })
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || "Error al actualizar el estado del pedido."
        );
    }

    return datos;
},


    // Obtener pedidos próximos a entregar
    async obtenerProximos() {

        const respuesta = await apiFetch(`${API_PEDIDOS}/todos`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener pedidos.");
        }

        const pedidos = await respuesta.json();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const limite = new Date(hoy);
        limite.setDate(limite.getDate() + 3);

        return pedidos.filter(pedido => {

            if (
                pedido.estado === "Entregado" ||
                pedido.estado === "Cancelado"
            ) {
                return false;
            }

            const fecha = new Date(pedido.fecha_entrega);
            fecha.setHours(0, 0, 0, 0);

            return fecha >= hoy && fecha <= limite;

        }).sort((a, b) =>
            new Date(a.fecha_entrega) - new Date(b.fecha_entrega)
        );

    },

    // Cancelar pedido
    
async cancelar(id) {
    const respuesta = await apiFetch(
        `${API_PEDIDOS}/cancelar/${id}`,
        {
            method: "PUT"
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || "Error al cancelar el pedido."
        );
    }

    return datos;
}

};

export default pedidosService;