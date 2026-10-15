jest.mock('../config/Conexion', () => ({
    connect: jest.fn()
}));

const Conexion = require('../config/Conexion');
const PedidoModelo = require('../models/pedidosModelo');

describe('Validación del cliente al crear un pedido', () => {
    let client;

    beforeEach(() => {
        jest.clearAllMocks();

        client = {
            query: jest.fn(),
            release: jest.fn()
        };

        Conexion.connect.mockResolvedValue(client);
    });

    test('rechaza un identificador de cliente inválido', async () => {
        await expect(
            PedidoModelo.crearPedido({
                idcliente: 0,
                detalle: []
            })
        ).rejects.toThrow('Debe seleccionar un cliente válido.');

        expect(client.query).toHaveBeenCalledWith('BEGIN');
        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });

    test('rechaza un cliente que no existe', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') {
                return { rows: [] };
            }

            if (
                typeof sql === 'string' &&
                sql.includes('SELECT idcliente FROM clientes')
            ) {
                return { rows: [] };
            }

            return { rows: [] };
        });

        await expect(
            PedidoModelo.crearPedido({
                idcliente: 999999,
                detalle: []
            })
        ).rejects.toThrow('El cliente seleccionado no existe.');

        expect(client.query).toHaveBeenCalledWith(
            'SELECT idcliente FROM clientes WHERE idcliente = $1',
            [999999]
        );

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });

    test('continúa con el proceso cuando el cliente existe', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') {
                return { rows: [] };
            }

            if (
                typeof sql === 'string' &&
                sql.includes('SELECT idcliente FROM clientes')
            ) {
                return { rows: [{ idcliente: 1 }] };
            }

            return { rows: [] };
        });

        await expect(
            PedidoModelo.crearPedido({
                idcliente: 1,
                detalle: []
            })
        ).rejects.toThrow(
            'El pedido debe contener al menos un producto.'
        );

        expect(client.query).toHaveBeenCalledWith(
            'SELECT idcliente FROM clientes WHERE idcliente = $1',
            [1]
        );
    });
});
