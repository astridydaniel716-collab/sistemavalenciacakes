import apiFetch from './api';

const API_PRODUCTOS = '/app/productos';

// Procesar respuestas del servidor y mostrar errores específicos
async function procesarRespuesta(respuesta, mensajeError) {
const texto = await respuesta.text();

let datos = null;

if (texto) {
    try {
        datos = JSON.parse(texto);
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

return datos;

}

const productoService = {
// Obtener todos los productos
async obtenerTodos() {
const respuesta = await apiFetch(`${API_PRODUCTOS}/todos`);

    const datos = await procesarRespuesta(
        respuesta,
        'Error al obtener los productos.'
    );

    if (!Array.isArray(datos)) {
        throw new Error('La respuesta de productos no tiene un formato válido.');
    }

    return datos;
},

// Buscar productos
async buscar(termino) {
    const respuesta = await apiFetch(
        `${API_PRODUCTOS}/buscar?termino=${encodeURIComponent(termino)}`
    );

    const datos = await procesarRespuesta(
        respuesta,
        'Error al buscar productos.'
    );

    if (!Array.isArray(datos)) {
        throw new Error('La respuesta de búsqueda no tiene un formato válido.');
    }

    return datos;
},

// Registrar producto
async crear(producto) {
    const respuesta = await apiFetch(`${API_PRODUCTOS}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });

    return await procesarRespuesta(
        respuesta,
        'Error al registrar el producto.'
    );
},

// Obtener un producto por ID
async obtenerPorId(id) {
    const respuesta = await apiFetch(`${API_PRODUCTOS}/${id}`);

    return await procesarRespuesta(
        respuesta,
        'No se encontró el producto.'
    );
},

// Editar producto
async editar(id, producto) {
    const respuesta = await apiFetch(`${API_PRODUCTOS}/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });

    return await procesarRespuesta(
        respuesta,
        'Error al actualizar el producto.'
    );
},

// Eliminar producto
async eliminar(id) {
    const respuesta = await apiFetch(`${API_PRODUCTOS}/eliminar/${id}`, {
        method: 'DELETE'
    });

    return await procesarRespuesta(
        respuesta,
        'Error al eliminar el producto.'
    );
}

};

export default productoService;