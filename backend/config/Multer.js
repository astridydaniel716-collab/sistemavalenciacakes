const multer = require('multer');
const path = require('path');

const almacenamiento = multer.memoryStorage();

const filtroArchivo = (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const extension = path.extname(file.originalname).toLowerCase();
    const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];

    if (
        tiposPermitidos.includes(file.mimetype) &&
        extensionesPermitidas.includes(extension)
    ) {
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