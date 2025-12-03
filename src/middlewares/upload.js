// --- backend/src/middlewares/upload.js ---
import multer from 'multer'; // 1. Traigo la librería Multer. Es la CLAVE para manejar formularios con archivos.
import path from 'path';     // Traigo 'path' para poder trabajar con las rutas de los archivos.

// ---  Configuración del ALMACENAMIENTO (Dónde y con qué nombre guardar) ---
const storage = multer.diskStorage({
        // La función 'destination' le dice dónde guardar el archivo en el servidor.
        destination: (req, file, cb) => {
                // cb(null, 'public/uploads/') -> Le decimos que guarde en esa carpeta. 
                // El 'null' es para indicar que no hay error.
                cb(null, 'public/uploads/');
        },

        // La función 'filename' le dice cómo nombrar el archivo. Para evitar nombres repetidos
        filename: (req, file, cb) => {
                // Genero un sufijo único usando la fecha actual + un número random gigante.
                const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
                // Guardo: (Número Único) + (la extensión original del archivo, ej: .png)
                cb(null, uniqueSuffix + path.extname(file.originalname));
        }
});

// ---  Configuración del FILTRO (Qué tipos de archivo aceptar) ---
const fileFilter = (req, file, cb) => {
        // Defino los tipos de archivo que SÍ quiero aceptar (regex).
        const filetypes = /jpeg|jpg|png|gif|webp/;

        // 1. Verifico el tipo MIME (el que manda el navegador, ej: image/jpeg).
        const mimetype = filetypes.test(file.mimetype);

        // 2. Verifico la extensión del archivo (ej: .png). Lo pongo en minúsculas por si acaso.
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        // Si cumplen las dos condiciones (tipo MIME y extensión), aceptamos el archivo
        if (mimetype && extname) {
                return cb(null, true); // 'true' significa que aceptamos.
        }
        // Si no, rechazamos el archivo y mandamos un error.
        cb(new Error('Error: El archivo debe ser una imagen válida'));
};

// ---  Exportar la instancia de Multer con toda la configuración ---
export const upload = multer({
        storage: storage, // Usar la configuración de almacenamiento que hicimos arriba.
        fileFilter: fileFilter, // Usar el filtro de tipos de archivo.
        limits: { fileSize: 5 * 1024 * 1024 } // Límite de tamaño: 5 MB (5 * 1024 KB * 1024 Bytes). Para que no suban archivos grandes.
});