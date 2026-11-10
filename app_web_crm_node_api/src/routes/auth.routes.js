import { Router } from 'express';
import { login, yo } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';

export default Router().post('/login', login).get('/yo', auth, yo);
