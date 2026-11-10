import { api } from './client.js';

export const obtenerProductos = () => api.get('/productos').then((r) => r.data);