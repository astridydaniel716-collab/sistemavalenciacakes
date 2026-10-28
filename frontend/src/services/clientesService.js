import apiFetch from './api';
const API_CLIENTES = '/app/clientes';

// Procesar respuestas de la API y manejar errores
const procesarRespuesta = async (respuesta, mensajeError) => {
    const contenido = await respuesta.text();

    let datos = null;

    if (contenido) {
        try {
            datos = JSON.parse(contenido);
        } catch {
            datos = null;
        }
    }

    if (!respuesta.ok) {
        throw new Error(
            datos?.mensaje ||
            datos?.error ||
            mensajeError
        );
    }

    if (contenido && datos === null) {
        throw new Error('El servidor devolvió una respuesta no válida.');
    }

    return datos;
};


// Obtener todos los clientes
export const obtenerClientes = async () => {
    const respuesta = await apiFetch(`${API_CLIENTES}/todos`);

    return await procesarRespuesta(
        respuesta,
        'Error al obtener los clientes'
    );
};

// Registrar cliente
export const crearCliente = async (cliente) => {
    const respuesta = await apiFetch(`${API_CLIENTES}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    return await procesarRespuesta(
        respuesta,
        'Error al registrar el cliente'
    );
};

// Buscar clientes
export const buscarClientes = async (termino) => {
    const respuesta = await apiFetch(
        `${API_CLIENTES}/buscar?termino=${encodeURIComponent(termino)}`
    );

    return await procesarRespuesta(
        respuesta,
        'Error al buscar clientes'
    );
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id) => {
    const respuesta = await apiFetch(`${API_CLIENTES}/${id}`);

    return await procesarRespuesta(
        respuesta,
        'Error al obtener el cliente'
    );
};

// Obtener historial de pedidos
export const obtenerHistorialPedidos = async (idcliente) => {
    const respuesta = await apiFetch(
        `${API_CLIENTES}/${idcliente}/historial-pedidos`
    );

    return await procesarRespuesta(
        respuesta,
        'Error al obtener el historial de pedidos.'
    );
};

// Editar cliente
export const editarCliente = async (id, cliente) => {
    const respuesta = await apiFetch(`${API_CLIENTES}/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    return await procesarRespuesta(
        respuesta,
        'Error al actualizar el cliente'
    );
};

// Eliminar cliente
export const eliminarCliente = async (id) => {
    const respuesta = await apiFetch(`${API_CLIENTES}/eliminar/${id}`, {
        method: 'DELETE'
    });

    return await procesarRespuesta(
        respuesta,
        'Error al eliminar el cliente'
    );
};