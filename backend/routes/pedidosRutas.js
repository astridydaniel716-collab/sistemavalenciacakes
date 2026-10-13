
const express = require('express');
const router = express.Router();

const PedidoControlador = require('../controllers/pedidosControlador');
const upload = require('../config/Multer');
const verificarToken = require('../middleware/autenticacion');

// Todas las rutas de pedidos requieren autenticación.
router.use(verificarToken);

// Crear pedido
router.post('/crear',upload.single('imagen_referencia'),PedidoControlador.crearPedido);

// Obtener todos
router.get('/todos', PedidoControlador.obtenerPedidos);

// Buscar
router.get('/buscar', PedidoControlador.buscarPedidos);

// Editar pedido
router.put('/editar/:id',upload.single('imagen_referencia'),PedidoControlador.editarPedido);

// Actualizar estado
router.put('/estado/:id', PedidoControlador.actualizarEstado);

// Cancelar pedido
router.put('/cancelar/:id', PedidoControlador.cancelarPedido);

// Obtener pedido por ID
router.get('/:id', PedidoControlador.obtenerPedidoPorId);

module.exports = router;
