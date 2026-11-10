import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos.js';
import { crearPedido } from '../api/pedidos.api.js';
import { mensajeDeError } from '../api/client.js';
import { soles, fechaEntrega, minimoEntrega } from '../utils/formato.js';

// HU-C06: el cliente encarga su torta sin crear cuenta
export default function PedidoPage() {
  const { productoId } = useParams();
  const { productos, cargando } = useProductos();
  const producto = productos.find((p) => p.id === Number(productoId));

  const [form, setForm] = useState({ nombre: '', celular: '', cantidad: 1, dedicatoria: '', fechaEntrega: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [confirmado, setConfirmado] = useState(null);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const pedido = await crearPedido({ ...form, cantidad: Number(form.cantidad), productoId: producto.id });
      setConfirmado({ ...pedido, celular: form.celular });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <p className="aviso">Cargando…</p>;
  if (!producto) return <p className="aviso">Esa torta no existe. <Link to="/">Ver la carta</Link></p>;

  // Pantalla de confirmación con el código: es el hilo de la trazabilidad
  if (confirmado) {
    return (
      <section className="tarjeta confirmacion">
        <p className="etiqueta">¡Pedido registrado!</p>
        <h1>Tu código es</h1>
        <p className="codigo">{confirmado.codigo}</p>
        <p>{confirmado.producto} · Total {soles(confirmado.total)}</p>
        <p>Entrega: {fechaEntrega(confirmado.fechaEntrega)}</p>
        <p className="nota">Guarda tu código. Con él y tu celular puedes ver cómo va tu pedido.</p>
        <Link className="boton" to={`/seguimiento?codigo=${confirmado.codigo}&celular=${confirmado.celular}`}>
          Seguir mi pedido
        </Link>
      </section>
    );
  }

  return (
    <section className="tarjeta formulario">
      <Link to="/" className="volver">← Volver a la carta</Link>
      <h1>{producto.nombre}</h1>
      <p className="precio">{soles(producto.precio)} c/u</p>

      <form onSubmit={enviar}>
        <label>Tu nombre
          <input name="nombre" value={form.nombre} onChange={cambiar} required minLength={2} autoComplete="name" />
        </label>
        <label>Celular
          <input name="celular" value={form.celular} onChange={cambiar} required inputMode="numeric"
                 pattern="9[0-9]{8}" title="9 dígitos, empieza con 9" placeholder="987654321" autoComplete="tel" />
        </label>
        <div className="fila">
          <label>Cantidad
            <input name="cantidad" type="number" min="1" max="10" value={form.cantidad} onChange={cambiar} required />
          </label>
          <label>Fecha y hora de entrega
            <input name="fechaEntrega" type="datetime-local" min={minimoEntrega()} value={form.fechaEntrega} onChange={cambiar} required />
          </label>
        </div>
        <label>Dedicatoria (opcional)
          <input name="dedicatoria" value={form.dedicatoria} onChange={cambiar} maxLength={40} placeholder="¡Feliz cumpleaños, Lucía!" />
          <small>{form.dedicatoria.length}/40</small>
        </label>

        <p className="total">Total: <strong>{soles(producto.precio * Number(form.cantidad || 0))}</strong></p>
        {error && <p className="aviso error" role="alert">{error}</p>}

        <button className="boton ancho" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Confirmar pedido'}
        </button>
      </form>
    </section>
  );
}