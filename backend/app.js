const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const Config = require('./config/Config');

require('./config/Conexion');

const usuarioRutas = require('./routes/usuarioRutas');
const app = express();
const clienteRutas = require('./routes/clientesRutas');
const proveedoresRutas = require('./routes/proveedoresRutas');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/app/usuarios', usuarioRutas);

app.use('/app/clientes', clienteRutas);

app.use('/app/proveedores', proveedoresRutas);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Valencia Cakes funcionando correctamente'
    });
});

app.listen(Config.PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${Config.PORT}`);
});