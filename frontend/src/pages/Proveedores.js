import React, { useEffect, useState } from 'react';

import {
    obtenerProveedores,
    crearProveedor,
    buscarProveedores,
    editarProveedor,
    eliminarProveedor
} from '../services/proveedoresService';

import '../css/Proveedores.css';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';


function Proveedores() {

    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [proveedorEditando, setProveedorEditando] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [formulario, setFormulario] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        direccion: '',
        productos_suministrados: '',
        observaciones: ''
    });

    const [proveedorDetalle, setProveedorDetalle] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);


    // Cargar Proveedores al entrar al módulo
    useEffect(() => {
        cargarProveedores();
    }, []);


    // Obtener todos los Proveedores
    const cargarProveedores = async () => {

        try {

            const datos = await obtenerProveedores();

            setProveedores(datos);

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


    // Abrir modal para nuevo Proveedor
    const nuevoProveedor = () => {

        setModoEdicion(false);

        setProveedorEditando(null);

        setFormulario({
            nombre: '',
            telefono: '',
            correo: '',
            direccion: '',
            productos_suministrados: '',
            observaciones: ''
        });

        setMensaje('');
        setError('');

        setMostrarModal(true);
    };


    // Abrir modal para editar
    const abrirEditar = (proveedor) => {

        setModoEdicion(true);

        setProveedorEditando(proveedor);

        setFormulario({
            nombre: proveedor.nombre || '',
            telefono: proveedor.telefono || '',
            correo: proveedor.correo || '',
            direccion: proveedor.direccion || '',
            productos_suministrados: proveedor.productos_suministrados || '',
            observaciones: proveedor.observaciones || ''
        });

        setMensaje('');
        setError('');

        setMostrarModal(true);
    };

    // ver detalle

    const verDetalle = (proveedor) => {
        setProveedorDetalle(proveedor);
        setMostrarDetalle(true);
};

    // Guardar proveedor
    const guardarProveedor = async (e) => {

        e.preventDefault();

        setMensaje('');
        setError('');

        try {

            if (modoEdicion) {

                await editarProveedor(
                    proveedorEditando.idproveedor,
                    formulario
                );

                setMensaje('Proveedor actualizado correctamente.');

            } else {

                await crearProveedor(formulario);

                setMensaje('Proveedor registrado correctamente.');
            }

            setMostrarModal(false);

            await cargarProveedores();

        } catch (error) {

            setError(error.message);
        }
    };


    // Buscar Proveedores
    const realizarBusqueda = async (e) => {

        const valor = e.target.value;

        setBusqueda(valor);

        if (valor.trim() === '') {

            await cargarProveedores();

            return;
        }

        try {

            const resultados = await buscarProveedores(valor);

            setProveedores(resultados);

            setError('');

        } catch (error) {

            setProveedores([]);

            setError(error.message);
        }
    };


    // Eliminar Proveedor
    const eliminar = async (id) => {

        const confirmar = window.confirm(
            '¿Está seguro de que desea eliminar este Proveedor?'
        );

        if (!confirmar) {
            return;
        }

        try {

            await eliminarProveedor(id);

            setMensaje('Proveedor eliminado correctamente.');

            await cargarProveedores();

        } catch (error) {

            setError(error.message);
        }
    };


    return (

        <div className="proveedores-container">

            {/* ENCABEZADO */}

            <div className="proveedores-header">

                <div>
                    <h1>Proveedores</h1>

                    <p>
                        Gestiona la información de los proveedores
                        registrados en Valencia Cakes.
                    </p>
                </div>

                <button
                    className="btn-nuevo"
                    onClick={nuevoProveedor}
                >
                    + Nuevo Proveedor
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

            <div className="proveedores-herramientas">

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

                        {proveedores.length > 0 ? (

                            proveedores.map((proveedor) => (

                                <tr key={proveedor.idproveedor}>

                                    <td>{proveedor.nombre}</td>

                                    <td>{proveedor.telefono}</td>

                                    <td>
                                        {proveedor.correo || '-'}
                                    </td>

                                    <td>
                                        {proveedor.direccion || '-'}
                                    </td>

                                   <td className="acciones">

                                    <button
                                        className="btn-ver"
                                        onClick={() => verDetalle(proveedor)}
                                        title="Ver detalle"
                                    >
                                        <FaEye />
                                    </button>

                                    <button
                                        className="btn-editar"
                                        onClick={() => abrirEditar(proveedor)}
                                        title="Editar proveedor"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="btn-eliminar"
                                        onClick={() => eliminar(proveedor.idproveedor)}
                                        title="Eliminar proveedor"
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
                                    className="sin-proveedores"
                                >
                                    No hay proveedores registrados.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* MODAL */}

            {mostrarModal && (

                <div className="modal-overlay">

                    <div className="modal-proveedor">

                        <div className="modal-header">

                            <h2>
                                {modoEdicion
                                    ? 'Editar proveedor'
                                    : 'Nuevo proveedor'}
                            </h2>

                            <button
                                className="cerrar-modal"
                                onClick={() => setMostrarModal(false)}
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={guardarProveedor}>

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

                                <div className="form-group">

                                    <label>
                                        Productos suministrados
                                    </label>

                                    <input
                                        type="text"
                                        name="productos_suministrados"
                                        value={formulario.productos_suministrados}
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

{/* MODAL DETALLE DEL PROVEEDOR */}

{mostrarDetalle && proveedorDetalle && (

    <div className="modal-overlay">

        <div className="modal-detalle">

            <div className="modal-header">

                <h2>Detalle del proveedor</h2>

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
                    <p>{proveedorDetalle.nombre}</p>
                </div>

                <div className="detalle-item">
                    <span>Teléfono</span>
                    <p>{proveedorDetalle.telefono}</p>
                </div>

                <div className="detalle-item">
                    <span>Correo</span>
                    <p>{proveedorDetalle.correo || 'No registrado'}</p>
                </div>

                <div className="detalle-item">
                    <span>Dirección</span>
                    <p>{proveedorDetalle.direccion || 'No registrada'}</p>
                </div>

                <div className="detalle-item">
                    <span>Productos suministrados</span>
                    <p>{proveedorDetalle.productos_suministrados || 'No registrados'}</p>
                </div>

                <div className="detalle-item observaciones">
                    <span>Observaciones</span>
                    <p>{proveedorDetalle.observaciones || 'Sin observaciones.'}</p>
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
        </div>
    );
}


export default Proveedores;