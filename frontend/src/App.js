import React, { useState } from 'react';
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

function App() {
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
   };

<Login alIniciarSesion={setToken} />
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
                            ? <Dashboard cerrarSesion={cerrarSesion}/>
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
