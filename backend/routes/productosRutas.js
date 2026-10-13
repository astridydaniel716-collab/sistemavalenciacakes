
const express = require('express');
const router = express.Router();

const ProductoControlador = require('../controllers/productosControlador');
const verificarToken = require('../middleware/autenticacion');

// Todas las rutas de productos requieren autenticación.
router.use(verificarToken);

// Registrar producto
router.post('/crear', ProductoControlador.crearProducto);

// Obtener todos
router.get('/todos', ProductoControlador.obtenerProductos);

// Buscar
router.get('/buscar', ProductoControlador.buscarProductos);

// Obtener uno
router.get('/:id', ProductoControlador.obtenerProductoPorId);

// Editar
router.put('/editar/:id', ProductoControlador.editarProducto);

// Eliminar
router.delete('/eliminar/:id', ProductoControlador.eliminarProducto);

module.exports = router;
