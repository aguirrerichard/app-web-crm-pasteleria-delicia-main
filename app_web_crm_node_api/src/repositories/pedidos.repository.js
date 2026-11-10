import { pool } from '../config/db.js';

// Única parte del SQL que no es parámetro: una constante nuestra, nunca datos del usuario
const SELECT_PEDIDO = `
  SELECT p.id, p.codigo, p.cantidad, p.dedicatoria, p.total::float AS total, p.estado, p.creado,
         to_char(p.fecha_entrega, 'YYYY-MM-DD HH24:MI:SS') AS fecha_entrega,
         pr.nombre AS producto, c.nombre AS cliente, c.celular
  FROM pedidos p
  JOIN productos pr ON pr.id = p.producto_id
  JOIN clientes c ON c.id = p.cliente_id`;

export const crear = async (db, p) =>
  (await db.query(
    `INSERT INTO pedidos (cliente_id, producto_id, cantidad, dedicatoria, fecha_entrega, total)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [p.clienteId, p.productoId, p.cantidad, p.dedicatoria, p.fechaEntrega, p.total]
  )).rows[0].id;

export const porId = async (db, id) =>
  (await db.query(`${SELECT_PEDIDO} WHERE p.id = $1`, [id])).rows[0];

export const porCodigoYCelular = async (codigo, celular) =>
  (await pool.query(`${SELECT_PEDIDO} WHERE p.codigo = $1 AND c.celular = $2`, [codigo, celular])).rows[0];

export const listar = async (estado) =>
  (await pool.query(
    `${SELECT_PEDIDO} WHERE ($1::text IS NULL OR p.estado = $1) ORDER BY p.fecha_entrega, p.id LIMIT 300`,
    [estado]
  )).rows;

export const historialPublico = async (pedidoId) =>
  (await pool.query('SELECT estado, fecha FROM pedido_estados WHERE pedido_id = $1 ORDER BY fecha, id', [pedidoId])).rows;

// Para el administrador: incluye quién hizo cada cambio (NULL = el cliente)
export const historialCompleto = async (pedidoId) =>
  (await pool.query(
    `SELECT e.estado, e.fecha, COALESCE(u.nombre, 'Cliente') AS usuario, u.rol
     FROM pedido_estados e LEFT JOIN usuarios u ON u.id = e.usuario_id
     WHERE e.pedido_id = $1 ORDER BY e.fecha, e.id`,
    [pedidoId]
  )).rows;

// FOR UPDATE: nadie más puede cambiar este pedido hasta que termine la transacción
export const bloquear = async (db, id) =>
  (await db.query('SELECT id, estado FROM pedidos WHERE id = $1 FOR UPDATE', [id])).rows[0];

export const actualizarEstado = (db, id, estado) =>
  db.query('UPDATE pedidos SET estado = $2 WHERE id = $1', [id, estado]);

export const registrarEstado = (db, pedidoId, estado, usuarioId = null) =>
  db.query('INSERT INTO pedido_estados (pedido_id, estado, usuario_id) VALUES ($1, $2, $3)', [pedidoId, estado, usuarioId]);

export async function resumen() {
  const { rows: porEstado } = await pool.query('SELECT estado, COUNT(*)::int AS cantidad FROM pedidos GROUP BY estado');
  const { rows: [tot] } = await pool.query(
    `SELECT COUNT(*)::int AS pedidos, COALESCE(SUM(total), 0)::float AS ingresos,
            COUNT(*) FILTER (WHERE (creado AT TIME ZONE 'America/Lima')::date = (NOW() AT TIME ZONE 'America/Lima')::date)::int AS hoy
     FROM pedidos`
  );
  return { ...tot, porEstado: Object.fromEntries(porEstado.map((e) => [e.estado, e.cantidad])) };
}
