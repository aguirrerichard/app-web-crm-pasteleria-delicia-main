import { api } from './client.js';

export const iniciarSesion = (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data);
