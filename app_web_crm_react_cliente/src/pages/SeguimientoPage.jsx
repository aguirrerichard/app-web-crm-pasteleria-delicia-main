import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EstadoPedido from '../components/EstadoPedido.jsx';
import { useSeguimiento } from '../hooks/useSeguimiento.js';
import { soles, fechaEntrega } from '../utils/formato.js';

// RF-T08: el cliente sigue su pedido con código + celular
export default function SeguimientoPage() {
  const [params] = useSearchParams();
  const [codigo, setCodigo] = useState(params.get('codigo') ?? '');
  const [celular, setCelular] = useState(params.get('celular') ?? '');
  const [busqueda, setBusqueda] = useState(
    params.get('codigo') && params.get('celular') ? { codigo: params.get('codigo'), celular: params.get('celular') } : null
  );
  const { pedido, error, cargando } = useSeguimiento(busqueda);

  const buscar = (e) => {
    e.preventDefault();
    setBusqueda({ codigo: codigo.trim().toUpperCase(), celular: celular.trim() });
  };

  return (
    <>
      <section className="tarjeta formulario">
        <h1>Seguir mi pedido</h1>
        <form onSubmit={buscar} className="busqueda">
          <label>Código
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="DEL-0001" required />
          </label>
          <label>Celular
            <input value={celular} onChange={(e) => setCelular(e.target.value)} inputMode="numeric" pattern="9[0-9]{8}" required />
          </label>
          <button className="boton">Consultar</button>
        </form>
      </section>

      {cargando && !pedido && <p className="aviso">Buscando…</p>}
      {error && <p className="aviso error" role="alert">{error}</p>}

      {pedido && (
        <section className="tarjeta seguimiento">
          <div className="seguimiento-cabecera">
            <div>
              <p className="etiqueta">{pedido.codigo}</p>
              <h2>{pedido.cantidad} × {pedido.producto}</h2>
              <p>Entrega: {fechaEntrega(pedido.fecha_entrega)} · Total {soles(pedido.total)}</p>
              {pedido.dedicatoria && <p className="nota">“{pedido.dedicatoria}”</p>}
            </div>
            <span className="en-vivo">● Se actualiza solo</span>
          </div>
          <EstadoPedido estado={pedido.estado} historial={pedido.historial} />
        </section>
      )}
    </>
  );
}