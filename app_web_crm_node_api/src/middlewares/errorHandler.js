import { AppError } from '../utils/AppError.js';

export const noEncontrado = (req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada.' });

// Último eslabón: los AppError se muestran tal cual; lo demás se esconde (no filtramos detalles internos)
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) return res.status(err.estado).json({ mensaje: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ mensaje: 'El JSON enviado no es válido.' });
  console.error(err);
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor. Intenta de nuevo.' });
}
