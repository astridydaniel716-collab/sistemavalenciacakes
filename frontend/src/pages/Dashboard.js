import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaSignOutAlt} from 'react-icons/fa';

function Dashboard() {

const navigate = useNavigate()
   const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
    navigate('/');
};

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    return (
        <div className="dashboard">

            {/* MENÚ LATERAL */}

            <aside className="sidebar">

                <div className="logo-container">
                    <img
                        src="/imagenes/logo.png"
                        alt="Valencia Cakes"
                        className="logo-img"
                    />
                </div>

                <nav className="menu">

                    <button onClick={() => navigate('/Dashboard')}>
                        Inicio 
                    </button>

                    <button onClick={() => navigate('/Clientes')}>
                        Clientes
                    </button>

                    <button onClick={() => navigate('/Proveedores')}>
                        Proveedores
                    </button>

                    <button onClick={() => navigate('/Pedidos')}>
                        Pedidos
                    </button>

                    <button
                        className="logout-button"
                        onClick={cerrarSesion}
                       
                    >
                        Cerrar sesión
                        <FaSignOutAlt style={{ marginLeft: '10px' }}/>
                        
                    </button>

                </nav>

            </aside>


            {/* CONTENIDO */}

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <div>
                        <h2>Dashboard</h2>

                        <p>
                            Bienvenido al sistema de gestión de Valencia Cakes
                        </p>
                    </div>

                    <div className="user-info">
                        {usuario?.nombre || 'Administrador'}
                    </div>

                </div>


                {/* TARJETAS */}

                <div className="dashboard-cards">

                    <div className="dashboard-card" onClick={() => navigate('/clientes')}>

                        <h3>Clientes</h3>

                        <p>
                            Gestiona la información de los clientes
                            registrados en el sistema.
                        </p>

                    </div>


                    <div className="dashboard-card" onClick={() => navigate('/proveedores')}>

                        <h3>Proveedores</h3>

                        <p>
                            Administra la información de los proveedores
                            de Valencia Cakes.
                        </p>

                    </div>


                    <div className="dashboard-card" onClick={() => navigate('/pedidos')}>

                        <h3>Pedidos</h3>

                        <p>
                            Consulta y administra los pedidos
                            registrados en el sistema.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;