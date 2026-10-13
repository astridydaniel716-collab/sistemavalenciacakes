
const apiFetch = async (url, opciones = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        ...opciones.headers
    };

    // Agregar el token a las solicitudes autenticadas.
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const respuesta = await fetch(url, {
        ...opciones,
        headers,
    });

    return respuesta;
};

export default apiFetch;
