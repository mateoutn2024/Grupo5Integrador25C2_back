// --- backend/src/routes/admin/admin.routes.js ---
import { Router } from 'express';
import { productosAdminController } from '../../controllers/admin/productos.admin.controller.js';
import { ventasAdminController } from '../../controllers/admin/ventas.admin.controller.js';
import { checkAuth } from '../../middlewares/checkAuth.js';
import { upload } from '../../middlewares/upload.js';

const router = Router();

// Dashboard
router.get('/dashboard', checkAuth, productosAdminController.mostrarDashboard);

// Alta
router.get('/agregar', checkAuth, productosAdminController.mostrarFormularioAlta);
router.post('/agregar', checkAuth, upload.single('imagen'), productosAdminController.crearProducto);

// Edición
router.get('/editar/:id', checkAuth, productosAdminController.mostrarFormularioEditar);
router.post('/editar/:id', checkAuth, upload.single('imagen'), productosAdminController.editarProducto);

router.get('/estado/:id', checkAuth, productosAdminController.cambiarEstado);

// Reporte Excel
router.get('/ventas/excel', checkAuth, ventasAdminController.descargarExcel);

// Eliminar
router.get('/eliminar/:id', checkAuth, productosAdminController.eliminarProducto);

export default router;