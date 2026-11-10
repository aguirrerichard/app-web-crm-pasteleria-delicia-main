import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { requireRol } from '../middlewares/requireRol.js';
import { listar, cambiarEstado, historial, resumen } from '../controllers/gestion.controller.js';

const router = Router();
router.use(auth); // todo lo de gestión pide token (401 si falta)

router.get('/pedidos', requireRol('empleado', 'admin'), listar);
router.patch('/pedidos/:id/estado', requireRol('empleado', 'admin'), cambiarEstado);
router.get('/pedidos/:id/historial', requireRol('admin'), historial);
router.get('/resumen', requireRol('admin'), resumen);

export default router;
