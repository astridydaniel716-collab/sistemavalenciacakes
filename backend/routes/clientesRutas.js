const express = require('express');

const router = express.Router();

const ClienteControlador = require('../controllers/clientesControlador');


// Registrar cliente
router.post('/crear', ClienteControlador.crearCliente);


// Obtener todos los clientes
router.get('/todos', ClienteControlador.obtenerClientes);


// Buscar clientes
router.get('/buscar', ClienteControlador.buscarClientes);


// Obtener cliente por ID
router.get('/:id', ClienteControlador.obtenerClientePorId);


// Editar cliente
router.put('/editar/:id', ClienteControlador.editarCliente);


// Eliminar cliente
router.delete('/eliminar/:id', ClienteControlador.eliminarCliente);


module.exports = router;