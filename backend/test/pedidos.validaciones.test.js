
jest.mock('../config/Conexion', () => ({
    connect: jest.fn(),
    query: jest.fn()
}));

const Conexion = require('../config/Conexion');
const PedidoModelo = require('../models/pedidosModelo');

describe('Validaciones de precios y cantidades de pedidos', () => {
    let client;

    beforeEach(() => {
        jest.clearAllMocks();

        client = {
            query: jest.fn()
        };

        Conexion.connect.mockResolvedValue(client);
    });

    test('rechaza un detalle vacío', async () => {
        await expect(
            PedidoModelo.calcularDetallePedido(client, [])
        ).rejects.toThrow(
            'El pedido debe contener al menos un producto.'
        );
    });

    test.each([0, -1, 1.5])(
        'rechaza la cantidad inválida %s',
        async (cantidad) => {
            await expect(
                PedidoModelo.calcularDetallePedido(client, [
                    {
                        idproducto: 1,
                        cantidad,
                        valor_extras: 0
                    }
                ])
            ).rejects.toThrow(
                'La cantidad debe ser un entero mayor que cero.'
            );

            expect(client.query).not.toHaveBeenCalled();
        }
    );

    test('rechaza extras negativos', async () => {
        await expect(
            PedidoModelo.calcularDetallePedido(client, [
                {
                    idproducto: 1,
                    cantidad: 1,
                    valor_extras: -100
                }
            ])
        ).rejects.toThrow(
            'El valor de los extras no puede ser negativo.'
        );

        expect(client.query).not.toHaveBeenCalled();
    });

    test('calcula precio unitario, subtotal y total correctamente', async () => {
        client.query.mockResolvedValue({
            rows: [
                {
                    idproducto: 1,
                    nombre: 'Torta',
                    precio_base: '80000'
                }
            ]
        });

        const resultado =
            await PedidoModelo.calcularDetallePedido(client, [
                {
                    idproducto: 1,
                    cantidad: 2,
                    valor_extras: 15000,
                    descripcion: 'Decoración especial',
                    extras: 'Decoración'
                }
            ]);

        expect(resultado.detalle[0].precio_unitario).toBe(95000);
        expect(resultado.detalle[0].subtotal).toBe(190000);
        expect(resultado.total).toBe(190000);
    });

    test('rechaza un producto inexistente', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await expect(
            PedidoModelo.calcularDetallePedido(client, [
                {
                    idproducto: 999,
                    cantidad: 1,
                    valor_extras: 0
                }
            ])
        ).rejects.toThrow('El producto 999 no existe.');
    });
});
