// Un cliente se identifica por su celular: si ya existe, se reutiliza (y no se le cambia el nombre)
export const obtenerOCrear = async (db, nombre, celular) =>
  (await db.query(
    `INSERT INTO clientes (nombre, celular) VALUES ($1, $2)
     ON CONFLICT (celular) DO UPDATE SET celular = EXCLUDED.celular
     RETURNING id`,
    [nombre, celular]
  )).rows[0].id;
