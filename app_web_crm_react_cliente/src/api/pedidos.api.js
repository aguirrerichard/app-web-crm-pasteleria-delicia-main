import { api } from './client.js';

// HU-C06 · RF-T05: registrar el pedido (el total lo calcula el backend)
export const crearPedido = (datos) => api.post('/pedidos', datos).then((r) => r.data);

// RF-T08: consultar el pedido con código y celular
export const consultarPedido = (codigo, celular) =>
  api.get(`/pedidos/${encodeURIComponent(codigo)}`, { params: { celular } }).then((r) => r.data);