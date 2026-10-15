jest.mock('../config/Conexion', () => ({
    connect: jest.fn()
}));

const Conexion = require('../config/Conexion');
const PedidoModelo = require('../models/pedidosModelo');

describe('Cancelación de pedidos', () => {
    let client;

    beforeEach(() => {
        jest.clearAllMocks();

        client = {
            query: jest.fn(),
            release: jest.fn()
        };

        Conexion.connect.mockResolvedValue(client);
    });

    test('permite cancelar un pedido pendiente', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };

            if (sql.includes('SELECT idpedido, estado')) {
                return {
                    rows: [{ idpedido: 1, estado: 'Pendiente' }]
                };
            }

            if (sql.includes('UPDATE pedidos')) {
                return {
                    rows: [{ idpedido: 1, estado: 'Cancelado' }]
                };
            }

            if (sql === 'COMMIT') return { rows: [] };

            throw new Error(`Consulta inesperada: ${sql}`);
        });

        const resultado = await PedidoModelo.cancelarPedido(1);

        expect(resultado.estado).toBe('Cancelado');
        expect(client.query).toHaveBeenCalledWith('COMMIT');
        expect(client.release).toHaveBeenCalled();
    });

    test.each([
        'En preparación',
        'Listo para entregar',
        'Entregado',
        'Cancelado'
    ])('rechaza la cancelación cuando el estado es %s', async (estado) => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };

            if (sql.includes('SELECT idpedido, estado')) {
                return {
                    rows: [{ idpedido: 1, estado }]
                };
            }

            if (sql === 'ROLLBACK') return { rows: [] };

            throw new Error(`Consulta inesperada: ${sql}`);
        });

        await expect(
            PedidoModelo.cancelarPedido(1)
        ).rejects.toThrow(
            'Solo se pueden cancelar pedidos que estén pendientes.'
        );

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });

    test('rechaza un pedido inexistente', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };

            if (sql.includes('SELECT idpedido, estado')) {
                return { rows: [] };
            }

            if (sql === 'ROLLBACK') return { rows: [] };

            throw new Error(`Consulta inesperada: ${sql}`);
        });

        await expect(
            PedidoModelo.cancelarPedido(999999)
        ).rejects.toThrow('Pedido no encontrado.');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });

    test('rechaza un identificador inválido', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };
            if (sql === 'ROLLBACK') return { rows: [] };

            throw new Error(`Consulta inesperada: ${sql}`);
        });

        await expect(
            PedidoModelo.cancelarPedido(0)
        ).rejects.toThrow('Identificador de pedido inválido.');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });
});
