import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/pedidos.service.js';

export const listar = asyncHandler(async (req, res) => res.json(await service.listarParaGestion(req.query.estado)));

export const cambiarEstado = asyncHandler(async (req, res) =>
  res.json(await service.cambiarEstado(Number(req.params.id), req.body?.estado, req.usuario)));

export const historial = asyncHandler(async (req, res) => res.json(await service.historial(Number(req.params.id))));

export const resumen = asyncHandler(async (req, res) => res.json(await service.resumen()));
