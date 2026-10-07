import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Proveedores from './pages/Proveedores';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';

function App() {

    // Obtener el token de autenticación
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>

            <Routes>

                {/* Acceso al sistema */}
                <Route
                    path="/"
                    element={token ? <Navigate to="/dashboard" /> : <Login />}
                />

                {/* Rutas protegidas */}
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard /> : <Navigate to="/" />}
                />

                <Route
                    path="/clientes"
                    element={token ? <Clientes /> : <Navigate to="/" />}
                />

                <Route
                    path="/proveedores"
                    element={token ? <Proveedores /> : <Navigate to="/" />}
                />

                <Route
                    path="/productos"
                    element={token ? <Productos /> : <Navigate to="/" />}
                />

                <Route
                    path="/pedidos"
                    element={token ? <Pedidos /> : <Navigate to="/" />}
                />

                {/* Redirigir rutas inexistentes */}
                <Route
                    path="*"
                    element={
                        <Navigate to={token ? "/dashboard" : "/"} />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;