
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3330";

const apiFetch = async (url, opciones = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...opciones.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Convertir rutas locales de la API a la URL configurada
    const urlFinal = url.startsWith("http")
        ? url
        : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

    const respuesta = await fetch(urlFinal, {
        ...opciones,
        headers
    });

    if (respuesta.status === 401 && token) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.dispatchEvent(new Event("sesionExpirada"));
    }

    return respuesta;
};

export default apiFetch;
