import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Formatear fechas sin desplazamientos de zona horaria
function formatearFecha(fecha) {
    if (!fecha) return '-';

    const soloFecha = String(fecha).slice(0, 10);
    const partes = soloFecha.split('-');

    if (partes.length !== 3) return '-';

    const [anio, mes, dia] = partes.map(Number);

    if (!anio || !mes || !dia) return '-';

    return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${anio}`;
}

// Convertir imágenes a Base64 para insertarlas en el PDF
async function imagenABase64(ruta) {
    const respuesta = await fetch(ruta, {
        cache: "no-cache"
    });

    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar la imagen: ${ruta}`);
    }

    const blob = await respuesta.blob();

    if (!blob.type.startsWith("image/")) {
        throw new Error("El archivo recibido no es una imagen válida.");
    }

    const base64 = await new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);
        lector.onerror = () => reject(
            new Error("Error al convertir la imagen.")
        );

        lector.readAsDataURL(blob);
    });

    const imagen = new Image();
    imagen.src = base64;

    if (imagen.decode) {
        await imagen.decode();
    } else {
        await new Promise((resolve, reject) => {
            imagen.onload = resolve;
            imagen.onerror = reject;
        });
    }

    return {
        base64,
        width: imagen.naturalWidth,
        height: imagen.naturalHeight
    };
}

// Preparar el logo para el diseño del PDF
async function prepararLogoPDF(ruta) {
    const respuesta = await fetch(ruta, {
        cache: "no-cache"
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar el logo");
    }

    const blob = await respuesta.blob();
    const url = URL.createObjectURL(blob);

    try {
        const imagen = new Image();
        imagen.src = url;

        await imagen.decode();

        const canvasOriginal = document.createElement("canvas");
        canvasOriginal.width = imagen.naturalWidth;
        canvasOriginal.height = imagen.naturalHeight;

        const contexto = canvasOriginal.getContext("2d");
        contexto.drawImage(imagen, 0, 0);

        const datos = contexto.getImageData(
            0, 0,
            canvasOriginal.width,
            canvasOriginal.height
        ).data;

        let minX = canvasOriginal.width;
        let minY = canvasOriginal.height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < canvasOriginal.height; y++) {
            for (let x = 0; x < canvasOriginal.width; x++) {
                const alfa = datos[(y * canvasOriginal.width + x) * 4 + 3];

                if (alfa > 10) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        const padding = 8;

        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(canvasOriginal.width - 1, maxX + padding);
        maxY = Math.min(canvasOriginal.height - 1, maxY + padding);

        const ancho = maxX - minX + 1;
        const alto = maxY - minY + 1;

        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = ancho * 2;
        canvasFinal.height = alto * 2;

        const ctx = canvasFinal.getContext("2d");

        // Fondo igual al de la cabecera del PDF
        ctx.fillStyle = "rgb(250, 239, 243)";
        ctx.fillRect(0, 0, canvasFinal.width, canvasFinal.height);

        ctx.drawImage(
            imagen,
            minX, minY, ancho, alto,
            0, 0, canvasFinal.width, canvasFinal.height
        );

        return {
            base64: canvasFinal.toDataURL("image/jpeg", 0.95),
            width: canvasFinal.width,
            height: canvasFinal.height
        };

    } finally {
        URL.revokeObjectURL(url);
    }
}

// Generar y descargar el detalle del pedido en PDF
export async function generarPDFPedido(pedido) {

    if (!pedido) return;

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
        const datosLogo = await prepararLogoPDF("/imagenes/logo.png");

        const anchoLogo = 48;

        const altoLogo =
            anchoLogo * (datosLogo.height / datosLogo.width);

        const posicionLogoY = 10 + (48 - altoLogo) / 2;

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

        // LOGO
        doc.addImage(
            datosLogo.base64,
            "JPEG",
            20,
            posicionLogoY,
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
                pedido.cliente ||
                "No registrado"
            }`,
            86,
            29
        );

        doc.text(
            `Teléfono: ${
                pedido.telefono ||
                "No registrado"
            }`,
            86,
            36
        );

        const direccion =
            pedido.direccion_entrega ||
            pedido.direccion_cliente ||
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
            `DETALLE DEL PEDIDO #${pedido.idpedido}`,
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

        const fechaPedido = formatearFecha(
            pedido.fecha_pedido
        );

        const fechaEntrega = formatearFecha(
            pedido.fecha_entrega
        );

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
                pedido.hora_entrega ||
                "No especificada"
            }`,
            18,
            100
        );

        doc.text(
            `Tipo de entrega: ${
                pedido.tipo_entrega ||
                "No especificado"
            }`,
            105,
            100
        );

        // Tercera fila
        doc.text(
            `Estado: ${
                pedido.estado ||
                "No especificado"
            }`,
            18,
            108
        );

        // OBSERVACIONES
        let posicionProductos = 117;

        if (
            pedido.observaciones
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
                    pedido.observaciones,
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
            pedido.detalle.map(
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
                pedido.total || 0
            ).toLocaleString("es-CO")}`,
            18,
            posicionInferior + 16
        );

        doc.text(
            `Anticipo: $ ${Number(
                pedido.anticipo || 0
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
                pedido.saldo || 0
            ).toLocaleString("es-CO")}`,
            18,
            posicionInferior + 32
        );

                // IMAGEN DE REFERENCIA - DERECHA
        if (
            pedido.imagen_referencia
        ) {

            const urlImagen = pedido.imagen_referencia.startsWith('http')
                ? pedido.imagen_referencia
                : `${process.env.REACT_APP_API_URL}/uploads/${pedido.imagen_referencia}`;

            try {

                const datosReferencia = await imagenABase64(urlImagen);

                const imagenReferencia = datosReferencia.base64;

                const dimensiones = {
                    width: datosReferencia.width,
                    height: datosReferencia.height
                };

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
            `Pedido-Valencia-Cakes-${pedido.idpedido}.pdf`
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
