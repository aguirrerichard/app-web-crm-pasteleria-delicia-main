import { readFileSync } from 'node:fs';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';

const PRODUCTOS = [
  ['Torta de chocolate', 'Bizcocho húmedo de cacao con ganache y fudge.', 55],
  ['Torta tres leches', 'Clásica, bañada en tres leches y crema chantilly.', 48],
  ['Torta de fresa', 'Crema de vainilla, fresas frescas y bizcocho esponjoso.', 52],
  ['Torta de maracuyá', 'Mousse de maracuyá sobre base de galleta.', 50]
];
const USUARIOS = [
  ['Administrador Delicia', 'admin@delicia.pe', 'admin'],
  ['Rosa Quispe', 'rosa@delicia.pe', 'empleado']
];

try {
  await pool.query(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));

  const { rows: [{ n: hayProductos }] } = await pool.query('SELECT COUNT(*)::int AS n FROM productos');
  if (hayProductos === 0) {
    for (const [nombre, descripcion, precio] of PRODUCTOS) {
      await pool.query('INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3)', [nombre, descripcion, precio]);
    }
  }

  const hash = await bcrypt.hash('123456', 10);
  for (const [nombre, email, rol] of USUARIOS) {
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      [nombre, email, hash, rol]
    );
  }

  const { rows: [{ p, u }] } = await pool.query(
    'SELECT (SELECT COUNT(*) FROM productos) AS p, (SELECT COUNT(*) FROM usuarios) AS u'
  );
  console.log(`Tablas creadas · ${p} productos · ${u} usuarios`);
} catch (err) {
  console.error('No se pudo iniciar la base de datos:', err.message);
  console.error('Revisa DATABASE_URL y DB_SSL=true en el .env');
  process.exitCode = 1;
} finally {
  await pool.end();
}
