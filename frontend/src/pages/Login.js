import { iniciarSesion } from '../services/usuarioService'; // Servicio de autenticación
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    // Estados para usuario y contraseña
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');


    // Manejar el inicio de sesión
    const manejarLogin = async (e) => {
        e.preventDefault();

        try {
            // Validar credenciales con el backend
            const datos = await iniciarSesion(usuario, contrasena);

            console.log('Login exitoso:', datos);

            // Guardar token y datos del usuario
            localStorage.setItem('token', datos.token);
            localStorage.setItem('usuario', JSON.stringify(datos.usuario));

            alert('Inicio de sesión exitoso');

            // Redirigir al sistema
            window.location.href = '/';
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };


    return (
        <div className="login-container">

            <div className="login-card">

                <div className="login-logo">
                    <img
                        src="/imagenes/logo.png"
                        alt="Valencia Cakes"
                    />
                </div>

                <h2 className="login-title">
                    Iniciar sesión
                </h2>

                <p className="login-subtitle">
                    Accede al sistema de gestión
                </p>

                <form className="login-form" onSubmit={manejarLogin}>

                    <div className="form-group">
                        <label>Usuario</label>

                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            placeholder="Ingrese su usuario"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>

                        <input
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Iniciar sesión
                    </button>

                </form>

                <div className="login-footer">
                    Valencia Cakes · Sistema de gestión
                </div>

            </div>

        </div>
    );
}

export default Login;