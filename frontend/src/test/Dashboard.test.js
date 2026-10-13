
import React from "react";
import {
    render,
    screen,
    fireEvent,
    act
} from "@testing-library/react";
import "@testing-library/jest-dom";

import Dashboard from "../pages/Dashboard";
import pedidosService from "../services/pedidosService";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn()
}));

jest.mock("../services/pedidosService", () => ({
    __esModule: true,
    default: {
        obtenerProximos: jest.fn()
    }
}));

describe("Pruebas del módulo Dashboard", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useNavigate.mockReturnValue(mockNavigate);

        localStorage.setItem(
            "usuario",
            JSON.stringify({
                nombre: "Administrador de prueba"
            })
        );

        pedidosService.obtenerProximos.mockResolvedValue([]);
    });

    afterEach(() => {
        localStorage.clear();
    });

    // Renderiza el componente y espera a que termine la carga inicial.
    const renderDashboard = async () => {
        render(<Dashboard />);

        await act(async () => {
            await Promise.resolve();
        });
    };

    test("F-DASH-01 - muestra las cuatro tarjetas de módulos", async () => {
        await renderDashboard();

        expect(
            screen.getByRole("heading", { name: "Dashboard" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Administrador de prueba")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Clientes" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Proveedores" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Productos" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Pedidos" })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Gestiona la información de los clientes registrados en el sistema."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "No hay pedidos programados para los próximos 3 días."
            )
        ).toBeInTheDocument();

        expect(
            pedidosService.obtenerProximos
        ).toHaveBeenCalledTimes(1);
    });

    test.each([
        ["Clientes", "/Clientes"],
        ["Proveedores", "/Proveedores"],
        ["Productos", "/Productos"],
        ["Pedidos", "/Pedidos"]
    ])(
        "F-DASH-02 - al hacer clic en la tarjeta %s navega a su módulo",
        async (modulo, ruta) => {
            await renderDashboard();

            fireEvent.click(
                screen.getByRole("heading", { name: modulo })
            );

            expect(mockNavigate).toHaveBeenCalledWith(ruta);
        }
    );

    test(
        "F-DASH-03 - muestra los pedidos próximos a entregar",
        async () => {
            const hoy = new Date();

            const anio = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, "0");
            const dia = String(hoy.getDate()).padStart(2, "0");

            const fechaHoy = `${anio}-${mes}-${dia}`;

            pedidosService.obtenerProximos.mockResolvedValue([
                {
                    idpedido: 25,
                    cliente: "Cliente de prueba",
                    fecha_entrega: fechaHoy,
                    hora_entrega: "10:00"
                }
            ]);

            await renderDashboard();

            expect(
                await screen.findByText("Cliente de prueba")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Pedido #25")
            ).toBeInTheDocument();

            expect(
                screen.getByText(/10:00/)
            ).toBeInTheDocument();

            expect(
                screen.getByText(/Hoy|Mañana|Faltan -?\d+ días/)
            ).toBeInTheDocument();
        }
    );

    test(
        "F-DASH-04 - cierra la sesión y regresa al inicio",
        async () => {
            localStorage.setItem("token", "token-de-prueba");

            await renderDashboard();

            fireEvent.click(
                screen.getByRole("button", {
                    name: /Cerrar sesión/i
                })
            );

            expect(localStorage.getItem("token")).toBeNull();
            expect(localStorage.getItem("usuario")).toBeNull();

            expect(mockNavigate).toHaveBeenCalledWith("/");
        }
    );
});
