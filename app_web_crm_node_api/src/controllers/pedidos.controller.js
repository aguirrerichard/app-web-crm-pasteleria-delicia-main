import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/pedidos.service.js';

export const crear = asyncHandler(async (req, res) => res.status(201).json(await service.crearPedido(req.body)));

export const consultar = asyncHandler(async (req, res) =>
  res.json(await service.consultarPedido(req.params.codigo, req.query.celular)));
