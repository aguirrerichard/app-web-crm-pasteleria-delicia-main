import { api } from './client.js';

export const listarPedidos = () => api.get('/gestion/pedidos').then((r) => r.data);
export const avanzarPedido = (id, estado) => api.patch(`/gestion/pedidos/${id}/estado`, { estado }).then((r) => r.data);
export const obtenerHistorial = (id) => api.get(`/gestion/pedidos/${id}/historial`).then((r) => r.data);
export const obtenerResumen = () => api.get('/gestion/resumen').then((r) => r.data);
