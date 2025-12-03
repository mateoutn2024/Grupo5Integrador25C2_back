import express from 'express'; // 1. Traigo Express. El framework que usamos para crear el servidor web.
import session from 'express-session'; // Traigo el middleware para manejar sesiones de usuario.
import cors from 'cors'; // Traigo CORS para permitir peticiones desde diferentes dominios (útil para APIs).
import { sequelize } from './src/database/database.js'; // Traigo la conexión a la base de datos (Sequelize).
// Traigo todos los archivos de rutas (routers):
//import authRoutes from './src/routes/admin/auth.routes.js'; // Rutas de login/logout.
//import adminRoutes from './src/routes/admin/admin.routes.js'; // Rutas del panel de administración (CRUD de productos, etc.).
import apiProductosRoutes from './src/routes/api/productos.routes.js'; // Rutas de la API de productos (para el frontend/app).
import apiVentasRoutes from './src/routes/api/ventas.routes.js'; // Rutas de la API de ventas (para registrar tickets).
import environments from './src/config/environments.js'; // Traigo la configuración (como el número de puerto) del archivo environments.js.

const app = express(); // 2. Creo la instancia principal de la aplicación Express.
const PUERTO = environments.port; // Saco el puerto de la configuración (de environments.js, que a su vez lo saca del .env).

// 3. CONFIGURACIÓN DE MIDDLEWARES GLOBALES (Se ejecutan en orden)
app.use(cors()); // Permite que el backend hable con un frontend que esté en otro puerto o dominio.
app.use(session({ // Configuro el sistema de sesiones para saber quién está logueado.
    secret: environments.sessionSecret, // Texto secreto para encriptar la cookie de la sesión.
    resave: false, // No guardo la sesión si no ha cambiado.
    saveUninitialized: false, // No creo una sesión hasta que no se guarde algo en ella.
}));

app.use(express.json()); // Middleware CLAVE: Permite que Express lea los JSON que vienen en el cuerpo de las peticiones (usado en APIs).
app.use(express.urlencoded({ extended: true })); // Middleware CLAVE: Permite leer los datos de los formularios HTML tradicionales.
app.use(express.static('public')); // Defino la carpeta 'public' como acceso estático (para CSS, JS del frontend).
app.use('/uploads', express.static('public/uploads')); // Hago accesible la carpeta donde Multer guarda las imágenes.
app.set('view engine', 'ejs'); // 4. Defino el motor de plantillas que vamos a usar (EJS).
app.set('views', './src/views'); // Le digo a Express dónde buscar los archivos de las vistas.

// 5. CONFIGURACIÓN DE RUTAS (Le digo a la app qué router usar para qué prefijo de URL)
//app.use('/admin', authRoutes); // Todas las rutas de authRoutes empiezan con /admin (ej: /admin/login).
//app.use('/admin', adminRoutes); // Todas las rutas del panel principal de admin.
app.use('/api', apiProductosRoutes); // Todas las rutas de la API de productos empiezan con /api.
app.use('/api', apiVentasRoutes); // Todas las rutas de la API de ventas.

// 6. Ruta raíz (Fallback)
app.get('/', (req, res) => res.redirect('/admin/login')); // Si alguien entra a la raíz, lo mando directo al login del admin.

// 7. ARRANQUE DEL SERVIDOR Y CONEXIÓN A LA BD
app.listen(PUERTO, async () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    try {
        // Conecto la base de datos y sincronizo los modelos (crea las tablas si no existen).
        await sequelize.sync({ force: false }); // force: false es CLAVE, para no borrar la DB cada vez que arranco.
        console.log('Conexión a MySQL exitosa.');
    } catch (err) {
        console.error('Error al conectar BD:', err);
    }
});