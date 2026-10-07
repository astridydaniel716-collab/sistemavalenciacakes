import React, { useEffect, useState } from "react";
import productoService from "../services/productoService"; // Servicio de productos

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./Productos.css";


// Opciones disponibles para los productos
const nombresProductos = [
    "Torta personalizada",
    "Torta 3 leches",
    "Torta refrigerada",
    "Brownie",
    "Quesillo",
    "Cupcake",
    "Alfajores",
    "NY Cookies",
    "Galletas de mantequilla",
];

const categorias = [
    "Tortas",
    "Postres",
    "Brownies",
    "Cupcakes",
    "Galletas",
];

const tiposCrema = ["Chantilly", "Buttercream", "Fondant", "No aplica"];

const porciones = [
    "Unidad",
    "4-6",
    "6-8",
    "10-14",
    "16-20",
    "20-24",
    "30",
    "40",
    "50",
    "Grande",
];


// Productos que no utilizan crema
const productosSinCrema = [
    "Brownie",
    "Quesillo",
    "Alfajores",
    "NY Cookies",
    "Galletas de mantequilla",
];


// Valores iniciales del formulario
const formularioInicial = {
    nombre: "",
    categoria: "",
    tipo_crema: "",
    porciones: "",
    precio_base: "",
};


function Productos() {

    // Estados del módulo
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [formulario, setFormulario] = useState(formularioInicial);


    // Cargar productos al iniciar el componente
    useEffect(() => {
        cargarProductos();
    }, []);


    // Obtener todos los productos
    async function cargarProductos() {
        try {
            const datos = await productoService.obtenerTodos();
            setProductos(datos);

        } catch (error) {
            console.error(error);
            alert("Error al cargar los productos.");
        }
    }


    // Buscar productos
    async function buscarProducto(texto) {
        setBusqueda(texto);

        try {
            if (texto.trim() === "") {
                cargarProductos();
            } else {
                const datos = await productoService.buscar(texto);
                setProductos(datos);
            }

        } catch (error) {
            console.error(error);
        }
    }


    // Abrir formulario para crear producto
    function abrirNuevo() {
        setModoEdicion(false);
        setFormulario(formularioInicial);
        setMostrarModal(true);
    }


    // Abrir formulario para editar producto
    function abrirEditar(producto) {
        setModoEdicion(true);
        setProductoSeleccionado(producto);

        setFormulario({
            nombre: producto.nombre,
            categoria: producto.categoria,
            tipo_crema: producto.tipo_crema,
            porciones: producto.porciones,
            precio_base: producto.precio_base,
        });

        setMostrarModal(true);
    }


    // Mostrar detalle del producto
    function verDetalle(producto) {
        setProductoSeleccionado(producto);
        setMostrarDetalle(true);
    }


    // Guardar o actualizar producto
    async function guardarProducto(e) {
        e.preventDefault();

        try {
            if (modoEdicion) {

                await productoService.editar(
                    productoSeleccionado.idproducto,
                    formulario
                );

                alert("Producto actualizado correctamente.");

            } else {

                await productoService.crear(formulario);

                alert("Producto registrado correctamente.");
            }

            setMostrarModal(false);
            cargarProductos();

        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al guardar el producto.");
        }
    }


    // Eliminar producto
    async function eliminarProducto(id) {
        const confirmar = window.confirm(
            "¿Deseas eliminar este producto?"
        );

        if (!confirmar) return;

        try {
            await productoService.eliminar(id);

            alert("Producto eliminado correctamente.");

            cargarProductos();

        } catch (error) {
            console.error(error);
            alert("Error al eliminar el producto.");
        }
    }


    // Actualizar datos del formulario
    function manejarCambio(e) {
        const { name, value } = e.target;

        let datos = {
            ...formulario,
            [name]: value,
        };


        // Desactivar crema para productos que no la utilizan
        if (name === "nombre") {

            if (productosSinCrema.includes(value)) {
                datos.tipo_crema = "No aplica";

            } else if (datos.tipo_crema === "No aplica") {
                datos.tipo_crema = "";
            }
        }

        setFormulario(datos);
    }


    return (
        <div className="contenedor-productos">

            <div className="encabezado-modulo">
                <h2>Productos</h2>

                <button
                    className="btn-nuevo"
                    onClick={abrirNuevo}
                >
                    + Nuevo Producto
                </button>
            </div>


            <div className="barra-busqueda">
                <input
                    type="text"
                    placeholder="Buscar por nombre, categoría, crema o porciones..."
                    value={busqueda}
                    onChange={(e) => buscarProducto(e.target.value)}
                />
            </div>


            <table className="tabla-productos">

                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Crema</th>
                        <th>Porciones</th>
                        <th>Precio Base</th>
                        <th>Acciones</th>
                    </tr>
                </thead>


                <tbody>

                    {productos.length === 0 ? (

                        <tr>
                            <td colSpan="6">
                                No hay productos registrados.
                            </td>
                        </tr>

                    ) : (

                        productos.map((producto) => (

                            <tr key={producto.idproducto}>

                                <td>{producto.nombre}</td>

                                <td>{producto.categoria}</td>

                                <td>{producto.tipo_crema}</td>

                                <td>{producto.porciones}</td>

                                <td>
                                    $
                                    {Number(producto.precio_base).toLocaleString(
                                        "es-CO"
                                    )}
                                </td>


                                <td className="acciones">

                                    {/* Ver producto */}
                                    <button
                                        className="btn-ver"
                                        onClick={() => verDetalle(producto)}
                                        title="Ver detalle"
                                    >
                                        <FaEye />
                                    </button>


                                    {/* Editar producto */}
                                    <button
                                        className="btn-editar"
                                        onClick={() => abrirEditar(producto)}
                                        title="Editar producto"
                                    >
                                        <FaEdit />
                                    </button>


                                    {/* Eliminar producto */}
                                    <button
                                        className="btn-eliminar"
                                        onClick={() =>
                                            eliminarProducto(producto.idproducto)
                                        }
                                        title="Eliminar producto"
                                    >
                                        <FaTrash />
                                    </button>

                                </td>

                            </tr>
                        ))
                    )}

                </tbody>

            </table>


            {/* Modal para crear o editar */}
            {mostrarModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h3>
                            {modoEdicion
                                ? "Editar Producto"
                                : "Registrar Producto"}
                        </h3>


                        <form onSubmit={guardarProducto}>

                            <label>Producto</label>

                            <select
                                name="nombre"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">
                                    Seleccione un producto
                                </option>

                                {nombresProductos.map((nombre) => (
                                    <option key={nombre} value={nombre}>
                                        {nombre}
                                    </option>
                                ))}

                            </select>


                            <label>Categoría</label>

                            <select
                                name="categoria"
                                value={formulario.categoria}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">
                                    Seleccione una categoría
                                </option>

                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}

                            </select>


                            <label>Tipo de crema</label>

                            <select
                                name="tipo_crema"
                                value={formulario.tipo_crema}
                                onChange={manejarCambio}
                                disabled={productosSinCrema.includes(
                                    formulario.nombre
                                )}
                                required
                            >
                                <option value="">
                                    Seleccione un tipo de crema
                                </option>

                                {tiposCrema.map((crema) => (
                                    <option key={crema} value={crema}>
                                        {crema}
                                    </option>
                                ))}

                            </select>


                            <label>Porciones</label>

                            <select
                                name="porciones"
                                value={formulario.porciones}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">
                                    Seleccione las porciones
                                </option>

                                {porciones.map((porcion) => (
                                    <option key={porcion} value={porcion}>
                                        {porcion}
                                    </option>
                                ))}

                            </select>


                            <label>Precio Base</label>

                            <input
                                type="number"
                                name="precio_base"
                                value={formulario.precio_base}
                                onChange={manejarCambio}
                                placeholder="Ejemplo: 55000"
                                required
                            />


                            <div className="botones-modal">

                                <button
                                    type="submit"
                                    className="btn-guardar"
                                >
                                    {modoEdicion
                                        ? "Actualizar"
                                        : "Guardar"}
                                </button>

                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setMostrarModal(false)}
                                >
                                    Cancelar
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* Modal con detalle del producto */}
            {mostrarDetalle && productoSeleccionado && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h3>Detalle del Producto</h3>

                        <div className="detalle-cliente">

                            <p>
                                <strong>Producto:</strong>{" "}
                                {productoSeleccionado.nombre}
                            </p>

                            <p>
                                <strong>Categoría:</strong>{" "}
                                {productoSeleccionado.categoria}
                            </p>

                            <p>
                                <strong>Tipo de crema:</strong>{" "}
                                {productoSeleccionado.tipo_crema}
                            </p>

                            <p>
                                <strong>Porciones:</strong>{" "}
                                {productoSeleccionado.porciones}
                            </p>

                            <p>
                                <strong>Precio Base:</strong> $
                                {Number(
                                    productoSeleccionado.precio_base
                                ).toLocaleString("es-CO")}
                            </p>

                        </div>


                        <button
                            className="btn-cerrar"
                            onClick={() => setMostrarDetalle(false)}
                        >
                            Cerrar
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Productos;