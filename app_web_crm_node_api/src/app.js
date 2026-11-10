import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import authRoutes from './routes/auth.routes.js';
import gestionRoutes from './routes/gestion.routes.js';
import { errorHandler, noEncontrado } from './middlewares/errorHandler.js';

const app = express();

const origenes = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map((o) => o.trim());
app.use(cors({ origin: origenes }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/salud', (req, res) => res.json({ ok: true }));
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gestion', gestionRoutes);

app.use(noEncontrado);
app.use(errorHandler);

export default app;
