import { asyncHandler } from '../utils/asyncHandler.js';
import { listarActivos } from '../repositories/productos.repository.js';

export const listar = asyncHandler(async (req, res) => res.json(await listarActivos()));
