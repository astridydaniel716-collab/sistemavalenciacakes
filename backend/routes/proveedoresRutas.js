const express = require('express');

const router = express.Router();

const ProveedorControlador = require('../controllers/proveedoresControlador');


// Registrar proveedor
router.post('/crear', ProveedorControlador.crearProveedor);


// Obtener todos los proveedores
router.get('/todos', ProveedorControlador.obtenerProveedores);


// Buscar proveedores
router.get('/buscar', ProveedorControlador.buscarProveedores);


// Obtener proveedor por ID
router.get('/:id', ProveedorControlador.obtenerProveedorPorId);


// Editar proveedor
router.put('/editar/:id', ProveedorControlador.editarProveedor);


// Eliminar proveedor
router.delete('/eliminar/:id', ProveedorControlador.eliminarProveedor);


module.exports = router;