    const apiFetch = async (url, opciones = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        ...opciones.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const respuesta = await fetch(url, {
        ...opciones,
        headers,
    });

    if (respuesta.status === 401 && token) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        window.dispatchEvent(
            new Event('sesionExpirada')
        );
    }

    return respuesta;
};

export default apiFetch;
