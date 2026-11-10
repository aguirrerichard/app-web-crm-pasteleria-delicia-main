import { pool } from '../config/db.js';

export const buscarPorEmail = async (email) =>
  (await pool.query('SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = $1', [email])).rows[0];
