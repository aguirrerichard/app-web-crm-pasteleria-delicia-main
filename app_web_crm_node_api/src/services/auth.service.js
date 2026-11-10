import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { buscarPorEmail } from '../repositories/usuarios.repository.js';

// Hash de relleno: así tardamos lo mismo exista o no el correo
const HASH_FALSO = bcrypt.hashSync('relleno', 10);

export async function login(email, password) {
  const usuario = await buscarPorEmail(String(email ?? '').trim().toLowerCase());
  const ok = await bcrypt.compare(String(password ?? ''), usuario?.password_hash ?? HASH_FALSO);
  if (!usuario || !ok) throw new AppError(401, 'Correo o contraseña incorrectos.');

  const datos = { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
  const token = jwt.sign(datos, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '8h' });
  return { token, usuario: { ...datos, email: usuario.email } };
}
