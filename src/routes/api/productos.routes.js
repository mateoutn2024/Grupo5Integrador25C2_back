// --- backend/src/routes/api/productos.routes.js ---
import { Router } from 'express';
import { productosApiController } from '../../controllers/api/productos.api.controller.js';

const router = Router();

// GET /api/productos -> Devuelve lista JSON
router.get('/productos', productosApiController.obtenerProductos);

// GET /api/productos/:id -> Devuelve un solo producto JSON
router.get('/productos/:id', productosApiController.obtenerProductoPorId);

export default router;