import { useEffect, useState } from 'react';
import { obtenerHistorial } from '../api/gestion.api.js';
import { mensajeDeError } from '../api/client.js';

const fechaHora = (iso) => new Date(iso).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Lima' });

// Solo administrador: quién cambió cada estado y cuándo
export default function HistorialModal({ pedido, onCerrar }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerHistorial(pedido.id).then(setItems).catch((e) => setError(mensajeDeError(e)));
  }, [pedido.id]);

  return (
    <div className="fondo-modal" onClick={onCerrar}>
      <section className="tarjeta modal" role="dialog" aria-label={`Historial de ${pedido.codigo}`} onClick={(e) => e.stopPropagation()}>
        <p className="etiqueta">Historial · {pedido.codigo}</p>
        <h2>{pedido.cantidad} × {pedido.producto}</h2>
        {error && <p className="aviso error" role="alert">{error}</p>}
        {!items && !error && <p className="aviso">Cargando…</p>}
        {items && (
          <ol className="linea-tiempo">
            {items.map((h, i) => (
              <li key={i}><b>{h.estado}</b><span>{h.usuario}{h.rol ? ` (${h.rol})` : ''} · {fechaHora(h.fecha)}</span></li>
            ))}
          </ol>
        )}
        <button className="boton" onClick={onCerrar}>Cerrar</button>
      </section>
    </div>
  );
}
