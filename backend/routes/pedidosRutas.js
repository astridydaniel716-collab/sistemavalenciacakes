const express = require('express');
const router = express.Router();

const PedidoControlador = require('../controllers/pedidosControlador');
const upload = require('../config/Multer');

// CREAR PEDIDO
router.post('/crear',upload.single('imagen_referencia'),PedidoControlador.crearPedido);

// OBTENER TODOS
router.get('/todos',PedidoControlador.obtenerPedidos);

// BUSCAR
router.get('/buscar',PedidoControlador.buscarPedidos);

// EDITAR PEDIDO
router.put('/editar/:id',upload.single('imagen_referencia'),PedidoControlador.editarPedido);

// ACTUALIZAR ESTADO
router.put('/estado/:id',PedidoControlador.actualizarEstado);

// CANCELAR PEDIDO
router.put('/cancelar/:id',PedidoControlador.cancelarPedido);


// OBTENER PEDIDO POR ID
router.get('/:id',PedidoControlador.obtenerPedidoPorId);

module.exports = router;