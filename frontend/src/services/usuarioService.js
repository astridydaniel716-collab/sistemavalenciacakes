import apiFetch from "./api";

// Enviar credenciales para iniciar sesión
export const iniciarSesion = async (usuario, contrasena) => {
    const respuesta = await apiFetch("/app/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            contrasena
        })
    });

    const contenido = await respuesta.text();

    let datos;

    try {
        datos = JSON.parse(contenido);
    } catch {
        console.error("Respuesta recibida del servidor:", contenido);
        throw new Error(
            "El servidor devolvió una respuesta que no es JSON. Verifica la URL de la API."
        );
    }

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || "Error al iniciar sesión"
        );
    }

    return datos;
};