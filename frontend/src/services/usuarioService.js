const API_USUARIOS = 'http://localhost:3330/app/usuarios';

// Enviar credenciales para iniciar sesión
export const iniciarSesion = async (usuario, contrasena) => {

    // Enviar solicitud al backend
    const respuesta = await fetch(`${API_USUARIOS}/login`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        // Enviar usuario y contraseña en formato JSON
        body: JSON.stringify({
            usuario,
            contrasena
        })
    });

    // Convertir respuesta a JSON
    const datos = await respuesta.json();

    // Verificar si la solicitud fue exitosa
    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al iniciar sesión');
    }

    // Retornar respuesta del servidor
    return datos;
};