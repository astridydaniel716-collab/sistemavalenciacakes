const API_CLIENTES = 'http://localhost:3330/app/clientes';


// Obtener todos los clientes
export const obtenerClientes = async () => {

    const respuesta = await fetch(`${API_CLIENTES}/todos`);

    if (!respuesta.ok) {
        throw new Error('Error al obtener los clientes');
    }

    return await respuesta.json();
};


// Registrar cliente
export const crearCliente = async (cliente) => {

    const respuesta = await fetch(`${API_CLIENTES}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al registrar el cliente');
    }

    return datos;
};


// Buscar clientes
export const buscarClientes = async (termino) => {

    const respuesta = await fetch(
        `${API_CLIENTES}/buscar?termino=${encodeURIComponent(termino)}`
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al buscar clientes');
    }

    return datos;
};


// Obtener cliente por ID
export const obtenerClientePorId = async (id) => {

    const respuesta = await fetch(`${API_CLIENTES}/${id}`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al obtener el cliente');
    }

    return datos;
};


// Editar cliente
export const editarCliente = async (id, cliente) => {

    const respuesta = await fetch(`${API_CLIENTES}/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al actualizar el cliente');
    }

    return datos;
};

//historial por cliente

export async function obtenerHistorialPedidos(idcliente) {

    const respuesta = await fetch(
        `${API_CLIENTES}/${idcliente}/historial-pedidos`
    );

    if (!respuesta.ok) {
        throw new Error("Error al obtener el historial de pedidos.");
    }

    return await respuesta.json();
};

// Eliminar cliente
export const eliminarCliente = async (id) => {

    const respuesta = await fetch(`${API_CLIENTES}/eliminar/${id}`, {
        method: 'DELETE'
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al eliminar el cliente');
    }

    return datos;
};