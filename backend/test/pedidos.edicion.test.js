
jest.mock('../config/Conexion', () => ({
    connect: jest.fn()
}));

const Conexion = require('../config/Conexion');
const PedidoModelo = require('../models/pedidosModelo');

describe('Validaciones al editar pedidos', () => {
    let client;

    beforeEach(() => {
        jest.clearAllMocks();

        client = {
            query: jest.fn(),
            release: jest.fn()
        };

        Conexion.connect.mockResolvedValue(client);
    });

    test('rechaza un pedido que no existe', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };
            if (typeof sql === 'string' && sql.includes('SELECT imagen_referencia, estado')) {
                return { rows: [] };
            }
            return { rows: [] };
        });

        await expect(
            PedidoModelo.editarPedido(999999, {})
        ).rejects.toThrow('Pedido no encontrado.');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });

    test('rechaza un cliente inexistente', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };

            if (typeof sql === 'string' && sql.includes('SELECT imagen_referencia, estado')) {
                return {
                    rows: [{ imagen_referencia: null, estado: 'Pendiente' }]
                };
            }

            if (typeof sql === 'string' && sql.includes('SELECT idcliente FROM clientes')) {
                return { rows: [] };
            }

            return { rows: [] };
        });

        await expect(
            PedidoModelo.editarPedido(1, {
                idcliente: 999999
            })
        ).rejects.toThrow('El cliente seleccionado no existe.');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
        expect(client.release).toHaveBeenCalled();
    });

    test('rechaza una fecha de entrega inválida', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };

            if (typeof sql === 'string' && sql.includes('SELECT imagen_referencia, estado')) {
                return {
                    rows: [{ imagen_referencia: null, estado: 'Pendiente' }]
                };
            }

            if (typeof sql === 'string' && sql.includes('SELECT idcliente FROM clientes')) {
                return { rows: [{ idcliente: 1 }] };
            }

            return { rows: [] };
        });

        await expect(
            PedidoModelo.editarPedido(1, {
                idcliente: 1,
                fecha_entrega: '2026-02-30',
                hora_entrega: '10:00',
                tipo_entrega: 'Domicilio',
                anticipo: 0,
                detalle: [{ idproducto: 1, cantidad: 1 }]
            })
        ).rejects.toThrow('Debe indicar una fecha de entrega válida.');

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    });

   
test('rechaza un anticipo superior al total recalculado', async () => {
    client.query.mockImplementation(async (sql) => {
        if (typeof sql !== 'string') {
            throw new Error('La consulta SQL debe ser una cadena.');
        }

        if (sql.trim() === 'BEGIN') {
            return { rows: [] };
        }

        if (sql.includes('SELECT imagen_referencia, estado')) {
            return {
                rows: [{
                    imagen_referencia: null,
                    estado: 'Pendiente'
                }]
            };
        }

        if (sql.includes('SELECT idcliente FROM clientes')) {
            return { rows: [{ idcliente: 1 }] };
        }

        if (sql.includes('FROM productos')) {
            return {
                rows: [{
                    idproducto: 1,
                    nombre: 'Torta',
                    precio_base: '50000'
                }]
            };
        }

        if (sql.trim() === 'ROLLBACK') {
            return { rows: [] };
        }

        throw new Error(`Consulta SQL no contemplada: ${sql}`);
    });

    await expect(
        PedidoModelo.editarPedido(1, {
            idcliente: 1,
            fecha_entrega: '2026-11-20',
            hora_entrega: '10:00',
            tipo_entrega: 'Domicilio',
            anticipo: 60000,
            detalle: [{
                idproducto: 1,
                cantidad: 1,
                valor_extras: 0
            }]
        })
    ).rejects.toThrow(
        'El anticipo debe estar entre cero y el total del pedido.'
    );

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalled();
});


    test('rechaza cantidades inválidas durante la edición', async () => {
        client.query.mockImplementation(async (sql) => {
            if (sql === 'BEGIN') return { rows: [] };

            if (typeof sql === 'string' && sql.includes('SELECT imagen_referencia, estado')) {
                return {
                    rows: [{ imagen_referencia: null, estado: 'Pendiente' }]
                };
            }

            if (typeof sql === 'string' && sql.includes('SELECT idcliente FROM clientes')) {
                return { rows: [{ idcliente: 1 }] };
            }

            return { rows: [] };
        });

        await expect(
            PedidoModelo.editarPedido(1, {
                idcliente: 1,
                fecha_entrega: '2026-11-20',
                hora_entrega: '10:00',
                tipo_entrega: 'Domicilio',
                anticipo: 0,
                detalle: [{ idproducto: 1, cantidad: -2, valor_extras: 0 }]
            })
        ).rejects.toThrow(
            'La cantidad debe ser un entero mayor que cero.'
        );

        expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    });
});
