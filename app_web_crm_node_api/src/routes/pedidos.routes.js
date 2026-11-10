import { Router } from 'express';
import { crear, consultar } from '../controllers/pedidos.controller.js';

export default Router().post('/', crear).get('/:codigo', consultar);
