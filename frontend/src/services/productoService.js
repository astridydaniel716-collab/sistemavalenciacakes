const API_PRODUCTOS = "http://localhost:3330/app/productos";

const productoService = {

    // Obtener todos los productos
    async obtenerTodos() {

        const respuesta = await fetch(`${API_PRODUCTOS}/todos`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los productos.");
        }

        return await respuesta.json();
    },

    // Buscar productos
    async buscar(termino) {

        const respuesta = await fetch(
            `${API_PRODUCTOS}/buscar?termino=${encodeURIComponent(termino)}`
        );

        if (!respuesta.ok) {
            throw new Error("Error al buscar productos.");
        }

        return await respuesta.json();
    },

    // Registrar producto
    async crear(producto) {

        const respuesta = await fetch(`${API_PRODUCTOS}/crear`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        return await respuesta.json();
    },

    // Obtener un producto por ID
    async obtenerPorId(id) {

        const respuesta = await fetch(`${API_PRODUCTOS}/${id}`);

        if (!respuesta.ok) {
            throw new Error("Producto no encontrado.");
        }

        return await respuesta.json();
    },

    // Editar producto
    async editar(id, producto) {

        const respuesta = await fetch(`${API_PRODUCTOS}/editar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        return await respuesta.json();
    },

    // Eliminar producto
    async eliminar(id) {

        const respuesta = await fetch(`${API_PRODUCTOS}/eliminar/${id}`, {
            method: "DELETE"
        });

        return await respuesta.json();
    }

};

export default productoService;