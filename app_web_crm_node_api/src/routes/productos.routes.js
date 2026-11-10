import { Router } from 'express';
import { listar } from '../controllers/productos.controller.js';

export default Router().get('/', listar);
