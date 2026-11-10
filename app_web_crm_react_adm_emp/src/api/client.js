import axios from 'axios';

const CLAVE = 'delicia_sesion';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export const leerSesion = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE)); } catch { return null; }
};
export const guardarSesion = (s) => localStorage.setItem(CLAVE, JSON.stringify(s));
export const borrarSesion = () => localStorage.removeItem(CLAVE);

// Cada petición lleva el token; si el servidor dice 401 (venció), se cierra la sesión
api.interceptors.request.use((cfg) => {
  const s = leerSesion();
  if (s?.token) cfg.headers.Authorization = `Bearer ${s.token}`;
  return cfg;
});
api.interceptors.response.use((r) => r, (err) => {
  const esLogin = err.config?.url?.includes('/auth/login');
  if (err.response?.status === 401 && !esLogin && leerSesion()) {
    borrarSesion();
    window.location.assign('/login');
  }
  return Promise.reject(err);
});

export const mensajeDeError = (err) =>
  err.response?.data?.mensaje || 'No pudimos conectar con el servidor. Intenta de nuevo.';
