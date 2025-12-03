// --- backend/src/routes/api/ventas.routes.js ---
import { Router } from 'express';
import { ventasApiController } from '../../controllers/api/ventas.api.controller.js';

const router = Router();

// POST /api/ventas
router.post('/ventas', ventasApiController.crearVenta);

export default router;