import { asyncHandler } from '../utils/asyncHandler.js';
import { login as loginService } from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => res.json(await loginService(req.body?.email, req.body?.password)));

export const yo = (req, res) => res.json(req.usuario);
