const ProveedorModelo = require('../models/proveedoresModelo');


// Registrar proveedor
const crearProveedor = async (req, res) => {
    try {
        let {
            nombre,
            telefono,
            correo,
            direccion,
            productos_suministrados,
            observaciones
        } = req.body;

        // Validar campos obligatorios
        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del proveedor es obligatorio'
            });
        }

        if (!telefono || !String(telefono).trim()) {
            return res.status(400).json({
                mensaje: 'El teléfono del proveedor es obligatorio'
            });
        }

        if (!productos_suministrados || !String(productos_suministrados).trim()) {
            return res.status(400).json({
                mensaje: 'Los productos suministrados son obligatorios'
            });
        }

        // Validar longitud del teléfono
        if (String(telefono).trim().length > 16) {
            return res.status(400).json({
                mensaje: 'El teléfono no puede superar los 16 caracteres'
            });
        }

        // Limpiar espacios
        nombre = String(nombre).trim();
        telefono = String(telefono).trim();
        productos_suministrados = String(productos_suministrados).trim();

        // Validar correo solo si se proporciona
        if (
            correo !== undefined &&
            correo !== null &&
            String(correo).trim() !== ''
        ) {
            correo = String(correo).trim();

            const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formatoCorreo.test(correo)) {
                return res.status(400).json({
                    mensaje: 'El formato del correo electrónico no es válido.'
                });
            }
        } else {
            correo = null;
        }

        // Normalizar campos opcionales
        direccion = direccion?.trim() || null;
        observaciones = observaciones?.trim() || null;

        const duplicados = await ProveedorModelo.verificarDuplicados(
    telefono,
    correo
);

if (duplicados.telefono_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe un proveedor registrado con ese teléfono.'
    });
}

if (duplicados.correo_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe un proveedor registrado con ese correo electrónico.'
    });
}

        const proveedor = await ProveedorModelo.crearProveedor({
            nombre,
            telefono,
            correo,
            direccion,
            productos_suministrados,
            observaciones
        });

        return res.status(201).json({
            mensaje: 'Proveedor registrado correctamente.',
            proveedor
        });

    } catch (error) {
        console.error('Error al registrar proveedor:', error);

        return res.status(500).json({
            mensaje: 'Error interno al registrar el proveedor.'
        });
    }
};



// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {

    try {

        const proveedores = await ProveedorModelo.obtenerProveedores();

        res.status(200).json(proveedores);

    } catch (error) {

        console.error('Error al obtener los proveedores:', error);

        res.status(500).json({
            mensaje: 'Error al obtener los proveedores'
        });
    }
};


// Obtener proveedor por ID
const obtenerProveedorPorId = async (req, res) => {

    try {

        const proveedor = await ProveedorModelo.obtenerProveedorPorId(
            req.params.id
        );

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json(proveedor);

    } catch (error) {

        console.error('Error al obtener proveedor:', error);

        res.status(500).json({
            mensaje: 'Error al obtener el proveedor'
        });
    }
};


// Buscar proveedores
const buscarProveedores = async (req, res) => {

    try {

        const { termino } = req.query;

        if (!termino || termino.trim() === '') {
            return res.status(400).json({
                mensaje: 'Debe ingresar un término de búsqueda'
            });
        }

        const proveedores = await ProveedorModelo.buscarProveedores(
            termino.trim()
        );

        res.status(200).json(proveedores);

    } catch (error) {

        console.error('Error al buscar proveedores:', error);

        res.status(500).json({
            mensaje: 'Error al buscar proveedores'
        });
    }
};


// Editar proveedor
const editarProveedor = async (req, res) => {
    try {
        let {
            nombre,
            telefono,
            correo,
            direccion,
            productos_suministrados,
            observaciones
        } = req.body;

        // Validar identificador
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El identificador del proveedor no es válido.'
            });
        }

        // Validar campos obligatorios
        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                mensaje: 'El nombre del proveedor es obligatorio'
            });
        }

        if (!telefono || !String(telefono).trim()) {
            return res.status(400).json({
                mensaje: 'El teléfono del proveedor es obligatorio'
            });
        }

        if (!productos_suministrados || !String(productos_suministrados).trim()) {
            return res.status(400).json({
                mensaje: 'Los productos suministrados son obligatorios'
            });
        }

        // Validar longitud del teléfono
        if (String(telefono).trim().length > 16) {
            return res.status(400).json({
                mensaje: 'El teléfono no puede superar los 16 caracteres'
            });
        }

        // Limpiar espacios
        nombre = String(nombre).trim();
        telefono = String(telefono).trim();
        productos_suministrados = String(productos_suministrados).trim();

        // Validar correo si se proporciona
        if (
            correo !== undefined &&
            correo !== null &&
            String(correo).trim() !== ''
        ) {
            correo = String(correo).trim();

            const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formatoCorreo.test(correo)) {
                return res.status(400).json({
                    mensaje: 'El formato del correo electrónico no es válido.'
                });
            }
        } else {
            correo = null;
        }

        // Normalizar campos opcionales
        direccion = direccion?.trim() || null;
        observaciones = observaciones?.trim() || null;

        const duplicados = await ProveedorModelo.verificarDuplicados(
    telefono,
    correo,
    id
);

if (duplicados.telefono_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe otro proveedor registrado con ese teléfono.'
    });
}

if (duplicados.correo_duplicado) {
    return res.status(409).json({
        mensaje: 'Ya existe otro proveedor registrado con ese correo electrónico.'
    });
}

        const proveedor = await ProveedorModelo.editarProveedor(id, {
            nombre,
            telefono,
            correo,
            direccion,
            productos_suministrados,
            observaciones
        });

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado.'
            });
        }

        return res.status(200).json({
            mensaje: 'Proveedor actualizado correctamente.',
            proveedor
        });

    } catch (error) {
        console.error('Error al editar proveedor:', error);

        return res.status(500).json({
            mensaje: 'Error interno al actualizar el proveedor.'
        });
    }
};


// Eliminar proveedor
const eliminarProveedor = async (req, res) => {

    try {

        const proveedor = await ProveedorModelo.eliminarProveedor(
            req.params.id
        );

        if (!proveedor) {
            return res.status(404).json({
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Proveedor eliminado correctamente',
            proveedor
        });

    } catch (error) {

        console.error('Error al eliminar proveedor:', error);

        res.status(500).json({
            mensaje: 'Error al eliminar el proveedor'
        });
    }
};


module.exports = {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedorPorId,
    buscarProveedores,
    editarProveedor,
    eliminarProveedor
};