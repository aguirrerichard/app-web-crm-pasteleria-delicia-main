import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

// Sin token válido: 401. Si todo bien, deja el usuario en req.usuario
export function auth(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) return next(new AppError(401, 'Inicia sesión para continuar.'));
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new AppError(401, 'Tu sesión venció. Inicia sesión otra vez.'));
  }
}
