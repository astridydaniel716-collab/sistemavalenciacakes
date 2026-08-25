const API_PROVEEDORES = 'http://localhost:3330/app/proveedores';


// Obtener todos los proveedores
export const obtenerProveedores = async () => {

    const respuesta = await fetch(`${API_PROVEEDORES}/todos`);

    if (!respuesta.ok) {
        throw new Error('Error al obtener los proveedores');
    }

    return await respuesta.json();
};


// Registrar proveedor
export const crearProveedor = async (proveedor) => {

    const respuesta = await fetch(`${API_PROVEEDORES}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al registrar el proveedor');
    }

    return datos;
};


// Buscar proveedor
export const buscarProveedores = async (termino) => {

    const respuesta = await fetch(
        `${API_PROVEEDORES}/buscar?termino=${encodeURIComponent(termino)}`
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al buscar proveedores');
    }

    return datos;
};


// Obtener proveedor por ID
export const obtenerProveedorPorId = async (id) => {

    const respuesta = await fetch(`${API_PROVEEDORES}/${id}`);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al obtener el proveedor');
    }

    return datos;
};


// Editar proveedor
export const editarProveedor = async (id, proveedor) => {

    const respuesta = await fetch(`${API_PROVEEDORES}/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al actualizar el proveedor');
    }

    return datos;
};


// Eliminar proveedor
export const eliminarProveedor = async (id) => {

    const respuesta = await fetch(`${API_PROVEEDORES}/eliminar/${id}`, {
        method: 'DELETE'
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al eliminar el proveedor');
    }

    return datos;
};