// Simular el modelo de productos
jest.mock('../models/productosModelo', () => ({
    obtenerProductos: jest.fn()
}));

// Simular el modelo de clientes
jest.mock('../models/clientesModelo', () => ({
    obtenerClientes: jest.fn()
}));

// Simular el modelo de proveedores
jest.mock('../models/proveedoresModelo', () => ({
    obtenerProveedores: jest.fn()
}));

// Simular el modelo de pedidos
jest.mock('../models/pedidosModelo', () => ({
    obtenerPedidos: jest.fn()
}));



describe('Pruebas de listado', () => {

    // B-PROD-01: Obtener todos los productos
    test('obtener productos devuelve correctamente la lista de productos', async () => {

    const ProductoModelo = require('../models/productosModelo');
    const ProductoControlador = require('../controllers/productosControlador');

        const productosSimulados = [
            {
                idproducto: 1,
                nombre: 'Torta de chocolate',
                categoria: 'Tortas',
                precio_base: 80000
            },
            {
                idproducto: 2,
                nombre: 'Cupcakes',
                categoria: 'Cupcakes',
                precio_base: 5000
            }
        ];

        // Simular respuesta del modelo
        ProductoModelo.obtenerProductos.mockResolvedValue(productosSimulados);

        const req = {};

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Ejecutar el controlador
        await ProductoControlador.obtenerProductos(req, res);

        // Verificar que el modelo fue llamado
        expect(ProductoModelo.obtenerProductos).toHaveBeenCalled();

        // Verificar que el controlador devuelve los productos
        expect(res.json).toHaveBeenCalledWith(productosSimulados);
    });
});

// B-CLI-01: Obtener todos los clientes
test('obtener clientes devuelve correctamente la lista de clientes', async () => {

    const ClienteModelo = require('../models/clientesModelo');
    const ClienteControlador = require('../controllers/clientesControlador');

    const clientesSimulados = [
        {
            idcliente: 1,
            nombre: 'María',
            telefono: '3001234567',
            correo: 'maria@gmail.com'
        },
        {
            idcliente: 2,
            nombre: 'Carlos',
            telefono: '3017654321',
            correo: 'carlos@gmail.com'
        }
    ];

    // Simular respuesta del modelo
    ClienteModelo.obtenerClientes.mockResolvedValue(clientesSimulados);

    const req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Ejecutar el controlador
    await ClienteControlador.obtenerClientes(req, res);

    // Verificar que el modelo fue llamado
    expect(ClienteModelo.obtenerClientes).toHaveBeenCalled();

    // Verificar código de respuesta
    expect(res.status).toHaveBeenCalledWith(200);

    // Verificar que devuelve los clientes
    expect(res.json).toHaveBeenCalledWith(clientesSimulados);
});

// B-PROV-01: Obtener todos los proveedores
test('obtener proveedores devuelve correctamente la lista de proveedores', async () => {

    const ProveedorModelo = require('../models/proveedoresModelo');
    const ProveedorControlador = require('../controllers/proveedoresControlador');

    const proveedoresSimulados = [
        {
            idproveedor: 1,
            nombre: 'Distribuciones ABC',
            telefono: '3001234567',
            correo: 'abc@gmail.com'
        },
        {
            idproveedor: 2,
            nombre: 'Repostería La Rosa',
            telefono: '3017654321',
            correo: 'larosa@gmail.com'
        }
    ];

    // Simular respuesta del modelo
    ProveedorModelo.obtenerProveedores.mockResolvedValue(proveedoresSimulados);

    const req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Ejecutar el controlador
    await ProveedorControlador.obtenerProveedores(req, res);

    // Verificar que el modelo fue llamado
    expect(ProveedorModelo.obtenerProveedores).toHaveBeenCalled();

    // Verificar código de respuesta
    expect(res.status).toHaveBeenCalledWith(200);

    // Verificar que devuelve los proveedores
    expect(res.json).toHaveBeenCalledWith(proveedoresSimulados);
});

// B-PED-01: Obtener todos los pedidos
test('obtener pedidos devuelve correctamente la lista de pedidos', async () => {

    const PedidoModelo = require('../models/pedidosModelo');
    const PedidoControlador = require('../controllers/pedidosControlador');

    const pedidosSimulados = [
        {
            idpedido: 1,
            idcliente: 1,
            fecha_entrega: '2026-10-10',
            hora_entrega: '15:00',
            estado: 'Pendiente',
            total: 80000
        },
        {
            idpedido: 2,
            idcliente: 2,
            fecha_entrega: '2026-10-12',
            hora_entrega: '10:00',
            estado: 'Confirmado',
            total: 120000
        }
    ];

    // Simular respuesta del modelo
    PedidoModelo.obtenerPedidos.mockResolvedValue(pedidosSimulados);

    const req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Ejecutar el controlador
    await PedidoControlador.obtenerPedidos(req, res);

    // Verificar que el modelo fue llamado
    expect(PedidoModelo.obtenerPedidos).toHaveBeenCalled();

    // Verificar que devuelve los pedidos
    expect(res.json).toHaveBeenCalledWith(pedidosSimulados);
});