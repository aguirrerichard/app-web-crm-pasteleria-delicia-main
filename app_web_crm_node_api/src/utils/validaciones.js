import { AppError } from './AppError.js';

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

// Hora actual de la tienda (Perú, UTC-5, sin horario de verano) como "YYYY-MM-DDTHH:MM"
const ahoraLima = () => new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 16);

export function validarCelular(valor) {
  const celular = texto(valor);
  if (!/^9\d{8}$/.test(celular)) throw new AppError(400, 'El celular debe tener 9 dígitos y empezar con 9.');
  return celular;
}

export function validarPedido(body = {}) {
  const nombre = texto(body.nombre);
  const celular = validarCelular(body.celular);
  const cantidad = Number(body.cantidad);
  const productoId = Number(body.productoId);
  const dedicatoria = texto(body.dedicatoria);
  const fechaEntrega = texto(body.fechaEntrega);

  if (nombre.length < 2 || nombre.length > 80) throw new AppError(400, 'Escribe tu nombre (mínimo 2 letras).');
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 10) throw new AppError(400, 'La cantidad debe ser de 1 a 10.');
  if (!Number.isInteger(productoId) || productoId < 1) throw new AppError(400, 'Elige una torta de la carta.');
  if (dedicatoria.length > 40) throw new AppError(400, 'La dedicatoria admite hasta 40 caracteres.');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(fechaEntrega) || Number.isNaN(Date.parse(fechaEntrega))) {
    throw new AppError(400, 'La fecha de entrega no es válida.');
  }
  if (fechaEntrega.slice(0, 16) <= ahoraLima()) throw new AppError(400, 'La fecha de entrega debe ser futura.');

  return { nombre, celular, cantidad, productoId, dedicatoria: dedicatoria || null, fechaEntrega: fechaEntrega.slice(0, 16).replace('T', ' ') };
}

export function validarCodigo(valor) {
  const codigo = texto(valor).toUpperCase();
  if (!/^DEL-\d{4,}$/.test(codigo)) throw new AppError(400, 'El código tiene el formato DEL-0001.');
  return codigo;
}
