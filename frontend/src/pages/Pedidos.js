import React, { useEffect, useState } from "react";
import pedidosService from "../services/pedidosService";
import * as clientesService from "../services/clientesService";
import productoService from "../services/productoService";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/Pedidos.css";


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

        setModoEdicion(false);
        setFormulario(formularioInicial);
        setMostrarModal(true);

    }

    async function abrirEditarPedido(id) {

        try {

            const pedido = await pedidosService.obtenerPorId(id);

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

// CONVERTIR IMAGEN A BASE64 PARA EL PDF

const imagenABase64 = async (url) => {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar la imagen.");
    }

    const blob = await respuesta.blob();

    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.onloadend = () => resolve(lector.result);
        lector.onerror = reject;

        lector.readAsDataURL(blob);
    });
};

// OBTENER PROPORCIÓN DE UNA IMAGEN

const obtenerDimensionesImagen = (base64) => {
    return new Promise((resolve, reject) => {
        const imagen = new Image();

        imagen.onload = () => {
            resolve({
                width: imagen.width,
                height: imagen.height
            });
        };

        imagen.onerror = reject;
        imagen.src = base64;
    });
};

// DESCARGAR DETALLE DEL PEDIDO EN PDF

async function descargarDetallePedido() {

    if (!pedidoSeleccionado) return;

    try {

    const doc = new jsPDF();

        // COLORES VALENCIA CAKES
       
        const lavanda = [179, 154, 201];
        const rosa = [242, 166, 184];
        const rosaClaro = [250, 239, 243];
        const crema = [253, 249, 247];
        const gris = [95, 88, 98];

        // FONDO
        doc.setFillColor(...crema);
        doc.rect(0, 0, 210, 297, "F");

       
        // LOGO
        const logo = await imagenABase64("/imagenes/logo.png");

        const dimensionesLogo =
            await obtenerDimensionesImagen(logo);

        // Mantener proporción original
        const anchoLogo = 48;

        const altoLogo =
            anchoLogo *
            (dimensionesLogo.height /
                dimensionesLogo.width);

        // CABECERA
        doc.setFillColor(...rosaClaro);
        doc.roundedRect(
            12,
            10,
            186,
            48,
            4,
            4,
            "F"
        );

        // Logo a la izquierda
        doc.addImage(
            logo,
            "PNG",
            20,
            13,
            anchoLogo,
            altoLogo
        );

        // Línea vertical
        doc.setDrawColor(...lavanda);
        doc.setLineWidth(0.7);

        doc.line(
            78,
            17,
            78,
            51
        );

        
        // CLIENTE A LA DERECHA DEL LOGO
       
        doc.setTextColor(...lavanda);
        doc.setFont(
            "helvetica",
            "bold"
        );
        doc.setFontSize(10);

        doc.text(
            "INFORMACIÓN DEL CLIENTE",
            86,
            20
        );

        doc.setTextColor(...gris);
        doc.setFont(
            "helvetica",
            "normal"
        );
        doc.setFontSize(8.5);

        doc.text(
            `Cliente: ${
                pedidoSeleccionado.cliente ||
                "No registrado"
            }`,
            86,
            29
        );

        doc.text(
            `Teléfono: ${
                pedidoSeleccionado.telefono ||
                "No registrado"
            }`,
            86,
            36
        );

        const direccion =
            pedidoSeleccionado.direccion_entrega ||
            pedidoSeleccionado.direccion_cliente ||
            "No especificada";

        const direccionLineas =
            doc.splitTextToSize(
                `Dirección: ${direccion}`,
                105
            );

        doc.text(
            direccionLineas,
            86,
            43
        );

        
        // TÍTULO
        doc.setTextColor(...lavanda);
        doc.setFont(
            "helvetica",
            "bold"
        );
        doc.setFontSize(14);

        doc.text(
            `DETALLE DEL PEDIDO #${pedidoSeleccionado.idpedido}`,
            105,
            69,
            {
                align: "center"
            }
        );
        
        // INFORMACIÓN DEL PEDIDO
        doc.setFillColor(...rosa);

        doc.roundedRect(
            14,
            76,
            182,
            8,
            3,
            3,
            "F"
        );

        doc.setTextColor(
            255,
            255,
            255
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);

        doc.text(
            "INFORMACIÓN DEL PEDIDO",
            19,
            81.5
        );

        const fechaPedido =
            pedidoSeleccionado.fecha_pedido
                ? new Date(
                    pedidoSeleccionado.fecha_pedido
                ).toLocaleDateString(
                    "es-CO"
                )
                : "No disponible";

        const fechaEntrega =
            pedidoSeleccionado.fecha_entrega
                ? new Date(
                    pedidoSeleccionado.fecha_entrega
                ).toLocaleDateString(
                    "es-CO"
                )
                : "No disponible";

        doc.setTextColor(...gris);
        doc.setFont(
            "helvetica",
            "normal"
        );
        doc.setFontSize(8.5);

        // Primera fila
        doc.text(
            `Fecha del pedido: ${fechaPedido}`,
            18,
            92
        );

        doc.text(
            `Fecha de entrega: ${fechaEntrega}`,
            105,
            92
        );

        // Segunda fila
        doc.text(
            `Hora: ${
                pedidoSeleccionado.hora_entrega ||
                "No especificada"
            }`,
            18,
            100
        );

        doc.text(
            `Tipo de entrega: ${
                pedidoSeleccionado.tipo_entrega ||
                "No especificado"
            }`,
            105,
            100
        );

        // Tercera fila
        doc.text(
            `Estado: ${
                pedidoSeleccionado.estado ||
                "No especificado"
            }`,
            18,
            108
        );

        // OBSERVACIONES
        let posicionProductos = 117;

        if (
            pedidoSeleccionado.observaciones
        ) {

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "Observaciones:",
                18,
                116
            );

            doc.setFont(
                "helvetica",
                "normal"
            );

            const observaciones =
                doc.splitTextToSize(
                    pedidoSeleccionado.observaciones,
                    170
                );

            doc.text(
                observaciones,
                18,
                122
            );

            posicionProductos =
                122 +
                (observaciones.length * 4) +
                3;
        }

        
        // PRODUCTOS
        doc.setFillColor(...lavanda);

        doc.roundedRect(
            14,
            posicionProductos,
            182,
            8,
            3,
            3,
            "F"
        );

        doc.setTextColor(
            255,
            255,
            255
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);

        doc.text(
            "PRODUCTOS DEL PEDIDO",
            19,
            posicionProductos + 5.5
        );

        const filasProductos =
            pedidoSeleccionado.detalle.map(
                (item) => [
                    item.producto || "",
                    item.tipo_crema || "",
                    item.porciones || "",
                    item.descripcion || "",
                    item.extras || "Sin extras",
                    item.cantidad || 0,
                    `$ ${Number(
                        item.precio_unitario || 0
                    ).toLocaleString(
                        "es-CO"
                    )}`,
                    `$ ${Number(
                        item.subtotal || 0
                    ).toLocaleString(
                        "es-CO"
                    )}`
                ]
            );

        autoTable(doc, {

            startY:
                posicionProductos + 11,

            head: [[
                "Producto",
                "Crema",
                "Porciones",
                "Descripción",
                "Extras",
                "Cant.",
                "Precio",
                "Subtotal"
            ]],

            body: filasProductos,

            theme: "grid",

            margin: {
                left: 14,
                right: 14
            },

            styles: {
                fontSize: 6.3,
                cellPadding: 1.3,
                textColor: gris,
                lineColor: [
                    225,
                    218,
                    228
                ],
                overflow: "linebreak",
                valign: "middle"
            },

            headStyles: {
                fillColor: lavanda,
                textColor: 255,
                fontSize: 6.2,
                fontStyle: "bold",
                halign: "center"
            },

            alternateRowStyles: {
                fillColor: [
                    252,
                    248,
                    252
                ]
            }
        });

        const posicionInferior =
            doc.lastAutoTable.finalY + 8;

     
        // RESUMEN DE PAGO - IZQUIERDA
    
        doc.setFillColor(...rosa);

        doc.roundedRect(
            14,
            posicionInferior,
            92,
            8,
            3,
            3,
            "F"
        );

        doc.setTextColor(
            255,
            255,
            255
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(8.5);

        doc.text(
            "RESUMEN DE PAGO",
            19,
            posicionInferior + 5.5
        );

        doc.setTextColor(...gris);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(8.5);

        doc.text(
            `Total: $ ${Number(
                pedidoSeleccionado.total || 0
            ).toLocaleString("es-CO")}`,
            18,
            posicionInferior + 16
        );

        doc.text(
            `Anticipo: $ ${Number(
                pedidoSeleccionado.anticipo || 0
            ).toLocaleString("es-CO")}`,
            18,
            posicionInferior + 24
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            `Saldo pendiente: $ ${Number(
                pedidoSeleccionado.saldo || 0
            ).toLocaleString("es-CO")}`,
            18,
            posicionInferior + 32
        );

  
        // IMAGEN DE REFERENCIA - DERECHA
       
        if (
            pedidoSeleccionado.imagen_referencia
        ) {

            const urlImagen =
                `${process.env.REACT_APP_API_URL}/uploads/${pedidoSeleccionado.imagen_referencia}`;

            try {

                const imagenReferencia =
                    await imagenABase64(
                        urlImagen
                    );

                const dimensiones =
                    await obtenerDimensionesImagen(
                        imagenReferencia
                    );

                // Título
                doc.setFillColor(...lavanda);

                doc.roundedRect(
                    116,
                    posicionInferior,
                    80,
                    8,
                    3,
                    3,
                    "F"
                );

                doc.setTextColor(
                    255,
                    255,
                    255
                );

                doc.setFont(
                    "helvetica",
                    "bold"
                );

                doc.setFontSize(8);

                doc.text(
                    "IMAGEN DE REFERENCIA",
                    156,
                    posicionInferior + 5.5,
                    {
                        align: "center"
                    }
                );

                // Tamaño máximo
                const anchoMaximo = 62;
                const altoMaximo = 42;

                let ancho =
                    dimensiones.width;

                let alto =
                    dimensiones.height;

                const escala = Math.min(
                    anchoMaximo / ancho,
                    altoMaximo / alto
                );

                ancho *= escala;
                alto *= escala;

                // Centrar dentro de la columna
                const x =
                    116 +
                    ((80 - ancho) / 2);

                const y =
                    posicionInferior + 12;

                // Marco
                doc.setDrawColor(...lavanda);
                doc.setLineWidth(0.5);

                doc.roundedRect(
                    x - 1.5,
                    y - 1.5,
                    ancho + 3,
                    alto + 3,
                    2,
                    2
                );

                    doc.addImage(
                    imagenReferencia,
                    "JPEG",
                    x,
                    y,
                    ancho,
                    alto
                );

            } catch (error) {

                console.error(
                    "No se pudo agregar la imagen de referencia:",
                    error
                );
            }
        }


        // PIE
   
        doc.setFontSize(8);

        doc.setFont(
            "helvetica",
            "italic"
        );

        doc.setTextColor(...lavanda);

        doc.text(
            "Gracias por elegir Valencia Cakes",
            105,
            288,
            {
                align: "center"
            }
        );

        
        // DESCARGAR PDF
        
        doc.save(
            `Pedido-Valencia-Cakes-${pedidoSeleccionado.idpedido}.pdf`
        );

    } catch (error) {

        console.error(
            "Error al generar el PDF:",
            error
        );

        alert(
            "No fue posible generar el PDF del pedido."
        );
    }
}

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

            console.error(error);
            alert("Error al cancelar el pedido.");

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
        alert("Seleccione un producto.");
        return;
    }

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

    if (!formulario.fecha_entrega) {
        alert("Debe seleccionar la fecha de entrega.");
        return;
    }

    if (formulario.detalle.length === 0) {
        alert("Debe agregar al menos un producto.");
        return;
    }

    const total = Number(formulario.total);
    const anticipo = Number(formulario.anticipo || 0);

    if (!Number.isFinite(total) || total <= 0) {
        alert("El total del pedido debe ser mayor que cero.");
        return;
    }

    if (!Number.isFinite(anticipo) || anticipo < 0) {
        alert("El anticipo no puede ser negativo.");
        return;
    }

    if (anticipo > total) {
        alert("El anticipo no puede superar el total del pedido.");
        return;
    }

    try {
        if (modoEdicion) {
            await pedidosService.editar(
                pedidoSeleccionado.idpedido,
                formulario
            );

            alert("Pedido actualizado correctamente.");
        } else {
            await pedidosService.crear(formulario);

            alert("Pedido registrado correctamente.");
        }

        // Limpiar y cerrar solo después de guardar correctamente
        setMostrarModal(false);
        setFormulario(formularioInicial);
        setProductoActual(detalleInicial);

        await cargarPedidos();

    } catch (error) {
        console.error("Error al guardar el pedido:", error);

        alert(
            error.message ||
            "No se pudo guardar el pedido. Los datos del formulario se conservan."
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
        <option value="Pendiente">Pendiente</option>
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

                                <td>{pedido.fecha_entrega
                                    ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CO')
                                    : '-'}</td>

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
            alert("No se pudo actualizar el estado.");
        }
    }}
>
    {pedido.estado === "Pendiente" && (
        <>
            <option value="Pendiente">Pendiente</option>
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

                        <form onSubmit={guardarPedido}>

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

                    <p><strong>Fecha del pedido:</strong>{" "}
                    {new Date(pedidoSeleccionado.fecha_pedido).toLocaleDateString('es-CO')}</p>

                    <p><strong>Fecha de entrega:</strong>{" "}
                    {new Date(pedidoSeleccionado.fecha_entrega).toLocaleDateString('es-CO')}</p>

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
                            src={`${process.env.REACT_APP_API_URL}/uploads/${pedidoSeleccionado.imagen_referencia}`}
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