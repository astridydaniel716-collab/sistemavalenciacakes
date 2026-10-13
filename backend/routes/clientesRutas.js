
const express = require('express');
const router = express.Router();

const ClienteControlador = require('../controllers/clientesControlador');
const verificarToken = require('../middleware/autenticacion');

// Todas las rutas de clientes requieren autenticación.
router.use(verificarToken);

// Registrar cliente
router.post('/crear', ClienteControlador.crearCliente);

// Obtener todos los clientes
router.get('/todos', ClienteControlador.obtenerClientes);

// Buscar clientes
router.get('/buscar', ClienteControlador.buscarClientes);

// Historial por cliente
router.get('/:id/historial-pedidos', ClienteControlador.obtenerHistorialPedidos);

// Obtener cliente por ID
router.get('/:id', ClienteControlador.obtenerClientePorId);

// Editar cliente
router.put('/editar/:id', ClienteControlador.editarCliente);

// Eliminar cliente
router.delete('/eliminar/:id', ClienteControlador.eliminarCliente);

module.exports = router;
