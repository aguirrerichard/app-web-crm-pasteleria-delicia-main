# Pastelería Delicia · CRM web (demo de clase)

Trazabilidad del pedido: el cliente encarga una torta, el empleado avanza su estado y el administrador ve el historial.

| Carpeta | Qué es | Puerto |
|---|---|---|
| `app_web_crm_node_api` | Backend: Node + Express + PostgreSQL (Neon) | 3000 |
| `app_web_crm_react_cliente` | Frontend del cliente (React + Vite) | 5173 |
| `app_web_crm_react_adm_emp` | Frontend de administrador y empleado | 5174 |

Requisitos: Node.js 20.19 o superior y una base de datos PostgreSQL (Neon).

## Cómo levantarlo (3 terminales)

1. Backend:
   ```bash
   cd app_web_crm_node_api
   npm install
   copy .env.example .env     # en Mac/Linux: cp .env.example .env
   # edita .env: pon TU DATABASE_URL de Neon y un JWT_SECRET propio
   npm run db:init
   npm run dev
   ```
   Prueba: http://localhost:3000/api/salud y http://localhost:3000/api/productos

2. Cliente: `cd app_web_crm_react_cliente` → `npm install` → `npm run dev` (http://localhost:5173)

3. Administrador y empleado: `cd app_web_crm_react_adm_emp` → `npm install` → `npm run dev` (http://localhost:5174)

Usuarios de prueba: `admin@delicia.pe` y `rosa@delicia.pe` (contraseña `123456`).
`rosa` es empleada (tablero); `admin` además ve Resumen e Historial.
