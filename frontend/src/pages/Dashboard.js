import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import pedidosService from '../services/pedidosService';

function Dashboard({cerrarSesionApp}) {

    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Estado para las alertas de pedidos
    const [pedidosProximos, setPedidosProximos] = useState([]);

    // Cargar alertas al iniciar el Dashboard
    useEffect(() => {
        cargarPedidosProximos();
    }, []);

    const handleLogout = () => {
    cerrarSesionApp();
    navigate('/', { replace: true });
};

    // Obtener pedidos próximos a entregar
    async function cargarPedidosProximos() {

        try {

            const datos = await pedidosService.obtenerProximos();
            setPedidosProximos(datos);

        } catch (error) {

            console.error("Error al cargar alertas:", error);
        }
    }

    // Mostrar Hoy, Mañana o Faltan X días
    function textoAlerta(fechaEntrega) {

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const entrega = new Date(fechaEntrega);
        entrega.setHours(0, 0, 0, 0);

        const diferencia = Math.round(
            (entrega - hoy) / (1000 * 60 * 60 * 24)
        );

        if (diferencia === 0) return "Hoy";
        if (diferencia === 1) return "Mañana";

        return `Faltan ${diferencia} días`;
    }

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

                    <button onClick={() => navigate('/Productos')}>
                        Productos
                    </button>

                    <button onClick={() => navigate('/Pedidos')}>
                        Pedidos
                    </button>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                        <FaSignOutAlt style={{ marginLeft: "10px" }} />
                    </button>

                </nav>

            </aside>

            {/* CONTENIDO */}
            <main className="dashboard-content">

                <div className="dashboard-header">

                    <div>

                        <h2>Dashboard</h2>

                        <p>
                            Bienvenido al sistema de gestión de Valencia Cakes.
                        </p>

                    </div>

                    <div className="user-info">
                        {usuario?.nombre || "Administrador"}
                    </div>

                </div>

                {/* ALERTAS DE PEDIDOS PRÓXIMOS */}
                <div className="alertas-dashboard">

                    <div className="titulo-alerta">

                        <FaBell />

                        <h3>Pedidos próximos a entregar</h3>

                    </div>

                    {pedidosProximos.length === 0 ? (

                        <p className="sin-alertas">
                            No hay pedidos programados para los próximos 3 días.
                        </p>

                    ) : (

                        pedidosProximos.map((pedido) => (

                    <div
                        className="tarjeta-alerta clickable"
                        key={pedido.idpedido}
                        onClick={() =>
                        navigate("/Pedidos", {
                            state: {
                            abrirPedido: pedido.idpedido
                        }
                    })
                    }>

                                <div className="info-alerta">

                                    <strong>{pedido.cliente}</strong>

                                    <span>
                                        Pedido #{pedido.idpedido}
                                    </span>

                                    <span>
                                        {pedido.fecha_entrega? new Date(pedido.fecha_entrega).toLocaleDateString('es-CO')
                                        : '-'} • {pedido.hora_entrega}
                                    </span>

                                </div>

                                <span className="badge-alerta">
                                    {textoAlerta(pedido.fecha_entrega)}
                                </span>

                            </div>

                        ))

                    )}

                </div>

                {/* TARJETAS DEL DASHBOARD */}
                <div className="dashboard-cards">

                    <div
                        className="dashboard-card"
                        onClick={() => navigate('/Clientes')}
                    >

                        <h3>Clientes</h3>

                        <p>
                            Gestiona la información de los clientes registrados en el sistema.
                        </p>

                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() => navigate('/Proveedores')}
                    >

                        <h3>Proveedores</h3>

                        <p>
                            Administra la información de los proveedores de Valencia Cakes.
                        </p>

                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() => navigate('/Productos')}
                    >

                        <h3>Productos</h3>

                        <p>
                            Consulta y administra el catálogo de productos y precios base.
                        </p>

                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() => navigate('/Pedidos')}
                    >

                        <h3>Pedidos</h3>

                        <p>
                            Consulta, registra y administra los pedidos del sistema.
                        </p>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default Dashboard;