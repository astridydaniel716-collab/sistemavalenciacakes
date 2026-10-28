import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    obtenerClientes,
    crearCliente,
    buscarClientes,
    editarCliente,
    obtenerHistorialPedidos,
    eliminarCliente
} from '../services/clientesService';

import '../css/Clientes.css';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';


function Clientes() {

    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [formulario, setFormulario] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        direccion: '',
        observaciones: ''
    });

    const [clienteDetalle, setClienteDetalle] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [historialPedidos, setHistorialPedidos] = useState([]);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [clienteHistorial, setClienteHistorial] = useState(null);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);


    // Cargar clientes al entrar al módulo
    useEffect(() => {
        cargarClientes();
    }, []);


    // Obtener todos los clientes
    const cargarClientes = async () => {

        try {

            const datos = await obtenerClientes();

            setClientes(datos);

        } catch (error) {

            setError(error.message);
        }
    };


    // Actualizar campos del formulario
    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };


    // Abrir modal para nuevo cliente
    const nuevoCliente = () => {

        setModoEdicion(false);

        setClienteEditando(null);

        setFormulario({
            nombre: '',
            telefono: '',
            correo: '',
            direccion: '',
            observaciones: ''
        });

        setMensaje('');
        setError('');

        setMostrarModal(true);
    };


    // Abrir modal para editar
    const abrirEditar = (cliente) => {

        setModoEdicion(true);

        setClienteEditando(cliente);

        setFormulario({
            nombre: cliente.nombre || '',
            telefono: cliente.telefono || '',
            correo: cliente.correo || '',
            direccion: cliente.direccion || '',
            observaciones: cliente.observaciones || ''
        });

        setMensaje('');
        setError('');

        setMostrarModal(true);
    };

    // ver detalle

    const verDetalle = (cliente) => {
        setClienteDetalle(cliente);
        setMostrarDetalle(true);
};

// Ver historial de pedidos del cliente
const verHistorial = async (cliente) => {

    try {

        setCargandoHistorial(true);
        setClienteHistorial(cliente);
        setMostrarHistorial(true);

        const pedidos = await obtenerHistorialPedidos(
            cliente.idcliente
        );

        setHistorialPedidos(pedidos);

    } catch (error) {

        console.error('Error al obtener historial:', error);

        setHistorialPedidos([]);

    } finally {

        setCargandoHistorial(false);

    }
};

// Abrir detalle del pedido desde el historial

