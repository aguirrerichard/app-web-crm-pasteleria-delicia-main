import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Convierte cualquier error de la API en un mensaje legible para la pantalla
export function mensajeDeError(err) {
  return err.response?.data?.mensaje || 'No pudimos conectar con la pastelería. Intenta de nuevo.';
}