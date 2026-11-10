import { AppError } from '../utils/AppError.js';

// Con token pero sin el rol correcto: 403 (aunque llamen a la API directo)
export const requireRol = (...roles) => (req, res, next) =>
  roles.includes(req.usuario?.rol) ? next() : next(new AppError(403, 'No tienes permiso para esta acción.'));
