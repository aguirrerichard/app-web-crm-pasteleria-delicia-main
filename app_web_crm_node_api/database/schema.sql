-- Delicia CRM · 5 tablas. Se puede ejecutar varias veces sin borrar datos.
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(80)  NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  rol           VARCHAR(10)  NOT NULL CHECK (rol IN ('admin', 'empleado'))
);

CREATE TABLE IF NOT EXISTS clientes (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(80) NOT NULL,
  celular CHAR(9)     NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS productos (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(80)   NOT NULL,
  descripcion VARCHAR(200)  NOT NULL DEFAULT '',
  precio      NUMERIC(8, 2) NOT NULL CHECK (precio > 0),
  activo      BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(12) GENERATED ALWAYS AS ('DEL-' || LPAD(id::TEXT, 4, '0')) STORED UNIQUE,
  cliente_id    INT           NOT NULL REFERENCES clientes(id),
  producto_id   INT           NOT NULL REFERENCES productos(id),
  cantidad      INT           NOT NULL CHECK (cantidad BETWEEN 1 AND 10),
  dedicatoria   VARCHAR(40),
  fecha_entrega TIMESTAMP     NOT NULL,            -- hora de la tienda (sin zona)
  total         NUMERIC(10, 2) NOT NULL,
  estado        VARCHAR(20)   NOT NULL DEFAULT 'Pendiente'
                CHECK (estado IN ('Pendiente', 'En preparación', 'Listo', 'Entregado')),
  creado        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Trazabilidad: cada cambio de estado, quién lo hizo y cuándo
CREATE TABLE IF NOT EXISTS pedido_estados (
  id         SERIAL PRIMARY KEY,
  pedido_id  INT         NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  estado     VARCHAR(20) NOT NULL,
  fecha      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usuario_id INT REFERENCES usuarios(id)            -- NULL = lo hizo el cliente
);

CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedido_estados_pedido ON pedido_estados(pedido_id);
