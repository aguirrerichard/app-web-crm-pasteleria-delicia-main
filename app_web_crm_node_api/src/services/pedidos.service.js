import { conTransaccion } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { validarPedido, validarCelular, validarCodigo } from '../utils/validaciones.js';
import * as productos from '../repositories/productos.repository.js';
import * as clientes from '../repositories/clientes.repository.js';
import * as pedidos from '../repositories/pedidos.repository.js';

// El pedido solo avanza en este orden
export const ESTADOS = ['Pendiente', 'En preparación', 'Listo', 'Entregado'];

// El cliente encarga: el precio y el total los calcula el SERVIDOR (el navegador no manda total)
export async function crearPedido(body) {
  const datos = validarPedido(body);
  return conTransaccion(async (db) => {
    const producto = await productos.buscarActivo(db, datos.productoId);
    if (!producto) throw new AppError(404, 'Esa torta no está disponible.');

    const clienteId = await clientes.obtenerOCrear(db, datos.nombre, datos.celular);
    const total = Math.round(producto.precio * datos.cantidad * 100) / 100;
    const id = await pedidos.crear(db, { ...datos, clienteId, total });
    await pedidos.registrarEstado(db, id, ESTADOS[0], null);

    const pedido = await pedidos.porId(db, id);
    return { codigo: pedido.codigo, producto: pedido.producto, total: pedido.total, fechaEntrega: pedido.fecha_entrega };
  });
}

// El cliente consulta con código + celular (si no coinciden, no revelamos nada)
export async function consultarPedido(codigoCrudo, celularCrudo) {
  const codigo = validarCodigo(codigoCrudo);
  const celular = validarCelular(celularCrudo);
  const p = await pedidos.porCodigoYCelular(codigo, celular);
  if (!p) throw new AppError(404, 'No encontramos un pedido con ese código y celular.');
  const historial = await pedidos.historialPublico(p.id);
  return {
    codigo: p.codigo, producto: p.producto, cantidad: p.cantidad, dedicatoria: p.dedicatoria,
    fecha_entrega: p.fecha_entrega, total: p.total, estado: p.estado, historial
  };
}

export const listarParaGestion = (estado) => {
  if (estado && !ESTADOS.includes(estado)) throw new AppError(400, 'Estado no válido.');
  return pedidos.listar(estado || null);
};

// Empleado/admin: solo se permite pasar al estado SIGUIENTE; saltarse uno responde 409
export async function cambiarEstado(id, nuevoEstado, usuario) {
  if (!Number.isInteger(id)) throw new AppError(400, 'Pedido no válido.');
  if (!ESTADOS.includes(nuevoEstado)) throw new AppError(400, 'Estado no válido.');

  return conTransaccion(async (db) => {
    const actual = await pedidos.bloquear(db, id);
    if (!actual) throw new AppError(404, 'El pedido no existe.');

    const siguiente = ESTADOS[ESTADOS.indexOf(actual.estado) + 1];
    if (!siguiente) throw new AppError(409, 'El pedido ya fue entregado.');
    if (nuevoEstado !== siguiente) {
      throw new AppError(409, `El pedido está "${actual.estado}"; el siguiente paso es "${siguiente}".`);
    }

    await pedidos.actualizarEstado(db, id, nuevoEstado);
    await pedidos.registrarEstado(db, id, nuevoEstado, usuario.id);
    return pedidos.porId(db, id);
  });
}

export async function historial(id) {
  if (!Number.isInteger(id)) throw new AppError(400, 'Pedido no válido.');
  return pedidos.historialCompleto(id);
}

export const resumen = () => pedidos.resumen();
