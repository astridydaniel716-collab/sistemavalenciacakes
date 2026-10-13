// Simular el modelo de productos
jest.mock('../models/productosModelo', () => ({
    obtenerProductos: jest.fn()
}));

// Simular el modelo de clientes
jest.mock('../models/clientesModelo', () => ({
    obtenerClientes: jest.fn()
}));

// Simular el modelo de pedidos
jest.mock('../models/pedidosModelo', () => ({
    obtenerPedidos: jest.fn()
}));

describe('Pruebas de manejo de errores', () => {

    // B-PROD-02: Error al obtener productos
    test('obtener productos responde con error 500 cuando el modelo falla', async () => {

        const ProductoModelo = require('../models/productosModelo');
        const ProductoControlador = require('../controllers/productosControlador');

        ProductoModelo.obtenerProductos.mockRejectedValue(
            new Error('Error de conexión con la base de datos')
        );

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await ProductoControlador.obtenerProductos(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Error al obtener los productos.'
        });
    });


    // B-CLI-02: Error al obtener clientes
    test('obtener clientes responde con error 500 cuando el modelo falla', async () => {

        const ClienteModelo = require('../models/clientesModelo');
        const ClienteControlador = require('../controllers/clientesControlador');

        ClienteModelo.obtenerClientes.mockRejectedValue(
            new Error('Error de conexión con la base de datos')
        );

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await ClienteControlador.obtenerClientes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Error al obtener los clientes'
        });
    });


    // B-PED-03: Error al obtener pedidos
    test('obtener pedidos responde con error 500 cuando el modelo falla', async () => {

        const PedidoModelo = require('../models/pedidosModelo');
        const PedidoControlador = require('../controllers/pedidosControlador');

        PedidoModelo.obtenerPedidos.mockRejectedValue(
            new Error('Error de conexión con la base de datos')
        );

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await PedidoControlador.obtenerPedidos(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Error al obtener los pedidos.'
        });
    });

});