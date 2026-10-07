const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const Config = require('./config/Config');

require('./config/Conexion');

const usuarioRutas = require('./routes/usuarioRutas');
const app = express();
const clienteRutas = require('./routes/clientesRutas');
const proveedoresRutas = require('./routes/proveedoresRutas');
const productosRutas = require('./routes/productosRutas');
const pedidosRutas = require('./routes/pedidosRutas'); 

// Configuración de middlewares
app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(morgan('dev')); // Muestra las solicitudes en consola


// Servir las imágenes almacenadas en la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rutas principales de la API
app.use('/app/usuarios', usuarioRutas);
app.use('/app/clientes', clienteRutas);
app.use('/app/proveedores', proveedoresRutas);
app.use('/app/productos', productosRutas);
app.use('/app/pedidos', pedidosRutas);


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Valencia Cakes funcionando correctamente'
    });
});

// Iniciar el servidor
app.listen(Config.PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${Config.PORT}`);
});