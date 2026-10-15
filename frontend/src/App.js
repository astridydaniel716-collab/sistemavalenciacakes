
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Proveedores from './pages/Proveedores';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';

// Comprueba si el JWT existe y no ha vencido.
function obtenerTokenValido() {
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
        const partes = token.split('.');
        if (partes.length !== 3) throw new Error('Token inválido');

        const payload = JSON.parse(
            atob(
                partes[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
            )
        );

        if (
            typeof payload.exp !== 'number' ||
            payload.exp * 1000 <= Date.now()
        ) {
            throw new Error('Token vencido');
        }

        return token;
    } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        return null;
    }
}

function App() {
    const [token, setToken] = useState(obtenerTokenValido);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
    };

    useEffect(() => {
        const manejarSesionExpirada = () => {
            cerrarSesion();
        };

        window.addEventListener(
            'sesionExpirada',
            manejarSesionExpirada
        );

        return () => {
            window.removeEventListener(
                'sesionExpirada',
                manejarSesionExpirada
            );
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        token
                            ? <Navigate to="/dashboard" replace />
                            : <Login alIniciarSesion={setToken} />
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        token
                            ? <Dashboard cerrarSesionApp={cerrarSesion} />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/clientes"
                    element={
                        token
                            ? <Clientes />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/proveedores"
                    element={
                        token
                            ? <Proveedores />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/productos"
                    element={
                        token
                            ? <Productos />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/pedidos"
                    element={
                        token
                            ? <Pedidos />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={token ? "/dashboard" : "/"}
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
