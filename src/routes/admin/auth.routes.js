import { Router } from 'express';
import { authController } from '../../controllers/admin/auth.admin.controller.js';

const router = Router();

// Si entrás a /admin/login
router.get('/login', authController.mostrarLogin);

// Si enviás el formulario (POST)
router.post('/login', authController.procesarLogin);

// Si querés salir
router.get('/logout', authController.cerrarSesion);

export default router;