const abrirPedidoDesdeHistorial = (idpedido) => {
    setMostrarHistorial(false);

    navigate('/Pedidos', {
        state: {
            abrirPedido: idpedido,
            origen: 'historialCliente'
        }
    });
};


    // Guardar cliente
    const guardarCliente = async (e) => {

        e.preventDefault();

        setMensaje('');
        setError('');

        try {

            if (modoEdicion) {

                await editarCliente(
                    clienteEditando.idcliente,
                    formulario
                );

                setMensaje('Cliente actualizado correctamente.');

            } else {

                await crearCliente(formulario);

                setMensaje('Cliente registrado correctamente.');
            }

            setMostrarModal(false);

            await cargarClientes();

        } catch (error) {

            setError(error.message);
        }
    };


    // Buscar clientes
    const realizarBusqueda = async (e) => {

        const valor = e.target.value;

        setBusqueda(valor);

        if (valor.trim() === '') {

            await cargarClientes();

            return;
        }

        try {

            const resultados = await buscarClientes(valor);

            setClientes(resultados);

            setError('');

        } catch (error) {

            setClientes([]);

            setError(error.message);
        }
    };


    // Eliminar cliente
    const eliminar = async (id) => {

        const confirmar = window.confirm(
            '¿Está seguro de que desea eliminar este cliente?'
        );

        if (!confirmar) {
            return;
        }

        try {

            await eliminarCliente(id);

            setMensaje('Cliente eliminado correctamente.');

            await cargarClientes();

        } catch (error) {

            setError(error.message);
        }
    };


    return (

        <div className="clientes-container">

            {/* ENCABEZADO */}

            <div className="clientes-header">

                <div>
                    <h1>Clientes</h1>

                    <p>
                        Gestiona la información de los clientes
                        registrados en Valencia Cakes.
                    </p>
                </div>

                <button
                    className="btn-nuevo"
                    onClick={nuevoCliente}
                >
                    + Nuevo cliente
                </button>

            </div>


            {/* MENSAJES */}

            {mensaje && (
                <div className="mensaje-exito">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="mensaje-error">
                    {error}
                </div>
            )}


            {/* BUSCADOR */}

            <div className="clientes-herramientas">

                <input
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    value={busqueda}
                    onChange={realizarBusqueda}
                />

            </div>


            {/* TABLA */}

            <div className="tabla-container">

                <table>

                    <thead>

                        <tr>

                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Dirección</th>
                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {clientes.length > 0 ? (

                            clientes.map((cliente) => (

                                <tr key={cliente.idcliente}>

                                    <td>{cliente.nombre}</td>

                                    <td>{cliente.telefono}</td>

                                    <td>
                                        {cliente.correo || '-'}
                                    </td>

                                    <td>
                                        {cliente.direccion || '-'}
                                    </td>

                                   <td className="acciones">

                                    <button
                                        className="btn-ver"
                                        onClick={() => verDetalle(cliente)}
                                        title="Ver detalle"
                                    >
                                        <FaEye />
                                    </button>
                                    
                                    <button
                                        className="btn-historial"
                                        onClick={() => verHistorial(cliente)}
                                        title="Historial de pedidos"
                                    >
                                        📋
                                    </button>

                                    <button
                                        className="btn-editar"
                                        onClick={() => abrirEditar(cliente)}
                                        title="Editar cliente"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="btn-eliminar"
                                        onClick={() => eliminar(cliente.idcliente)}
                                        title="Eliminar cliente"
                                    >
                                        <FaTrash />
                                    </button>

                                </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="sin-clientes"
                                >
                                    No hay clientes registrados.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* MODAL */}

            {mostrarModal && (

                <div className="modal-overlay">

                    <div className="modal-cliente">

                        <div className="modal-header">

                            <h2>
                                {modoEdicion
                                    ? 'Editar cliente'
                                    : 'Nuevo cliente'}
                            </h2>

                            <button
                                className="cerrar-modal"
                                onClick={() => setMostrarModal(false)}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={guardarCliente}>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Nombre *
                                    </label>

                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formulario.nombre}
                                        onChange={manejarCambio}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Teléfono *
                                    </label>

                                    <input
                                        type="text"
                                        name="telefono"
                                        value={formulario.telefono}
                                        onChange={manejarCambio}
                                        maxLength="16"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Correo
                                    </label>

                                    <input
                                        type="email"
                                        name="correo"
                                        value={formulario.correo}
                                        onChange={manejarCambio}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Dirección
                                    </label>

                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formulario.direccion}
                                        onChange={manejarCambio}
                                    />

                                </div>


                                <div className="form-group campo-completo">

                                    <label>
                                        Observaciones
                                    </label>

                                    <textarea
                                        name="observaciones"
                                        value={formulario.observaciones}
                                        onChange={manejarCambio}
                                        rows="3"
                                    />

                                </div>

                            </div>


                            <div className="modal-botones">

                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setMostrarModal(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-guardar"
                                >
                                    {modoEdicion
                                        ? 'Actualizar'
                                        : 'Guardar'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

{/* MODAL DETALLE DEL CLIENTE */}

{mostrarDetalle && clienteDetalle && (

    <div className="modal-overlay">

        <div className="modal-detalle">

            <div className="modal-header">

                <h2>Detalle del cliente</h2>

                <button
                    className="cerrar-modal"
                    onClick={() => setMostrarDetalle(false)}
                >
                    ×
                </button>

            </div>

            <div className="detalle-contenido">

                <div className="detalle-item">
                    <span>Nombre</span>
                    <p>{clienteDetalle.nombre}</p>
                </div>

                <div className="detalle-item">
                    <span>Teléfono</span>
                    <p>{clienteDetalle.telefono}</p>
                </div>

                <div className="detalle-item">
                    <span>Correo</span>
                    <p>{clienteDetalle.correo || 'No registrado'}</p>
                </div>

                <div className="detalle-item">
                    <span>Dirección</span>
                    <p>{clienteDetalle.direccion || 'No registrada'}</p>
                </div>

                <div className="detalle-item observaciones">
                    <span>Observaciones</span>
                    <p>{clienteDetalle.observaciones || 'Sin observaciones.'}</p>
                </div>

            </div>

            <div className="modal-botones">

                <button
                    className="btn-cancelar"
                    onClick={() => setMostrarDetalle(false)}
                >
                    Cerrar
                </button>

            </div>

        </div>

    </div>

)}

{/* MODAL HISTORIAL DE PEDIDOS */}

{mostrarHistorial && clienteHistorial && (

    <div className="modal-overlay">

        <div className="modal-historial">

            <div className="modal-header">

                <div>
                    <h2>Historial de pedidos</h2>

                    <p className="subtitulo-historial">
                        {clienteHistorial.nombre}
                    </p>
                </div>

                <button
                    className="cerrar-modal"
                    onClick={() => setMostrarHistorial(false)}
                >
                    ×
                </button>

            </div>

            {cargandoHistorial ? (

                <p className="historial-cargando">
                    Cargando historial...
                </p>

            ) : historialPedidos.length === 0 ? (

                <p className="historial-vacio">
                    Este cliente no tiene pedidos registrados.
                </p>

            ) : (

                <div className="tabla-historial-container">

                    <table className="tabla-historial">

                        <thead>

                            <tr>
                                <th>Pedido</th>
                                <th>Fecha pedido</th>
                                <th>Fecha entrega</th>
                                <th>Hora</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>

                        </thead>

                        <tbody>

                            {historialPedidos.map((pedido) => (

                                 <tr
                                    key={pedido.idpedido}
                                    className="fila-pedido-historial"
                                    onClick={() => abrirPedidoDesdeHistorial(pedido.idpedido)}
                                >

                                <td>
                                    #{pedido.idpedido}
                                </td>

                                    <td>
                                        {pedido.fecha_pedido
                                            ? new Date(
                                                pedido.fecha_pedido
                                            ).toLocaleDateString('es-CO')
                                            : '-'}
                                    </td>

                                    <td>
                                        {pedido.fecha_entrega
                                            ? new Date(
                                                pedido.fecha_entrega
                                            ).toLocaleDateString('es-CO')
                                            : '-'}
                                    </td>

                                    <td>
                                        {pedido.hora_entrega || '-'}
                                    </td>

                                    <td>
                                        ${Number(
                                            pedido.total || 0
                                        ).toLocaleString('es-CO')}
                                    </td>

                                    <td>

                                        <span
                                            className={`estado-historial ${pedido.estado
                                                .toLowerCase()
                                                .replaceAll(' ', '-')}`}
                                        >
                                            {pedido.estado}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <div className="modal-botones">

                <button
                    className="btn-cancelar"
                    onClick={() => setMostrarHistorial(false)}
                >
                    Cerrar
                </button>

            </div>

        </div>

    </div>

)}
        </div>
    );
}


export default Clientes;