import { pool } from '../config/db.js';

export const listarActivos = async () =>
  (await pool.query('SELECT id, nombre, descripcion, imagen, precio::float AS precio FROM productos WHERE activo ORDER BY id')).rows;

export const buscarActivo = async (db, id) =>
  (await db.query('SELECT id, nombre, descripcion, imagen, precio::float AS precio FROM productos WHERE id = $1 AND activo', [id])).rows[0];
