import { hora } from '../utils/formato.js';

const ESTADOS = ['Pendiente', 'En preparación', 'Listo', 'Entregado'];
const TEXTOS = {
  'Pendiente': 'Recibimos tu pedido',
  'En preparación': 'Estamos horneando',
  'Listo': 'Listo para recoger',
  'Entregado': 'Entregado'
};

// Línea de tiempo con los 4 estados; marca los que ya pasaron y a qué hora
export default function EstadoPedido({ estado, historial = [] }) {
  const actual = ESTADOS.indexOf(estado);
  const horaDe = (e) => historial.find((h) => h.estado === e)?.fecha;

  return (
    <ol className="estados" aria-label="Estado del pedido">
      {ESTADOS.map((e, i) => {
        const clase = i < actual ? 'hecho' : i === actual ? 'actual' : '';
        return (
          <li key={e} className={clase} aria-current={i === actual ? 'step' : undefined}>
            <span className="punto">{i < actual ? '✓' : i + 1}</span>
            <b>{TEXTOS[e]}</b>
            <small>{horaDe(e) ? hora(horaDe(e)) : '—'}</small>
          </li>
        );
      })}
    </ol>
  );
}