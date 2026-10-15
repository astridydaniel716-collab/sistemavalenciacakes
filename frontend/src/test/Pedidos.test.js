import React from "react";
import {
    render,
    screen,
    waitFor,
    fireEvent,
    within
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Pedidos from "../pages/Pedidos";
import jsPDF from "jspdf";
/* =========================================================
   MOCK DE REACT ROUTER
   ========================================================= */
jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({
        state: null
    })
}));
/* =========================================================
   MOCK DE JSPDF
   ========================================================= */
jest.mock("jspdf", () => {
    const mockDoc = {
        setFillColor: jest.fn(),
        rect: jest.fn(),
        roundedRect: jest.fn(),
        addImage: jest.fn(),
        setDrawColor: jest.fn(),
        setLineWidth: jest.fn(),
        line: jest.fn(),
        setTextColor: jest.fn(),
        setFont: jest.fn(),
        setFontSize: jest.fn(),
        text: jest.fn(),
        splitTextToSize: jest.fn(() => ["texto"]),
        save: jest.fn(),
        lastAutoTable: { finalY: 160 }
    };

    const JsPDFMock = jest.fn(function () {
        return mockDoc;
    });

   JsPDFMock.mockDoc = mockDoc;

return {
    __esModule: true,
    default: JsPDFMock
};
});


/* =========================================================
   MOCK DE JSPDF-AUTOTABLE
   ========================================================= */
jest.mock("jspdf-autotable", () => ({
    __esModule: true,
    default: jest.fn()
}));
/* =========================================================
   PRUEBAS
   ========================================================= */
