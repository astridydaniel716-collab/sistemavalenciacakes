const multer = require('multer');
const path = require('path');

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const nombreArchivo = `pedido-${Date.now()}${extension}`;

        cb(null, nombreArchivo);
    }
});

const filtroArchivo = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;

    const extension = path.extname(file.originalname).toLowerCase();

    const mimeType = tiposPermitidos.test(file.mimetype);

    const extensionValida = tiposPermitidos.test(extension);

    if (mimeType && extensionValida) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'));
    }
};

const upload = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivo,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;