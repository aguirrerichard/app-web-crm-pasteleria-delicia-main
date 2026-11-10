import { Link } from 'react-router-dom';
import { soles } from '../utils/formato.js';

// Colores para la ilustración de cada torta (no usamos fotos en la demo)
const TONOS = ['#6B3E2E', '#F3E1C7', '#3B2320', '#F6C744'];

export default function ProductoCard({ producto, indice }) {
  return (
    <article className="tarjeta producto">
      <div className="producto-ilustracion" style={{ '--tono': TONOS[indice % TONOS.length] }} aria-hidden="true">
        <span className="capa capa-1" />
        <span className="capa capa-2" />
      </div>
      <div className="producto-cuerpo">
        <h2>{producto.nombre}</h2>
        <p>{producto.descripcion}</p>
        <div className="producto-pie">
          <strong className="precio">{soles(producto.precio)}</strong>
          <Link className="boton" to={`/pedido/${producto.id}`}>Encargar</Link>
        </div>
      </div>
    </article>
  );
}