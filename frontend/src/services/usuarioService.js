const API_USUARIOS = 'http://localhost:3330/app/usuarios';

export const iniciarSesion = async (usuario, contrasena) => {
    const respuesta = await fetch(`${API_USUARIOS}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario,
            contrasena
        })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al iniciar sesión');
    }

    return datos;
};