jsPDF.mockImplementation(() => jsPDF.mockDoc);
jsPDF.mockDoc.splitTextToSize.mockReturnValue(["texto"]);
describe("Pruebas del módulo de pedidos", () => {
    beforeEach(() => {
    jsPDF.mockImplementation(() => jsPDF.mockDoc);
    jsPDF.mockDoc.splitTextToSize.mockReturnValue(["texto"]);

    global.fetch = jest.fn(async (url) => {
            /* -----------------------------------------
               PEDIDOS
            ----------------------------------------- */
            if (url.includes("/app/pedidos/todos")) {
                return {
                    ok: true,
                    json: async () => []
                };
            }
            /* -----------------------------------------
               CLIENTES
            ----------------------------------------- */
            if (url.includes("/app/clientes/todos")) {
                return {
                    ok: true,
                    json: async () => [
                        {
                            idcliente: 1,
                            nombre: "Cliente de prueba",
                            telefono: "3000000000",
                            correo: "cliente@test.com",
                            direccion: "Calle 10 #20-30",
                            observaciones: ""
                        }
                    ]
                };
            }
            /* -----------------------------------------
               PRODUCTOS
            ----------------------------------------- */
            if (url.includes("/app/productos/todos")) {
                return {
                    ok: true,
                    json: async () => [
                        {
                            idproducto: 1,
                            nombre: "Torta de chocolate",
                            tipo_crema: "Chocolate",
                            porciones: "10",
                            precio_base: 50000
                        }
                    ]
                };
            }
            return {
                ok: true,
                json: async () => []
            };
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });


    /* =====================================================
       F-PED-01
       ===================================================== */
    test(
        "F-PED-01 - calcula correctamente el subtotal según precio y cantidad",
        async () => {
            render(<Pedidos />);
            await waitFor(() => {
                expect(
                    screen.getByRole("heading", {
                        name: "Pedidos"
                    })
                ).toBeInTheDocument();
            });
            const botonNuevo =
                screen.getByRole("button", {
                    name: /\+ Nuevo Pedido/i
                });
            fireEvent.click(botonNuevo);
            expect(
                screen.getByRole("heading", {
                    name: "Registrar Pedido"
                })
            ).toBeInTheDocument();
            await waitFor(() => {
                expect(
                    screen.getByRole("option", {
                        name: /Torta de chocolate/i
                    })
                ).toBeInTheDocument();
            });
            const productoSelect =
                screen
                    .getAllByRole("combobox")
                    .find(select =>
                        Array.from(select.options).some(
                            option =>
                                option.textContent.includes(
                                    "Torta de chocolate"
                                )
                        )
                    );
            expect(productoSelect).toBeDefined();
            fireEvent.change(productoSelect, {
                target: {
                    value: "1"
                }
            });
            const valores50Mil =
                screen.getAllByDisplayValue("$ 50.000");
            expect(valores50Mil).toHaveLength(3);
            const cantidades =
                screen.getAllByRole("spinbutton");
            const cantidad =
                cantidades.find(
                    input =>
                        input.name === "cantidad"
                );
            expect(cantidad).toBeInTheDocument();
            fireEvent.change(cantidad, {
                target: {
                    value: "2"
                }
            });
            const valores100Mil =
                screen.getAllByDisplayValue("$ 100.000");
            expect(valores100Mil).toHaveLength(1);
        }
    );
    /* =====================================================
       F-PED-02
       ===================================================== */
    test(
        "F-PED-02 - permite cargar una imagen de referencia",
        async () => {
            render(<Pedidos />);
            await waitFor(() => {
                expect(
                    screen.getByRole("heading", {
                        name: "Pedidos"
                    })
                ).toBeInTheDocument();
            });
            fireEvent.click(
                screen.getByRole("button", {
                    name: /\+ Nuevo Pedido/i
                })
            );
            const inputImagen =
                screen.getByLabelText(/imagen/i);
            expect(
                inputImagen
            ).toBeInTheDocument();
            const archivo =
                new File(
                    ["imagen de prueba"],
                    "referencia.jpg",
                    {
                        type: "image/jpeg"
                    }
                );
            fireEvent.change(
                inputImagen,
                {
                    target: {
                        files: [archivo]
                    }
                }
            );
            expect(
                inputImagen.files[0]
            ).toBe(archivo);
            expect(
                inputImagen.files[0].name
            ).toBe("referencia.jpg");
        }
    );
    /* =====================================================
       F-PED-03
       ===================================================== */
    test(
        "F-PED-03 - descarga correctamente el detalle del pedido en PDF",
        async () => {
            /* -----------------------------------------
               DATOS ESPECÍFICOS PARA ESTA PRUEBA
            ----------------------------------------- */
            global.fetch = jest.fn(async (url) => {
                /* Lista de pedidos */
                if (
                    url.includes(
                        "/app/pedidos/todos"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => [
                            {
                                idpedido: 1,
                                cliente: "Cliente de prueba",
                                telefono: "3000000000",
                                direccion_entrega:
                                    "Calle 10 #20-30",
                                fecha_pedido:
                                    "2026-10-08",
                                fecha_entrega:
                                    "2026-10-10",
                                hora_entrega:
                                    "10:00",
                                tipo_entrega:
                                    "Domicilio",
                                estado:
                                    "Pendiente",
                                observaciones:
                                    "Pedido de prueba",
                                total: 50000,
                                anticipo: 20000,
                                saldo: 30000
                            }
                        ]
                    };
                }
                /* Detalle del pedido */
                if (
                    url.includes(
                        "/app/pedidos/1"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => ({
                            idpedido: 1,
                            cliente:
                                "Cliente de prueba",
                            telefono:
                                "3000000000",
                            direccion_entrega:
                                "Calle 10 #20-30",
                            fecha_pedido:
                                "2026-10-08",
                            fecha_entrega:
                                "2026-10-10",
                            hora_entrega:
                                "10:00",
                            tipo_entrega:
                                "Domicilio",
                            estado:
                                "Pendiente",
                            observaciones:
                                "Pedido de prueba",
                            total: 50000,
                            anticipo: 20000,
                            saldo: 30000,
                            detalle: [
                                {
                                    producto:
                                        "Torta de chocolate",
                                    tipo_crema:
                                        "Chocolate",
                                    porciones:
                                        "10",
                                    descripcion:
                                        "Torta de prueba",
                                    extras: "",
                                    valor_extras: 0,
                                    cantidad: 1,
                                    precio_unitario:
                                        50000,
                                    subtotal:
                                        50000
                                }
                            ]
                        })
                    };
                }
                /* Logo */
                if (
                    url.includes(
                        "/imagenes/logo.png"
                    )
                ) {
                    return {
                        ok: true,
                        blob: async () =>
                            new Blob(
                                ["imagen de prueba"],
                                {
                                    type:
                                        "image/png"
                                }
                            )
                    };
                }
                /* Clientes */
                if (
                    url.includes(
                        "/app/clientes/todos"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => []
                    };
                }
                /* Productos */
                if (
                    url.includes(
                        "/app/productos/todos"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => []
                    };
                }
                return {
                    ok: true,
                    json: async () => []
                };
            });
            /* -----------------------------------------
               SIMULAR CARGA DEL LOGO
            ----------------------------------------- */
            global.Image = class {
                set src(valor) {
                    this.width = 100;
                    this.height = 100;
                    if (this.onload) {
                        this.onload();
                    }
                }
            };
            /* Evitar error de alert de jsdom */
            global.alert = jest.fn();
            render(<Pedidos />);
            /* -----------------------------------------
               ESPERAR PEDIDO
            ----------------------------------------- */
            await waitFor(() => {
                expect(
                    screen.getByText(
                        "Cliente de prueba"
                    )
                ).toBeInTheDocument();
            });
            /* -----------------------------------------
               BUSCAR FILA
            ----------------------------------------- */
            const filaPedido =
                screen.getByRole("row", {
                    name:
                        /1.*Cliente de prueba/i
                });
            expect(
                filaPedido
            ).toBeInTheDocument();
            /* -----------------------------------------
               BOTÓN VER DETALLE
            ----------------------------------------- */
            const botones =
                within(filaPedido)
                    .getAllByRole("button");
            expect(
                botones.length
            ).toBeGreaterThan(0);
            fireEvent.click(
                botones[0]
            );
            /* -----------------------------------------
               ESPERAR DETALLE
            ----------------------------------------- */
            await waitFor(() => {
                expect(
                    screen.getByRole("heading", {
                        name:
                            /Detalle del Pedido #1/i
                    })
                ).toBeInTheDocument();
            });
            /* -----------------------------------------
               BOTÓN DESCARGAR
            ----------------------------------------- */
            const botonDescargar =
                screen.getByRole("button", {
                    name:
                        "Descargar detalle"
                });
            expect(
                botonDescargar).toBeInTheDocument();


            /* -----------------------------------------
               DESCARGAR PDF
            ----------------------------------------- */
            fireEvent.click(botonDescargar);

await waitFor(() => {
    expect(jsPDF.mockDoc.save).toHaveBeenCalledWith(
        "Pedido-Valencia-Cakes-1.pdf"
    );
});

expect(jsPDF).toHaveBeenCalled();
  }
    );
    /* =====================================================
       F-PED-04
       ===================================================== */
    test(
        "F-PED-04 - calcula precio con valor adicional",
        async () => {
            render(<Pedidos />);
            await waitFor(() => {
                expect(
                    screen.getByRole("heading", {
                        name: "Pedidos"
                    })
                ).toBeInTheDocument();
            });
            fireEvent.click(
                screen.getByRole("button", {
                    name: /\+ Nuevo Pedido/i
                })
            );
            await waitFor(() => {
                expect(
                    screen.getByRole("option", {
                        name: /Torta de chocolate/i
                    })
                ).toBeInTheDocument();
            });
            const productoSelect =
                screen
                    .getAllByRole("combobox")
                    .find(select =>
                        Array.from(select.options).some(
                            option =>
                                option.textContent.includes(
                                    "Torta de chocolate"
                                )
                        )
                    );
            fireEvent.change(productoSelect, {
                target: {
                    value: "1"
                }
            });
            const valoresExtras =
                screen.getAllByRole("spinbutton");
            const valorExtras =
                valoresExtras.find(
                    input =>
                        input.name ===
                        "valor_extras"
                );
            expect(
                valorExtras
            ).toBeInTheDocument();
            fireEvent.change(valorExtras, {
                target: {
                    value: "10000"
                }
            });
            expect(
                screen.getAllByDisplayValue(
                    "$ 60.000"
                )
            ).toHaveLength(2);
        }
    );
    /* =====================================================
       F-PED-05
       ===================================================== */
    test(
        "F-PED-05 - recalcula precio con extras y cantidad",
        async () => {
            render(<Pedidos />);
            await waitFor(() => {
                expect(
                    screen.getByRole("heading", {
                        name: "Pedidos"
                    })
                ).toBeInTheDocument();
            });
            fireEvent.click(
                screen.getByRole("button", {
                    name: /\+ Nuevo Pedido/i
                })
            );
            await waitFor(() => {
                expect(
                    screen.getByRole("option", {
                        name: /Torta de chocolate/i
                    })
                ).toBeInTheDocument();
            });
            const productoSelect =
                screen
                    .getAllByRole("combobox")
                    .find(select =>
                        Array.from(select.options).some(
                            option =>
                                option.textContent.includes(
                                    "Torta de chocolate"
                                )
                        )
                    );
            fireEvent.change(productoSelect, {
                target: {
                    value: "1"
                }
            });
            const camposNumericos =
                screen.getAllByRole("spinbutton");
            const valorExtras =
                camposNumericos.find(
                    input =>
                        input.name ===
                        "valor_extras"
                );
            const cantidad =
                camposNumericos.find(
                    input =>
                        input.name ===
                        "cantidad"
                );
            expect(
                valorExtras
            ).toBeInTheDocument();
            expect(
                cantidad
            ).toBeInTheDocument();
            fireEvent.change(valorExtras, {
                target: {
                    value: "10000"
                }
            });
            fireEvent.change(cantidad, {
                target: {
                    value: "2"
                }
            });
            expect(
                screen.getAllByDisplayValue(
                    "$ 120.000"
                )
            ).toHaveLength(1);
        }
    );
    /* =====================================================
       F-PED-06
       ===================================================== */
    test(
        "F-PED-06 - permite actualizar el estado del pedido mediante el selector",
        async () => {
            global.fetch = jest.fn(async (url) => {
                /* Lista de pedidos */
                if (
                    url.includes(
                        "/app/pedidos/todos"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => [
                            {
                                idpedido: 1,
                                cliente:
                                    "Cliente de prueba",
                                fecha_entrega:
                                    "2026-10-10",
                                hora_entrega:
                                    "10:00",
                                estado:
                                    "Pendiente",
                                total: 50000
                            }
                        ]
                    };
                }
                /* Actualización del estado */
                if (
                    url.includes(
                        "/app/pedidos/estado/1"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => ({
                            mensaje:
                                "Estado actualizado correctamente"
                        })
                    };
                }
                /* Clientes */
                if (
                    url.includes(
                        "/app/clientes/todos"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => []
                    };
                }
                /* Productos */
                if (
                    url.includes(
                        "/app/productos/todos"
                    )
                ) {
                    return {
                        ok: true,
                        json: async () => []
                    };
                }
                return {
                    ok: true,
                    json: async () => []
                };
            });
            render(<Pedidos />);
            /* -----------------------------------------
               VERIFICAR PEDIDO
            ----------------------------------------- */
            await waitFor(() => {
                expect(
                    screen.getByText(
                        "Cliente de prueba"
                    )
                ).toBeInTheDocument();
            });
            /* -----------------------------------------
               SELECTOR DE ESTADO
            ----------------------------------------- */
           const filaPedido = screen.getByRole("row", {
                name: /Cliente de prueba/
            });

            const selectorEstado =
                 within(filaPedido).getByRole("combobox");
            /* -----------------------------------------
               ESTADO INICIAL
            ----------------------------------------- */
            expect(
                selectorEstado
            ).toHaveValue("Pendiente");
            /* -----------------------------------------
               CAMBIAR ESTADO
            ----------------------------------------- */
            fireEvent.change(
                selectorEstado,
                {
                    target: {
                        value:
                            "En preparación"
                    }
                }
            );
            /* -----------------------------------------
               VERIFICAR PETICIÓN PUT
            ----------------------------------------- */
            await waitFor(() => {
                expect(
                    global.fetch
                ).toHaveBeenCalledWith(
                    expect.stringContaining(
                        "/app/pedidos/estado/1"
                    ),
                    expect.objectContaining({
                        method: "PUT",
                        body:
                            JSON.stringify({
                                estado:
                                    "En preparación"
                            })
                    })
                );
            });
        }
    );
});
