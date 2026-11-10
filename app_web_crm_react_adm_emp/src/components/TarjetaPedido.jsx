import { soles, fechaEntrega } from '../utils/formato.js';

export const ESTADOS = ['Pendiente', 'En preparación', 'Listo', 'Entregado'];

export default function TarjetaPedido({ pedido, ocupado, onAvanzar, onHistorial }) {
  const siguiente = ESTADOS[ESTADOS.indexOf(pedido.estado) + 1];
  return (
    <article className="tarjeta pedido">
      <div className="pedido-cabecera">
        <strong>{pedido.codigo}</strong>
        <span>{soles(pedido.total)}</span>
      </div>
      <p className="pedido-titulo">{pedido.cantidad} × {pedido.producto}</p>
      <p className="nota">{pedido.cliente} · {pedido.celular}</p>
      <p className="nota">Entrega: {fechaEntrega(pedido.fecha_entrega)}</p>
      {pedido.dedicatoria && <p className="dedicatoria">“{pedido.dedicatoria}”</p>}
      <div className="pedido-acciones">
        {siguiente && (
          <button className="boton" disabled={ocupado} onClick={() => onAvanzar(pedido, siguiente)}>
            Pasar a «{siguiente}»
          </button>
        )}
        {onHistorial && <button className="boton secundario" onClick={() => onHistorial(pedido)}>Historial</button>}
      </div>
    </article>
  );
}
