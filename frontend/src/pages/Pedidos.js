import React, { useEffect, useState } from "react";
import pedidosService from "../services/pedidosService";
import * as clientesService from "../services/clientesService";
import productoService from "../services/productoService";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { generarPDFPedido } from "../utils/pedidoPDF";
import "../css/Pedidos.css";


// Convertir fechas de calendario sin desplazamientos de zona horaria
function formatearFecha(fecha) {
    if (!fecha) return '-';

    const soloFecha = String(fecha).slice(0, 10);
    const partes = soloFecha.split('-');

    if (partes.length !== 3) return '-';

    const [anio, mes, dia] = partes.map(Number);

    if (!anio || !mes || !dia) return '-';

    return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${anio}`;
}


const formularioInicial = {
    idcliente: "",
    fecha_entrega: "",
    hora_entrega: "",
    tipo_entrega: "Domicilio",
    direccion_entrega: "",
    observaciones: "",
    anticipo: 0,
    total: 0,
    saldo: 0,
    imagen_referencia: null,
    detalle: []
};

function Pedidos() {

    const navigate = useNavigate();
    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const detalleInicial = {
    idproducto: "",
    descripcion: "",
    extras: "",
    valor_extras: 0,
    cantidad: 1,
    precio_base: 0,
    precio_unitario: 0,
    subtotal: 0
    };
    const [origenDetalle, setOrigenDetalle] = useState(null);
    const [productoActual, setProductoActual] = useState(detalleInicial);

    useEffect(() => {

        cargarPedidos();
        cargarClientes();
        cargarProductos();

    }, []);

    async function cargarPedidos() {

        try {

            const datos = await pedidosService.obtenerTodos();
            setPedidos(datos);

        } catch (error) {

            console.error(error);
            alert("Error al cargar los pedidos.");

        }

    }
  
useEffect(() => {
    if (location.state?.abrirPedido) {
        setOrigenDetalle(location.state.origen || null);

        abrirDetalleDesdeDashboard(location.state.abrirPedido);

        // Limpiar el state para que no vuelva a abrir el modal
        navigate("/Pedidos", { replace: true });
    }
}, [location.state, navigate]);

//CARGAR CLIENTES
    async function cargarClientes() {

        try {

            const datos = await clientesService.obtenerClientes();
            setClientes(datos);

        } catch (error) {

            console.error(error);

        }

    }

    async function cargarProductos() {

       try {

        const datos = await productoService.obtenerTodos();
        setProductos(datos);

    } catch (error) {

        console.error(error);

    }

    }

    async function buscarPedido(texto) {

        setBusqueda(texto);

        try {

            if (texto.trim() === "") {

                cargarPedidos();

            } else {

                const datos = await pedidosService.buscar(texto);
                setPedidos(datos);

            }

        } catch (error) {

            console.error(error);

        }

    }

    
function obtenerPedidosFiltrados() {
    if (filtroEstado) {
        return pedidos.filter(
            pedido => pedido.estado === filtroEstado
        );
    }

    if (filtroFecha) {
        return pedidos.filter(pedido => {
            if (!pedido.fecha_entrega) return false;

            const fecha = String(pedido.fecha_entrega).slice(0, 10);

            return fecha === filtroFecha;
        });
    }

    return pedidos;
}

const pedidosFiltrados = obtenerPedidosFiltrados();


    function abrirNuevoPedido() {
        setMensaje('');
        setError('');
        setModoEdicion(false);
        setFormulario(formularioInicial);
        setMostrarModal(true);

    }

    async function abrirEditarPedido(id) {
            
        try {

            const pedido = await pedidosService.obtenerPorId(id);
            setMensaje('');
            setError('');
            setModoEdicion(true);
            setPedidoSeleccionado(pedido);
            setFormulario(pedido);

            setMostrarModal(true);

        } catch (error) {

            console.error(error);

        }

    }

    async function verPedido(id) {

        try {

            const pedido = await pedidosService.obtenerPorId(id);

console.log("IMAGEN RECIBIDA DEL BACKEND:", pedido.imagen_referencia);
console.log("PEDIDO RECIBIDO:", pedido);

setPedidoSeleccionado(pedido);
setMostrarDetalle(true);

        } catch (error) {

            console.error(error);

        }

    }

    //cerrar detalle del pedido desde el historial del cliente
const cerrarDetallePedido = () => {
    setMostrarDetalle(false);

    if (origenDetalle === 'historialCliente') {
        setOrigenDetalle(null);
        navigate('/Clientes', { replace: true });
    }
};

// descarga detalle en pdf
async function descargarDetallePedido() {
    if (!pedidoSeleccionado) return;

    await generarPDFPedido(pedidoSeleccionado);
}
        
   // Ver detalle del pedido desde el dashboard en las alertas de proximos pedidos     
    async function abrirDetalleDesdeDashboard(id) {

    try {

        const pedido = await pedidosService.obtenerPorId(id);

        setPedidoSeleccionado(pedido);
        setMostrarDetalle(true);

    } catch (error) {

        console.error(error);

    }

}

// cancelar pedido
    async function cancelarPedido(id) {

        const confirmar = window.confirm(
            "¿Deseas cancelar este pedido? El historial se conservará."
        );

        if (!confirmar) return;

        try {

            await pedidosService.cancelar(id);

            alert("Pedido cancelado correctamente.");

            cargarPedidos();

        } catch (error) {
    console.error("Error al cancelar el pedido:", error);

    await cargarPedidos();

    alert(
        error.message ||
        "No se pudo cancelar el pedido."
    );
    }
    }

    //cambio en direccion del cliente
   function manejarCambio(e) {

    const { name, value } = e.target;

    let datos = {
        ...formulario,
        [name]: value
    };

    // Si cambia el cliente
    if (name === "idcliente") {

        const cliente = clientes.find(
            c => Number(c.idcliente) === Number(value)
        );

        if (cliente && datos.tipo_entrega === "Domicilio") {
            datos.direccion_entrega = cliente.direccion || "";
        }

    }

    // Si cambia el tipo de entrega
    if (name === "tipo_entrega") {

        if (value === "Recoger en tienda") {
            datos.direccion_entrega = "";
        }

        if (value === "Domicilio") {

            const cliente = clientes.find(
                c => Number(c.idcliente) === Number(datos.idcliente)
            );

            if (cliente) {
                datos.direccion_entrega = cliente.direccion || "";
            }
        }
    }

    setFormulario(datos);
}

// MANEJO DE PRODUCTOS DEL PEDIDO

function seleccionarProducto(idProducto) {

    const producto = productos.find(
        p => Number(p.idproducto) === Number(idProducto)
    );

    if (!producto) return;

    const precioBase = Number(producto.precio_base);

    setProductoActual({
        ...productoActual,
        idproducto: producto.idproducto,
        precio_base: precioBase,
        precio_unitario: precioBase,
        subtotal: precioBase * productoActual.cantidad
    });

}

//actualizar producto del pedido
function actualizarProducto(e) {

    const { name, value } = e.target;

    let nuevoProducto = {
        ...productoActual,
        [name]: value
    };

    const precioBase = Number(nuevoProducto.precio_base);
    const extras = Number(nuevoProducto.valor_extras || 0);
    const cantidad = Number(nuevoProducto.cantidad || 1);

    nuevoProducto.precio_unitario = precioBase + extras;
    nuevoProducto.subtotal = (precioBase + extras) * cantidad;

    setProductoActual(nuevoProducto);

}

//agregar otros productos
function agregarProducto() {

    if (!productoActual.idproducto) {
        setError('Seleccione un producto antes de agregarlo al pedido.');
    return;
}

setError('');

    const nuevoDetalle = [...formulario.detalle, productoActual];

    const total = nuevoDetalle.reduce(
        (acum, item) => acum + Number(item.subtotal),
        0
    );

    const saldo = total - Number(formulario.anticipo || 0);

    setFormulario({
        ...formulario,
        detalle: nuevoDetalle,
        total,
        saldo
    });

    setProductoActual(detalleInicial);

}

//eliminar un producto
function eliminarProductoDetalle(indice) {

    const nuevoDetalle = formulario.detalle.filter(
        (_, i) => i !== indice
    );

    const total = nuevoDetalle.reduce(
        (acum, item) => acum + Number(item.subtotal),
        0
    );

    const saldo = total - Number(formulario.anticipo || 0);

    setFormulario({
        ...formulario,
        detalle: nuevoDetalle,
        total,
        saldo
    });

}

// ANTICIPO Y SALDO
function cambiarAnticipo(e) {

    const anticipo = Number(e.target.value || 0);

    setFormulario({
        ...formulario,
        anticipo,
        saldo: Number(formulario.total) - anticipo
    });
}

// GUARDAR PEDIDO
async function guardarPedido(e) {

    e.preventDefault();

    setMensaje('');
    setError('');

    // Validar cliente
    if (!formulario.idcliente) {
        setError('Debes seleccionar un cliente.');
        return;
    }

    // Validar fecha de entrega
    if (!formulario.fecha_entrega) {
        setError('Debe seleccionar la fecha de entrega.');
        return;
    }

    // Validar productos
    if (formulario.detalle.length === 0) {
        setError('Debe agregar al menos un producto.');
        return;
    }

    const total = Number(formulario.total);
    const anticipo = Number(formulario.anticipo || 0);

    // Validar total
    if (!Number.isFinite(total) || total <= 0) {
        setError('El total del pedido debe ser mayor que cero.');
        return;
    }

    // Validar anticipo
    if (!Number.isFinite(anticipo) || anticipo < 0) {
        setError('El anticipo no puede ser negativo.');
        return;
    }

    if (anticipo > total) {
        setError('El anticipo no puede superar el total del pedido.');
        return;
    }

    try {

        if (modoEdicion) {

            const { estado, ...datosEdicion } = formulario;

            await pedidosService.editar(
                pedidoSeleccionado.idpedido,
                datosEdicion
            );

            setMensaje('Pedido actualizado correctamente.');

        } else {

            await pedidosService.crear(formulario);

            setMensaje('Pedido registrado correctamente.');
        }

        // Cerrar y limpiar después de guardar correctamente
        setMostrarModal(false);
        setFormulario(formularioInicial);
        setProductoActual(detalleInicial);

        await cargarPedidos();

    } catch (error) {

        console.error('Error al guardar el pedido:', error);

        setError(
            error.message ||
            'No se pudo guardar el pedido. Los datos del formulario se conservan.'
        );
    }
}

    return (

        <div className="contenedor-pedidos">

            <div className="encabezado-modulo">
                
                <h2>Pedidos</h2>

                <button
                    className="btn-nuevo"
                    onClick={abrirNuevoPedido}
                >
                    + Nuevo Pedido
                </button>

            </div>
            {mensaje && (
    <div className="pedido-mensaje-exito">
        {mensaje}
    </div>
)}

{error && !mostrarModal && (
    <div className="pedido-mensaje-error">
        {error}
    </div>
)}
            
<div className="barra-busqueda">
    <input
        type="text"
        placeholder="Buscar por nombre o teléfono del cliente..."
        value={busqueda}
        onChange={(e) => {
            setFiltroEstado("");
            setFiltroFecha("");
            buscarPedido(e.target.value);
        }}
    />

    <select
        value={filtroEstado}
        onChange={(e) => {
            setFiltroEstado(e.target.value);
            setFiltroFecha("");
            setBusqueda("");
            cargarPedidos();
        }}
    >
        <option value="">Filtrar por estado</option>
        <option value="Pendiente" disabled>Pendiente</option>
        <option value="En preparación">En preparación</option>
        <option value="Listo para entregar">Listo para entregar</option>
        <option value="Entregado">Entregado</option>
        <option value="Cancelado">Cancelado</option>
    </select>

    <input
        type="date"
        value={filtroFecha}
        onChange={(e) => {
            setFiltroFecha(e.target.value);
            setFiltroEstado("");
            setBusqueda("");
            cargarPedidos();
        }}
        aria-label="Filtrar por fecha de entrega"
    />

    <button
        type="button"
        onClick={() => {
            setFiltroEstado("");
            setFiltroFecha("");
            setBusqueda("");
            cargarPedidos();
        }}
    >
        Limpiar filtros
    </button>
</div>


            <table className="tabla-pedidos">

                <thead>

                    <tr>

                        <th>Pedido</th>
                        <th>Cliente</th>
                        <th>Fecha Entrega</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {pedidosFiltrados.length === 0 ? (

                        <tr>
                            <td colSpan="7">
                                No hay pedidos registrados.
                            </td>
                        </tr>

                    ) : (

                        pedidosFiltrados.map((pedido) => (

                            <tr key={pedido.idpedido}>

                                <td>#{pedido.idpedido}</td>

                                <td>{pedido.cliente}</td>

                                <td>{formatearFecha(pedido.fecha_entrega)}</td>

                                <td>{pedido.hora_entrega}</td>

                                <td>

                        <select
    className={`estado-select ${pedido.estado.toLowerCase().replaceAll(" ", "-")}`}
    value={pedido.estado}
    disabled={
        pedido.estado === "Cancelado" ||
        pedido.estado === "Entregado"
    }
    onChange={async (e) => {
        const nuevoEstado = e.target.value;

        try {
            const resultado = await pedidosService.actualizarEstado(
                pedido.idpedido,
                nuevoEstado
            );

            if (resultado.mensaje) {
                alert(resultado.mensaje);
            }

            cargarPedidos();

        } catch (error) {
            console.error("Error al actualizar estado:", error);

            await cargarPedidos();
            alert(
                error.message ||
                "No se pudo actualizar el estado.");
        }
    }}
>
    {pedido.estado === "Pendiente" && (
        <>
            <option value="Pendiente" disabled>Pendiente</option>
            <option value="En preparación">En preparación</option>
        </>
    )}

    {pedido.estado === "En preparación" && (
        <>
            <option value="En preparación">En preparación</option>
            <option value="Listo para entregar">Listo para entregar</option>
        </>
    )}

    {pedido.estado === "Listo para entregar" && (
        <>
            <option value="Listo para entregar">Listo para entregar</option>
            <option value="Entregado">Entregado</option>
        </>
    )}

    {pedido.estado === "Entregado" && (
        <option value="Entregado">Entregado</option>
    )}

    {pedido.estado === "Cancelado" && (
        <option value="Cancelado">Cancelado</option>
    )}
</select>

                            </td>

                                <td>
                                    $
                                    {Number(pedido.total).toLocaleString("es-CO")}
                                </td>

                                <td className="acciones">

                                    <button
                                        className="btn-ver"
                                        onClick={() => verPedido(pedido.idpedido)}
                                    >
                                        <FaEye />
                                    </button>

                                    <button
                                        className="btn-editar"
                                        onClick={() => abrirEditarPedido(pedido.idpedido)}
                                        disabled={pedido.estado === "Cancelado" ||
                                    pedido.estado === "Entregado"}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="btn-eliminar"
                                        onClick={() => cancelarPedido(pedido.idpedido)}
                                        disabled={pedido.estado !== "Pendiente"}
                                    >
                                        <FaTimes/>
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

            {mostrarModal && (

                <div className="modal-overlay">

                    <div className="modal modal-pedido">

                        <h3>
                            {modoEdicion ? "Editar Pedido" : "Registrar Pedido"}
                        </h3>

                        <form onSubmit={guardarPedido} noValidate>

                            {error && (
                        <div className="pedido-mensaje-error">
                            {error}
                        </div>
                    )}

                            <div className="grid-pedido">

                                <div>

                                    <label>Cliente</label>

                                    <select
                                        name="idcliente"
                                        value={formulario.idcliente}
                                        onChange={manejarCambio}
                                        required
                                    >

                                        <option value="">Seleccione un cliente</option>

                                        {clientes.map(cliente => (

                                            <option
                                                key={cliente.idcliente}
                                                value={cliente.idcliente}
                                            >
                                                {cliente.nombre}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div>

                                    <label>Fecha de entrega</label>

                                    <input
                                        type="date"
                                        name="fecha_entrega"
                                        value={formulario.fecha_entrega}
                                        onChange={manejarCambio}
                                    />

                                </div>

                                <div>

                                    <label>Hora de entrega</label>

                                    <input
                                        type="time"
                                        name="hora_entrega"
                                        value={formulario.hora_entrega}
                                        onChange={manejarCambio}
                                    />

                                </div>

                                <div>

                                    <label>Tipo de entrega</label>

                                    <select
                                        name="tipo_entrega"
                                        value={formulario.tipo_entrega}
                                        onChange={manejarCambio}
                                    >

                                        <option>Domicilio</option>
                                        <option>Recoger en tienda</option>

                                    </select>

                                </div>

                                <div className="campo-completo">

                                    <label>Dirección de entrega</label>

                                    <input
                                        type="text"
                                        name="direccion_entrega"
                                        value={formulario.direccion_entrega}
                                        onChange={manejarCambio}
                                        disabled={formulario.tipo_entrega === "Recoger en tienda"}
                                        placeholder={formulario.tipo_entrega === "Recoger en tienda"
                                        ? "El cliente recogerá el pedido."
                                        : "Dirección de entrega"
                                        }
                                    />

                                </div>

                                <div className="campo-completo">

                                    <label>Observaciones</label>

                                    <textarea
                                        rows="3"
                                        name="observaciones"
                                        value={formulario.observaciones}
                                        onChange={manejarCambio}
                                    />

                                </div>

                            </div>

                            <hr />

                            <div className="campo-formulario campo-imagen">
    <label>Imagen de referencia</label>

    <label className="selector-imagen">
        <span className="icono-imagen">📷</span>

        <span className="texto-imagen">
            <strong>Seleccionar imagen</strong>
            <small>JPG, PNG o WEBP · Máximo 5 MB</small>
        </span>

        <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) =>
                setFormulario({
                    ...formulario,
                    imagen_referencia: e.target.files[0] || null
                })
            }
        />
    </label>

    {formulario.imagen_referencia instanceof File && (
        <div className="nombre-imagen">
            ✓ {formulario.imagen_referencia.name}
        </div>
    )}
</div>

                            <h4>Productos del pedido</h4>

                            <div className="producto-card">

    <h5>Agregar producto</h5>

    <div className="grid-producto">

        <div>

            <label>Producto</label>

            <select
                value={productoActual.idproducto}
                onChange={(e) => seleccionarProducto(e.target.value)}
            >

                <option value="">Seleccione un producto</option>

                {productos.map(producto => (

                    <option
                        key={producto.idproducto}
                        value={producto.idproducto}
                    >
                        {producto.nombre} | {producto.tipo_crema} | {producto.porciones}
                    </option>

                ))}

            </select>

        </div>

        <div>

            <label>Precio base</label>

            <input
                value={`$ ${Number(productoActual.precio_base).toLocaleString("es-CO")}`}
                readOnly
            />

        </div>

        <div>

            <label>Cantidad</label>

            <input
                type="number"
                name="cantidad"
                min="1"
                value={productoActual.cantidad}
                onChange={actualizarProducto}
            />

        </div>

        <div className="campo-completo">

            <label>Descripción del producto</label>

            <textarea
                rows="2"
                name="descripcion"
                value={productoActual.descripcion}
                onChange={actualizarProducto}
            />

        </div>

        <div className="campo-completo">

            <label>Extras</label>

            <textarea
                rows="2"
                name="extras"
                value={productoActual.extras}
                onChange={actualizarProducto}
            />

        </div>

        <div>

            <label>Valor extras</label>

            <input
                type="number"
                name="valor_extras"
                min="0"
                step="1"
                value={productoActual.valor_extras}
                onChange={actualizarProducto}
            />

        </div>

        <div>

            <label>Precio final</label>

            <input
                value={`$ ${Number(productoActual.precio_unitario).toLocaleString("es-CO")}`}
                readOnly
            />

        </div>

        <div>

            <label>Subtotal</label>

            <input
                value={`$ ${Number(productoActual.subtotal).toLocaleString("es-CO")}`}
                readOnly
            />

        </div>

    </div>

    <button
        type="button"
        className="btn-agregar-producto"
        onClick={agregarProducto}
    >
        + Agregar al pedido
    </button>

</div>

<hr />

<h4>Productos agregados</h4>

<table className="tabla-detalle">

    <thead>

        <tr>

            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Final</th>
            <th>Subtotal</th>
            <th></th>

        </tr>

    </thead>

    <tbody>

        {formulario.detalle.length === 0 ? (

            <tr>
                <td colSpan="5">
                    No hay productos agregados.
                </td>
            </tr>

        ) : (

            formulario.detalle.map((item, index) => {

                const producto = productos.find(
                    p => Number(p.idproducto) === Number(item.idproducto)
                );

                return (

                    <tr key={index}>

                        <td>
                            {producto
                                ? `${producto.nombre} (${producto.tipo_crema} - ${producto.porciones})`
                                : "Producto"}
                        </td>

                        <td>{item.cantidad}</td>

                        <td>
                            $
                            {Number(item.precio_unitario).toLocaleString("es-CO")}
                        </td>

                        <td>
                            $
                            {Number(item.subtotal).toLocaleString("es-CO")}
                        </td>

                        <td>

                            <button
                                type="button"
                                className="btn-eliminar"
                                onClick={() => eliminarProductoDetalle(index)}
                            >
                                <FaTrash />
                            </button>

                        </td>

                    </tr>

                );

            })

        )}

    </tbody>

</table>

<hr />

<h4>Resumen del pedido</h4>

<div className="grid-totales">

    <div>

        <label>Total del pedido</label>

        <input
            value={`$ ${Number(formulario.total).toLocaleString("es-CO")}`}
            readOnly
        />

    </div>

    <div>

        <label>Anticipo</label>

        <input
            type="number"
            min="0"
            step="1"
            value={formulario.anticipo}
            onChange={cambiarAnticipo}
        />

    </div>

    <div>

        <label>Saldo pendiente</label>

        <input
            value={`$ ${Number(formulario.saldo).toLocaleString("es-CO")}`}
            readOnly
        />

    </div>

</div>

                            <div className="botones-modal">

                                <button
                                    type="submit"
                                    className="btn-guardar"
                                >
                                    {modoEdicion ? "Actualizar Pedido" : "Guardar Pedido"}
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

           {mostrarDetalle && pedidoSeleccionado && (

    <div className="modal-overlay">

        <div className="modal modal-detalle-pedido">

            <h3>Detalle del Pedido #{pedidoSeleccionado.idpedido}</h3>

            <div className="detalle-pedido">

                <div className="detalle-seccion">

                    <h4>Información del Cliente</h4>

                    <p><strong>Cliente:</strong> {pedidoSeleccionado.cliente}</p>

                    <p><strong>Teléfono:</strong> {pedidoSeleccionado.telefono}</p>

                    <p><strong>Dirección:</strong> {pedidoSeleccionado.direccion_entrega}</p>

                </div>

                <div className="detalle-seccion">

                    <h4>Información del Pedido</h4>

                    <p><strong>Fecha del pedido:</strong>{" "}{formatearFecha(pedidoSeleccionado.fecha_pedido)}</p>

                    <p><strong>Fecha de entrega:</strong>{" "}{formatearFecha(pedidoSeleccionado.fecha_entrega)}</p>

                    <p><strong>Hora:</strong> {pedidoSeleccionado.hora_entrega}</p>

                    <p><strong>Tipo de entrega:</strong> {pedidoSeleccionado.tipo_entrega}</p>

                    <p><strong>Estado:</strong> {pedidoSeleccionado.estado}</p>

                    <p><strong>Observaciones:</strong> {pedidoSeleccionado.observaciones}</p>

                </div>

                <div className="detalle-seccion">

                    <h4>Productos del Pedido</h4>

                    {pedidoSeleccionado.detalle.map((item, index) => (

                        <div key={index} className="producto-detalle">

                            <p><strong>Producto:</strong> {item.producto}</p>

                            <p><strong>Crema:</strong> {item.tipo_crema}</p>

                            <p><strong>Porciones:</strong> {item.porciones}</p>

                            <p><strong>Descripción:</strong> {item.descripcion}</p>

                            <p><strong>Extras:</strong> {item.extras || "Sin extras"}</p>

                            <p>
                                <strong>Valor extras:</strong> $
                                {Number(item.valor_extras).toLocaleString("es-CO")}
                            </p>

                            <p><strong>Cantidad:</strong> {item.cantidad}</p>

                            <p>
                                <strong>Precio unitario:</strong> $
                                {Number(item.precio_unitario).toLocaleString("es-CO")}
                            </p>

                            <p>
                                <strong>Subtotal:</strong> $
                                {Number(item.subtotal).toLocaleString("es-CO")}
                            </p>

                            <hr/>

                        </div>

                    ))}

                </div>

                <div className="detalle-seccion">

                    <h4>Pago</h4>

                    <p>
                        <strong>Total:</strong> $
                        {Number(pedidoSeleccionado.total).toLocaleString("es-CO")}
                    </p>

                    <p>
                        <strong>Anticipo:</strong> $
                        {Number(pedidoSeleccionado.anticipo).toLocaleString("es-CO")}
                    </p>

                    <p>
                        <strong>Saldo pendiente:</strong> $
                        {Number(pedidoSeleccionado.saldo).toLocaleString("es-CO")}
                    </p>

                </div>

                {pedidoSeleccionado.imagen_referencia && (

                    <div className="detalle-seccion">

                        <h4>Imagen de referencia</h4>

                        <img
    className="imagen-referencia"
    src={
        pedidoSeleccionado.imagen_referencia.startsWith("http")
            ? pedidoSeleccionado.imagen_referencia
            : `${process.env.REACT_APP_API_URL}/uploads/${pedidoSeleccionado.imagen_referencia}`
    }
    alt="Imagen de referencia"
/>
                    </div>

                )}

            </div>

            <div className="botones-detalle">
                <button type="button" className="btn-descargar-pdf" onClick={descargarDetallePedido}>

                 Descargar detalle
            </button>

            <button
                    type="button" className="btn-cerrar" onClick={cerrarDetallePedido}>
                Cerrar
            </button>
            </div>
            
        </div>

    </div>
)}
    </div>
    );
}

export default Pedidos;